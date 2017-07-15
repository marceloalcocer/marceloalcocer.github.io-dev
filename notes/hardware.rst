================
Hardware Issues
================

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


Mediatek MT7630e Wireless Card Drivers
=========================================

Card and Driver
------------------

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


With 14.04 and kernel from summer 2014, card not working with default Ubuntu drivers. Had to build and install drivers myself [#]_. Source still present in ``/usr/src/rt2x00-3.13``, and kernel module added in ``/etc/modules``. 

With 16.04 and 4.4.0-34 kernel, wireless card not working with default Ubuntu drivers. Had to build and install drivers myself [#]_. Source still present in ``/usr/local/src/MT7360E-2.0.4``.

Secure Boot
-----------

Secure Boot is a chain of trust which starts at firmware [#]_; firmware certificate authority validates bootloader which validates kernel, which validates kernel modules, etc.

In Ubuntu:

#. Ubuntu primary bootloader (``shim``) is signed with MS key, and so is validated by firmware CA.
#. ``shim`` has Canonical key which validates GRUB secondary bootloader
#. GRUB validates kernel
#. Kernel validates kernel modules

Previously, had not needed to disable Secure Boot as whole chain worked. After kernel upgrade (>= 3.13.0-92-generic), wireless drivers no longer being used. Probably because using kernel built with kernel module signing enforced? This would result in a problem as own kernel module build cannot be signed with the Canonical key [#]_ and so fails validation in Secure Boot chain

Indeed see that were always failing validation:: 

	>> less /var/log/kern.log
	   ...
	   Jul 14 17:30:04 malcocer-S551LN kernel: [   17.839047] rt2x00lib: module verification failed: signature and/or  required key missing - tainting kernel
	   ...
	   Jul 15 17:30:04 malcocer-S551LN kernel: [   17.839047] rt2x00lib: module verification failed: signature and/or  required key missing - tainting kernel
	   ...

Previously, failure does not seem to have been a problem, however new kernel probably requires success? Interestingly, do not see any log entries after kernel update. Probably modules not being loaded at all.

Verified that Secure Boot enabled in UEFI settings (shift-restart from Windows as primary bootloader).

Solution - 14.04
---------------------

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

Solution - 16.04
---------------------

As before, tried signing the module to allow secure booting. As originally generated key still enrolled in MOK (``mokutil -l``), tries signing with this first.

With new driver from neurobin, can install kernel module with DKMS or manually — advantage of DKMS approach is that do not need to rebuild for every kernel update, however manual building seems to give more control of installation process (look at makefile).

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

.. [#] https://bugs.launchpad.net/ubuntu/+source/linux/+bug/1220146/comments/125
.. [#] http://github.com/neurobin/MT7630E
.. [#] https://wiki.ubuntu.com/SecurityTeam/SecureBoot
.. [#] http://askubuntu.com/questions/755238/why-disabling-secure-boot-is-enforced-policy-when-installing-3rd-party-modules
.. [#] http://askubuntu.com/questions/760671/could-not-load-vboxdrv-after-upgrade-to-ubuntu-16-04-and-i-want-to-keep-secur

