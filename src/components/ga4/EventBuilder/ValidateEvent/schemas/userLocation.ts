// User Location Schema

export const userLocationSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    city: {
      type: "string",
    },
    region_id: {
      type: "string",
      // ISO 3166-2
      pattern: "^[A-Z]{2}-[A-Z0-9]{1,3}$",
    },
    country_id: {
      type: "string",
      // ISO 3166-1 alpha-2
      pattern: "^[A-Z]{2}$",
    },
    subcontinent_id: {
      type: "string",
      // UN M49
      pattern: "^[0-9]{3}$",
    },
    continent_id: {
      type: "string",
      // UN M49
      pattern: "^[0-9]{3}$",
    },
  },
}
