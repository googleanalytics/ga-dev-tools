# Functions for GA Demos

## Deploy to production

1. From the top-level, run the following command:

   ```
   yarn check-config --all
   ```

   This will make sure that all required values are deploy correctly. We use
   [`functions.config()`] to get configuration values that are set from the
   previous command.

1. Navigate to the ./functions directory
1. `nvm use 12`

   Use nvm to switch your current version of node to the same one in the
   `engines` section of `package.json`.

1. `npm install`
1. `npm run deploy`

[functions.config()]: https://firebase.google.com/docs/functions/config-env#access_environment_configuration_in_a_function

## Run locally

1. `nvm use 12`
1. `npm install`
1. `npm run serve`
