=====================
Visual Studio Code
=====================

Licensing
==========

Version of VS code available from the `MS website <https://code.visualstudio.com/>`_ ('VS Code') is a MS internal build of the `open source hosted on GitHub <https://github.com/Microsoft/vscode>`_ ('Code') [#]_. The VS Code-specific additions are [#]_:

* MS branding
* MS license
* Extension marketplace support
* Crash reporting

N.b. Whilst Code is distributed under an MIT license, the VS Code is distributed under a MS license. As such, currently the only way to obtain a version under an open source license is to build from source.

.. [#] https://github.com/Microsoft/vscode/issues/60#issuecomment-161792005
.. [#] https://github.com/Microsoft/vscode/pull/28736/files


Building
=========

Releases
---------

Master branch is latest daily snapshot. To install a release version, must first check out a tagged release.

New releases come out every month and are labelled by a minor version number [#]_. There is also a patch release number which appears to vary between releases. As such, best to check MS website for latest full version number [#]_.

Individual release source size is very comparable to entire git repository. As such, more convenient to clone entire repository and just fetch new releases.

.. [#] https://github.com/Microsoft/vscode/releases
.. [#] https://code.visualstudio.com/updates/v1_22

Build process
--------------

Following `build instructions <https://github.com/Microsoft/vscode/wiki/How-to-Contribute#build-and-run-from-source>`_.

Obtained all build prerequisites;

:Node: v8.11.1
:NPM: v5.8.0
:Yarn: v1.6.0
:Python: 2.7.12

Obtained source::

	git clone https://github.com/Microsoft/vscode.git

Obtained all node dependencies::

	cd vscode
	yarn

Using ``yarn run watch`` to build as suggested triggers incremental build for Code development purposes. If want to build stable release, use gulp packaging task instead::

	yarn run gulp vscode-linux-x64

This results in build output being created in ``../VSCode-linux-x64``. Run with app script (``bin/code-oss``).

node-gyp error
---------------

Ran into following error when getting node dependencies with yarn::

	>>> cd vscode
	>>> yarn
	error /usr/local/src/vscode/node_modules/gc-signals: Command failed.
	Exit code: 1
	Command: node-gyp rebuild
	Arguments: 
	Directory: /usr/local/src/vscode/node_modules/gc-signals
	Output:
	module.js:549
	    throw err;
	        ^

		Error: Cannot find module '/usr/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js'
		    at Function.Module._resolveFilename (module.js:547:15)
		        at Function.Module._load (module.js:474:25)

Clearly a missing dependency (``node-gyp``).

NPM installs packages in two different ways; locally (viz. in CWD) for use as local project dependency, or globally (viz. Central location) for use at CLI [#]_. List location of globally installed packages [#]_::

	>>> npm list -g
	/usr/lib

As such, appears that ``node-gyp`` expected as a locally installed package in (globally installed) ``npm`` package. Installed::

	>>> cd /usr/lib/node_modules/npm
	>>> npm install node-gyp

Now yarn successfully installs all dependencies.

.. [#] https://docs.npmjs.com/getting-started/installing-npm-packages-globally
.. [#] https://stackoverflow.com/questions/5926672/where-does-npm-install-packages


Extensions
===========

The extensions marketplace is an MS service and thus is not enabled by default in Code. Must be enabled by modifying ``resources/app/product.json`` [#]_::

	"extensionsGallery": {
		"serviceUrl": "https://marketplace.visualstudio.com/_apis/public/gallery",
		"cacheUrl": "https://vscode.blob.core.windows.net/gallery/index",
		"itemUrl": "https://marketplace.visualstudio.com/items"
	}

.. [#] https://stackoverflow.com/questions/37143536/no-extensions-found-when-running-visual-studio-code-from-source


Updating
=========

To update, just need to checkout release version of source and follow build instructions.

An example update script::
	
	#!/bin/bash
	#
	# Description
	# ===========
	#
	# Upgrade VS Code (from source) to given release
	#
	# Usage
	# ======
	#
	# vscode_upgrade <RELEASE>
	#
	# RELEASE must be a valid tag in the git repository
	#
	#
	
	# Fetch
	git fetch

	# Fast-forward master
	git checkout master
	git merge origin/master

	# Checkout release tag
	git checkout $1

	# Build
	yarn
	yarn run gulp vscode-linux-x64

	# Add marketplace
	cd ../VSCode-linux-x64
	sed -i "$ d" resources/app/product.json
	sed -i "$ d" resources/app/product.json
	echo -e '\t},\n\t"extensionsGallery": {\n\t\t"serviceUrl": "https://marketplace.visualstudio.com/_apis/public/gallery",\n\t\t"cacheUrl": "https://vscode.blob.core.windows.net/gallery/index",\n\t\t"itemUrl": "https://marketplace.visualstudio.com/items"\n\t}\n}' >> resources/app/product.json

All preferences and settings are stored in ``~/.vscode-oss`` and ``~/.config/Code - OSS``, and so are not overwritten.
