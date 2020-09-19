==========
Windows
==========

Windows Shares
===============

Windows shares can be mounted using `CIFS <https://en.wikipedia.org/wiki/Server_Message_Block>`_ protocol (now called SMB) — file sharing protocol compatible with Windows shares [#]_. Provided by kernel module and accessed via ``cifs-utils`` package::

	sudo apt-get install cifs-utils

Once installed, allows ``mount`` to use Windows network shares as devices for mounting. Specific options to pass using ``mount -o`` or in ``fstab`` described in ``man mount.cifs``. Can then simply mount as normal::

	sudo mount //servername/sharename <MOUNT_POINT>

Authentication
----------------

If server requires authentication, have to pass CIFS specific ``user`` and ``password`` options. Easiest to define these in protected (600) local file and pass ``credentials`` option instead.

Mount on boot
--------------

Can mount on boot by adding ``fstab`` entry. Ensure that ``_netdev`` standard option present so that only mounts when network present [#]_ [#]_.

Mount on login
---------------

If network only present when logged on (e.g. WiFi), better to mount on login instead. Relevant options:

:``_netdev``: Mount only when network present
:``noauto``: Prevent automatic (i.e. boot time) mounting
:``users``: Allow normal users to mount/unmount

Tried using ``user``, ``owner`` and ``group`` options instead of ``users`` to limit mount access. This allows mounting, but not unmounting on Ubuntu 16.04. This is because on Ubuntu, ``/etc/mtab`` is a symlink to readonly ``/proc/self/mounts``, and so information on user who mounted cannot be written [#]_.

Instead, allow all users to mount and unmount — credentials for protected network share are protected anyway, and so limit users which can successfully mount.

.. [#] https://wiki.ubuntu.com/MountWindowsSharesPermanently
.. [#] https://askubuntu.com/questions/157128/proper-fstab-entry-to-mount-a-samba-share-on-boot
.. [#] https://askubuntu.com/questions/194727/mounting-samba-share-whenever-its-available-unmounting-when-its-not
.. [#] https://unix.stackexchange.com/questions/76326/option-user-work-for-mount-not-for-umount


Windows Subsystem for Linux
============================

Installation of WSL is only fully supported for Windows 10 builds ≥ 16215 [#]_. Such an installation allows multiple different distributions (Ubuntu, Debian, Fedora, etc).

Prior to 16215, WSL considered a beta feature and only supported Ubuntu distribution as "Bash on Ubuntu on Windows" [#]_. If for whatever reason, cannot update to latest builds, can still install this.

.. [#] https://docs.microsoft.com/en-us/windows/wsl/install-win10
.. [#] https://docs.microsoft.com/en-us/windows/wsl/install-legacy

X11 on WSL
----------

WSL provides only limited Linux functionality. Amongst missing features is X11 server — server used by X11 clients (viz. applications) to render graphics. As such, graphical display on WSL not directly possible.

Workaround is to install X11 server (e.g. xming) on Windows and forward all X11 client requests from WSL to windows [#]_. Forward requests by setting ``DISPLAY`` environment variable in WSL to point to X11 server [#]_::

	export DISPLAY=localhost:0.0

This can be chained with X11 forwarding by SSH to allow rendering of remote graphics by X11 server on local Windows::

	ssh -X <SSH_SERVER>

In this case, only need to set local WSL ``DISPLAY`` variable. Remote variable should be left as is for SSH to listen to and forward [#]_

.. [#] https://virtualizationreview.com/articles/2017/02/08/graphical-programs-on-windows-subsystem-on-linux.aspx
.. [#] https://stackoverflow.com/questions/784404/how-can-i-specify-a-display
.. [#] https://unix.stackexchange.com/questions/207365/x-flag-x11-forwarding-does-not-appear-to-work-in-windows#answer-209083

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

