interface CommonAttributes {
  group: string;
  uiName: string;
  description: string;
  allowedInSegments?: "true" | "false";
  addedInApiVersion: number | string;
}

interface DimensionAttributes {
  type: "DIMENSION";
  dataType: "STRING";
}

interface MetricAttributes {
  type: "METRIC";
  dataType: "INTEGER" | "PERCENT" | "TIME" | "CURRENCY" | "FLOAT";
  calculation?: string;
}

interface DeprecatedAttributes {
  replacedBy: string;
  status: "DEPRECATED";
}

interface PublicAttributes {
  status: "PUBLIC";
}

interface TemplateAttributes {
  minTemplateIndex: number;
  maxTemplateIndex: number;
}

interface PremiumTemplateAttributes extends TemplateAttributes {
  premiumMinTemplateIndex: number;
  premiumMaxTemplateIndex: number;
}

type Attributes = CommonAttributes &
  (DimensionAttributes | MetricAttributes) &
  (DeprecatedAttributes | PublicAttributes) &
  ({} | TemplateAttributes | PremiumTemplateAttributes);

// A single Dimension or Metric
export interface Column {
  id: string;
  kind: string;
  attributes: Attributes;
}

// Columns grouped by group
export type Groups = { [key: string]: Column[] };
