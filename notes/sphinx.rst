Sphinx
=======

Package Documentation Quickstart
---------------------------------

Generate Sphinx conf file (in doc directory) by answering some questions::

	cd docs
	sphinx-quickstart

Edit conf file to add package to PYTHONPATH; e.g. with standard package structure::

	cd source
	vim conf.py
	sys.path.insert(0, os.path.abspath('../..'))

Call ``sphinx-apidoc``::

	cd ..
	sphinx-apidoc -f -o source/ ../package

Build::

	make html

Enjoy


Structure
-----------------

``.. py:function::``, *etc*. Directives
	Basic directives defined by Sphinx to correctly format Python elements (functions, classes, etc). The argument (string) following the directive is subsequently formatted. As such, the string must be written in a valid ResT file.


``.. automodule::``, ``.. autoclass::``, *etc*. Directives
	Directives defined by the ``autodoc`` Sphinx extension which must be enabled in the config file. Parses Python modules, classes, functions and generates ResT nodes describing them. Essentially, the element protoype and/or docstring is parsed into a string and formatted with the appropriate directive (e.g. ``.. py:function::``).  The ``.. autoXXX::`` directives must still be 'called' in a valid ResT file however. 

``sphinx-apidoc`` Command
	Parses python package to generate ResT file for all contained modules. The output ResT files will mainly contain things like ``.. automodule::``, ``.. autoclass::``, etc.

``sphinx-build`` Command
	Generates output from ResT files (in doc directory) using given writer (e.g. HTML). Basically fancy version of docutils with extra directives, roles, etc. defined.

