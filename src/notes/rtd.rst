Read The Docs
===============

To generate documentation, must be able to run autodoc on RTD build server. This involves importing the ultrafast module, which obviously fails as it depends on lots of Python packages which are not necessarily installed on the build server (e.g. SciPy). The way RTD gets round this is by allowing you to install your package on their build server using pip [#]_ [#]_. In doing so, you can specify a pip requirements file which details any dependencies your package may have. These will then be installed first.

As such, to properly serve autodoc generated documentation on RTD must:

#. Make package installable via pip, ensuring pip requirements file contains all dependencies
#. Push package to GitHub
#. Specify location of pip requirements file on RTD project settings

Did all this and finally got RTD working. Issue was that had to push to GitHub to test. As such, all tests went live. Now begin clean up operation:

#. Backup successful install files
#. Delete local ``feat/install`` branch::
  
	git branch -D feat/install

#. Delete remote ``feat/install`` branch (via GitHub hopefully...)
#. Paste successful install files (into new ``feat/install`` branch)
#. Merge into dev, push and pretend nothing happened
#. Reconfigure RTD to use dev branch once again

.. [#] https://docs.python.org/3/distutils/setupscript.html
.. [#] https://pip.pypa.io/en/stable/user_guide/

