=========
Backup
=========

Duplicity
==========

Duplicity compresses, encrypts and signs (optional) a set of files before copying to a backend [#]_ [#]_. Multiple backend protocols are supported, e.g. local filesystems, FTP, SSH, Dropbox, etc.

Compression is done by default using gzip.

Encryption is also done by default, but is symmetric. Can instead pass ``--encrypt-keys`` option to use GPG public key for asymmetric encryption. In this case, must specify key.

Finally, encrypted archive files can be optionally signed with GPG  key. In this case, must pass ``--sign-key`` option with public/private key hex ID (e.g. obtained from ``gpg -k``). The private key passphrase will be requested and the archive will be signed using the private key. Password input can be deferred to GPG agent by passing ``--use-agent`` option. The convenience option ``--encrypt-sign-key`` can be used to specify the same GPG key for encryption and signing, although it must then be identified by its hex ID.

Archive signing can be confirmed by decryption using GPG [#]_::

	gpg --output tmpfile --decrypt <A_DUPLICITY_ARCHIVE_FILE>.gpg

looking out for confirmation of a valid signature::

	gpg: encrypted with 2048-bit RSA key, ID XXXXXXXX
	gpg: Signature made using RSA key ID XXXXXXXX
	gpg: Good signature from "Marcelo Alcocer (local) <marsehole@gmail.com>"
	
Display progress with ``--progress`` option. Can be buggy however so best to rely on ``--verbosity debug`` instead [#]_.

Force full backup (rather than incremental) by using ``full`` command::

	duplicity full <SRC> <DEST>

Example backup command (to local backend)::

	duplicity --verbosity debug --encrypt-sign-key <KEY_ID> --use-agent <SRC> file://<DEST>

.. [#] http://duplicity.nongnu.org/index.html
.. [#] https://help.ubuntu.com/community/DuplicityBackupHowto
.. [#] https://answers.launchpad.net/duplicity/+question/170395
.. [#] https://superuser.com/questions/814321/how-to-go-through-this-duplicity-stalled-connection


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


Gnome keyring
===============

Gnome provides password storage service — Gnome Keyring — to desktop applications so as to reduce number of times you have to type passwords into prompt (e.g. GPG password prompt when using GPG agent) [#]_. If ``save password`` checked during password prompt, password is encrypted with current Linux user logon password, and stored locally.

Chrome delegates password management and storage to local service. On Gnome desktop, this is Gnome Keyring service.

Interface to Gnome Keyring is provided by Seahorse app.

.. [#] https://superuser.com/questions/969484/what-is-gnome-keyring-seahorse-and-why-its-storing-my-passwords-in-plaintext

GPG agent
============

Daemon automatically started by GPG to handle (amongst other things) private key decryption [#]_. Enables passphrases to be cached, allowing password-free access to private key for limited time.

On Gnome desktop, uses ``pinentry`` program for interactive password entry. As such, Gnome keyring service also available to user.

.. [#] https://www.gnupg.org/faq/whats-new-in-2.1.html#autostart

