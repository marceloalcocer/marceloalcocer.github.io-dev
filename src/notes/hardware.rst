=========
Hardware
=========

Authentication for Samba print server
========================================

Having problems getting Ubuntu to authenticate with sambsa print server — authenticates successfully during setup if credentials input manually, fails otherwise.

Turns out to be a Active Directory domain issue. Easily solved by prefixing username with ``/`` rather than usual ``DOMAIN\USERNAME`` [#]_

.. [#] https://askubuntu.com/a/154081/326761


Drivers
========

Concept
--------

Hardware drivers are just kernel modules — C code conforming to kernel module API [#]_. Most driver modules subsequently interact with HW via firmware code provided by manufacturer.

.. [#] http://www.tldp.org/LDP/lkmpg/2.6/html/

Building and installing
--------------------------

Modules typically built using kernel makefile (``/lib/modules/${uname-r}/build``). Resulting kernel object binaries copied to kernel modules directory (e.g. ``/lib/modules/$(uname-r)/kernel/driver``). Any firmware is copied to kernel firmware directory (``/lib/firmware/``).

Modules dependencies are computed and module is placed into module dependency tree (``lib/modules/$(uname-r)/modules.dep``, loading order for new kernel boot) using ``depmod``.

Finally, modules dynamically can inserted/removed into/from currently running kernel using ``modprobe``.

DKMS
-----

DKMS is framework which automates module build/installation procedure. This avoids user having to recompile modules manually every time the kernel updates.

Instead of building and inserting modules manually, install (copy) just firmware and give DKMS source code for module. It will then handle compilation, installation and insertion.

Secure Boot
=============

Secure Boot is a chain of trust which starts at firmware [#]_; firmware certificate authority validates bootloader which validates kernel, which validates kernel modules, etc.

In Ubuntu:

#. Ubuntu primary bootloader (``shim``) is signed with MS key, and so is validated by firmware CA.
#. ``shim`` has Canonical key which validates GRUB secondary bootloader
#. GRUB validates kernel
#. Kernel validates kernel modules

.. [#] https://wiki.ubuntu.com/SecurityTeam/SecureBoot


Reverting to Nouveau Graphics Driver
======================================

Remove all nvidia drivers::

	sudo apt-get purge nvidia*
	sudo apt-get autoremove

Resinstall nouveau firmware package::

	sudo apt-get install --reinstall nouveau-firmware

Remove nouveau module blacklisting::

	sudo rm /etc/modprobe.d/nvidia-graphics-drivers.conf

Remove modified (newly created?) xorg.conf::

	sudo cp /etc/X11/xorg.conf /etx/X11/xorg.conf.backup

Reconfigure X (not sure if this did anything)::

	sudo dpkg-reconfigure xserver-xorg

Change Xauthority permissions::

	sudo chown malcocer ~/.Xauthority sudo chgrp malcocer ~/.Xauthority


Low Mic Level
===============

alsamixer settings: No mic boost (playback and record), Full capture. Do **NOT** increase mic level from PulseAudio!

Backlight Brightness 
=====================

::

	sudo sh -c 'echo 70 > /sys/class/backlight/acpi_video0/brightness'  


Wacom Tablet Scrolling
=========================

Wacom Bamboo tablet pad ring and buttons not being recognized on Xenial. Can map to commands using [#]_::

	xsetwacom set "Wacom Bamboo Pad pad" "AbsWheelUp" "key up"
	xsetwacom set "Wacom Bamboo Pad pad" "AbsWheelDown" "key down"

According to man page, these are non-persistent X11 mappings and so will be reset with each X-server restart. As such, to make persistent could:

	#. Use Gnome startup application to run script
	#. Add to Xsession startup scripts [#]_

Latter is lower level — Gnome runs on X11. Probably no need to go so low, so will just set Gnome startup application

.. [#] https://ubuntuforums.org/showthread.php?t=1474596
.. [#] https://debian-administration.org/article/50/Running_applications_automatically_when_X_starts

Encrypted DVD playback
======================

Protected DVDs must have protection cracked to allow open-source playback. This is provided by ``css`` part of ``libdvdread``. Cannot be bundled for copyright reasons though — must download using script provided [#]_::

	sudo /usr/share/doc/libdvdread4/install-css.sh

.. [#] https://help.ubuntu.com/community/RestrictedFormats/PlayingDVDs


Set DVD region
----------------

VLC ignores DVD drive region when playing. For CSS though, DVD drive region must be set to something. Set using regionset tool (Europe: 2).


Clear CSS cache
-----------------

Every time CSS cracking occurs, resulting keys are cached in ``~/.dvdcss``. May not be totally transferable though from one protected DVD to another. This causes jerky playback. Clear cache to force ``libdvdread`` to crack again.

CNST printing
==============

::

	lp -U Alcocer <filename>



Mediatek MT7630e Wireless Card
===============================

Model
-------

Wireless card::

	>> lspci
	   ...
	   03:00.0 Network controller: MEDIATEK Corp. MT7630e 802.11bgn Wireless Network Adapter
	   ...

	>> sudo lshw -C network;
	   ...
	   *-network UNCLAIMED
	        description: Network controller
	        product: MT7630e 802.11bgn Wireless Network Adapter
	        vendor: MEDIATEK Corp.
	        physical id: 0
	        bus info: pci@0000:03:00.0
	        version: 00
	        width: 32 bits
	        clock: 33MHz
	        capabilities: pm msi pciexpress bus_master cap_list
	        configuration: latency=0
	        resources: memory:f7800000-f78fffff
	   ...


Ubuntu 14.04
----------------

With 14.04 and kernel from summer 2014, card not working with default Ubuntu drivers. Had to build and install drivers myself [#]_. Source still present in ``/usr/src/rt2x00-3.13``, and kernel module added in ``/etc/modules``. 

< 3.13.0-92
.............

Worked fine.

>= 3.13.0-92
.............

After kernel upgrade (>= 3.13.0-92-generic), wireless drivers no longer being used. Probably because using kernel built with kernel module signing enforced? This would result in a problem as own kernel module build cannot be signed with the Canonical key [#]_ and so fails validation in Secure Boot chain

Indeed see that were always failing validation:: 

	>> less /var/log/kern.log
	   ...
	   Jul 14 17:30:04 malcocer-S551LN kernel: [   17.839047] rt2x00lib: module verification failed: signature and/or  required key missing - tainting kernel
	   ...
	   Jul 15 17:30:04 malcocer-S551LN kernel: [   17.839047] rt2x00lib: module verification failed: signature and/or  required key missing - tainting kernel
	   ...

Previously, failure does not seem to have been a problem, however new kernel probably requires success? Interestingly, do not see any log entries after kernel update. Probably modules not being loaded at all.

Verified that Secure Boot enabled in UEFI settings (shift-restart from Windows as primary bootloader).

Should be able to generate key, sign own modules and add to MOK [#]_.

Checking modules added during driver installation to ``/etc/modules`` using ``modinfo``, see that only ``rt2*`` modules lack signatures as they were built locally. As such, only signed these.

Enrolled key in MOK. Checked public key file with ``mokutil -t``. Checked signature displayed in ``mokutil -l`` matches that in ``modinfo``.

Still getting error message in ``kern.log``::

	Request for unknown module key 'Descriptive name: 1abaa67b131e7951eb631b71b72c45e75e36c286' err -11

Strange, as signature matches that in MOK.

Confirmed that disabling validation (``mokutil --disable-validation``) solves problem.

Why are the modules failing validation?

#. Kernel rebuild/update required?
#. Where is module being loaded from? Perhaps from different location to signed ones...?

Whilst checking module location, saw that kernel already provides rt2x-like drivers for this wireless card. These are already signed by someone at Canonical. Tried removing all own drivers and using these kernel drivers. Now they pass validation (no errors in ``kern.log``), but the wireless car remains unclaimed.

In the end, had to disable kernel module validation. Poor solution.

.. [#] https://bugs.launchpad.net/ubuntu/+source/linux/+bug/1220146/comments/125
.. [#] http://askubuntu.com/questions/755238/why-disabling-secure-boot-is-enforced-policy-when-installing-3rd-party-modules
.. [#] http://askubuntu.com/questions/760671/could-not-load-vboxdrv-after-upgrade-to-ubuntu-16-04-and-i-want-to-keep-secur



Ubuntu 16.04
----------------

With 16.04 and 4.4.0-34 kernel, wireless card still not working with default Ubuntu drivers. Had to build and install drivers myself [#]_. Source still present in ``/usr/local/src/MT7360E-2.0.4``.


4.4.0
.......

As before, tried signing the module to allow secure booting. As originally generated key still enrolled in MOK (``mokutil -l``), tries signing with this first.

With new driver from neurobin, can install kernel module with DKMS or manually — advantage of DKMS approach is that do not need to rebuild for every kernel update, however manual building gives more control of installation process and allows us to sign module.

Build module::

	>> cd /usr/local/src/MT7630E
	>> sudo ./uninstall
	>> sudo make clean
	>> sudo ./install

Final ``modprobe`` fails as kernel modules not yet signed.

Sign modules::

	>> sudo /usr/src/linux-headers-$(uname -r)/scripts/sign-file sha256 ./MOK.priv ./MOK.der $(modinfo -n mt7630e)	
	>> sudo /usr/src/linux-headers-$(uname -r)/scripts/sign-file sha256 ./MOK.priv ./MOK.der $(modinfo -n mt76xx)	

Final ``depmod`` to build kernel module dependency tree (no fail now)::

	>> sudo depmod

Reboot and working first time now ;-)

Will have to repeat at each kernel upgrade however. **Don't uninstall module yet! Boot into previous kernel version first to decrypt** ``MOK.priv`` .



4.10.0
..............

Noticing that module is tainting the kernel despite being signed::

	>> dmesg | grep mt7630e
	[   18.407252] mt7630e: loading out-of-tree module taints kernel.
	[   18.407331] mt7630e: module verification failed: signature and/or required key missing - tainting kernel

Everything seems to be working though. Is kernel module signing not enforced for 4.10?


4.10.0-30
...........

Now module installation failing — seems to hang on ``depmod`` just after build completion.

Tested build + manual insertion using ``test`` script — all working. Implies that module works fine and problem is indeed related to ``depmod`` only.

Interestingly, installation with DKMS does not hang on ``depmod``. Given that do not need to sign, can use this as a workaround for the time being.

DKMS for some reason not building or installing module on kernel upgrades — must do this manually::

	sudo dkms build mt7630e/2.1.0
	sudo dkms install mt7630e/2.1.0

4.15.0-29
...........

Up until now, previous DKMS-based install to circumvent ``depmod`` bug had been working fine. Module could not be signed, but did not seem to be strictly enforced by kernel.

As of 4.15.0-29, noticed that DKMS shows ``mt7630e`` module as being installed, but it is not loaded (nothing in ``kern.log`` or ``lsmod`` output).

Uninstalling from DKMS and trying manual install however seems to once again work — ``depmod`` doesn't hang. Final ``modprobe`` call to load module does however fail due to kernel signing, so must sign and reload as before.

N.b. Calling module uninstall script removes firmware binaries from ``/lib/firmware``. These are **not** re-copied by DKMS-based module installation (e.g. for 4.13 kernel), and so the card will not work and a missing firmware message will be logged in ``kern.log``. Manually copying the firmware files resolves the issue.

Example upgrade script (assuming decrypted MOK)::

	#!/bin/bash
	MOKDIR="/home/malcocer/.mok/"
	MOKPRIV=$MOKDIR"_MOK.priv"
	MOKDER=$MOKDIR"MOK.der"
	if (( $EUID != 0 )); then
	    printf "\n-----Sorry! Run with root privilege (for example with 'sudo ./install')\n\n"
	    exit 1
	fi
	echo "*** Uninstalling ***"
	./uninstall
	echo "*** Cleaning Up ***"
	make clean
	echo "*** Installing ***"
	./install
	echo "*** Signing ***"
	/usr/src/linux-headers-$(uname -r)/scripts/sign-file sha256 $MOKPRIV $MOKDER $(modinfo -n mt7630e)
	/usr/src/linux-headers-$(uname -r)/scripts/sign-file sha256 $MOKPRIV $MOKDER $(modinfo -n mt76xx)
	echo "*** Inserting Module ***"
	depmod
	echo "*** Cleaning Up ***"
	make clean
	rm $MOKPRIV


.. [#] http://github.com/neurobin/MT7630E
