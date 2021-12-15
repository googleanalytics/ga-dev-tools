import * as React from "react"

const defaultValues = {
    cart: [],
    lastCart: [],
    events: [],
    isOpen: false,
    onOpen: () => {
    },
    onClose: () => {
    },
    addEvent: () => {
    },
    addVariantToCart: () => {
    },
    removeCartItem: () => {
    },
    updateCartItem: () => {
    },
    getCartSubtotal: () => {
    },
    checkoutState: {
        email: '',
        shippingAddress: {
            firstName: '',
            lastName: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            provinceState: '',
            country: '',
            zipCode: ''
        },
        shippingMethod: '',
        billingAddress: {
            firstName: '',
            lastName: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            provinceState: '',
            country: '',
            zipCode: ''
        },
        coupon: '',
        paymentMethod: ''
    }
}

export const StoreContext = React.createContext(defaultValues)

export const StoreProvider = ({children}) => {
    const [cart, setCart] = React.useState(defaultValues.cart)
    const [lastCart, setLastCart] = React.useState(defaultValues.lastCart)

    const [checkoutState, setCheckoutState] = React.useState(defaultValues.checkoutState)
    const [events, setEvents] = React.useState(defaultValues.events)
    const [didJustAddToCart, setDidJustAddToCart] = React.useState(false)

    const addEvent = (name, description, snippet) => {
        const key = events.length
        const timestamp = new Intl.DateTimeFormat('default', {

            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false,
        }).format(Date.now())

        const newEvents = [{
            key,
            timestamp,
            name,
            description,
            snippet
        }].concat(events);
        setEvents(newEvents);
    }
    const addVariantToCart = (product, variantId, quantity) => {
        const id = cart.length;
        const cartItems = [
            {
                id,
                product,
                variantId,
                quantity: parseInt(quantity, 10),
            },
        ]
        const newCart = cart.concat(cartItems)
        setCart(newCart)
        setDidJustAddToCart(true)
        setTimeout(() => setDidJustAddToCart(false), 3000)
    }

    const removeLineItem = (id) => {
        const newCart = cart.filter(item => item.id !== id);
        setCart(newCart)
    }

    const updateLineItem = (id, quantity) => {
        const newCart = [ ...cart]
        const item = newCart.find(item => item.id === id);
        if( item )
        {
            item.quantity = parseInt(quantity, 10);
        }
        setCart(newCart);
    }

    const getCartSubtotal = () => {
        return cart.reduce((sum,x)  => sum + Number(x.product.price) * x.quantity, 0);
    }

    const updateCheckoutState = (name, value) =>
    {
        const newCheckoutState = { ...checkoutState };
        newCheckoutState[name] = value;
        setCheckoutState(newCheckoutState);
    }

    const updateShippingAddress = (name, value) =>
    {
        const newCheckoutState = { ...checkoutState };
        newCheckoutState.shippingAddress[name] = value;
        setCheckoutState(newCheckoutState);
    }

    const updateBillingAddress = (name, value) =>
    {
        const newCheckoutState = { ...checkoutState };
        newCheckoutState.billingAddress[name] = value;
        setCheckoutState(newCheckoutState);
    }

    const emptyCart = () =>
    {
        const cartSnapshot = [ ...cart ];
        setCart([]);
        setLastCart(cart)
        return cartSnapshot;
    }

    return (
        <StoreContext.Provider
            value={{
                ...defaultValues,
                addEvent,
                addVariantToCart,
                removeLineItem,
                updateLineItem,
                getCartSubtotal,
                didJustAddToCart,
                cart,
                checkoutState,
                updateCheckoutState,
                updateShippingAddress,
                updateBillingAddress,
                emptyCart,
                lastCart,
                events
            }}
        >
            {children}
        </StoreContext.Provider>
    )
}
