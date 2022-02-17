import {Link} from "gatsby"
import * as React from "react"
import {navStyle, navLink, activeLink} from "./navigation.module.css"

export function Navigation({className}) {
    return (
        <nav className={[navStyle, className].join(" ")}>
            <Link
                key="All"
                className={navLink}
                to="/ga4/enhanced-ecommerce"
                activeClassName={activeLink}
            >
                All products
            </Link>
        </nav>
    )
}
