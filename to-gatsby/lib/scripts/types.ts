import * as path from "path"

export const PWD = process.cwd()
export const Encoding = "utf8"
export const RuntimeJsonPath = path.join(PWD, "runtime.json")

export interface RuntimeJson {
  gaMeasurementId: string
  gaMeasurementIdDev: string
}
