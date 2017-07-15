2D Server
========================

WAMP Stack Installation
-----------------------------

Setting up MediaWiki on own server requires:

#. Web server
#. PHP installation
#. Database installation

Easiest way of getting all these is a WAMP/LAMP/WIMP/LIMP stack (Windows|Linux, Apache|ISS, MySQL, PHP). Nice bundle which facilities installation and configuration.

Nice WAMP stack for Windows is XAMPP [#]_. Added benisfit that it supports Bitnami installer for MediaWiki — installer to simplify installation and configuration of MediWiki alongside WAMP stack.  

As such, downloaded and installed XAMPP 7.0.8. Installed components:

#. Apache (webserver)
#. MariaDB (database)
#. PHP
#. phpMyAdmin (SQL management web interface)
#. Webalizer (logging)

Start Apache and MariaDB. Can now see default XAMPP start page at http://2d-acq.root.sx.

Securing SQL
---------------

XAMPP stresses that it is not production ready and has lots of security holes [#]_ — fine for dev, but not for public release. Latest version of XAMPP however seem to have patched the most glaring holes [#]_. Only real thing left to secure is MySQL root password.

Set via XAMPP console using::

	mysqladmin --user=root password <PASSWORD>

**N.b. quote <PASSWORD>!**

Changed ``phpmyadmin.ini`` to authenticate using http rather than config file values. phpMyAdmin now asks for password.

Testing access from outside of ChemPhys LAN. No access to either web server from outside (home). Good.

MediaWiki Installation
--------------------------

Now installing MediaWiki using Bitnami installer [#]_.

N.b. application password is password to be used by SQL user ``bitnami_mediawiki`` for all MediaWiki access to SQL DB. It's stored in plaintext in ``LocalSettings.php`` so it should be disposable.

Added new user ``Malcocer`` with admin privileges during installation.

Can now access Wiki


.. [#] https://www.apachefriends.org/download.html
.. [#] https://www.apachefriends.org/faq_windows.html
.. [#] http://stackoverflow.com/questions/35391539/is-there-a-new-uri-for-opening-the-xampp-security-console-on-xampp-7-0-2-1
.. [#] https://www.apachefriends.org/add-ons.html

Mercurial Web Hosting
-----------------------

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

Filezilla FTP Server
------------------------

Setting up FTP server to allow apache htdocs to be modified without needing RDP to 2d-acq. This should be useful for uploading files which are too large/prohibited by MediaWiki.

Configuration [#]_:

#. Run FTP server
#. Select to allow FTP server through firewall on private networks
#. Open admin panel
#. Connect as admin (requests new password on first time logon)
#. Configure general server settings (all left as default FTM)
#. Add new user(group) with associated directory/ies access and password

Can now connect using FTP client (e.g. Filezilla Client, Nautilus, etc).

.. [#] https://wiki.filezilla-project.org/FileZilla_FTP_Server
.. [#] https://wiki.filezilla-project.org/Network_Configuration

Server Backup
-----------------

SQL dump 
.........

Do from phpMyAdmin [#]_. Copy to ``D:\Wiki``. Add to HG.

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


.. [#] https://www.mediawiki.org/wiki/Manual:Backing_up_a_wiki#phpMyAdmin

