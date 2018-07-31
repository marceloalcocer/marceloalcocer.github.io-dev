==========
Windows
==========

Windows C++ development
========================

MSVC build tools
-----------------

Whilst Microsoft Visual C (MSVC) build tools (compiler, linker, make implementation, etc.) used to be baked into Visual Studio's C/C++ workload (extension), can now obtain build tools separately, allowing building from the command line [#]_.

N.b. Must always use tools from correctly set up environment to ensure correct variables are set (e.g. PATH, LIB, LIBPATH, INCLUDE, etc)

.. [#] https://docs.microsoft.com/en-gb/cpp/build/building-on-the-command-line


MSVC search paths
-------------------

Pre-processor
..............

Set ``INCLUDE`` environment variable, e.g.::

	setx INCLUDE "path\to\dependency\include\;%INCLUDE%"

Linker
.......

Set ``LIB`` environment variable [#]_, e.g.::

	setx LIB "path\to\dependency\lib\;%LIB%"

Runtime
........

Windows uses different search path rules for link- and run-time. Could set ``PATH`` variable, but better to set application specific path in registry instead [#]_.


.. [#] https://stackoverflow.com/questions/20483619/what-is-the-difference-between-the-lib-and-libpath-environment-variables-for-ms
.. [#] https://www.codeguru.com/cpp/w-p/dll/article.php/c99/Application-Specific-Paths-for-DLL-Loading.htm


MSVC runtime
--------------

MSVC runtime (``MSVCRT.dll``) is a library which provides typical functions required by C and C++ programs (e.g. string manipulation, malloc, etc). It ships by default with the Windows OS, but is considered part of the OS and therefore can be patched (i.e. modified) at any time. As such, linking against MSVCRT.dll is strongly discouraged as there is no guarantee it will be the same on the target machine.

To remedy this, each version of VS ships with its own Visual C RunTime library; e.g. VS 2008 ships with ``MSVCRT90.dll``, VS 2010 shipped with ``MSVCRT100.dll``, etc. Devs are recommended to link against the DLL shipped with their version of VS. This means however that when depolying the software, either the program must be statically linked (contains the library functions, larger file size), the specific ``MSVCRTxxx.dll`` must be distributed with the program ("app-local distribution"), or the target machine must be assumed to have to have it in a known location ("central distribution") [#]_.

With the advent of Windows 10 and continous rolling updates, MS realised that it could revert back to having once central runtime DLL without any negative consequences - all Win10 machines are forcefully updated and so everyone (devs and end-users) will always have the latest version of the VCRT DLL. This eternal VCRT DLL is known as the Universal CRT and is spread out across two files; ``vcruntime.dll`` and ``ucrtbase.dll``. As these are integral parts of the OS, Win10 end-users can always be assumed to have them installed. End-users running Win < 10 do not however, and so DLL redistribution must be done as before [#]_.

Visual Studio ≥ 2015 should already link against ``ucrtbase.dll`` by default.

.. [#] http://stackoverflow.com/questions/1073509/should-i-redistribute-msvcrt-dll-with-my-application
.. [#] https://blogs.msdn.microsoft.com/vcblog/2015/03/03/introducing-the-universal-crt/

Microscoft Visual Studio
--------------------------

MSVS is only available as 32-bit application. It can however happily target 64-bit systems.

Declaring exported symbols in DLLs
-------------------------------------

Build Windows dynamic link libraries (DLL) by linking with ``/DLL`` option. Unlike Linux dynamics libraries, DLLs require explicit declaration of which functions/classes are to be exported [#]_.

Easiest way to do this is to prepend ``__declspec(dllexport)`` to function/class declaration, as well as any superclasses [#]_. 

If writing portable code, probably wise to use preprocessor commands to limit prepending to Windows builds, e.g.::

	#ifndef DLLExport
	#ifdef _WIN32
	#define DLLExport __declspec(dllexport)
	#else
	#define DLLExport
	#endif // _WIN32
	#endif // DLLExport

.. [#] https://docs.microsoft.com/en-gb/cpp/build/reference/dll-build-a-dll
.. [#] https://docs.microsoft.com/en-gb/cpp/cpp/dllexport-dllimport

Hashing
=========

Builtin MD5 hashing [#]_::

	CertUtil -hashfile <FILE> MD5

.. [#] https://superuser.com/questions/245775/is-there-a-built-in-checksum-utility-on-windows-7/898377#898377


Symlinks 
=========

::

	mklink <NAME> <TARGET>

N.b. for links to executables, must make sure ``<NAME>`` has .exe suffix.


Windows <10 USB serial drivers
==============================

Windows only included dedicated USB-serial drivers in Windows 10 (``usbser.sys``).

Previous versions `should instead use usb modem drivers (mdmcpq.sys) <https://support.microsoft.com/en-us/kb/837637>`_ which offers almost identical functionality. To do so, need to `reference modem driver in .inf file <https://social.technet.microsoft.com/Forums/windows/en-US/01e8e7db-0461-48d6-bc3d-aa8ee2620b67/usb-modem-driver-usbsersys-does-not-install-on-windows-7-64bit-enterprise?forum=w7itprohardware>`_. Then Just "Have Disk" inf file, and voila - instant USB COM port


Logged in users
==================

Use sysinternals live from command prompt::

	\\live.sysinternals.com\Tools\psloggedon.exe \\<workstation_name>

