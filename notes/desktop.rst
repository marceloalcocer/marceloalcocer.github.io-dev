=====================
Desktop environment
=====================

Unity SSH agent
================

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

In the end, looks like it's a problem with Unity's SSH agent (``gnome-keyring``). Disabling it on startup seems to solve the problem as OpenSSH agent is then used instead [#]_ [#]_.

Only issue now is that OpenSSH agent requests SSH password each time — not maintained for the session.

.. [#] https://help.github.com/articles/testing-your-ssh-connection/
.. [#] https://chrisjean.com/ubuntu-ssh-fix-for-agent-admitted-failure-to-sign-using-the-key/
.. [#] http://stackoverflow.com/questions/25464930/how-to-remove-a-ssh-key


Adding apps to unity dash
==========================

Add application desktop file to ``~/.local/share/applications/<app>.desktop`` [#]_

.. [#] http://askubuntu.com/questions/67753/how-do-i-add-an-application-to-the-dash

Remove desktop from unity switcher
====================================

Install ``unity-tweak-tool``. Deselect from there.

GNOME critical power action
============================

Default is to use time remaining for action rather than percentage. If time estimating wrong, action may be skipped. Can change all settings using gsettings [#]_::
	
	gsettings get org.gnome.settings-daemon.plugins.power

.. [#] http://askubuntu.com/questions/167062/netbook-performs-hard-shutdown-without-warning-on-low-battery-power


GNOME power off menu
=======================

::

	gnome-session-quit --power-off

evince copy picture
====================

::

	<C-S-PrintScreen>

