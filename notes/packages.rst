===========
Packages
===========

Misc Package Commands
=========================

List installed packages [#]_::

	apt list --installed

Information on installed package [#]_::

	dpkg -s <PACKAGE>

Information on non-installed package::

	dpkg --print-avail <PACKAGE>

Find package which provides file [#]_::

	apt-file search <FILE>

.. [#] http://askubuntu.com/questions/17823/how-to-list-all-installed-packages
.. [#] http://askubuntu.com/questions/341178/how-do-i-get-details-about-a-package-which-isnt-installed
.. [#] https://wiki.debian.org/apt-file


Packages Held Back
===========================

On day of 16.10 (Yakkety) release, doing ``apt-get upgrade`` seemed to update kernel from 4.4.0-42 to 4.4.0-43. GRUB now defaults to 43, but all hardware support is gone (usb, wifi, ethernet, etc).

When booting back into 42 and doing ``apt-get upgrade``, now seeing::

	The following packages have been kept back:
	  linux-generic linux-headers-generic linux-image-generic linux-signed-generic linux-signed-image-generic

Kept back implies that newer versions of the listed packages cannot be installed without breaking current dependencies:

	upgrade
		upgrade is used to install the newest versions of all packages
		currently installed on the system from the sources enumerated in
		/etc/apt/sources.list. Packages currently installed with new
		versions available are retrieved and upgraded; under no
		circumstances are currently installed packages removed, or packages
		not already installed retrieved and installed. New versions of
		currently installed packages that cannot be upgraded without
		changing the install status of another package will be left at
		their current version. An update must be performed first so that
		apt-get knows that new versions of packages are available.

	dist-upgrade
		dist-upgrade in addition to performing the function of upgrade,
		also intelligently handles changing dependencies with new versions
		of packages; apt-get has a "smart" conflict resolution system, and
		it will attempt to upgrade the most important packages at the
		expense of less important ones if necessary. So, dist-upgrade
		command may remove some packages. The /etc/apt/sources.list file
		contains a list of locations from which to retrieve desired package
		files. See also apt_preferences(5) for a mechanism for overriding
		the general settings for individual packages.

	--- apt-get man page

Would seem that ``apt-get upgrade`` is trying to upgrade the kernel packages (``linux-generic``, ``linux-headers-generic``, etc) to 43, but has realised that doing so would screw 42 and as such aborts. Not sure why it's trying to upgrade to 43, but probably due to Yakkety release. Think those kernel packages are virtual and should contain different things for Yakkety and Xenial. Maybe someone screwed up the release upstream?

... indeed would seem to be the case. An ``apt-get upgrade`` at a later date seems to have fixed the problem.

Ignoring ucf-dist File
========================

For a while now, have been getting following notification during ``apt-get update``::

	N: Ignoring file '20auto-upgrades.ucf-dist' in directory '/etc/apt/apt.conf.d/' as it has an invalid filename extension

Reading around a little, found out that is due to conflicting APT configuration files.

APT configuration is done via a series of distributed configuration files all held in ``/etc/apt/apt.conf.d`` directory [#]_. When a package updates an APT config file, the ``ucf`` (Update Configuration Files) utility is called to prompt the user whether to keep the old config file or switch to the new one. Regardless of the given answer, the original configuration file (before update) is copied to a ``*.ucf-dist`` suffixed file. The configurations contained within this file is ignored by ``apt-get update`` due to the added extension, generating the above notification [#]_.

As such, the retained original config file can be compared to the active config file, and if not needed can be safely deleted.

.. [#] https://askubuntu.com/questions/254137/etc-apt-apt-conf-d-priority-overrule-configuration-file/254617
.. [#] https://askubuntu.com/questions/572976/what-to-do-now-update-just-after-install/573091#573091

