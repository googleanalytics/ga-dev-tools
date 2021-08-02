export interface AdNetwork {
  label: string
  networkId?: string
  clickId?: string
  customFields?: {
    name: string
    value: string
    label?: string
    visible?: boolean
    required?: boolean
    builders?: ("ios" | "play")[]
  }[]
  source?: string
  medium?: string
  method?: "ping" | "redirect"
  deviceId: string
}

export const supportedAdNetworks: AdNetwork[] = [
  {
    label: "Aarki",
    method: "redirect",
    deviceId: "{advertising_id}",
    networkId: "aarki",
    clickId: "{click_id}",
    customFields: [
      {
        name: "cp1",
        value: "{app_id}",
      },
    ],
  },
  {
    label: "AdColony",
    method: "redirect",
    deviceId: "[IDFA]",
    networkId: "adcolony",
    customFields: [
      {
        label: "iTunes Store ID",
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
    deviceId: "{idfa}",
    networkId: "admob",
    source: "google",
    medium: "cpc",
  },
  {
    label: "Applovin",
    method: "redirect",
    deviceId: "{ADID}",
    networkId: "applovin",
  },
  {
    label: "Conversant (formerly Greystripe)",
    method: "redirect",
    deviceId: "{idfa}",
    networkId: "conversant",
  },
  {
    label: "Fiksu",
    method: "ping",
    deviceId: "{{advertising_id}}",
    networkId: "fiksu",
    customFields: [
      {
        label: "iTunes Store ID",
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
    deviceId: "$IDA",
    networkId: "inmobi",
    clickId: "$IMP_ID",
  },
  {
    label: "Jampp",
    method: "redirect",
    deviceId: "{apple_ifa}",
    networkId: "jampp",
    clickId: "{hash}",
  },
  {
    label: "Leadbolt",
    method: "redirect",
    deviceId: "[DEVICE_AD_ID]",
    networkId: "leadbolt",
    clickId: "[CLK_ID]",
    customFields: [
      {
        name: "cp1",
        value: "[TRACK_ID]",
      },
    ],
  },
  {
    label: "Limei",
    method: "redirect",
    deviceId: "--IDFA--",
    networkId: "limei",
    clickId: "--LIMEIBIDID--",
  },
  {
    label: "Millennial Media",
    method: "redirect",
    deviceId: "[:_jv_uaid:]",
    networkId: "millennial",
    clickId: "[:_jv_urid:]",
  },
  {
    label: "Millennial Media DSP",
    method: "redirect",
    deviceId: "JT_IDFA",
    networkId: "millennialdsp",
    clickId: "JT_REQID",
  },
  {
    label: "MdotM",
    method: "redirect",
    deviceId: "[AID]",
    networkId: "mdotm",
    clickId: "[CLICKID]",
    customFields: [
      {
        label: "iTunes Store ID",
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
    deviceId: "MFOXIFA",
    networkId: "mobfox",
  },
  {
    label: "nend",
    method: "redirect",
    deviceId: "{{IDFA}}",
    networkId: "nend",
    clickId: "{{NENDID}}",
  },
  {
    label: "Opera",
    method: "redirect",
    deviceId: "xxxidfaxxx",
    networkId: "opera",
    clickId: "xxxtransidxxx",
  },
  {
    label: "Phunware",
    method: "redirect",
    deviceId: "[idfa]",
    networkId: "phunware",
    clickId: "[transaction_id]",
  },
  {
    label: "Snakk!Ads",
    method: "redirect",
    deviceId: "[idfa]",
    networkId: "snakkads",
    clickId: "[transaction_id]",
  },
  {
    label: "Tapjoy",
    method: "redirect",
    deviceId: "TAPJOY_RESTORED_RAW_ADVERTISING_ID",
    networkId: "tapjoy",
  },
  {
    label: "Custom",
    method: "redirect",
    deviceId: "",
  },
]
