==========
Windows
==========

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


Windows <10 USB Serial Drivers
==============================

Windows only included dedicated USB-serial drivers in Windows 10 (``usbser.sys``).

Previous versions `should instead use usb modem drivers (mdmcpq.sys) <https://support.microsoft.com/en-us/kb/837637>`_ which offers almost identical functionality. To do so, need to `reference modem driver in .inf file <https://social.technet.microsoft.com/Forums/windows/en-US/01e8e7db-0461-48d6-bc3d-aa8ee2620b67/usb-modem-driver-usbsersys-does-not-install-on-windows-7-64bit-enterprise?forum=w7itprohardware>`_. Then Just "Have Disk" inf file, and voila - instant USB COM port


Windows C++ Development
========================

Visual Studio < 2015
----------------------

Microsoft Visual C RunTime (``MSVCRT.dll``) is a library which provides typical functions required by C and C++ programs (e.g. string manipulation, malloc, etc). It ships by default with the Windows OS, but is considered part of the OS and therefore can be patched (i.e. modified) at any time. As such, linking against MSVCRT.dll is strongly discouraged as there is no guarantee it will be the same on the target machine.

To remedy this, each version of VS ships with its own Visual C RunTime library; e.g. VS 2008 ships with ``MSVCRT90.dll``, VS 2010 shipped with ``MSVCRT100.dll``, etc. Devs are recommended to link against the DLL shipped with their version of VS. This means however that when depolying the software, either the program must be statically linked (contains the library functions, larger file size), the specific ``MSVCRTxxx.dll`` must be distributed with the program ("app-local distribution"), or the target machine must be assumed to have to have it in a known location ("central distribution").

Full details: http://stackoverflow.com/questions/1073509/should-i-redistribute-msvcrt-dll-with-my-application

Visual Studio 2015
-------------------

With the advent of Windows 10 and continous rolling updates, MS realised that it could revert back to having once central runtime DLL without any negative consequences - all Win10 machines are forcefully updated and so everyone (devs and end-users) will always have the latest version of the VCRT DLL. This eternal VCRT DLL is known as the Universal CRT and is spread out across two files; ``vcruntime.dll`` and ``ucrtbase.dll``. As these are integral parts of the OD, Win10 end-users can always be assumed to have them installed. End-users running Win < 10 do not however, and so DLL redistribution must be done as before.

Visual Studio 2015 should already link against ``ucrtbase.dll`` by default.

Full details: https://blogs.msdn.microsoft.com/vcblog/2015/03/03/introducing-the-universal-crt/

Notes
------

VS is only available as 32-bit application. It can however happily traget 64-bit systems.


Logged in Users
==================

Use sysinternals live from command prompt::

	\\live.sysinternals.com\Tools\psloggedon.exe \\<workstation_name>

