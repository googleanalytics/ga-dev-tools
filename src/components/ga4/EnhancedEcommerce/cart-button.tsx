import * as React from "react"
import {Link} from "gatsby"
import {badge, cartButton} from "./cart-button.module.css"
import {MdShoppingCart} from 'react-icons/md';
import IconButton from "@material-ui/core/IconButton"

export function CartButton({quantity}) {
    return (
        <Link
            aria-label={`Shopping Cart with ${quantity} items`}
            to="/ga4/enhanced-ecommerce/cart"
            className={cartButton}
        >
            <IconButton>
                <MdShoppingCart/>
            </IconButton>
            {quantity > 0 && <div className={badge}>{quantity}</div>}
        </Link>
    )
}
