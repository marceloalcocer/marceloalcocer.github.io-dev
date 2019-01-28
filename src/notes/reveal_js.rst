reveal.js
===============


Serving locally from different directories
---------------------------------------------

Running ``npm start`` calls ``start`` script in ``package.json``. This is ``grunt serve`` which tells Grunt to run a local HTTP server [#]_. The server configuration is defined in ``Gruntfile.js`` and contains a root and watch directories. The ``root`` directory is just like any server's root, whilst the ``watch`` directory is monitored for changes (like htdocs?).

Cannot modify server root directory as reveal.js requires this to be its base directory. Instead, create symlink in reveal.js base directory pointing to desired directory. This will now be accessible from server root. Then, add subdirectory html files to watch list. Finally, ensure that all ref and src attributes in html pointing to reveal.js assets use absolute paths. These will be interpreted from the server root directory and so will be correctly resolved [#]_.


.. [#] This is typically used for running JS tasks for TDD
.. [#] https://medium.com/@KienanKB/serving-multiple-reveal-js-presentations-b1a5c086e959
