Cron vs. Gnome startup
=======================

Use ``crontab`` for managing periodic jobs to run whenever system is running (even non-graphical session).

Use Gnome startup to run something when a user logs in to gnome (i.e. graphical session only). This simply places a ``.desktop`` file in ``~/,config/autostart`` [#]_

.. [#] http://stackoverflow.com/questions/8247706/start-script-when-gnome-starts-up

