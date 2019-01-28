====
Web
====


Server-Side Scripting
=======================

Server-side scripting — request server to execute code in a scripting language (e.g. Python, PHP, etc) and return result. Requires server process to be able to execute scripts, ideally in any arbitrary scripting language.

As such, interface protocols developed to allow communication between server processes and scripting languages [#]_.

Protocols
-----------

Common Gateway Interface (CGI)
.................................

Oldest interface. Supported by almost all web servers.

Slow as each new request starts up separate scripting environment (e.g. python shell).

FastCGI and SCGI
..................

Upgrade to CGI.

One scripting process started and kept alive in background which handles all requests.

Web Server Gateway Interface (WSGI)
....................................

Problem with all these legacy interfaces is that server-side (and web server) code must be tailored for the specific interface. As such, in order to develop server-side code which will work with all interfaces and all servers, would have to develop multiple versions of the server-side code. For example, python code for a wiki engine would need to be written so as to support CGI, FastCGI, SCGI, etc. in order to guarantee that it could be deployed on any web server.

To solve this duplication, the WSGI protocol was developed to act as an intermediate between all existing interfaces and all server-side scripting languages. In this way, when developing server-side code, only need to make it compatible with WSGI to ensure universal operability.

WSGI is defined as a client-server architecture:

WSGI Server
	Connects to low-level gateway intefaces (i.e. CGI, FastCGI, etc)

WSGI Client
	Connects to server-side code (e.g. Python, PHP, etc)
	

Practicalities
----------------

Cannot get WSGI working on XAMMP. Tried with ``hgweb.wsgi`` and just refuses to work. Apache does not have wsgi module and so cannot interpret ``WSGIScriptAlias`` option.

Tried downloading wsgi module binary [#]_, but does not seem to work either. Looks like there may be fundamental compatibility issues [#]_...

.. [#] https://docs.python.org/3.5/howto/webservers.html
.. [#] https://www.devbattles.com/en/sand/post-304-using+Apache+and+Python+WSGI+on+Windows
.. [#] https://github.com/GrahamDumpleton/mod_wsgi/blob/develop/win32/README.rst
