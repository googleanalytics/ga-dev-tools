import * as React from "react"
import {StoreContext} from "./store-context"
import {CartButton} from "./cart-button"
import {Navigation} from "./navigation"

import {container, header, nav,} from "./header.module.css"

export function Header() {
    const {cart} = React.useContext(StoreContext)

    const items = cart ? cart : []

    const quantity = items.reduce((total, item) => {
        return total + item.quantity
    }, 0)

    return (

        <div className={container}>
            <header className={header}>
                <Navigation className={nav}/>
                <CartButton quantity={quantity}/>
            </header>
        </div>
    )
}
