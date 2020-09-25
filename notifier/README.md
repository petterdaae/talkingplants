# Notifier

## Setup
* Create your own firebase project
* Upgrade to blaze plan
* Set default GCP resource location (in project settings)
* Create a new gmail account
* Enable two factor authentication
* Create an app password
* Add correct config values to `.env` (similar to `.env.example`)
- `sudo npm i -g firebase-tools`
- `firebase login`
- `firebase emulators:start --only functions` (to test the functions locally)
- `firebase deploy --only functions` (to deploy the functions to your firebase project)
