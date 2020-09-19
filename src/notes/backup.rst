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


Recovery
========

Create new user::

	sudo adduser foobar

New user can mount external filesystems. FSs take permissions however of mount point — most frequently root. As such, cannot read (copy) any files which do not match current user (e.g. cannot copy malcocer files from foobar) — must use SU preveledges.

Add user to sudo group::

	sudo adduser foobar sudo

Now can copy backup keys::

	sudo cp <BACKUP>/.gnupg/*.gpg ./gnupg

Can now list keys as usual::

	gpg2 --list-keys

Now check restore with a single file. Again, must use sudo to access backup files if different from current user::

	sudo duplicity restore --file-to-restore <FILE> file://<BACKUP><FILE> <DEST> --verbosity debug

First time, will download signatures — takes a long time.

Will of course be prompted for passphrase for symmetric decryption of private key in order to decrypt archive.
