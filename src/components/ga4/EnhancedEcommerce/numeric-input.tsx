import * as React from "react"
import {MdArrowDropDown, MdArrowDropUp} from "react-icons/md"
import {decrement, increment, input, wrap} from "./numeric-input.module.css"
import {ChangeEvent, MouseEventHandler} from 'react';

interface Props {
  onIncrement: MouseEventHandler<HTMLButtonElement>,
  onDecrement: MouseEventHandler<HTMLButtonElement>,
  onChange: (event: ChangeEvent<HTMLInputElement>) => void,
  disabled: boolean,
  value: number,
  min: string,
  max: string
}
export function NumericInput(props: Props) {
    return (
        <div className={wrap}>
            <input
                disabled={props.disabled}
                type="numeric"
                className={input}
            />
            <button
                disabled={props.disabled}
                className={increment}
                aria-label="Increment"
                onClick={props.onIncrement}
            >
                <span>+</span>
                <MdArrowDropUp/>
            </button>
            <button
                disabled={props.disabled}
                className={decrement}
                aria-label="Decrement"
                onClick={props.onDecrement}
            >
                <span>-</span>
                <MdArrowDropDown/>
            </button>
        </div>
    )
}