import {
  Category,
  Event2,
  EventType,
  NumberParameter,
  Parameter,
  ParameterType,
  StringParameter,
} from "@/components/ga4/EventBuilder/types"

export const cloneEvent = (event: Event2): Event2 => {
  const nu = { ...event, parameters: event.parameters.map(p => ({ ...p })) }
  if (event.items !== undefined) {
    nu.items = event.items.map(i => i.map(ii => ({ ...ii })))
  }
  return nu
}

export const stringParam = (
  name: string,
  exampleValue: string | undefined
): StringParameter => ({
  type: ParameterType.String,
  name,
  value: undefined,
  exampleValue,
})

export const numberParam = (
  name: string,
  exampleValue: number | undefined
): NumberParameter => ({
  type: ParameterType.Number,
  name,
  value: undefined,
  exampleValue,
})

const eventFor = (
  type: EventType,
  categories: Category[],
  parameters: Parameter[],
  firstItem?: Parameter[]
) => ({
  type,
  categories,
  parameters,
  items: firstItem === undefined ? undefined : [firstItem],
})

const custom_event = eventFor(EventType.CustomEvent, [Category.Custom], [], [])

const add_payment_info = eventFor(
  EventType.AddPaymentInfo,
  [Category.RetailEcommerce],
  [
    stringParam("coupon", "SUMMER_FUN"),
    stringParam("currency", "USD"),
    stringParam("payment_type", "Credit Card"),
    numberParam("value", 7.77),
  ],
  [
    stringParam("item_id", "SKU_12345"),
    stringParam("item_name", "jeggings"),
    numberParam("quantity", 1),
    stringParam("affiliation", "Google Store"),
    stringParam("coupon", "SUMMER_FUN"),
    numberParam("discount", 2.22),
    stringParam("item_brand", "Gucci"),
    stringParam("item_category", "pants"),
    stringParam("item_variant", "Black"),
    numberParam("price", 9.99),
    stringParam("currency", "USD"),
  ]
)

const add_shipping_info = eventFor(
  EventType.AddShippingInfo,
  [Category.RetailEcommerce],
  [
    stringParam("coupon", "SUMMER_FUN"),
    stringParam("currency", "USD"),
    stringParam("shipping_tier", "Ground"),
    numberParam("value", 7.77),
  ],
  [
    stringParam("item_id", "SKU_12345"),
    stringParam("item_name", "jeggings"),
    numberParam("quantity", 1),
    stringParam("affiliation", "Google Store"),
    stringParam("coupon", "SUMMER_FUN"),
    numberParam("discount", 2.22),
    stringParam("item_brand", "Gucci"),
    stringParam("item_category", "pants"),
    stringParam("item_variant", "Black"),
    numberParam("price", 9.99),
    stringParam("currency", "USD"),
  ]
)

const add_to_cart = eventFor(
  EventType.AddToCart,
  [Category.RetailEcommerce],
  [stringParam("currency", "USD"), numberParam("value", 7.77)],
  [
    stringParam("item_id", "SKU_12345"),
    stringParam("item_name", "jeggings"),
    numberParam("quantity", 1),
    stringParam("affiliation", "Google Store"),
    stringParam("coupon", "SUMMER_FUN"),
    numberParam("discount", 2.22),
    stringParam("item_brand", "Gucci"),
    stringParam("item_category", "pants"),
    stringParam("item_variant", "Black"),
    numberParam("price", 9.99),
    stringParam("currency", "USD"),
  ]
)

const add_to_wishlist = eventFor(
  EventType.AddToWishlist,
  [Category.RetailEcommerce],
  [stringParam("currency", "USD"), numberParam("value", 7.77)],
  [
    stringParam("item_id", "SKU_12345"),
    stringParam("item_name", "jeggings"),
    numberParam("quantity", 1),
    stringParam("affiliation", "Google Store"),
    stringParam("coupon", "SUMMER_FUN"),
    numberParam("discount", 2.22),
    stringParam("item_brand", "Gucci"),
    stringParam("item_category", "pants"),
    stringParam("item_variant", "Black"),
    numberParam("price", 9.99),
    stringParam("currency", "USD"),
  ]
)

const begin_checkout = eventFor(
  EventType.BeginCheckout,
  [Category.RetailEcommerce],
  [
    stringParam("coupon", "SUMMER_FUN"),
    stringParam("currency", "USD"),
    numberParam("value", 7.77),
  ],
  [
    stringParam("item_id", "SKU_12345"),
    stringParam("item_name", "jeggings"),
    numberParam("quantity", 1),
    stringParam("affiliation", "Google Store"),
    stringParam("coupon", "SUMMER_FUN"),
    numberParam("discount", 2.22),
    stringParam("item_brand", "Gucci"),
    stringParam("item_category", "pants"),
    stringParam("item_variant", "Black"),
    numberParam("price", 9.99),
    stringParam("currency", "USD"),
  ]
)

const earn_virtual_currency = eventFor(
  EventType.EarnVirtualCurrency,
  [Category.AllApps],
  [stringParam("virtual_currency_name", "Gems"), numberParam("value", 5)]
)

const generate_lead = eventFor(
  EventType.GenerateLead,
  [Category.RetailEcommerce],
  [stringParam("currency", "USD"), numberParam("value", 99.99)]
)

const join_group = eventFor(
  EventType.JoinGroup,
  [Category.AllApps],
  [stringParam("group_id", "G_12345")]
)

const level_up = eventFor(
  EventType.LevelUp,
  [Category.Games],
  [numberParam("level", 5), stringParam("character", "Player 1")]
)

const login = eventFor(
  EventType.Login,
  [Category.AllApps],
  [stringParam("method", "Google")]
)

const post_score = eventFor(
  EventType.PostScore,
  [Category.Games],
  [
    numberParam("score", 10000),
    numberParam("level", 5),
    stringParam("character", "Player 1"),
  ]
)

const purchase = eventFor(
  EventType.Purchase,
  [Category.AllApps],
  [
    stringParam("affiliation", "Google Store"),
    stringParam("coupon", "SUMMER_FUN"),
    stringParam("currency", "USD"),
    stringParam("transaction_id", "T_12345"),
    numberParam("shipping", 3.33),
    numberParam("tax", 1.11),
    numberParam("value", 12.21),
  ],
  [
    stringParam("item_id", "SKU_12345"),
    stringParam("item_name", "jeggings"),
    numberParam("quantity", 1),
    stringParam("affiliation", "Google Store"),
    stringParam("coupon", "SUMMER_FUN"),
    numberParam("discount", 2.22),
    stringParam("item_brand", "Gucci"),
    stringParam("item_category", "pants"),
    stringParam("item_variant", "Black"),
    numberParam("tax", 1.11),
    numberParam("price", 9.99),
    stringParam("currency", "USD"),
  ]
)

const refund = eventFor(
  EventType.Refund,
  [Category.AllApps],
  [
    stringParam("affiliation", "Google Store"),
    stringParam("coupon", "SUMMER_FUN"),
    stringParam("currency", "USD"),
    stringParam("transaction_id", "T_12345"),
    numberParam("shipping", 3.33),
    numberParam("tax", 1.11),
    numberParam("value", 12.21),
  ],
  [
    stringParam("item_id", "SKU_12345"),
    stringParam("item_name", "jeggings"),
    numberParam("quantity", 1),
    stringParam("affiliation", "Google Store"),
    stringParam("coupon", "SUMMER_FUN"),
    numberParam("discount", 2.22),
    stringParam("item_brand", "Gucci"),
    stringParam("item_category", "pants"),
    stringParam("item_variant", "Black"),
    numberParam("tax", 1.11),
    numberParam("price", 9.99),
    stringParam("currency", "USD"),
  ]
)

const remove_from_cart = eventFor(
  EventType.RemoveFromCart,
  [Category.RetailEcommerce],
  [stringParam("currency", "USD"), numberParam("value", 7.77)],
  [
    stringParam("item_id", "SKU_12345"),
    stringParam("item_name", "jeggings"),
    numberParam("quantity", 1),
    stringParam("affiliation", "Google Store"),
    stringParam("coupon", "SUMMER_FUN"),
    numberParam("discount", 2.22),
    stringParam("item_brand", "Gucci"),
    stringParam("item_category", "pants"),
    stringParam("item_variant", "Black"),
    numberParam("price", 9.99),
    stringParam("currency", "USD"),
  ]
)

const search = eventFor(
  EventType.Search,
  [Category.AllApps],
  [stringParam("search_term", "t-shirts")]
)

const select_content = eventFor(
  EventType.SelectContent,
  [Category.AllApps],
  [stringParam("content_type", "product"), stringParam("item_id", "I_12345")]
)

const select_item = eventFor(
  EventType.SelectItem,
  [Category.RetailEcommerce],
  [
    stringParam("item_list_name", "Related products"),
    stringParam("item_list_id", "related_products"),
  ],
  [
    stringParam("item_id", "SKU_12345"),
    stringParam("item_name", "jeggings"),
    numberParam("quantity", 1),
    stringParam("affiliation", "Google Store"),
    stringParam("coupon", "SUMMER_FUN"),
    numberParam("discount", 2.22),
    numberParam("index", 5),
    stringParam("item_brand", "Gucci"),
    stringParam("item_category", "pants"),
    stringParam("item_list_name", "Related products"),
    stringParam("item_list_id", "related_products"),
    stringParam("item_variant", "Black"),
    numberParam("price", 9.99),
    stringParam("currency", "USD"),
  ]
)

const select_promotion = eventFor(
  EventType.SelectPromotion,
  [Category.RetailEcommerce],
  [stringParam("location_id", "L_12345")],
  [
    stringParam("item_id", "SKU_12345"),
    stringParam("item_name", "jeggings"),
    numberParam("quantity", 1),
    stringParam("promotion_id", "P_12345"),
    stringParam("promotion_name", "Summer Sale"),
    stringParam("affiliation", "Google Store"),
    stringParam("coupon", "SUMMER_FUN"),
    stringParam("creative_name", "summer_banner2"),
    stringParam("creative_slot", "featured_app_1"),
    numberParam("discount", 2.22),
    stringParam("item_brand", "Gucci"),
    stringParam("item_category", "pants"),
    stringParam("item_variant", "Black"),
    stringParam("location_id", "L_12345"),
    numberParam("price", 9.99),
    stringParam("currency", "USD"),
  ]
)

const share = eventFor(
  EventType.Share,
  [Category.AllApps],
  [
    stringParam("method", "Twitter"),
    stringParam("content_type", "image"),
    stringParam("content_id", "C_12345"),
  ]
)

const sign_up = eventFor(
  EventType.SignUp,
  [Category.AllApps],
  [stringParam("method", "Google")]
)

const spend_virtual_currency = eventFor(
  EventType.SpendVirtualCurrency,
  [Category.AllApps],
  [
    stringParam("item_name", "Starter Boost"),
    stringParam("virtual_currency_name", "Gems"),
    numberParam("value", 5),
  ]
)

const tutorial_begin = eventFor(EventType.TutorialBegin, [Category.AllApps], [])

const tutorial_complete = eventFor(
  EventType.TutorialComplete,
  [Category.AllApps, Category.Games],
  []
)

const unlock_achievement = eventFor(
  EventType.UnlockAchievement,
  [Category.Games],
  [stringParam("achievement_id", "A_12345")]
)

const view_cart = eventFor(
  EventType.ViewCart,
  [Category.RetailEcommerce],
  [stringParam("currency", "USD"), numberParam("value", 7.77)],
  [
    stringParam("item_id", "SKU_12345"),
    stringParam("item_name", "jeggings"),
    numberParam("quantity", 1),
    stringParam("affiliation", "Google Store"),
    stringParam("coupon", "SUMMER_FUN"),
    numberParam("discount", 2.22),
    stringParam("item_brand", "Gucci"),
    stringParam("item_category", "pants"),
    stringParam("item_variant", "Black"),
    numberParam("price", 9.99),
    stringParam("currency", "USD"),
  ]
)

const view_item = eventFor(
  EventType.ViewItem,
  [Category.RetailEcommerce],
  [stringParam("currency", "USD"), numberParam("value", 7.77)],
  [
    stringParam("item_id", "SKU_12345"),
    stringParam("item_name", "jeggings"),
    numberParam("quantity", 1),
    stringParam("affiliation", "Google Store"),
    stringParam("coupon", "SUMMER_FUN"),
    numberParam("discount", 2.22),
    stringParam("item_brand", "Gucci"),
    stringParam("item_category", "pants"),
    stringParam("item_variant", "Black"),
    numberParam("price", 9.99),
    stringParam("currency", "USD"),
  ]
)

const view_item_list = eventFor(
  EventType.ViewItemList,
  [Category.RetailEcommerce],
  [
    stringParam("item_list_name", "Related products"),
    stringParam("item_list_id", "related_products"),
  ],
  [
    stringParam("item_id", "SKU_12345"),
    stringParam("item_name", "jeggings"),
    numberParam("quantity", 1),
    stringParam("affiliation", "Google Store"),
    stringParam("coupon", "SUMMER_FUN"),
    numberParam("discount", 2.22),
    numberParam("index", 5),
    stringParam("item_brand", "Gucci"),
    stringParam("item_category", "pants"),
    stringParam("item_list_name", "Related products"),
    stringParam("item_list_id", "related_products"),
    stringParam("item_variant", "Black"),
    numberParam("price", 9.99),
    stringParam("currency", "USD"),
  ]
)

const view_promotion = eventFor(
  EventType.ViewPromotion,
  [Category.RetailEcommerce],
  [stringParam("location_id", "L_12345")],
  [
    stringParam("item_id", "SKU_12345"),
    stringParam("item_name", "jeggings"),
    numberParam("quantity", 1),
    stringParam("promotion_id", "P_12345"),
    stringParam("promotion_name", "Summer Sale"),
    stringParam("affiliation", "Google Store"),
    stringParam("coupon", "SUMMER_FUN"),
    stringParam("creative_name", "summer_banner2"),
    stringParam("creative_slot", "featured_app_1"),
    numberParam("discount", 2.22),
    stringParam("item_brand", "Gucci"),
    stringParam("item_category", "pants"),
    stringParam("item_variant", "Black"),
    stringParam("location_id", "L_12345"),
    numberParam("price", 9.99),
    stringParam("currency", "USD"),
  ]
)

const view_search_results = eventFor(
  EventType.ViewSearchResults,
  [Category.RetailEcommerce],
  [stringParam("search_term", "Clothing")],
  [
    stringParam("item_id", "SKU_12345"),
    stringParam("item_name", "jeggings"),
    numberParam("quantity", 1),
    stringParam("affiliation", "Google Store"),
    stringParam("coupon", "SUMMER_FUN"),
    numberParam("discount", 2.22),
    numberParam("index", 5),
    stringParam("item_brand", "Gucci"),
    stringParam("item_category", "pants"),
    stringParam("item_list_name", "Related products"),
    stringParam("item_list_id", "related_products"),
    stringParam("item_variant", "Black"),
    numberParam("price", 9.99),
    stringParam("currency", "USD"),
  ]
)

export const suggestedEventFor = (eventType: EventType): Event2 => {
  switch (eventType) {
    case EventType.CustomEvent:
      return custom_event

    case EventType.AddPaymentInfo:
      return add_payment_info
    case EventType.AddShippingInfo:
      return add_shipping_info
    case EventType.AddToCart:
      return add_to_cart
    case EventType.AddToWishlist:
      return add_to_wishlist
    case EventType.BeginCheckout:
      return begin_checkout
    case EventType.EarnVirtualCurrency:
      return earn_virtual_currency
    case EventType.GenerateLead:
      return generate_lead
    case EventType.JoinGroup:
      return join_group
    case EventType.LevelUp:
      return level_up
    case EventType.Login:
      return login
    case EventType.PostScore:
      return post_score
    case EventType.Purchase:
      return purchase
    case EventType.Refund:
      return refund
    case EventType.RemoveFromCart:
      return remove_from_cart
    case EventType.Search:
      return search
    case EventType.SelectContent:
      return select_content
    case EventType.SelectItem:
      return select_item
    case EventType.SelectPromotion:
      return select_promotion
    case EventType.Share:
      return share
    case EventType.SignUp:
      return sign_up
    case EventType.SpendVirtualCurrency:
      return spend_virtual_currency
    case EventType.TutorialBegin:
      return tutorial_begin
    case EventType.TutorialComplete:
      return tutorial_complete
    case EventType.UnlockAchievement:
      return unlock_achievement
    case EventType.ViewCart:
      return view_cart
    case EventType.ViewItem:
      return view_item
    case EventType.ViewItemList:
      return view_item_list
    case EventType.ViewPromotion:
      return view_promotion
    case EventType.ViewSearchResults:
      return view_search_results

    default:
      throw new Error(`Unsupported event type: ${eventType}`)
  }
}

const events = Object.values(EventType).map(eventType =>
  suggestedEventFor(eventType)
)

export const eventsForCategory = (category: Category) =>
  events.filter(event => event.categories.find(c => c === category))
