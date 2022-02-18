import * as React from "react"
import {MdArrowDropDown, MdArrowDropUp} from "react-icons/md"
import {decrement, increment, input, wrap} from "./numeric-input.module.css"

export function NumericInput({
                                 onIncrement,
                                 onDecrement,
                                 disabled,
                                 ...props
                             }) {
    return (
        <div className={wrap}>
            <input
                disabled={disabled}
                type="numeric"
                className={input}
                {...props}
            />
            <button
                disabled={disabled}
                className={increment}
                aria-label="Increment"
                onClick={onIncrement}
            >
                <span>+</span>
                <MdArrowDropUp/>
            </button>
            <button
                disabled={disabled}
                className={decrement}
                aria-label="Decrement"
                onClick={onDecrement}
            >
                <span>-</span>
                <MdArrowDropDown/>
            </button>
        </div>
    )
}