=========
Graphing
=========

HTML graphing libraries
===========================

D3
----

Renders data (i.e. arrays of numbers) using W3 DOM standards (SVG, CSS, HTML). Pure JS.

mpld3
------

Backend for MPL. Converts MPL objects into numerical arrays which can then be rendered using D3.

As uses D3, outputs in SVG rather than interactive HTML5 canvas (c.f. Bokeh below). Uses plugins (JS + python) to provide interactivity however (zooming, panning, labels, etc.). Builtin plugins should be sufficient for basic data exploration.

Not designed for large datasets, so can be slow with many points.

Uses MPL plotting commands.

Bokeh
-------

Python library for plotting to HTML canvas — native HTML interactivity and dynamic-ness [#]_ .

Specifically designed for rendering large datasets (downsampling, etc.)

Will support MPL eventually [#]_, but has its own plotting commands too:

	How does Bokeh compare to mpld3?
	
	For a lightweight, python-only library that exposes most of matplotlib to the browser, mpld3 could be a good choice. Bokeh also intends to fully support the MPL interface (and hence Seaborn, pandas, and ggplot.py), however the main goal of Bokeh is to provide approachable capability for novel interactive visualizations in the browser. If you would like to have the benefits of HTML canvas rendering, dynamic downsampling, abstract rendering, server plot hosting, and the possibility of interacting from languages besides python, please consider Bokeh for your project.

	--- http://bokehplots.com/pages/faqs.html


.. [#] http://www.w3schools.com/html/html5_canvas.asp
.. [#] http://bokeh.pydata.org/en/latest/docs/user_guide/compat.html#matplotlib-seaborn-ggplot-and-pandas
