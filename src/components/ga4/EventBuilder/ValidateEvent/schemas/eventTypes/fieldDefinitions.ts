// Event and item level property schema mapping.
import { GENERIC_STRING, GENERIC_NUMBER, CURRENCY_TYPE, CURRENCY_VALUE } from "./propertyConstants"

export const EVENT_FIELDS = {
    "currency": CURRENCY_TYPE,
    "transaction_id": GENERIC_STRING,
    "value": CURRENCY_VALUE,
    "affiliation": GENERIC_STRING,
    "coupon": GENERIC_STRING,
    "shipping": CURRENCY_VALUE,
    "shipping_tier": GENERIC_STRING,
    "virtual_currency_name": GENERIC_STRING,
    "tax": CURRENCY_VALUE,
    "payment_type": GENERIC_STRING,
    "group_id": GENERIC_STRING,
    "level": GENERIC_NUMBER,
    "character": GENERIC_STRING,
    "method": GENERIC_STRING,
    "search_term": GENERIC_STRING,
    "content_type": GENERIC_STRING,
    "item_id": GENERIC_STRING,
    "score": GENERIC_NUMBER,
    "item_list_id": GENERIC_STRING,
    "item_list_name": GENERIC_STRING,
    "creative_name": GENERIC_STRING,
    "creative_slot": GENERIC_STRING,
    "location_id": GENERIC_STRING,
    "promotion_id": GENERIC_STRING,
    "promotion_name": GENERIC_STRING,
    "item_name": GENERIC_STRING,
    "achievement_id": GENERIC_STRING,
}

export const ITEM_FIELDS = {
    "item_id": GENERIC_STRING,
    "item_name": GENERIC_STRING,
    "affiliation": GENERIC_STRING,
    "coupon": GENERIC_STRING,
    "currency": CURRENCY_TYPE,
    "discount": CURRENCY_VALUE,
    "index": GENERIC_NUMBER,
    "item_brand": GENERIC_STRING,
    "item_category": GENERIC_STRING,
    "item_category2": GENERIC_STRING,
    "item_category3": GENERIC_STRING,
    "item_category4": GENERIC_STRING,
    "item_category5": GENERIC_STRING,
    "item_list_id": GENERIC_STRING,
    "item_list_name": GENERIC_STRING,
    "item_variant": GENERIC_STRING,
    "location_id": GENERIC_STRING,
    "price": CURRENCY_VALUE,
    "quantity": GENERIC_NUMBER,
    "creative_name": GENERIC_STRING,
    "creative_slot": GENERIC_STRING,
    "promotion_id": GENERIC_STRING,
    "promotion_name": GENERIC_STRING,
}

export const VALUE_CURRENCY_DEPENDENCY = {"currency": ["value"], "value": ["currency"]}

// def get_schema(field_name: str) -> object:
//   return _EVENT_FIELDS[field_name]


// def get_event_fields() -> object:
//   return _EVENT_FIELDS


// def get_item_fields() -> object:
//   return _ITEM_FIELDS


// def get_item_schema(field_name: str) -> object:
//   return _ITEM_FIELDS[field_name]
