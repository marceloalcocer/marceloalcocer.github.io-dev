Network
=========

Switches vs Routers
---------------------

Switch
	Connects nodes within a network (i.e. creates a LAN)

Router
	Allows communication between two networks


Switch
.......

Think about UDyni switch which simply connected all computers within lab to each other and forwarded packets from one to the other. It did not in any way assign IP addresses or allow communication with the wider fisica network. Switches simply take incoming packet, checks MAC address again LUT, and forwards packet to correct interface (switch port).

In the case of UDyni network, udyni-vmi ran DHCP server which assined IP addresses to be used within the lab network. udyni-vmi also ran bridge which allowed communication between lab and fisi networks


Router
.......

Also does not handle IP address assignment (although most routers now have built-in DHCP servers). Does however try to route packets via best possible route to target. As such, communicates with other routers (e.g. via ICM protocol) to work out best route

Integrated routers typically have own IP address... NAT forwarding allows sharing of 'single' IP address...

