Window Functions
==================

Recall that multiplying by window in time domain is convolution by FT of window in frequency domain. As such, most windows will smear frequencies out in FT spectrum, and so very similar frequency components may not be resolvable. Equally, the convolution will also result in the noise floor of the spectrum being increased as signal amplitude from sharp peaks is spread out over a wide range of frequencies. As such, different windows have different sensitivities to low amplitude frequency components (low dynamic range).

The resolution of a window can be seen by the width of its main lobe in its FT spectrum.

The dynamic range of a window can be seen by the relative amplitudes of its side lobes in its FT spectrum.

.. figure:: https://upload.wikimedia.org/wikipedia/commons/f/f2/Window_functions_in_the_frequency_domain.png

	Window functions in the frequency domain [#]_

.. [#] https://upload.wikimedia.org/wikipedia/commons/f/f2/Window_functions_in_the_frequency_domain.png

