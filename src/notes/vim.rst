#####
Vim
#####

Installing vim plugins
#######################

From help;

	USING A FILETYPE PLUGIN					*ftplugin-name*

	You can add a filetype plugin by dropping it in the right directory.  The
	name of this directory is in the same directory mentioned above for global
	plugins, but the last part is "ftplugin".  Suppose you have found a plugin for
	the "stuff" filetype, and you are on Unix.  Then you can move this file to the
	ftplugin directory: >

		mv thefile ~/.vim/ftplugin/stuff.vim

	If that file already exists you already have a plugin for "stuff".  You might
	want to check if the existing plugin doesn't conflict with the one you are
	adding.  If it's OK, you can give the new one another name: >

		mv thefile ~/.vim/ftplugin/stuff_too.vim

	The underscore is used to separate the name of the filetype from the rest,
	which can be anything.  If you use "otherstuff.vim" it wouldn't work, it would
	be loaded for the "otherstuff" filetype.

N.b. underscore to avoid conflicts.

May also have other directories to copy too (e.g. ``ftdetect``, ``syntax``, etc).

Pretty print JSON
##################

Pretty print JSON by filtering through Python standrad library module [#]_ ::

	:%!python -m json.tool

.. [#] https://pascalprecht.github.io/posts/pretty-print-json-in-vim/
