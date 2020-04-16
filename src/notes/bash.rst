=====
Bash
=====

Redirect output on success
============================

[#]_::

    out=$(some_command) && echo "$out" > outfile

.. [#] https://stackoverflow.com/questions/31424456/how-to-redirect-output-of-a-program-only-if-it-succeeded/31424574#31424574

Disable aliases
================

Use backslah to disable aliases and avoid recusrsion [#]_::

    alias ls='clear;\ls'

.. [#] https://stackoverflow.com/a/7716048/2798933

Pop argument
=============

Can use bash ``shift`` builtin to pop argument to a script, e.g. [#]_::

    $ function foo() { echo $@; shift; echo $@; } 
    $ foo 1 2 3
    1 2 3
    2 3

.. [#] https://stackoverflow.com/questions/10569198/bash-take-the-first-command-line-argument-and-pass-the-rest

Redirection
===========

Everything is a file::

	$ ls -la /dev/std*
	lrwxrwxrwx 1 root root 15 Dec 11 20:57 /dev/stderr -> /proc/self/fd/2
	lrwxrwxrwx 1 root root 15 Dec 11 20:57 /dev/stdin -> /proc/self/fd/0
	lrwxrwxrwx 1 root root 15 Dec 11 20:57 /dev/stdout -> /proc/self/fd/1

Redirection can be most generally thought of a file descriptor duplication. Assuming ``a`` and ``b`` are numerical file descriptors (FDs), FD duplication is achieved with the duplication operators, ``<&`` and ``>&``::

	$ a<&b     # Make reading from FD a equal to reading from FD b
	$ a>&b     # Make writing to FD a equal to writing to FD b

For ``a<&b``, reading from ``a`` will now effectively read from ``b``, *and vice-versa*. ``a`` defaults to the FD for stdin (``0``), so that reading from stdin will effectively read from ``b``, e.g.::

	$ 0<&2     # Make reading from stdin (0) equal to reading from stderr (2)
	$ <&2      # idem
	$ 1>&2     # Make writing to stdout (1) equal to writing to stderr (2)
	$ <&2      # idem

For ``a>&b``, writing to ``a`` will now effectively write to ``b``, *and vice-versa*. ``a`` defaults to the FD for stdout (``1``), so that writing to stdout will effectively write to ``b``.

In both cases, ``a`` and ``b`` must be (or evaluate to) numerical FDs. In order to open files for reading/writing and return corresponding numerical file descriptors, the redirection operators ``<`` and ``>`` can be used::

	$ a<file  # Open file for reading and make reading from FD a equal to reading from file's FD
	$ a>file  # Open file for writing and make writing to FD a equal to writing to file's FD

For ``a<file``, reading from ``a`` will now effectively read contents of ``file``, *and vice-versa*. ``a`` defaults to the FD for stdin (``0``), so that reading from stdin will effectively read contents of ``file``, e.g.::

	$ xclip -i < file          # xclip reads from stdin, stdin shares FD with file

For ``a>&file``, writing to ``a`` will now effectively write content to ``file``, *and vice-versa*. ``a`` defaults to the FD for stdout (``1``), so that writing to stdout will effectively write content to ``file``, e.g.::

	$ ls > file                # ls writes to stdout, stdout shares FD with file

N.b. all redirection is valid only for current command.

Some examples now of both duplication and redirection operators in play. N.b. all assumes pointer-like assignment::

	$ cmd > file 2>&1    # 1 = open(file,"w"); 2 = 1; cmd writing to 1 == open(file,"w"); cmd writing to 2 == open(file, "w")
	$ cmd 2>&1 > file    # 2 = 1; 1 = open(file,"w"); cmd writing to 1 == open(file,"w"); cmd writing to 2 == open(/dev/stdout, "w")

Multiple background commands
===============================

Execute multiple commands in background [#]_::

	cmd1 & cmd2 &

.. [#] https://stackoverflow.com/questions/14612371/how-do-i-run-multiple-background-commands-in-bash-in-a-single-line

ISO image from CD
===================

Create ISO image [#]_::

	cat dev/srX > <OUTPUT>.iso

.. [#] http://askubuntu.com/questions/307688/how-to-create-iso-image-from-dvd

ImageMagik Thumbnailing
==============================

Create thumbnail by central cropping [#]_::

	convert -define jpeg:size=200x200 <INPUT> -thumbnail 100x100^ -gravity center -extent 100x100  <OUTPUT>

.. [#] http://www.imagemagick.org/Usage/thumbnails/#height

PDF Manipulation with pdfjam
=============================

Joining::

	pdfunit <FILE1> <FILE2> ... <OUTFILE>

or more fully and flexibly::

	pdfjam file1.pdf '-' file2.pdf '1,2' file3.pdf '2-' --outfile output.pdf

Splitting::

	pdfjam <INFILE> '1,2' --outfile first_two_pages.pdf
	pdfjam <INFILE> '3-' --outfile third_onwards.pdf

Insertion — split followed by join


Tabs Per Line
==============

When dealing with ASCII exported matrices, can easily find number of rows, but tricker to find number of columns. If the data is properly delimited (e.g. TSV, CSV), can use AWK to count the number of delimiters per line, e.g.::

	awk '{print gsub(/\t/,"")}' <INPUTFILE>

Renaming
===========

Uses perl regexp which is same as vim substitution, e.g.::

	rename "s/2D_/3D_/" 2D_*.txt

would turn ``2D_Foobar.txt`` into ``3D_Foobar.txt``.


Archive Copying
================

Archive copying::

	cp -a <SRC> <DEST>

		No link dereferencing
		Recursive
		Preserve all file attributes

For attribute preservation, require ``<DEST>`` to be in ext4 format.


GPG Encryption
===============

Encryption [#]_::

	gpg --encrypt --recipient <public_key_name> <input_file>

Decryption::

	gpg --output <output_file> --decrypt <input_file>

.. [#] https://www.madboa.com/geek/gpg-quickstart/


List Absolute Path
======================

[#]_::

	readlink -f <FILENAME>

.. [#] http://stackoverflow.com/questions/246215/how-can-i-list-files-with-their-absolute-path-in-linux


Content RegExp Recursive Search 
================================

::

	grep -Iron --include=*.txt "aRegExp" .


