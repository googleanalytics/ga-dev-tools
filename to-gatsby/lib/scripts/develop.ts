// yarn check-types && gatsby develop --host=0.0.0.0"
import { checkConfig } from "./check-config"
import * as execa from "execa"

export const develop = async () => {
  // TODO - update check config to take an argument for which command it is
  // running. All commands don't require all config to be set and this would
  // make it easier to get started.
  const config = await checkConfig()

  await execa("yarn", ["gatsby", "develop", "--host=0.0.0.0"], {
    env: { GATSBY_GA_MEASUREMENT_ID: config.gaMeasurementIdDev },
    stderr: "inherit",
    stdout: "inherit",
    stdin: "inherit",
  })

  return
}
