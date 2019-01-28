=====
Bash
=====

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


