# Notifier

## Setting up an email address to send emails from
* *This was tricky*
* Create a new gmail account
* Enable two factor authentication
* Generate an app password
* Put your credentials in a file similar to `.env.example`

## Development Setup
- `sudo npm i -g firebase-tools`
- `firebase login`
- Create your own firebase project
- TODO: Document how to create .firebaserc
- `firebase emulators:start --only functions`

## Deploying
- `firebase deploy --only functions`