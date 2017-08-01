C/C++
========

Building shared libaries
-----------------------------

Compile code to object files with ``-fPIC`` option [#]_ [#]_::

	g++ -fPIC file1.cpp -o file1.o

``-fPIC`` option seems to be required for shared-library builds on most architectures. Does not seem to be detrimental to non-library builds however [#]_.
	
Link object files into shared library with ``-shared`` option::

	g++ -shared file1.o -o libfile1.so


.. [#] http://www.adp-gmbh.ch/cpp/gcc/create_lib.html
.. [#] https://stackoverflow.com/questions/31541451/create-shared-library-from-cpp-files-and-static-library-with-g
.. [#] https://stackoverflow.com/questions/5311515/gcc-fpic-option
