#!/bin/bash

pin="13"

# 2. clean up
if [ -L /sys/class/gpio/gpio$pin ]; then
    echo $pin > /sys/class/gpio/unexport
fi

# 3. set GPIO pin to OUTPUT
echo $pin > /sys/class/gpio/export
echo "out" > /sys/class/gpio/gpio$pin/direction


pin="19"

# 2. clean up
if [ -L /sys/class/gpio/gpio$pin ]; then
    echo $pin > /sys/class/gpio/unexport
fi

# 3. set GPIO pin to OUTPUT
echo $pin > /sys/class/gpio/export
echo "out" > /sys/class/gpio/gpio$pin/direction


