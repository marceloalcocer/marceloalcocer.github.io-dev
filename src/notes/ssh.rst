SSH 
=====

Public key location
--------------------

For SSH with PKC authentication, public keys should be located in ``~/.ssh`` user directory of SSH host (server) [#]_.

.. [#] https://www.linode.com/docs/security/authentication/use-public-key-authentication-with-ssh/

Multiple keys
--------------

Multiple SSH key-pairs are simply differntiated by filename, i.e.::

	>>> ls ~/.ssh
	id_<ID1>
	id_<ID1>.pub
	id_<ID2>
	id_<ID2>.pub

As such, adding new keys is just a matter of generating a new keypair with a unique filename [#]_.

First, remove all key-pairs registered with SSH agent::

	>>> ssh-add -D

Then rename original key-pair (if required)::

	>>> cd ~/.ssh
	>>> mv id_rsa id_<ID1>
	>>> mv id_rsa.pub id_<ID1>.pub

Create new key-pair::

	>>> ssh-keygen -b 4096		# 4096 bit RSA key

specifying a unique filename when prompted.

New key-pairs should automatically be registered with SSH agent.


.. [#] https://unix.stackexchange.com/questions/58969/how-to-list-keys-added-to-ssh-agent-with-ssh-add/58977


Key Encryption
---------------

SSH uses MD5 and AES for key encryption/decryption — not very safe nowadays. Can upgrade to more recent algorithm for better protection (PKCS#8) with no compatibility issue [#]_.

Did so.

.. [#] https://martin.kleppmann.com/2013/05/24/improving-security-of-ssh-private-keys.html

