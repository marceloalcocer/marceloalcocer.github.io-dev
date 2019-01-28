========
Eclipse 
========

PyDev configuration
===========================

General
----------
Switching workspaces causes PyDev settings to be lost for some reason. Clearing workspace and re-importing Eclipse project does nothing - have to reconfigure. PyDev settings probably stored in workspace settings though (``.metadata``).

- `PyDev settings export`_
- `pep8.py errors and warnings`_
- `Remove RemoteSystemsTempFiles`_ (startup-shutdown -> RSE UI and delete from project explorer)

.. _PyDev settings export: https://sourceforge.net/p/pydev/feature-requests/72/
.. _pep8.py errors and warnings: http://pep8.readthedocs.org/en/latest/intro.html#error-codes
.. _Remove RemoteSystemsTempFiles: http://stackoverflow.com/questions/3627463/what-is-remotesystemstempfiles-in-eclipse

Project
---------

PyDev requires source files to be in a source folder. Presumably this is so that build tools (lint, etc) know where to look.

Source folders are typically added to the PYTHONPATH so as to allow contained modules to be found.

Furthermore, for packages to be recognised by PyDev they must be contained in a source folder. As such, you typically end up with a very nested structure:

- ProjectDir

  - SourceDir

    - PackageDir

      - __init__.py
      - Module1
      - Module2

Can however define the project folder to be a source directory though, eliminating one nesting. This is done during project creation with the option "Add project folder to PYTHONPATH". Packages can then be located directly within the project folder:

- ProjectDir

  - PackageDir

    - __init__.py
    - Module1
    - Module2

N.b Setting the project directory as a source directory adds it to the PYTHONPATH. Despite not being explicily added, it seems that sub-directories (e.g. package directories) are also searched. Is this a PyDev thing or a Python thing?


Manual upgrade
===============

Cannot upgrade directly from Eclipse Mars (4.5) to Neon (4.6), instead must do manual install [#]_.

First, back up workspace and project files [#]_:

- Preferences (export)
- Workspace (``~/Coding/.metadata``)
- Projects (``<project>/.project``, ``<project>/.pydevproject``)

  - Sandbox/Python
  - ultrafast
  - transient

Uninstall olde version by removing Eclipse instal directory (``/opt/eclipse``). Then simply unzip new version to install directory.

Unfortunately however, Neon requires newer version of Java. Open version of this is provided by OpenJDK 8. No openjdk-8 package is currently available for Ubuntu 14.04, only openjdk-7. Could try to find backport, but openjdk-8 is standard JDK version of Ubuntu 16.04. As such, probably easier to wait for full upgrade.

.. [#] https://wiki.eclipse.org/FAQ_How_do_I_upgrade_Eclipse_IDE%3F
.. [#] https://www.eclipse.org/eclipse/development/readme_eclipse_4.6.php#mozTocId324309

