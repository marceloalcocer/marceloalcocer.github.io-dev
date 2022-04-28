=========
Python
=========

async
=====

:Concept: Relinquish *some* control of execution order to an event loop so as to enable concurrent (*not parallel*) execution (handing execution 'baton' amongst multiple blocking operations).

To achieve this, define *coroutines* using ``async def`` — functions which can pause/resume execution. These are nothing magical, but rather just a formalization of some of the more advanced functionalities of generators::

	╭───────>───────╮
	│             ──┼─> yield
	┊   generator
	│             <─┼── send
	╰───────<───────╯

Within a coroutine, relinquish control using ``await``. The controlling event loop will then re-enter the coroutine once the awaitable is ready::

	╭───────>───────╮
	│             ──┼─> await
	┊   coroutine                Event Loop
	│             <─┼── result
	╰───────<───────╯

N.b. Execution order is as normal in the coroutine — ``await`` blocks *within* coroutine. Concurrency is only achieved when multiple coroutines are being handled by the event loop.

Python does *not* have an in-built event loop, but rather only provides the basic tools (``async/await``) to do so. It's envisaged that multiple libraries will implement them in different ways.

One such implementation bundled in the stdlib is ``asyncio`` — a library focussing on asynchronous IO. ``asyncio``'s event loop is started using ``asyncio.run()``. The argument is a coroutine which probably calls other coroutines. The called coroutines are added to and handled by the event loop. The event loop is closed once the main coroutine returns, e.g. [#]_::

	import asyncio
	import time

	async def say_after(delay, what):
		await asyncio.sleep(delay)
		print(what)

	async def main():
		print(f"started at {time.strftime('%X')}")

		await say_after(1, 'hello')
		await say_after(2, 'world')

		print(f"finished at {time.strftime('%X')}")

	asyncio.run(main())

N.b. As mentioned above, the ``await`` in ``main`` is blocking, so execution order within ``main`` is well defined (first ``await``, second ``await``). As such, in this example only one coroutine is being handled by the event loop at a time, and so there is no real concurrency.

To achieve concurrency, must have multiple coroutines in event loop, i.e. single ``await`` on multiple coroutines. Do this in ``asyncio`` by converting coroutines into ``Task`` instances (using ``asyncio.create_task``). These will be scheduled for imminent execution in the event loop.

N.b. Execution will occur soon after the ``Task`` is instantiated. ``Tasks`` are however awaitables, and so ``await`` can be used if necessary to suspend control flow until the ``Task`` has completed. This can be used for example, to ensure the ``Tasks`` stay in scope::

	import asyncio
	import time

	async def say_after(delay, what):
		await asyncio.sleep(delay)
		print(what)

	async def main():
		task1 = asyncio.create_task(say_after(1, 'hello'))      # Will start executing imminently
		task2 = asyncio.create_task(say_after(2, 'world'))      # Will start executing imminently

		print(f"started at {time.strftime('%X')}")

		await task1     # Wait until task 1 is done…
		await task2     # …and then wait until task 2 is done

		print(f"finished at {time.strftime('%X')}")

	asyncio.run(main())

Can also use ``asyncio.gather`` as convenient way to convert multiple coroutines into tasks — this is probably what you'll be using most::


	import asyncio
	import time

	async def say_after(delay, what):
		await asyncio.sleep(delay)
		print(what)

	async def main():

		# Convert both coroutines into tasks, thereby scheduling 
		# their concurrent execution.
		#
		# Wait until both tasks have completed before proceeding
		#
		await asyncio.gather(
			say_after(1, 'hello'),
			say_after(2, 'world')
		)

	asyncio.run(main())

.. [#] https://docs.python.org/3.7/library/asyncio-task.html


pip
====

Installation from source
------------------------

Recommended way of installing python package from source is via pip [#]_::

	pip install --user <PATH>

.. [#] https://packaging.python.org/tutorials/installing-packages/


Privileged installation
------------------------

``pip`` is Python package manager used for installing packages from Python Package Index (PyPI) [#]_. Typically bootstrap ``pip`` by installing it from external sources (e.g. Debian package using ``apt``), and from then it can update itself.

Python packages are installed by running their ``setup.py`` scripts. As such, very dangerous to call ``pip`` with superuser privileges — pulls code from PyPI (or elsewhere) and executes as superuser [#]_! Should instead install as user using ``pip install --user`` [#]_.

.. [#] https://en.wikipedia.org/wiki/Pip_(package_manager)
.. [#] https://askubuntu.com/questions/802544/is-sudo-pip-install-still-a-broken-practice
.. [#] Should be default pip behaviour on Ubuntu

Package locations
------------------

On Debian based distributions, Python packages are by default installed to 3 different locations (approx) [#]_:

1. ``/usr/lib/python3/dist-packages``: Global site-packages installed by Debian package manager. Typically required by the distribution
2. ``/usr/local/lib/python3.5/dist-packages``: Global site-packages installed by ``sudo pip install``. Typically installed (incorrectly) by user
3. ``~/.local/lib/python3.5/site-packages``: User site-packages installed by ``pip install --user``. Typically installed by user.

To see locations of installed packages::

	pip list -vvv

Interestingly, ``installer`` column does not always show ``pip`` even if the package was installed with ``pip``. Instead best to identify installation method by path.

To move packages erroneously installed as global packages to user packages::

	#!/bin/bash
	for x in $( pip3 list -vvv | grep "/usr/local/lib/*" | grep -o "^\w*" ); do
		pip show ${x}
		sudo pip uninstall ${x}
		pip install --user ${x}
		pip show ${x}
		pip list -vvv | grep "/usr/local/lib/*"
	done

N.b. ``pip uninstall`` will ask for confirmation before uninstalling.

Whilst installing, pip automatically checks dependencies using both global and user packages. As such, moving a depending/dependent package from global to user should not break the dependency, and so the packages may be moved in any order. Should still check though::

	pip check

.. [#] https://stackoverflow.com/questions/9387928/whats-the-difference-between-dist-packages-and-site-packages


NumPy
=======

Subclassing ndarray
---------------------------

Often desirable to subclass ndarray for numeric-based classes. Doing this correctly is slightly more complicated than regular subclassing as ndarray instances can be created in three different ways [#]_:

#. Explicit constructor call: ``MySubclass(params)``
#. View casting: ``np.array([1,2,3]).view(MySubclass)``
#. Templating: ``MySubclass([1,2,3])[1:]``

Each builds instances with slightly different calls to ``__new__``, ``__init__`` and ``__array_finalize__``. Briefly:

* All methods call subclass's ``__new__`` method where must have superclass ``np.ndarray.__new__`` call
* This triggers call to subclass's ``__array_finalize__`` method 
* Arguments to ``__array_finalize__`` are different for each creation route and can be used for identification

In almost every case, will want to follow template given in documentation [#]_.

.. [#] https://docs.scipy.org/doc/numpy-1.12.0/user/basics.subclassing.html
.. [#] https://docs.scipy.org/doc/numpy-1.12.0/user/basics.subclassing.html#slightly-more-realistic-example-attribute-added-to-existing-array


Pickling ndarray subclasses
-------------------------------

When unpickling class instance, pickle protocol does not call ``__init__`` but rather creates uninitialized instance and then populated attributes from ``__dict__`` [#]_. As such, complex creation procedure required for ndarray subclasses fails to store additional class attributes.

Solution is to override ndarray ``__reduce__`` and ``__setstate__`` methods to explicitly store and retrieve (respectively) the added attributes [#]_. N.b. Use ``__reduce__`` rather than ``__getstate__`` as is what is used by ndarray.

.. [#] https://docs.python.org/3.4/library/pickle.html?highlight=pickle#pickling-class-instances
.. [#] https://stackoverflow.com/questions/26598109/preserve-custom-attributes-when-pickling-subclass-of-numpy-array


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

