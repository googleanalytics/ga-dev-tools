// yarn check-types && gatsby develop --host=0.0.0.0"
import { checkConfig, writeEnvFile } from "./check-config"
import * as execa from "execa"
import { configForEnvironment } from "."
import { DevelopArgs } from "./types"

export const develop = async (args: DevelopArgs) => {
  const config = await checkConfig({ all: false })

  await writeEnvFile(configForEnvironment(args.environment, config))

  // We use port 5000 because the generated oauth client for a firebase allows
  // port 5000 by default on localhost. The developer can change this value, but
  // they'll need to make sure that the host+post they use is set in the
  // Authorized JavaScript origins.
  await execa("yarn", ["gatsby", "develop", "--host=0.0.0.0", "--port=5000"], {
    stderr: "inherit",
    stdout: "inherit",
    stdin: "inherit",
  })

  return
}
