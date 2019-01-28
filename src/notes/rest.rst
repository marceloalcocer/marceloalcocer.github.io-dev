=====
ReST 
=====

Strikethrough
===============

No native strikethrough in ReST. Implant ourselves with a custom role and CSS [#]_:

Define in the ReST document::
	
	.. role:: strike
	   :class: strike
	
Use in the ReST document::

	:strike:`struck!`

In CSS::

	.strike{
		text-decoration: line-through
	}

.. [#] http://stackoverflow.com/questions/6518788/rest-strikethrough
