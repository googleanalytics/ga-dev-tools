import * as React from "react"
import {Link} from "gatsby"
import {badge, cartButton} from "./cart-button.module.css"
import {MdShoppingCart} from 'react-icons/md';
import IconButton from "@mui/material/IconButton"

interface Props
{
    quantity:number
}
export function CartButton(props:Props) {
    return (
        <Link
            aria-label={`Shopping Cart with ${props.quantity} items`}
            to="/ga4/enhanced-ecommerce/cart"
            className={cartButton}
        >
            <IconButton>
                <MdShoppingCart/>
            </IconButton>
            {props.quantity > 0 && <div className={badge}>{props.quantity}</div>}
        </Link>
    )
}
