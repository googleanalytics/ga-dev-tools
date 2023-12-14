import * as React from "react"
import {Link} from "gatsby"
import {GatsbyImage} from "gatsby-plugin-image"

import {productCardStyle, productDetailsStyle, productHeadingStyle, productImageStyle, productPrice,} from "./product-card.module.css"
import {Product, StoreContext} from "@/components/ga4/EnhancedEcommerce/store-context";

interface Props {
    product: Product
}
export function ProductCard({product}: Props) {
    const {
        title,
        image,
        slug,
        price,
    } = product
    const {addEvent} = React.useContext(StoreContext)

    function selectProduct() {
        const snippet = `gtag("event",  "select_item",  {
  "currency": "USD",
  "item_list_name": "homepage",
  "item_list_id": "homepage",
  "items": [{
    "item_id": "${product.id}",
    "item_name": "${product.title}",
    "price": "${product.price}",
    "item_brand": "${product.brand}",
    "item_category": "${product.category}",
    "index": "${product.id}",
  }]
});`
        addEvent('select_item', 'An item was selected from a list.', snippet)
    }

    return (
        <Link
            className={productCardStyle}
            to={slug || ''}
            aria-label={`View ${title} product page`}
            onClick={selectProduct}
        >
            <div className={productImageStyle} data-name="product-image-box">
                <GatsbyImage alt={title}
                             image={image.childImageSharp.gatsbyImageData}/>
            </div>

            <div className={productDetailsStyle}>
                <h2 className={productHeadingStyle}>
                    {title}
                </h2>
                <div className={productPrice}>${price}</div>
            </div>
        </Link>
    )
}
