======
Gentoo
======

Portage
=======

Portage is the Gentoo package manager.

``emerge`` is main front-end to Portage. Other tools also exist (see wiki page [#]_ for list).

------------
Repositories
------------

Portage fetches packages from repositories. Repos contains packages, known as *ebuilds* — plain text files containing all info to fetch and build software from source, e.g.::

	root@肩車:~$ head /var/db/repos/gentoo/app-editors/vim/vim-8.2.0638.ebuild 
	# Copyright 1999-2021 Gentoo Authors
	# Distributed under the terms of the GNU General Public License v2

	EAPI=7
	VIM_VERSION="8.2"
	PYTHON_COMPAT=( python3_{6,7,8} )
	PYTHON_REQ_USE="threads(+)"
	USE_RUBY="ruby24 ruby25 ruby26 ruby27"

	inherit vim-doc flag-o-matic bash-completion-r1 python-single-r1 ruby-single desktop xdg-utils

Repos to use configured in ``/etc/portage/repos.conf``. When in use, repo contents copied to ``/var/db/repos``. Synchronizing repo simply fetches newest ebuilds [#]_. Fetching usually done from closest rsync mirror [#]_ using ``rsync``::

	emerge --sync  # OR
	emaint sync

``emaint`` is interface to portage for package/repo maintenance. ``emaint sync`` is prettier front-end to ``emerge --sync`` and is now preferred. Does fundamentally the same thing though.

.. note::

	You probably want ``emaint sync --auto`` to sync all repos which are set to auto-sync (e.g. main gentoo repo).

Alternatively can also fetch snapshot over http and sync with ``emerge-webrsync``. This is faster for first time as fetches whole repo contents as tarball. Also used to be only way to allow signature checking of repo contents. Nowadays though, ``emerge --sync``-based commands also do signature checking — prefer this.

---------
Packages
---------

Once local copy of repos contains newest ebuilds, can use info in ebuild to fetch source (and metadata) from source mirror [#]_ and build software. Source files are fetched and placed in ``/var/db/pkg/``, e.g.::

	root@肩車:~$ ls /var/db/pkg/app-editors/vim-8.2.0814-r100/
	BUILD_TIME  CFLAGS    COUNTER         DEPEND       environment.bz2  INHERITED       KEYWORDS  NEEDED        RDEPEND     SIZE  vim-8.2.0814-r100.ebuild
	CATEGORY    CHOST     CXXFLAGS        DESCRIPTION  FEATURES         IUSE            LDFLAGS   NEEDED.ELF.2  repository  SLOT
	CBUILD      CONTENTS  DEFINED_PHASES  EAPI         HOMEPAGE         IUSE_EFFECTIVE  LICENSE   PF            REQUIRES    USE

Lists of packages to install and keep updated are known as *sets*. Default set is ``@world``, and is simply the list of packages defined in ``/var/lib/portage/world``, e.g.::

	root@肩車:~$ cat /var/lib/portage/world
	app-admin/logrotate
	app-admin/sysklogd
	app-editors/vim
	dev-libs/libgpg-error
	net-misc/dhcpcd
	net-misc/netifrc
	net-wireless/wpa_supplicant
	sys-apps/pciutils
	sys-boot/grub:2
	sys-kernel/gentoo-sources
	sys-kernel/linux-firmware
	sys-process/dcron

To actually update packages, use ``emerge --update``, e.g. to update all packages in ``@world`` set [#]_::

	emerge --update @world

.. note::

	You probably want::

		emerge --update\
		 --deep          $(# Update dependecies too) \
		 --with-bdeps=y  $(# Update build dependencies too) \
		 --newuse        $(# Update anything whose USE has changed)\
		 --pretend       $(# Dry run) \
		 --ask           $(# Ask before proceeding) \
		 --tree          $(# Show dep tree)\
		 --verbose       $(# Speak!)\
		 @world

After doing full update, recommended to remove all unused dependencies::

	emerge --depclean    $(# Remove all no longer needed deps)\
	  --with-bdeps=n     $(# Remove non-required build deps too)\
	  --pretend \
	  -atv

.. [#] https://wiki.gentoo.org/wiki/Portage
.. [#] rsync mirrors are used to update repos with latest package versions
.. [#] source mirrors are used by packages as target to fetch sources from
.. [#] https://wiki.gentoo.org/wiki/Handbook:AMD64/Working/Portage#Updating_the_Gentoo_repository
.. [#] https://wiki.gentoo.org/wiki/Handbook:AMD64/Working/Portage#Updating_the_system


Kernel
======

Kernel sources in ``/usr/src``. Symlink ``linux`` to current kernel version. Kernel configuration file is ``/usr/src/linux/.config``.

Build kernel (main and modules) with ``make``.	Once built, copy kernel modules to ``/lib/modules/$(uname -r)/kernel``::

	make modules_install

Modules to be automatically loaded at boot configured in ``/etc/modules-load.d``.

Once built, copy kernel to ``/boot/vmlinuz-$(uname -r)``::

	make install

Configure grub to find new kernel images by generating new ``/boot/grub/grub.cfg``::

	grub-mkconfig -o /boot/grub/grub.cfg


