# 🚧 WORK IN PROGRESS 🚧

# 🌱 Talking Plants
Notifies you when your plants need your attention. 

Check out the web demo: [talkingplants.daae.dev](https://talkingplants.daae.dev).

## 🛠️ Installation / Development Setup
Follow this simple 12 step guide to get started! *I recommend hosting the database and rest api on Heroku and the react app on netlify (because this repo contains a lot of the necessary configuration for these).*

1. `sql/`: Setup a postgres database and run the sql scripts.
2. `api/`: Find a nice place to host the rest api.
3. Add all necessary variables to the environment where the api is running. These are specified in `api/.env.example`. *Note that some hosting platforms specify the port environment variable themselve.* If you are running the api locally you can add the variables to a `.env` file similar to the example file.
4. Wire up your arduino: *TBA*
5. `arduino/arduino_mkr_1010`: In this folder, create a file names `config.h`. The content should look like this:
```c++
#define WIFI_SSID "wifiname"
#define WIFI_PASS "wifipassword"
#define API_KEY "apikey"
#define PLANT_ID "42"
#define API_HOST "example.com"
```
5. You can use the Arduino IDE to upload the sketch to your arduino.
6. Find a nice place to host the web app.
7. Update `web/.env` to point to where you are hosting the api.
8. Create a firebase project (and upgrade to blaze plant).
9. Set the default GCP resource location in project settings.
10. Create a fresh gmail account, enable two factor authentication and create an app password for the account.
11. Create `notifier/functions/.env`, similar to `notifier/functions/.env.example`.
12. Go into `notifier/` (which is the firebase project root) and deploy to your own firebase instance.

## 🚀 Deployment (may not apply to your hosting choices)
### Rest API
* https://elements.heroku.com/buildpacks/sectorlabs/heroku-buildpack-subdir
* https://github.com/emk/heroku-buildpack-rust
* Add required environment variables (specified in .env.example) in `Settings/Config Vars` in Heroku
* `git push heroku master`

### Web
Deploys triggered in netlify on new commits to master.

### Arduino
Use the Arduino IDE.

### Notfier
`firebase deploy --only functions`

## 😠 Troubleshooting
### Arduino
* Use `lsusb` to check if the arduino is actually connected to usb.
* Press the reset button on the arduino to restart the sketch.
* Doubletap the reset button if you are not able to upload new code.
