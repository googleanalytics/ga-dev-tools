import * as execa from "execa"
import { build } from "./build"
import { ServeArgs } from "./types"
import { checkConfig } from "./check-config"

export const serve = async (args: ServeArgs) => {
  // TODO - in the future this should get the right id based on which
  // environment you're building/serving.
  const { firebaseStagingProjectId: projectId } = await checkConfig()

  if (!args.skipBuild) {
    await build(false)
  }

  await execa(
    "yarn",
    ["run", "firebase", "--project", projectId, "serve", "--host", "0.0.0.0"],
    {
      stderr: "inherit",
      stdout: "inherit",
      stdin: "inherit",
    }
  )

  return
}
