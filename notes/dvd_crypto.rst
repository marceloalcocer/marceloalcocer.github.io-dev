Encrypted DVD Playback
======================

Full details: https://help.ubuntu.com/community/RestrictedFormats/PlayingDVDs

Install CSS cracking
--------------------

Protected DVDs must have protection cracked to allow open-source playback. This is provided by css part of libdvdread. Cannot be bundled for copyright reasons though - must download using script provided::

	sudo /usr/share/doc/libdvdread4/install-css.sh


Set DVD region
----------------

VLC ignores DVD drive region when playing. For CSS though, DVD drive region must be set to something. Set using regionset tool (Europe: 2).


Clear CSS crack cache
---------------------

Every time CSS cracking occurs, resulting keys are cached in ~/.dvdcss. May not be totally transferable though from one protected DVD to another. This causes jerky playback. Clear cache to force libdvdread4 to crack again.

