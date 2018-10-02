Lab server
============

Basic web server for hosting lab related files.

Requirements:

* Wiki for multi-user lab documentation (MediaWiki)
* FTP server for file access (Filezilla)
* Repository hosting for lab software (Git/Mercurial)

Setting up wiki tpyically requires

* Web server
* PHP installation
* Database installation

Easiest way of getting all these is a WAMP/LAMP/WIMP/LIMP stack (Windows|Linux, Apache|ISS, MySQL, PHP). Nice bundle which facilities installation and configuration.

Nice WAMP stack for Windows is XAMPP [#]_. Added benefit that it supports Bitnami installer for MediaWiki — installer to simplify installation and configuration of MediWiki alongside WAMP stack.

.. [#] https://www.apachefriends.org/download.html

WAMP stack
------------

Installation
.............

Download and install XAMPP 7.0.8. Installed components:

#. Apache (webserver)
#. MariaDB (database)
#. PHP
#. phpMyAdmin (SQL management web interface)
#. Webalizer (logging)

Start Apache and MariaDB. Can now see default XAMPP start page at http://localhost

Securing SQL
.............

XAMPP stresses that it is not production ready and has lots of security holes [#]_ — fine for dev, but not for public release. Latest version of XAMPP however seem to have patched the most glaring holes [#]_. Only real thing left to secure is MySQL root password.

Set via XAMPP console using::

	mysqladmin --user=root password <PASSWORD>

**N.b. quote <PASSWORD>!**

Changed ``phpmyadmin.ini`` to authenticate using http rather than config file values. phpMyAdmin now asks for password.

.. [#] https://www.apachefriends.org/faq_windows.html
.. [#] http://stackoverflow.com/questions/35391539/is-there-a-new-uri-for-opening-the-xampp-security-console-on-xampp-7-0-2-1

MediaWiki
----------

Now installing MediaWiki using Bitnami installer [#]_.

N.b. application password is password to be used by SQL user ``bitnami_mediawiki`` for all MediaWiki access to SQL DB. It's stored in plaintext in ``LocalSettings.php`` so it should be disposable.

Added new user with admin privileges during installation.

.. [#] https://www.apachefriends.org/add-ons.html

Filezilla FTP Server
------------------------

Setting up FTP server to allow upload to server without needing RDP. This should be useful for uploading files which are too large/prohibited by MediaWiki.

Configuration [#]_:

#. Run FTP server
#. Select to allow FTP server through firewall on private networks
#. Open admin panel
#. Connect as admin (requests new password on first time logon)
#. Configure general server settings (all left as default FTM)
#. Add new user(group) with associated directory/ies access and password

Can now connect using FTP client (e.g. Filezilla Client, Nautilus, etc).

.. [#] https://wiki.filezilla-project.org/Network_Configuration

Repository hosting
-------------------

Mercurial
..........

Now want to set up web interface to HG repos. Can do in many ways [#]_. Simplest probably hgweb though.

hgweb requires mercurial python libraries however. As mercurial built on Python 2.x, on Windows these are only supplied for Python 2.x. As such did following:

#. Uninstalled existing Mercurial installation (3.5)
#. Installed Python 2.7 alongside existing Python 3.4
#. Made python2 and python3 symlinks to executables
#. Added Python 2.7 to path (above Python 3.4)
#. Reinstalled Mercurial (3.9) with Python 2 modules [#]_

Now default Python interpreter is 2.7 and can import mercurial module in python.

Proceeding with hgweb installation. Points to note:

#. Download latest version of ``hgweb.cgi`` as not included in mercurial installation(?!)
#. Set shebang path correctly in ``hgweb.cgi``
#. Place ``hgweb.cgi`` in ``cgi-bin``
#. Set apache alias in ``httpd.conf`` (in included conf file actually)
#. Denied push access for each repo individually in repo hgrc file

Works beautifully now.

Finally, themed with boundstate theme [#]_. Just had to modify ``Repositories`` link to point to ``/hg`` as per issue #13.

.. [#] https://www.mercurial-scm.org/wiki/PublishingRepositories#hgweb
.. [#] https://www.mercurial-scm.org/wiki/Download
.. [#] https://github.com/boundstate/hgweb-boundstate-theme

Git 
....

Initially tried to handle user authentication via FTP access. Could happily push using git ftp, but had no luck pulling as no git server scripts were present on server.

As have to install Git on server, might as well try more standard setup of Git over (smart) HTTP.

HTTP
______

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

	git clone http://lab.server.com/git/foo.git

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


Web interface
______________


Tried a few web interfaces:

gitweb
	Generated CGI script is not compatible with Windows Perl

gitlist
	Could not configure properly

gogs
	Nice, but includes server

Finally got GitPHP [#]_ to work nicely. Followed installation instructions with installation in ``htdocs`` and worked first time. Only issue was disabling cache as seemed to stick.

Would be nice to have following usage though::

	http://lab.server.com/git/		# Web interface
	http://lab.server.com/git/project.git	# Clone/push over HTTP

Relocated GitPHP outside of ``htdocs``. Set Apache alias to serve::

	Alias /git "C:/xampp/gitphp/"
	<Directory "C:/xampp/gitphp">
		Require all granted
	</Directory>

Can now browse at ``http://lab.server.com/git/``. Does not interfere with clone/push URL as git ``ScriptAliasMatch`` regexp filters out git HTTP requests to ``git-http-backen.exe`` and passes rest on.

.. [#] https://gitphp.org/


Server Backup
-----------------

SQL dump 
.........

Do from phpMyAdmin [#]_. Copy to ``D:\Wiki``. Add to HG.

.. [#] https://www.mediawiki.org/wiki/Manual:Backing_up_a_wiki#phpMyAdmin

XML dump
..........

Just for safety::

	php dumpBackup.php --full > bitnami_mediawiki.xml

Copy and add to HG

LocalSettings
..............

Copy and add to HG.

MediaWiki files
.................

Zip whole ``mediawiki`` directory. Move to ``D:\Wiki``. Do not add to HG (too large and binary)
	
Lab Files
.............

Zip ``lab`` directory. Move. Do not add to HG.


Software Repos
..................

These will almost certainly be mirrored in many other locations, but probably still best to clone out a fresh copy of each as a backup. All repos in ``C:\xampp\git``.

Conf Files
...........

Yuk, loads... Should list these...

* Apache
* PHP
* MySQL
* HG



