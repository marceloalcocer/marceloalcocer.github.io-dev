ImageMagik Thumbnailing
==============================

Create thumbnail by central cropping [#]_::

	convert -define jpeg:size=200x200 <INPUT> -thumbnail 100x100^ -gravity center -extent 100x100  <OUTPUT>

.. [#] http://www.imagemagick.org/Usage/thumbnails/#height

