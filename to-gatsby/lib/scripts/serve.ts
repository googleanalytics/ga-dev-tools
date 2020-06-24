import * as execa from "execa"
import { build } from "./build"

export const serve = async () => {
  // TODO - Low priority - add flag to skip the build.
  await build()

  await execa("yarn", ["run", "firebase", "serve"], {
    stderr: "inherit",
    stdout: "inherit",
    stdin: "inherit",
  })

  return
}
