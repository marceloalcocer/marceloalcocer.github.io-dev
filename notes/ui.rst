===============
User Interface
===============

Adding Apps to Unity Dash
==========================

Add application desktop file to ``~/.local/share/applications/<app>.desktop`` [#]_

.. [#] http://askubuntu.com/questions/67753/how-do-i-add-an-application-to-the-dash

Remove Desktop from Unity Switcher
====================================

Install ``unity-tweak-tool``. Deselect from there.

Gnome Critical Power Action
============================

Default is to use time remaining for action rather than percentage. If time estimating wrong, action may be skipped. Can change all settings using gsettings [#]_::
	
	gsettings get org.gnome.settings-daemon.plugins.power

.. [#] http://askubuntu.com/questions/167062/netbook-performs-hard-shutdown-without-warning-on-low-battery-power


Power Off Menu
================

::

	gnome-session-quit --power-off

