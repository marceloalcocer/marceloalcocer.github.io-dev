LaTeX
#########

LaTex word count
=================

From DVI render [#]_::

	dvips -o - <DVI_FILE> | ps2ascii | wc -w

.. [#] https://www.maths.ox.ac.uk/members/it/faqs/latex/word-count


LaTex package management on Ubuntu
====================================

Different latex distributions handle LaTex packages differently. The texlive distribution has a package manager (``tlmgr``) to keep packages up to date with those hosted on CTAN. 

Unfortunately, Ubuntu repackages many Tex packages into it's own ``.deb`` packages so as to offer easy installation. As ``apt`` now handles latex packages, ``tlmgr`` is disabled to avoid any conflicts. As such, can not install/update individual packages from CTAN using ``tlmgr``. Instead, should find the containing Ubuntu package and install it using ``apt``. All well and good, but often contain tons of other unwanted Latex packages.

Another solution would be to install texlive manually (i.e. not via ``apt``) so that ``apt`` is unaware of it. This thien separates the two managers allowing ``tlmgr`` to be used exclusively for packages [#]_.

Finally, could also try installing individual latex packages directly from CTAN, but not 100% sure how to do this...

.. [#] http://tex.stackexchange.com/questions/28528/best-way-to-install-packages-for-texlive-in-ubuntu
