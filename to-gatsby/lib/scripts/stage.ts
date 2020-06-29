import * as execa from "execa"
import { build } from "./build"
import { checkConfig } from "./check-config"

export const stage = async (environment: "integration" | "production") => {
  const config = await checkConfig()

  const projectId =
    environment === "integration" ? config.firebaseStagingProjectId : undefined

  if (projectId === undefined) {
    throw new Error("Production deployments are not yet supported.")
  }

  await build(false)

  await execa(
    "yarn",
    ["run", "firebase", "--project", projectId, "deploy", "--only", "hosting"],
    {
      stderr: "inherit",
      stdout: "inherit",
      stdin: "inherit",
    }
  )

  return
}
