import * as execa from "execa"
import { build } from "./build"
import { ServeArgs } from "./types"

export const serve = async (args: ServeArgs) => {
  if (!args.skipBuild) {
    await build()
  }

  await execa("yarn", ["run", "firebase", "serve"], {
    stderr: "inherit",
    stdout: "inherit",
    stdin: "inherit",
  })

  return
}
