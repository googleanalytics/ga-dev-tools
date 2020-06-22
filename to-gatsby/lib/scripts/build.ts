import { checkConfig } from "./check-config"
import * as execa from "execa"

// Building makes sure all necessary config items are provided, then runs gatsby build with all necessary environment variables.
export const build = async () => {
  const config = await checkConfig()

  await execa("yarn", ["gatsby", "build"], {
    env: { GATSBY_GA_MEASUREMENT_ID: config.gaMeasurementId },
    stderr: "inherit",
    stdout: "inherit",
    stdin: "inherit",
  })

  return
}
