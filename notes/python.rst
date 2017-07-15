=========
Python
=========

Subclassing builtin types
===========================

Reasons why you shouldn't immediately subclass Python built-in types [#]_

.. [#] https://stackoverflow.com/questions/25328448/should-i-subclass-python-list-or-create-class-with-list-as-attribute#answer-25328940


Bokeh Plotting Library
=========================

Architecture
--------------

	"The architecture of Bokeh is such that high-level “model objects” (representing things like plots, ranges, axes, glyphs, etc.) are created in Python, and then converted to a JSON format that is consumed by the client library, BokehJS"

	-- `Bokeh Website <http://bokeh.pydata.org/en/latest/docs/user_guide/server.html>`_

As the data, etc is passed once to BokehJS, it can be explored but is otherwise static. The Bokeh server can help here:

	"However, if it were possible to keep the “model objects” in python and in the browser in sync with one another, then more additional and powerful possibilities immediately open up:

	- respond to UI and tool events generated in a browser with computations or queries using the full power of python
	- automatically push updates the UI (i.e. widgets or plots), in a browser
	- use periodic, timeout, and asynchronous callbacks drive streaming updates
	  
	This capability to synchronize between python and the browser is the main purpose of the Bokeh Server."

	-- `Bokeh Website <http://bokeh.pydata.org/en/latest/docs/user_guide/server.html>`_

Current Status
-----------------

Bokeh is a nice way of generating explorable plots for embedding into log files, etc. Would provide mush richer experience than current MPL to SVG approach.

Furthermore, looks like a great way of building GUI for data analysis/exploration — leverage Python for data processing/analysis and leave display/UI to HTML/JS. Seems more forward-looking and interoperable than relying on native canvases such as GTK.

Unfortunately, would say that Bokeh needs to mature slightly before it can replace MPL as default plotting library. Simple 2D plots (lines, bars, etc) look great, but more complex 2D plots (e.g. heatmaps, contours, etc) are still in early stages. These are the ones we will need the most for plotting 2DES datasets. Heatmap is probably closest contender, but does not interpolate. Also, 3D plots are currently completely missing and can currently only be handled by `interfacing 3rd party libs with Bokeh servers <https://demo.bokehplots.com/apps/surface3d>`_.


ctypes Pointers
=================

Pointer summary:

ctypes.POINTER():
	Factory method. Returns callable which creates pointer of a particular ctypes type

ctypes.pointer():
	Returns pointer object. Equivalent to (POINTER(<type>))(). N.b. this is a fully fledged Python object instance, not just a memory address as expected in C

ctypes.byref():
	Returns a lightweight pointer object to the requested ctypes type. This is also a fully fledged Python object instance, albeit one which only really contains the address of the requested type.

ctypes.addressof():
	Returns the memory addresss of the object as an integer. As low as you can go

Full details: http://stackoverflow.com/questions/9126031/python-ctypes-sending-pointer-to-structure-as-parameter-to-native-library


matplotlib 
===========

Updating
---------

Ubuntu package is old (MPL 1.3.x). Update instead with pip3::

	sudo pip3 install matplotlib

Required a few dependencies however which pip couldn't handle, viz. ``libpng``, ``freetype``. Install dev packages manually first::

	sudo apt-get install libpng12-dev
	sudo apt-get install libfreetype6-dev

Now pip works fine

Finally, when using GTK3 canvas, must also install ``cairocffi`` in order to provide GTK with necessary Cairo wrappers. This in turn had it's own dependencies, viz; ``python3.4-dev``, ``libffi-dev``::

	sudo apt-get install python3.4-dev
	sudo apt-get install libffi-dev

and now install ``cairocffi``::

	sudo pip3 install cairocffi

N.b. ``cairocffi`` is required for all GTK3 backends (i.e. GTK3Cairo and GTK3Agg). It just doesn't work without it!

More backend installation details: http://matplotlib.org/users/installing.html
cairocffi installation details: https://pythonhosted.org/cairocffi/overview.html#installing-cffi

Backends
----------

Recall: backend is renderer/canvas combination - renderers are static (produce files); renderers + canvas are interactive (windows).

Previously using AGG renderer with Tk canvas. AGG write PNG only and is quite old (last repo update in 2006!). Probably better to move to Cairo - more output formats and newer.

Whilst we're at it, let's also try out GTK canvas - probably a bit newer (and already installed)

Change backend in `~/.config/matplotlib/matplotlibrc <~/.config/matplotlib/matplotlibrc>`_

Full details: http://matplotlib.org/faq/usage_faq.html#what-is-a-backend

Animation Output
-----------------

Using::

	ani = matplotlib.animation.Animation(*args)

Animated GIF using Imagemagick (usually installed)::

	ani.save("prova.gif", writer="Imagemagick")

MP4 (and other video formats) require ``ffmpeg``. ``ffmpeg`` being merged into main ubuntu multimedia PPA, but only from Wiley onwards. Only require binary however, so downloaded static build of 3.0.2 from http://johnvansickle.com/ffmpeg/ and placed in ``/usr/bin``. Now::

	ani.save("prova.mp4", writer="ffmpeg")

Also provides writing to h264 (HTML5 video) format. This is done by embedding animation in video tag::

	with open("prova.html", "wt") as file:
		file.write(ani.to_html5_video())

SVG Output
-----------

When generating SVGs from MPL, miter limit SVG property is set to a stupidly high value, causing Inkscape to crash hard [#]_ [#]_.

Solution is to manually edit generated SVG and change miter limit down to something more manageable (e.g. 4)

.. [#] https://bugs.launchpad.net/inkscape/+bug/1533058
.. [#] https://bugs.launchpad.net/inkscape/+bug/1534376

SciPy
==========

Upgrading SciPy Components on Linux
--------------------------------------

Do from pip. For user::

	pip3 install --user <PACKAGE> --upgrade

or systemwide (naughty)::

	sudo pip3 install <PACKAGE> --upgrade

In both cases, if using PyDev must remove and readd interpreter for changes to take effect.


Installing SciPy on Windows
-------------------------------

Whilst can install numpy using pip and PyPI packages, same does not work for rest of SciPy stack:

	pip does not work well for Windows because the standard pip package index site, PyPI, does not yet have Windows wheels for some packages, such as SciPy.

	--- Installing SciPy Stack, `scipy.org <https://www.scipy.org/install.html>`_

Instead, should use excellent pre-built installers provided by Christoph Gohlke [#]_. 

Check wheel versions supported by pip [#]_::

	import pip; print(pip.pep425tags.get_supported())

Download correct wheels for numpy and scipy, then install using pip [#]_::

	pip install numpy-<version>.whl
	pip install scipy-<version>.whl

N.b. should use a numpy wheel linked to the Interl Math Kernel library — standard library for mathematical computations

.. [#] http://www.lfd.uci.edu/~gohlke/pythonlibs/
.. [#] http://stackoverflow.com/questions/28107123/cannot-install-numpy-from-wheel-format
.. [#] https://pip.pypa.io/en/latest/user_guide/#installing-from-wheels



PyDev Configuration
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

