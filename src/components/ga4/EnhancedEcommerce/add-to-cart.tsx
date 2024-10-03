import * as React from "react"
import {addToCart as addToCartStyle} from "./add-to-cart.module.css"
import {Product, StoreContext} from "./store-context"

interface Props {
  variantId: string,
  quantity: number,
  product: Product
}

export function AddToCart(props: Props) {
  const {addVariantToCart, addEvent} = React.useContext(StoreContext)

  function addToCart(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault()
    const snippet = `gtag("event",  "add_to_cart",  {
  "currency": "USD",
  "value": ${parseInt(props.product.price) * props.quantity},
  "items": [{
    "item_id": "${props.product.id}",
    "item_name": "${props.product.title}",
    "price": "${props.product.price}",
    "item_brand": "${props.product.brand}",
    "item_category": "${props.product.category}",
    "index": 0,
    "size": "M"
  }]
});`
    addEvent('add_to_cart', 'Item(s) added to cart.', snippet)
    addVariantToCart(props.product, props.variantId, props.quantity)
  }

  return (
      <button
          type="submit"
          className={addToCartStyle}
          onClick={addToCart}
      >
        Add to Cart
      </button>
  )
}