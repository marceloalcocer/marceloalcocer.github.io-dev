C/C++
========

Useful GCC flags
---------------------

``-L<path>``
	Add ``<path>`` to linker search path. Should come before ``-l``.

``-l<lib>``
	Link against library ``<lib>``. Prepends ``lib`` and ``.so`` or ``.a`` to library name. Must come after object file.

``-fPIC``
	Compile to Position Independent Code. Required for building dynamically linked libraries.

``extern`` keyword
------------------------

The ``extern`` keyword is used to explicitly declare rather than define functions and variables over a global scope [#]_.

In C++, it can be used with ``"C"`` to declare pure-C functions/variables which are however defined in C++. This can be useful for example to expose C++ class methods to C [#]_ [#]_.

.. [#] http://www.geeksforgeeks.org/understanding-extern-keyword-in-c/
.. [#] http://www.auctoris.co.uk/2017/04/29/calling-c-classes-from-python-with-ctypes/
.. [#] https://stackoverflow.com/questions/1615813/how-to-use-c-classes-with-ctypes

Building dynamically linked libaries
---------------------------------------

Object files to be linked into shared library must be compiled with ``-fPIC`` option [#]_ [#]_, e.g.::

	g++ -fPIC file1.cpp -o file1.o

Whilst should only affect some speciifc architecures, in pratice ``-fPIC`` option seems to be required for shared-library builds on most architectures. Does not seem to be detrimental to non-library builds however [#]_.
	
Link object files into shared library with ``-shared`` option::

	g++ -shared file1.o -o libfile1.so

Once the library has been built, the OS must be told where to find it at runtime — this may not be the same place as at link-time. Exact link-/run-time serach rules can vary across Linux distributions, but generally can be set temporarily by setting ``LD_LIBRARY_PATH`` environment variable, or permanently by copying to a default location (e.g. ``/usr/local/lib``) [#]_.


N.b. Simply copying library to e.g. ``/usr/local/lib`` after building may not be enough however as some distributions (e.g. Ubuntu) cache dynamic libraries, which therefore must be updated by calling ``ldconfig`` [#]_.

.. [#] http://www.adp-gmbh.ch/cpp/gcc/create_lib.html
.. [#] https://stackoverflow.com/questions/31541451/create-shared-library-from-cpp-files-and-static-library-with-g
.. [#] https://stackoverflow.com/questions/5311515/gcc-fpic-option
.. [#] https://unix.stackexchange.com/questions/22926/where-do-executables-look-for-shared-objects-at-runtime
.. [#] https://stackoverflow.com/questions/8039562/cannot-open-shared-object-file
