======
GPG
======

Public key cryptography
=========================

Asymmetric encryption using a public/private key pair; public shared and used to encrypt data, private kept secret and used to decrypt. Keys are just fixed length sequence of binary digits (e.g. 768, 1024, 2048 bits).

As private key is only thing needed to decrypt, GPG protects it with passphrase (symmetric encryption) [#]_. *This is the only real protection you have if someone else gets hold of you private key!*

Generate key pair with ``gpg --gen-key``. Associate user ID with each key to identify it as belonging to someone. User ID is composed of real name, comment and e-mail address [#]_.

GPG stores keys in keyrings; one for private and one for public keys. Individual keys are identified by their hex hashes or owners.  Can list keys in keyring with ``gpg --list-keys``.  Can show (i.e. decrypt) specific key using ``gpg --output <DEST> --export <KEY>``. This results in raw binary output, which can be difficult to visualise. Can instead ask GPG to output ASCII encoded key with ``--armor`` option.

Signing
===========

Whilst typically use PKC to allow Bob to encrypt data which can only be decrypted by Alice, key pair can also be used signing data as verification of its origin. For example, Alice can used her private key to sign a document, whilst Bob can check the document's signature using Alice's public key.



.. [#] https://www.gnupg.org/gph/en/manual.html#AEN513
.. [#] https://www.gnupg.org/gph/en/manual.html#AEN26
