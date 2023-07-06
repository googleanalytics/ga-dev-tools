import * as React from "react"
import {ProductCard} from "./product-card"
import {listingContainerStyle} from "./product-listing.module.css"
import {StoreContext, Product} from "@/components/ga4/EnhancedEcommerce/store-context";

interface ProductListingProps {
    products: Product[]
}

export function ProductListing({products}: ProductListingProps) {
    const {addEvent} = React.useContext(StoreContext)

    React.useEffect(() => {
        const items = products.map( (product, i) => {
            return `    {
        "item_id": "${product.id}",
        "item_name": "${product.title}",
        "price": "${product.price}",
        "item_brand": "${product.brand}",
        "item_category": "${product.category}",
        "list_name": "Search Results",
        "list_position": ${i},
    }`
        }).join(",\n")
        const snippet = `gtag("event",  "view_item_list",  {
  "items": [${items}]
});`
        addEvent('view_item_list', 'View items list (search result).', snippet)


    }, [products, addEvent]);
    return (
        <div className={listingContainerStyle}>
            {products.map((p) => (
                <ProductCard product={p} key={p.id}/>
            ))}
        </div>
    )
}
