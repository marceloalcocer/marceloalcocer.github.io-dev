SSH Key Encryption
====================

SSH uses MD5 and AES for key encryption/decryption — not very safe nowadays. Can upgrade to more recent algorithm for better protection (PKCS#8) with no compatibility issue [#]_.

Did so.

.. [#] https://martin.kleppmann.com/2013/05/24/improving-security-of-ssh-private-keys.html

