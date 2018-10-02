=====================
Desktop environment
=====================

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

