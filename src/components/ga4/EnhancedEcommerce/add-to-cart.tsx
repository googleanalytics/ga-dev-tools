import * as React from "react"
import {addToCart as addToCartStyle} from "./add-to-cart.module.css"
import {StoreContext} from "./store-context"

export function AddToCart({variantId, quantity, product}) {
    const {addVariantToCart, addEvent} = React.useContext(StoreContext)

    function addToCart(e) {
        e.preventDefault()
        const snippet = `gtag("event",  "add_to_cart",  {
  "currency": "USD",
  "value": ${product.price * quantity},
  "items": [{
    "item_id": "${product.id}",
    "item_name": "${product.title}",
    "price": "${product.price}",
    "item_brand": "${product.brand}",
    "item_category": "${product.category}",
    "index": 0,
    "size": "M"
  }]
});`
        addEvent('add_to_cart', 'Item(s) added to cart.', snippet)
        addVariantToCart(product, variantId, quantity)
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