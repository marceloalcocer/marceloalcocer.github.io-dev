SSH 
=====

Port forwarding
----------------

Can tunnel arbitrary traffic through SSH by client-side port forwarding; local TCP socket opened (alongside usual SSH connection), and any connections made to it are forwarded over SSH to the client, e.g.::

    $ ssh -L 8080:remote-host-1:8888 remote-host-0

forwards all TCP connections to ``8080`` on the SSH client to ``remote-host-1:8888`` via SSH connection to ``remote-host-0``. As such, ``remote-host-1`` must be reachable from ``remote-host-0``.

N.b. you probably also want ``-T`` flag to disable TTY allocation so as to avoid a prompt.

This will work for basic protocols (e.g. text based protocols on the transport layer), but will likely become brittle for more complex higher level protocols. For these it's probably best to use dynamic port forwarding on the application layer; a local SOCKS [#]_ (application layer protocol) server will be run (using a local TCP socket), and connections to the local server will then be tunnelled through SSH to the remote server, e.g.::

    $ ssh -D 8080 remote-host-0

forwards all connections to ``8080`` on the SSH client to ``remote-host-0`` for further handling. Configuring a local browser to use ``localhost:8080`` as a SOCKS proxy would therefore result in all HTTP traffic being routed through ``remote-host-0`` via SSH, essentially conscripting ``remote-host-0`` to act as an HTTP proxy.

.. [#] https://en.wikipedia.org/wiki/SOCKS

Keep process alive
---------------------

Can keep process alive after closing SSH session by using nohup [#]_, e.g.::

    $ nohup python3 -m http.server 8000 &

.. [#] https://askubuntu.com/questions/8653/how-to-keep-processes-running-after-ending-ssh-session/222855#222855

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

