=====================
Lund University
=====================

Eduroam
===========

Having troubles setting up eduroam according to LU guidelines [#]_. Think it's a CA related problem, but difficult to diagnose.

Found configuration tool which seems to solve the problem however [#]_. Tested at ChemPhys and seems to work well.

.. [#] https://luservicedesk.service-now.com/kb_view.do?sysparm_article=KB0010412
.. [#] https://cat.eduroam.org/?idp=433


VPN
======

Access provided by fortis - horrible VPN through SSL approach. Cannot therefore use regular VPN client (e.g. openVPN), but instead must use theirs. The Fortis Linux binaries do no seem to work though.

Clever boy Rene however provides `working linux binaries in .deb packages <https://hadler.me/linux/forticlient-sslvpn-deb-packages/>`_. Buy that man a beer...

Server::

	https://connect.lu.se/sslvpn/portal.html:443

**Update (2017.03):** LDC changed FortiGate config meaning that home network can no longer be readched using above version of FortiClient. Must use ShrewSoft instead with custom config file [#]_

.. [#] http://www.chemphys.lu.se/internal
