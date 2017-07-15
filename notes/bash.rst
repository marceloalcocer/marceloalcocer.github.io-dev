============================
Misc Terminal Commands
============================

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


CNST Print
==========

::

	lp -U Alcocer <filename>


