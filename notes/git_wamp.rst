#########################
Git hosted on WAMP
#########################


**Aim**: Host Git repository on Apache on Windows (XAMPP WAMP stack)

Initially tried to handle user authentication via FTP_ access. Could happily push using git ftp, but had no luck pulling as no git server scripts were present on server.

As have to install Git on server, might as well try more standard setup of Git over (smart) HTTP.

HTTP
======

Downloaded Git for Windows official installation [#]_. This comes bundled with MinGW installation which provide basic GNU/Linux tools required for running Git.

Followed steps in Git book on setting up Git over Smart HTTP [#]_.

Created bare repository from git bash shell on server::

	cd C:\xampp\git
	git init --bare foo.git

Configuring apache config file now. Git root directory set to ``C:/xampp/git``::

	SetEnv GIT_PROJECT_ROOT "C:/xampp/git"

*N.b. Not served by default so repos not accessible via HTTP.* Access will be provided by Git HTTP script.

Routed all all HTTP requests to ``git`` directory through Git HTTP script by setting ``ScriptAlias`` directive::

	ScriptAlias /git/ "C:/Program Files/Git/mingw64/libexec/git-core/git-http-backend.exe"

*N.b. location of main Git HTTP script* (``git-http-backend``) *on Windows differs from GNU/Linux* [#]_

For some reason this doesn't seem to work. Instead had to use regexp version [#]_::

	ScriptAliasMatch "(?x)^/git/(.*/(HEAD | info/refs | objects/(info/[^/]+ | [0-9a-f]{2}/[0-9a-f]{38} | pack/pack-[0-9a-f]{40}\.(pack|idx)) | git-(upload|receive)-pack))$" "C:/Program Files/Git/mingw64/libexec/git-core/git-http-backend.exe/$1"

*N.b. Extra* ``$1`` *to pass HTTP request to script*

Allow access to HTTP script using ``Files`` section::

	<Files "git-http-backend.exe">
		Require all granted
	</Files>

*N.b.* ``.exe`` *extension is required.*

Can now clone (and push) anonymously::

	git clone http://acq.2d.chemphys.lu.se/git/foo.git

Now to enable authentication. Created password file in ``git`` directory using ``htpasswd`` script from xampp shell::

	htpasswd -c C:\xampp\git\.htpasswd <USER>

*N.b. This remains private as* ``git`` *is not served.* Limited access to ``git-http-backend`` script using ``Files`` section requiring valid user::

	<Files "git-http-backend.exe">
		AuthType Basic
		AuthName "Git Access"
		AuthUserFile "C:/xampp/git/.htpasswd"
		Require valid-user
	</Files>

Now both clone and push require authentication::

	git clone http://<USER>@acq.2d.chemphys.lu.se/foo.git

Finally, require authentication only for push by adding regexp to ``Require`` directive (as detailed in Git book)::

	<Files "git-http-backend.exe">
		AuthType Basic
		AuthName "Git Access"
		AuthUserFile "C:/xampp/git/.htpasswd"
		Require expr !(%{QUERY_STRING} -strmatch '*service=git-receive-pack*' || %{REQUEST_URI} =~ m#/git-receive-pack$#)
		Require valid-user
	</Files>

*N.b. Cannot push a new repo up to server — must always create bare on server first.*

Final Apache config file::

	# Apache configuration for git

	# Environment variables
	SetEnv GIT_PROJECT_ROOT "C:/xampp/git"
	SetEnv GIT_HTTP_EXPORT_ALL true

	# Alias
	ScriptAliasMatch "(?x)^/git/(.*/(HEAD | info/refs | objects/(info/[^/]+ | [0-9a-f]{2}/[0-9a-f]{38} | pack/pack-[0-9a-f]{40}.(pack|idx)) | git-(upload|receive)-pack))$" "C:/Program Files/Git/mingw64/libexec/git-core/git-http-backend.exe/$1"
	<Files "git-http-backend.exe">
	    AuthType Basic
	    AuthName "Git Access"
	    AuthUserFile "C:/xampp/git/.htpasswd"
	    Require expr !(%{QUERY_STRING} -strmatch '*service=git-receive-pack*' || %{REQUEST_URI} =~ m#/git-receive-pack$#)
	    Require valid-user
	</Files>



.. [#] https://git-scm.com/download/win
.. [#] https://git-scm.com/book/en/v2/Git-on-the-Server-Smart-HTTP
.. [#] https://stackoverflow.com/questions/33829145/git-smarthttp-where-is-git-http-backend-exe/33829578
.. [#] https://stackoverflow.com/questions/3817478/setting-up-git-server-on-windows-with-git-http-backend-exe
.. [#] http://www.jeremyskinner.co.uk/2010/07/31/hosting-a-git-server-under-apache-on-windows/


Web Interface
=================


Tried a few web interfaces:

gitweb
	Generated CGI script is not compatible with Windows Perl

gitlist
	Could not configure properly

gogs
	Nice, but includes server

Finally got GitPHP [#]_ to work nicely. Followed installation instructions with installation in ``htdocs`` and worked first time. Only issue was disabling cache as seemed to stick.

Would be nice to have following usage though::

	http://acq.2d.chemphys.lu.se/git/		# Web interface
	http://acq.2d.chemphys.lu.se/git/project.git	# Clone/push over HTTP

Relocated GitPHP outside of ``htdocs``. Set Apache alias to serve::

	Alias /git "C:/xampp/gitphp/"
	<Directory "C:/xampp/gitphp">
		Require all granted
	</Directory>

Can now browse at ``http://acq.2d.chemphys.lu.se/git/``. Does not interfere with clone/push URL as git ``ScriptAliasMatch`` regexp filters out git HTTP requests to ``git-http-backen.exe`` and passes rest on.


.. [#] https://gitphp.org/



FTP
====

Git natively supports some operations over FTP protocol, viz. ``clone`` and ``fetch`` [#]_. For further operations (e.g. ``push``) can use ``git-ftp`` [#]_.

Download ``git-ftp`` and install::

	make install-all

Setup global/user/local git config with server, username, etc. N.b. Server path will be root directory of project, so best to define per repository in local git config file.

Upload repo::

	git ftp init -u <USERNAME> -P

Install ``lftp``::

	sudo apt-get install lftp

.. [#] https://stackoverflow.com/questions/4664251/does-git-support-push-to-an-ftp-server
.. [#] https://github.com/git-ftp/git-ftp
