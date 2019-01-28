=================
Signal processing
=================

Discrete convolution
=======================

Linear discrete convolution
-----------------------------

Definition of discrete (linear) convolution,

.. math::

	L_l = (M * N)_l = \sum_m M_m N_{l-m}

Assuming zero-padding, the indices for valid convolution are therefore,

.. math::
	:nowrap:

	\begin{gather*}

	l_{valid} = \text{min}(\| M \|, \| N \|) - 1, \dots, \text{max}(\| M \|, \| N \|) - 1 \\
	\| L_{valid} \| = \text{max}(\| M \|, \| N \|) - \text{min}(\| M \|, \| N \|) + 1 \\
	m_{valid} = \begin{Bmatrix}
	0, 1, \ldots, \text{min}(\| M \|, \| N \|) - 1 & , & l < \|N\| \\
	l - \text{min}(\| M \|, \| N \|) + 1, \ldots, l & , & l \geq \|N\|
	\end{Bmatrix}

	\end{gather*}

where we have defined the length operator, :math:`\|X\|`. Similarly, the indices for full convolution are therefore,

.. math::
	:nowrap:

	\begin{gather*}

	l_{full} = 0, 1, \dots, \| M \| + \| N \| - 2 \\
	\| L_{full} \| = \| M \| + \| N \| - 1 \\
	m_{full} = \begin{Bmatrix}
	0, 1, \ldots, l & , & l < \text{min}(\| M \|, \| N \|) \\
	m_{valid} & , & \text{min}(\| M \|, \| N \|) \leq l < \text{max}(\| M \|, \| N \|) \\
	l - \|N\| + 1, \ldots, \|M\| - 1 & , & l \geq \text{max}(\| M \|, \| N \|)
	\end{Bmatrix}

	\end{gather*}

Fitting
........

Fitting a discrete dataset, :math:`E`,

.. math::

	\Rightarrow \| L_{valid} \| = \| E \|

Assuming :math:`N` is zero at leading edge (e.g. exponential), for leading edge of :math:`L` to also be zero, require first :math:`\| M \|` points of :math:`N` to be zero,

.. math::
	:nowrap:

	\begin{gather*}

	\Rightarrow \| M \| < \| N \| \\
	\Rightarrow \| L_{valid} \| =  \| N \| - \| M \| + 1 = \| E \| \\
	\Rightarrow \| N \| = \| E \| + \| M \| - 1 \\
	N_n = 0 \quad \text{for} \quad n \leq \| M \|

	\end{gather*}

It can be seen therefore that :math:`\| M \|` is arbitrary, but determines :math:`\| N \|`. Thus, :math:`N` must be analytical whilst :math:`M, E` may be numerical.

Circular discrete convolution
------------------------------

Making one input a discrete periodic summation turns the convolution into a circular convolution. A discrete period summation with period :math:`P` is defined as:

.. math::

	N_P = \sum_p N_{n-pP}

The resulting convolution is clearly also periodic with a period :math:`P`, and is given by


.. math::

	L_{P,l} = (M * N_P)_l &= \sum_m M_m N_{P,l-m}\\
	&= \sum_m M_m \sum_p N_{l-m-pP}

If the inputs are zero-padded such that the length of the period is longer than the non-padded full convolution output length,

.. math::

	\| P \| \geq \| M \| + \| N \| -1

then the full linear convolution will be contained within one period of the circular convolution and will thus exhibit no evidence of circularity [#]_.

.. [#] https://dsp-nbsphinx.readthedocs.io/en/nbsphinx-experiment/nonrecursive_filters/fast_convolution.html

Fast discrete convolution
--------------------------

The circular discrete convolution theorem states that the inverse DFT of a frequency domain multiplication is equivalent to the circular discrete convolution in the time domain [#]_,

.. math::

	\mathfrak{F}^{-1} \left[ \tilde{M} \cdot \tilde{N} \right]_l &= L_{P,l} \\
	&= \sum_m M_m \sum_p N_{l-m-pP}

As such, the linear discrete convolution can be efficiently computed in the following manner,

#. Zero-pad both inputs to lengths :math:`\geq \|M\| + \|N\| -1`
#. DFT
#. Multiply
#. Inverse DFT

Notes:

#. If both signals are padded at higher indices (right), the resulting convolution will have the same indices for region selection as detailed above. This can be used to select a valid region, e.g. full, valid, etc.
#. Depending on the DFT algorithm, it may be more efficient to pad inputs beyond minimum length (e.g. power of 2 for FFT)
#. Whilst in linear convolution, selection of the valid region only can be done with reduced computation, the same is not true for fast convolutions — reducing the input lengths results in circularity, so the full, padded convolution must be computed.
#. On the other hand, exploitation of single-sided (e.g. real) FFT algorithms can significantly speed computation.

.. [#] https://en.wikipedia.org/wiki/Discrete_Fourier_transform#Circular_convolution_theorem_and_cross-correlation_theorem

Discrete Fourier Transforms
============================

Going from continuous definition of FT to discrete FT (DFT) can most easily be understood in the following steps,

.. figure:: https://upload.wikimedia.org/wikipedia/commons/e/ea/From_Continuous_To_Discrete_Fourier_Transform.gif

	Discretization of the Fourier transform. **Left:** Continuous function (top) and its FT (bottom). **Centre-left:** Continuous periodic summation (i.e. convolution with Dirac comb), and its FT (i.e. Fourier series). **Centre-right:** Discretized function (i.e. Multiplication by Dirac comb) and its FT. **Right:** Discretized period summation, and its FT [#]_.

The final step is the DFT, whilst the penultimate is often termed the discrete-time FT (DTFT). Note also the reciprocity between the middle two steps.

.. [#] https://upload.wikimedia.org/wikipedia/commons/e/ea/From_Continuous_To_Discrete_Fourier_Transform.gif


Window Functions
==================

Recall that multiplying by window in time domain is convolution by FT of window in frequency domain. As such, most windows will smear frequencies out in FT spectrum, and so very similar frequency components may not be resolvable. Equally, the convolution will also result in the noise floor of the spectrum being increased as signal amplitude from sharp peaks is spread out over a wide range of frequencies. As such, different windows have different sensitivities to low amplitude frequency components (low dynamic range).

The resolution of a window can be seen by the width of its main lobe in its FT spectrum.

The dynamic range of a window can be seen by the relative amplitudes of its side lobes in its FT spectrum.

.. figure:: https://upload.wikimedia.org/wikipedia/commons/f/f2/Window_functions_in_the_frequency_domain.png

	Window functions in the frequency domain [#]_

.. [#] https://upload.wikimedia.org/wikipedia/commons/f/f2/Window_functions_in_the_frequency_domain.png

