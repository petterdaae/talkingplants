*Not maintained*

---

# Talking Plants
Notifies you when your plants need your attention.

## Installation / Development Setup
Follow this simple 12 step guide to get started! App sepecific instructions are intended for android, iOS has not been tested yet.

1. `sql/`: Setup a postgres database and run the sql scripts.
2. `api/`: Find a nice place to host the rest api.
3. Add all necessary variables to the environment where the api is running. These are specified in `api/.env.example`. If you are running the api locally you can add the variables to a `.env` file similar to the example file.
4. Wire up your arduino: *good luck :)*
5. `arduino/arduino_mkr_1010`: In this folder, create a file named `config.h`. The content should look like this:
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
8. Create a firebase project (and upgrade to blaze plant, you need this for api calls that goes out of firebase).
9. Set the default GCP resource location in project settings.
10. Create `notifier/functions/.env`, similar to `notifier/functions/.env.example`.
11. Go into `notifier/` (which is the firebase project root) and deploy to your own firebase instance.
12. Configure the app to talk to your firebase project. There are plenty of resources on how to do this. Essentially what you have to do is to get the `google-services.json` file.
