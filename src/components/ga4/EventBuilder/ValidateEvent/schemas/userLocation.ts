// User location schema

export const userLocationSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    city: {
      type: "string",
    },
    region_id: {
      type: "string",
    },
    country_id: {
      type: "string",
    },
    subcontinent_id: {
      type: "string",
    },
    continent_id: {
      type: "string",
    },
  },
}
