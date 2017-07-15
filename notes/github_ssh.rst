GitHub SSH
=============

After upgrading to Xenial, having problems authenticating with GitHub via SSH [#]_::

	>> ssh -vT git@github.com
	...
	debug1: identity file /home/malcocer/.ssh/id_rsa type 1
	...
	debug1: Offering RSA public key: /home/malcocer/.ssh/id_rsa
	...
	sign_and_send_pubkey: signing failed: agent refused operation
	...

See from output that have correct keys locally and they are found by SSH agent. Also, checked that key fingerprint matches that uploaded to GitHub.

In the end, looks like it's a problem with Unity's SSH agent (gnome-keyring). Disabling it on startup seems to solve the problem as OpenSSH agent is then used instead [#]_ [#]_.

Only issue now is that OpenSSH agent requests SSH password each time — not maintained for the session.

.. [#] https://help.github.com/articles/testing-your-ssh-connection/
.. [#] https://chrisjean.com/ubuntu-ssh-fix-for-agent-admitted-failure-to-sign-using-the-key/
.. [#] http://stackoverflow.com/questions/25464930/how-to-remove-a-ssh-key

