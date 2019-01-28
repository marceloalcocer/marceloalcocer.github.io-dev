=====================
Lund University
=====================

Eduroam
===========

Having troubles setting up eduroam according to LU guidelines [#]_. Think it's a CA related problem, but difficult to diagnose.

Found configuration tool which seems to solve the problem however [#]_. Tested at ChemPhys and seems to work well.

.. [#] https://luservicedesk.service-now.com/kb_view.do?sysparm_article=KB0010412
.. [#] https://cat.eduroam.org/?idp=433

SMTP Server
===============

Trying to use LU SMTP server to send outgoing ChemPhys mail rather than GMail SMTP servers. Marco got it working from Thunderbird using the following:

:Server: smtp.lu.se
:Port: 25
:Username: <email>@chemphys.lu.se
:Password: <password>
:Encryption: STARTTLS

Reading up a little:

Transport Layer Security (TLS)
	Successor to SSL (although still known as SSL). Provides secure layer for communication. Typically goes through port 587 for STMP. Uses fully encrypted port right from the beginning — no data sent to/from port in plain text

Opportunistic TLS (STARTTLS)
	Protocol to which provides a means of upgrading an unencrypted connection to an encrypted one. Allows communications to be initiated in plain text before upgrading to encrypted. AKA STARTTLS from command used to initialise upgrade. More commonly used nowadays as saves on dedicated ports. Initial part of communications in plain text, all encrypted after STARTTLS command.

Simple Mail Transfer Protocol (SMTP) [#]_
	Outgoing mail protocol. SMTP client wanting to send e-mail contacts its SMTP server, which contacts recipients STMP server to deliver the email. The email is then fetched from the recipients STMP server by the recipient's client via IMAP. SMTP servers usually require authentication (e.g. TLS) to avoid spammers from abusing them

So need gmail client to use ``smtp.lu.se`` rather than ``smtp.gmail.com`` to send outgoing mail. It provides options for both TLS and SSL authentication, on all three usual ports [#]_. None seem to work with LU SMTP server however.

Interestingly, trying to send mail manually via ``telnet`` with no authentication seems to be no problem::

	
	malcocer@malcocer-S551LN:~$ telnet smtp.lu.se 25
		Trying 130.235.52.18...
		Connected to mail.lu.se.
		Escape character is '^]'.
		220 mail.lu.se Microsoft ESMTP MAIL Service ready at Fri, 21 Oct 2016 17:21:17 +0200
		>> HELO marcelo.alcocer
		250 mail.lu.se Hello [130.235.28.41]
		>> MAIL FROM:<foo@bar.com>                       
		250 2.1.0 Sender OK
		>> RCPT TO:<marcelo.j.p.alcocer@gmail.com>
		250 2.1.5 Recipient OK
		>>DATA
		354 Start mail input; end with <CRLF>.<CRLF>
		>> From: "Foobar" <foo@bar.com>
		>> To: "Marcelo Alcocer" <marcelo.j.p.alcocer@gmail.com>
		>> Date: Fri, 21 October 2016 17:19:00 -0200
		>> Subject: Test
		>>
		>> Hi. this mail was sent from telnet from some random dude.
		>>
		>>.
		250 2.6.0 <7c3912d5-5036-4372-8b07-958498de668b@wedge011.net.lu.se> [InternalId=3959959848588, Hostname=wedge011.net.lu.se] 1224 bytes in 39.864, 0,030 KB/sec Queued mail for delivery
		>> QUIT
		221 2.0.0 Service closing transmission channel
		Connection closed by foreign host.

Does this mean that the LU SMTP server requires no authentication?! Would be very strange... [#]_

Perhaps only when within LU network? Indeed, does not work from outside LU::

	malcocer@malcocer-S551LN:~$ telnet smtp.lu.se 25
		Trying 130.235.52.18...
		Connected to mail.lu.se.
		Escape character is '^]'.
		220 wedge012.net.lu.se Microsoft ESMTP MAIL Service ready at Fri, 21 Oct 2016 21:18:21 +0200
		>> HELO marcelo.alcocer
		250 wedge012.net.lu.se Hello [46.59.111.153]
		>> MAIL FROM:<foo@bar.com>
		250 2.1.0 Sender OK
		>> RCPT TO:<marcelo.j.p.alcocer@gmail.com>
		550 5.7.54 SMTP; Unable to relay recipient in non-accepted domain

So can we authenticate using STARTTLS? Cannot really do communication via ``telnet`` as will eventually encrypt. Better to use ``openssl`` [#]_ [#]_.

Server does indeed support STARTTLS::

	malcocer@malcocer-S551LN:~$ telnet smtp.lu.se 25
		Trying 130.235.52.18...
		Connected to mail.lu.se.
		Escape character is '^]'.
		220 wedge012.net.lu.se Microsoft ESMTP MAIL Service ready at Fri, 21 Oct 2016 21:18:21 +0200
		>> EHLO marcelo.alcocer
		250-wedge010.net.lu.se Hello [46.59.111.153]
		250-SIZE 37748736
		250-PIPELINING
		250-DSN
		250-ENHANCEDSTATUSCODES
		250-STARTTLS
		250-X-ANONYMOUSTLS
		250-X-EXPS NTLM
		250-8BITMIME
		250-BINARYMIME
		250-CHUNKING
		250-XEXCH50
		250 XSHADOW

But no plaintext AUTH::

	malcocer@malcocer-S551LN:~$ openssl s_client -debug -starttls smtp -crlf -connect smtp.lu.se:25

		<...key exchange...>

		250 XSHADOW
		>> ehlo marcelo.alcocer
		250-wedge010.net.lu.se Hello [46.59.111.153]
		250-SIZE 37748736
		250-PIPELINING
		250-DSN
		250-ENHANCEDSTATUSCODES
		250-X-EXPS NTLM
		250-8BITMIME
		250-BINARYMIME
		250-CHUNKING
		250-XEXCH50
		250 XSHADOW

Implies connection is not secure? Or that plain text authentication is simply not supported?

No luck with STARTTLS on ports 465 or 587 (SSL ports) — connection refused. Is it expecting full TLS rather than STARTTLS?

Indeed, reading a bit further, looks like SMTP server only allows location based authentication:

	SMTP Server (Outgoing)	mail.lu.se (port 25 , no user name,outside the Lund University you will need to use SMTP of your ISP)

	--- `LDC <http://itsupport.nateko.lu.se/online-help/e-mail/>`_

Balls. Really?! Then Marco should not be able to send e-mails from Rostock...

Perhaps try LUCAT ID or mail.lu.se?

.. [#] https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol
.. [#] https://support.google.com/mail/answer/1074635?hl=en-GB
.. [#] https://productforums.google.com/forum/#!topic/gmail/rhEAg6hk6Lw
.. [#] http://stackoverflow.com/questions/27030605/smtp-starttls-certificate-negotitiation-via-telnet
.. [#] https://qmail.jms1.net/test-auth.shtml


VPN
======

Access provided by fortis - horrible VPN through SSL approach. Cannot therefore use regular VPN client (e.g. openVPN), but instead must use theirs. The Fortis Linux binaries do no seem to work though.

Clever boy Rene however provides `working linux binaries in .deb packages <https://hadler.me/linux/forticlient-sslvpn-deb-packages/>`_. Buy that man a beer...

Server::

	https://connect.lu.se/sslvpn/portal.html:443

**Update (2017.03):** LDC changed FortiGate config meaning that home network can no longer be readched using above version of FortiClient. Must use ShrewSoft instead with custom config file [#]_

.. [#] http://www.chemphys.lu.se/internal
