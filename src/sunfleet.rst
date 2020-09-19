Sunfleet pro-rata rental
#########################

`Sunfleet <https://www.sunfleet.com>`_ allows cars to be used on pro-rata (i.e. per hour, per km) and flat-rate (i.e. 24 hours, weekend) schemes.

If rental is only done on a pro-rata scheme and always renting the same class of car, the total monthly expenditure, :math:`C`, is given by,

.. math::

	C = C^{pro-rata}_{plan,car}(t,x) + C^{plan}_{plan}
	
where `t` is the total rental duration (over 1 month), `x` the total distance travelled (over 1 month) and `plan` and `car` index the membership plan and rented car class respectively [#]_.

For any given car class, the plan yielding the minimum monthly expenditure therefore depends on the total rental duration and distance, and is found by minimising over the `plan` dimension.

Selected minimisations were performed using a simple Python `Sunfleet membership plan class <https://github.com/marceloalcocer/sunfleet>`_, and are presented below to aid membership plan selection. In each case, the filled contours represent the minimum monthly expenditure at that point in the parameter space, whilst the solid contours denote the corresponding plan. e.g. The minimum monthly cost for renting a `liten` car during the day for 20 hours covering 100 km is ~ 1200 SEK, and is obtained by being on the `small` membership plan. Lines showing selected speed limits on Swedish roads are also shown to highlight regions of the parameter space which may be are accessible only illegally…

.. raw:: html

	<link rel="stylesheet" href="sunfleet/sunfleet.css">
	<form id="controls">
		<fieldset>
			<legend>Car</legend>
			<select id="car">
				<option value="liten" selected>Liten</option>
				<option value="mellan" >Mellan</option>
				<option value="stor" >Stor</option>
				<option value="premium" >Premium</option>
				<option value="transport_liten" >Transport (liten)</option>
				<option value="transport_mellan" >Transport (mellan)</option>
				<option value="transport_stor" >Transport (stor)</option>
			</select>
		</fieldset>
	</form>
	<img id="graph" src="sunfleet/img/liten.png">
	<script src="sunfleet/sunfleet.js"></script>


.. [#] https://www.sunfleet.com/priser/

