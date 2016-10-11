# rpi-garden-camera
Monitor your IKEA Växer garden with a RPI

Distro: https://adafruit-download.s3.amazonaws.com/2016-03-25_Jessie_PiTFT35r.zip

## Clean the distro
```sudo apt-get remove --purge wolfram-engine scratch sonic-pi idle3 penguinspuzzle minecraft-pi python-minecraftpi python3-minecraftpi*```

## Set RPI to Kiosk mode
http://raspberrypi.stackexchange.com/questions/30093/epiphany-browser-in-full-screen-mode
## Install Node.JS
```curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -```
```sudo apt install -y nodejs```
## Get code from Github
```git clone https://github.com/UI-Jakob/rpi-garden-camera.git```
