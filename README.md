# 🌱 Talking Plants
Notifies you when your plants need your attention. You can check out the unauthenticated parts of the application at [talkingplants.daae.dev](https://talkingplants.daae.dev).

## 🚀 Deploy
### Rest API
* https://elements.heroku.com/buildpacks/sectorlabs/heroku-buildpack-subdir
* https://github.com/emk/heroku-buildpack-rust
* Add required environment variables (specified in .env.example) in `Settings/Config Vars` in Heroku
* `git push heroku master`

### Arduino
* Create a file called `config.h` file. The content should look something like this:
```c++
#define WIFI_SSID "wifiname"
#define WIFI_PASS "wifipassword"
#define API_KEY "apikey"
#define PLANT_ID "42"
#define API_HOST "example.com"
```
* Put the file in `arduino/arduino_mkr_1010/`.
* Install/download the necessary dependencies (look at the top of the sketch file).
* Open the `arduino/arduino_mkr_1010` folder/sketch in the arduino IDE and uplaod it to your arduino (preferably *Arduino MKR WiFi 1010*).

### Web
Deploys triggered in netlify on new commits to master.

## 😠 Troubleshooting
### Arduino
* Use `lsusb` to check if the arduino is actually connected to usb.
* Press the reset button on the arduino to restart the sketch.
* Doubletap the reset button if you are not able to upload new code.
