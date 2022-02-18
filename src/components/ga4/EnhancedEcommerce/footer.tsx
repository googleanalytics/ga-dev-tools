import * as React from "react"
import {footerStyle, gaConsole} from "./footer.module.css"
import {GaConsole} from "@/components/ga4/EnhancedEcommerce/ga-console";

export function Footer() {
    return (
        <footer className={footerStyle}>
            <GaConsole className={gaConsole}/>
        </footer>
    )
}
