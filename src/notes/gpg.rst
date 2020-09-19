=============
Cryptography
=============

GPG agent
============

Daemon automatically started by GPG to handle (amongst other things) private key decryption [#]_. Enables passphrases to be cached, allowing password-free access to private key for limited time.

On Gnome desktop, uses ``pinentry`` program for interactive password entry. As such, Gnome keyring service also available to user.

.. [#] https://www.gnupg.org/faq/whats-new-in-2.1.html#autostart


Public key cryptography
=========================

Asymmetric encryption using a public/private key pair (fixed length sequence of binary digits). Provides advantage over symmetric schemes as do not have to find secure channel over which to distribute shared secret.

For encryption, public key is shared and used by anyone to encrypt data. This can only be feasibly decrypted using private key which is kept secret.

.. figure:: https://upload.wikimedia.org/wikipedia/commons/f/f9/Public_key_encryption.svg

	Encryption with PKC [#]_

Can also use key pair in reverse for signing as verification of origin. In this case, encrypt known data using private key. This can be decrypted by anyone using the corresponding public key, but serves to show that it has originated from private key holder.

.. figure:: https://upload.wikimedia.org/wikipedia/commons/a/a7/Private_key_signing.png

	Signing with PKC [#]_

This clearly shows how there is nothing really to distinguish a 'public' key from a 'private' key — they are simply a complementary pair of keys which are distributed differently. This of course makes perfect sense when thinking about it mathematically — each key is just a number!

In summary, the private key of a pair in PKC allows one to,

	1. Decrypt a message only intended for the recipient, which may be encrypted by anyone having the public key (asymmetric encrypted transport).
	2. Encrypt a message which may be decrypted by anyone [with the public key], but which can only be encrypted by one person (signature).

	--- RSA, Wikipedia [#]_ 

PKC schemes exist which provide encryption, signing, or both.

.. [#] https://commons.wikimedia.org/wiki/File:Public_key_encryption.svg
.. [#] https://commons.wikimedia.org/wiki/File:Private_key_signing.png
.. [#] https://en.wikipedia.org/wiki/RSA_(cryptosystem)#Signing_messages

Diffie-Hellman key exchange
----------------------------

Whilst not directly designed as a PKC scheme, PKC can be understood from the concepts formalised in DH key exchange — protocol for obtaining common secret between parties across public channel [#]_. This is a requirement e.g. for communicating the secret for symmetric encryption.

Basic concept can be described by color mixing analogy:

.. figure:: https://upload.wikimedia.org/wikipedia/commons/4/46/Diffie-Hellman_Key_Exchange.svg

	DH KE color mixing analogy [#]_

DH KE relies on a one-way trapdoor function (mixing of colors). The exact nature of this function defines a specific implementation of DH KE, (e.g. multiplicative group of modulo integers [#]_, elliptic curves [#]_, etc.). Most (all?) implementation rely on hardness of discrete logarithm problem [#]_.

Whilst not directly designed as a PKC scheme, DH protocol can also be used as a form of PKC. It lacks the capability to authenticate(sign) however, and thus is seldom used as such. Instead, schemes designed explicitly from PKC are far more commonly used, e.g. RSA_.

.. [#] https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange
.. [#] https://commons.wikimedia.org/wiki/File:Diffie-Hellman_Key_Exchange.svg
.. [#] https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange#Cryptographic_explanation
.. [#] https://en.wikipedia.org/wiki/Elliptic-curve_Diffie%E2%80%93Hellman
.. [#] https://en.wikipedia.org/wiki/Discrete_logarithm

Example implementation — Multiplicative group of modulo integers
.....................................................................

Given agreed and public prime and generator, :math:`p` and :math:`g` respectively, and individual secrets :math:`a` and :math:`b` (:math:`p, g, a, b \in \mathfrak{Z}`), Alice and Bob can compute and send values :math:`A` and :math:`B` over public channel,

.. math::

	A = g^a mod p \\
	B = g^b mod p

then, using the property,

.. math::

	(g^x mod z)^y mod z = (g^y mod z)^x mod z

can each compute shared secret, :math:`S`,

.. math::

	S = A^b mod p = =  B^a mod p = g^{ab} mod p

Application of DH as PKC scheme can be seen by considering :math:`A` as Alice's public key. Bob sends the desired message encrypted using the shared secret, :math:`S`, along with :math:`B`. As with key exchange, now only Alice can compute the secret, :math:`S` from :math:`B`, and thus decrypt the message.


Digital Signature Algorithm (DSA)
----------------------------------

As described above, main issue with using DH as PKC scheme is lack of authentication — public key could easily be hijacked and replaced by spoof key. 

DSA was developed as a signing only protocol to enable authentication. It also relies on the discrete logarithm problem.

ElGamal
---------

ElGamal is essentially an improved version of DH designed more specifically for PKC. It also relies on discrete logarithm problem.

In its original form (ElGamal encryption), it only provides encryption and not authentication. It was subsequently extended however to provide signing functionality (ElGammal signature scheme). As such, it can be considered a full PKC scheme.


RSA
----

RSA is a full PKC protocol providing both encryption and authentication [#]_.  It relies on integer factorization problem [#]_.

.. [#] https://en.wikipedia.org/wiki/RSA_(cryptosystem)
.. [#] https://en.wikipedia.org/wiki/Integer_factorization




GPG
====

Open source cryptography suite. Provides following functionality:

* Asymmetric
* Symmetric
* Hashing
* Compression

GPG 1.x vs GPG 2.x
--------------------

Main differences between v1 and v2 of GPG was move from integrated to external cryptography library (``Libgcrypt``) [#]_ [#]_. Also added more modern encryption schemes (e.g. elliptic curve cryptography) [#]_


.. [#] https://en.wikipedia.org/wiki/GNU_Privacy_Guard#Overview
.. [#] https://en.wikipedia.org/wiki/Libgcrypt
.. [#] https://en.wikipedia.org/wiki/GNU_Privacy_Guard#Branches

Keys
-----

Generate key pair with ``gpg --gen-key``. Associate user ID with each key to identify it as belonging to someone. User ID is composed of real name, comment and e-mail address [#]_. Multiple user IDs can be added to a single key pair.

As private key will just be sitting on filesystem, GPG protects it with passphrase (symmetric encryption) [#]_. *This is the only real protection you have if someone else gets hold of private key!*

Want to avoid public key being tampered with before sharing it (MIM attack). Do this by signing public key (just like any other data) with private key. Public key itself can then be used to confirm its own origin. Such self-signed public keys are known as *certificates*. View self-signature (along with any other signatures) attached to a public key::

	$ gpg2 --list-sigs

Key is actually composed of three distinct parts:

1. Master signing key
2. User IDs associated with key
3. Subordinate keys (signing and/or encryption)

Dividing the key into master signing and subordinate keys is useful as allows encryption to be separated from signing and identity; Alice changing the encryption part of her public key doesn't present a security concern for Bob as it's her responsibility to ensure she has the corresponding private decryption key; Alice changing the signing part of her public key does present a security concern for Bob however as he has previously placed trust in Alice having the corresponding private key (see also importing keys in Keyrings_ section below). Separation therefore allows the encryption part of the key to be changed [#]_ as desired without having to re-place trust in owner. 

.. [#] https://www.gnupg.org/gph/en/manual.html#AEN26
.. [#] https://www.gnupg.org/gph/en/manual.html#AEN513
.. [#] This is good practice to mitigate against it having been broken at some point (like periodically changing a password)

Keyrings
---------

GPG stores keys in keyrings; one for private and one for public keys. Individual keys are identified by their hex hashes or user IDs.

List keys on keyring::

	$ gpg2 --list-public-keys		# Public keyring
	$ gpg2 --list-secret-keys		# Private keyring
	
Export keys::

	$ gpg2 --export <KEY> --output <DEST> 
	$ gpg2 --export-secret-keys <KEY> --output <DEST> 

This results in raw binary key value. Can instead ask GPG to output base64 encoded with ``--armor`` option.

Importing keys::

	$ gpg2 --import foo.gpg

N.b. once public key imported, need to ensure that we trust its origin, i.e. trust that the person holding the private key does indeed correspond to the associated user ID. To perform this validation manually, check key's fingerprint::

	$ gpg2 --edit-key <KEY>
	Command> fpr

and compare this fingerprint with the purported owner of the key over any channel (e.g. phone, email, etc.).

If all ok, can then sign the key to show we trust its origin::

	Command> sign

Can see newly added signature (along with all others on key)::

	Command> check

Signing public keys to show trust that they come from the specified user is useful as it helps subsequent users of the key evaluate their trust in it — a public key signing by a million people probably does come from the stated user. To share your newly added signature, must recirculate the newly signed key — most easily done by (re-)uploading to a keyserver (probably the one you got it from originally)

In fact, by inspecting the number of signatures and who they come from, GPG will often make an automatic decision as to the authenticity of the key's origin [#]_, thereby relaxing the requirement for every key to be manually checked.

.. [#] https://www.gnupg.org/gph/en/manual.html#AEN335


Encryption
-----------

Asymmetric encryption::

	$ gpg2 --output <FILE>.gpg --recipient <KEY>  --encrypt <FILE>

Asymmetric decryption::

	$ gpg2 --output <FILE> --decrypt <FILE>.gpg

Symmetric en/decryption::

	$ gpg2 --output <FILE>.gpg --symmetric <FILE>

Signing
--------

Sign file only, base64 output::

	$ gpg2 --clearsign <FILE>

Sign file only, separate signature file output::

	$ gpg2 --output <FILE>.sig --detach-sig <FILE>

Sign file, and encrypt it::

	$ gpg2 --output <FILE>.sig --sign <FILE>

Verify signature only::

	$ gpg2 --verify <FILE>.sig		# Integrated signature
	$ gpg2 --verify <FILE>.sig <FILE>	# Detached signature

Verify signature and decrypt::

	$ gpg2 --output <FILE> --decrypt <FILE>.sig

