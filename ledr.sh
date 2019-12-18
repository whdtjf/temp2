#!/bin/bash

pin="19"


    # 4.1 turn LED ON
echo "1" > /sys/class/gpio/gpio$pin/value
sleep 5

    # 4.2 turn LED OFF
echo "0" > /sys/class/gpio/gpio$pin/value
