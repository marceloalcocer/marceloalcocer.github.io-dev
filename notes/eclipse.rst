Eclipse 
========

Manual upgrade
---------------

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

