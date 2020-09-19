=====================
Desktop environment
=====================

GNOME keyring
===============

Gnome provides password storage service — Gnome Keyring — to desktop applications so as to reduce number of times you have to type passwords into prompt (e.g. GPG password prompt when using GPG agent) [#]_. If ``save password`` checked during password prompt, password is encrypted with current Linux user logon password, and stored locally.

Chrome delegates password management and storage to local service. On Gnome desktop, this is Gnome Keyring service.

Interface to Gnome Keyring is provided by Seahorse app.

.. [#] https://superuser.com/questions/969484/what-is-gnome-keyring-seahorse-and-why-its-storing-my-passwords-in-plaintext

GNOME switch workspaces on all monitors
==========================================

[#]_::

    $ gsettings set org.gnome.mutter workspaces-only-on-primary false

.. [#] https://askubuntu.com/a/1076343/326761

Week numbers in GNOME calendar
================================

[#]_::

    $ gsettings set org.gnome.desktop.calendar show-weekdate true

.. [#] https://askubuntu.com/a/962200/326761


GNOME right-click window resize
=================================

[#]_::

    $ gsettings set org.gnome.desktop.wm.preferences resize-with-right-button true

.. [#] https://unix.stackexchange.com/a/37545/336183

GNOME Alt-Tab only on current workspace
========================================

[#]_::

    $ gsettings set org.gnome.shell.app-switcher current-workspace-only true

.. [#] gsettings set org.gnome.shell.app-switcher current-workspace-only true

Chromium command line flags
============================

Inpsecting chromium launcher script, see that it sources user RC file::

    $ cat $(which chromium-browser)
    #!/bin/bash

    # Chromium launcher

    …

    test -f ~/.chromium-browser.init && . ~/.chromium-browser.init↲

    …

It also reads envronment variable ``CHROMIUM_USER_FLAGS`` to set CLI flags::

    …

    # Prefer user defined CHROMIUM_USER_FLAGS (fron env) over system↲
    # default CHROMIUM_FLAGS (from /etc/$APPNAME/default)↲
    if test -n "$CHROMIUM_USER_FLAGS"; then↲
    »   echo "WARNING: \$CHROMIUM_USER_FLAGS is deprecated. Instead, update CHROMIUM_FLAGS in ~/.chromium-browser.init or place configura    tion for all sers in /etc/$APPNAME/customizations/ ."↲
    »   echo "WARNING: Ignoring system flags because \$CHROMIUM_USER_FLAGS is set."↲
    »   echo "CHROMIUM_FLAGS=${CHROMIUM_FLAGS}"↲
    »   echo "CHROMIUM_USER_FLAGS=${CHROMIUM_USER_FLAGS}"↲
    »   CHROMIUM_FLAGS=${CHROMIUM_USER_FLAGS}↲

    …

As such, can use RC file to specify CLI flags for chromium [#]_, e.g.::

    $ echo "CHROMIUM_USER_FLAGS="--enable-features=OverlayScrollbar"

This can be useful for enabling experimental flags which have been hidden in ``chrome://flags`` [#]_

.. [#] https://askubuntu.com/a/832595/326761
.. [#] https://www.reddit.com/r/chrome/comments/dsss44/bring_back_overlay_scrollbars_on_chromeflags/


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


Cron vs. GNOME startup
=======================

Use ``crontab`` for managing periodic jobs to run whenever system is running (even non-graphical session).

Use GNOME startup to run something when a user logs in to gnome (i.e. graphical session only). This simply places a ``.desktop`` file in ``~/,config/autostart`` [#]_

.. [#] http://stackoverflow.com/questions/8247706/start-script-when-gnome-starts-up

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

