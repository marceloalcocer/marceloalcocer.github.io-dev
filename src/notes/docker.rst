#######
Docker
#######

docker swarm vs. docker-compose
################################

``docker swarm``
	Part of main docker engine (implemented in Go). Used to deploy container stack (defined in ``Compose`` file format) over many nodes.

``docker-compose``
	Separate program (not part of docker engine, implemented in python). Used for deploying stack (defined in ``Compose`` file format) to single machine [#]_.

.. [#] https://forums.docker.com/t/when-to-use-docker-compose-and-when-to-use-docker-swarm/29107/2

Docker-compose installation
###############################

Follow excellent installation instructions [#]_

.. [#] https://docs.docker.com/compose/install/
