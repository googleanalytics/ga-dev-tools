export interface CustomField {
  name: string
  value: string
  builders: ("ios" | "play")[]
  label?: string
  visible?: boolean
  required?: boolean
  helperText?: string
}
export interface AdNetwork {
  label: string
  method: "ping" | "redirect"
  deviceID: string
  networkID?: string
  clickID?: string
  customFields?: CustomField[]
  source?: string
  medium?: string
}

export const supportedAdNetworks: AdNetwork[] = [
  {
    label: "Aarki",
    method: "redirect",
    deviceID: "{advertising_id}",
    networkID: "aarki",
    clickID: "{click_id}",
    customFields: [
      {
        name: "cp1",
        value: "{app_id}",
        builders: ["ios", "play"],
      },
    ],
  },
  {
    label: "AdColony",
    method: "redirect",
    deviceID: "[IDFA]",
    networkID: "adcolony",
    customFields: [
      {
        label: "iTunes Store ID",
        helperText: "The itunes store ID",
        name: "asid",
        value: "",
        visible: true,
        required: true,
        builders: ["ios"],
      },
    ],
  },
  {
    label: "Google AdMob",
    method: "redirect",
    deviceID: "{idfa}",
    networkID: "admob",
    source: "google",
    medium: "cpc",
  },
  {
    label: "Applovin",
    method: "redirect",
    deviceID: "{ADID}",
    networkID: "applovin",
  },
  {
    label: "Conversant (formerly Greystripe)",
    method: "redirect",
    deviceID: "{idfa}",
    networkID: "conversant",
  },
  {
    label: "Fiksu",
    method: "ping",
    deviceID: "{{advertising_id}}",
    networkID: "fiksu",
    customFields: [
      {
        label: "iTunes Store ID",
        helperText: "The itunes store ID",
        name: "asid",
        value: "",
        visible: true,
        required: true,
        builders: ["ios"],
      },
    ],
  },
  {
    label: "InMobi",
    method: "redirect",
    deviceID: "$IDA",
    networkID: "inmobi",
    clickID: "$IMP_ID",
  },
  {
    label: "Jampp",
    method: "redirect",
    deviceID: "{apple_ifa}",
    networkID: "jampp",
    clickID: "{hash}",
  },
  {
    label: "Leadbolt",
    method: "redirect",
    deviceID: "[DEVICE_AD_ID]",
    networkID: "leadbolt",
    clickID: "[CLK_ID]",
    customFields: [
      {
        name: "cp1",
        value: "[TRACK_ID]",
        builders: ["ios", "play"],
      },
    ],
  },
  {
    label: "Limei",
    method: "redirect",
    deviceID: "--IDFA--",
    networkID: "limei",
    clickID: "--LIMEIBIDID--",
  },
  {
    label: "Millennial Media",
    method: "redirect",
    deviceID: "[:_jv_uaid:]",
    networkID: "millennial",
    clickID: "[:_jv_urid:]",
  },
  {
    label: "Millennial Media DSP",
    method: "redirect",
    deviceID: "JT_IDFA",
    networkID: "millennialdsp",
    clickID: "JT_REQID",
  },
  {
    label: "MdotM",
    method: "redirect",
    deviceID: "[AID]",
    networkID: "mdotm",
    clickID: "[CLICKID]",
    customFields: [
      {
        label: "iTunes Store ID",
        helperText: "The itunes store ID",
        name: "asid",
        value: "",
        visible: true,
        required: true,
        builders: ["ios"],
      },
    ],
  },
  {
    label: "MobFox",
    method: "redirect",
    deviceID: "MFOXIFA",
    networkID: "mobfox",
  },
  {
    label: "nend",
    method: "redirect",
    deviceID: "{{IDFA}}",
    networkID: "nend",
    clickID: "{{NENDID}}",
  },
  {
    label: "Opera",
    method: "redirect",
    deviceID: "xxxidfaxxx",
    networkID: "opera",
    clickID: "xxxtransidxxx",
  },
  {
    label: "Phunware",
    method: "redirect",
    deviceID: "[idfa]",
    networkID: "phunware",
    clickID: "[transaction_id]",
  },
  {
    label: "Snakk!Ads",
    method: "redirect",
    deviceID: "[idfa]",
    networkID: "snakkads",
    clickID: "[transaction_id]",
  },
  {
    label: "Tapjoy",
    method: "redirect",
    deviceID: "TAPJOY_RESTORED_RAW_ADVERTISING_ID",
    networkID: "tapjoy",
  },
  {
    label: "Custom",
    method: "redirect",
    deviceID: "",
  },
]
