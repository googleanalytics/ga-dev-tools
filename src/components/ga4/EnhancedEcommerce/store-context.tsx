import * as React from "react"

interface GAEvent
{
    key: number
    timestamp: string
    name: string
    description: string
    snippet: string
}

interface Product
{
    id: number
    title: string
    brand: string
    category: string
    price: number
}

interface CartItem
{
    id: number
    product: Product
    variantId: string
    quantity: number
}

interface PostalAddress
{
    firstName: string
    lastName: string
    addressLine1: string
    addressLine2: string
    city: string
    provinceState: string
    zipPostalCode: string
    country: string
}

interface CheckoutState
{
    email: string
    shippingAddress: PostalAddress
    billingAddress: PostalAddress
    paymentMethod: string
    shippingMethod: string
    coupon: string
}

interface StoreContextValues {
    events: GAEvent[]
    cart: CartItem[]
    lastCart: CartItem[]
    isOpen: boolean
    checkoutState: CheckoutState
    onOpen(): void
    onClose(): void
    addEvent(name: string, description: string, snippet: string): void
    addVariantToCart(product: Product, variantId: string,
                     quantity: number): void
    removeLineItem(id: number): void
    updateLineItem(id: number, quantity: number): void
    getCartSubtotal(): number
    updateCheckoutState(name: string, value: string|number): void
    updateShippingAddress(name: string, value: string|number): void
    updateBillingAddress(name: string, value: string|number): void
    emptyCart(): CartItem[]
}

const defaultValues: StoreContextValues = {
    cart: [],
    lastCart: [],
    events: [],
    isOpen: false,
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
            zipPostalCode: ''
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
            zipPostalCode: ''
        },
        coupon: '',
        paymentMethod: ''
    },
    onOpen: () => {
    },
    onClose: () => {
    },
    addEvent: () => {
    },
    addVariantToCart: () => {
    },
    removeLineItem: () => {
    },
    updateLineItem: () => {
    },
    getCartSubtotal: () => {
        return 0
    },
    updateCheckoutState: () => {
    },
    updateShippingAddress: () => {
    },
    updateBillingAddress: () => {
    },
    emptyCart: () => {
        return []
    }
}


export const StoreContext = React.createContext(defaultValues)

export const StoreProvider = ({children}) => {
    const [cart, setCart] = React.useState(defaultValues.cart)
    const [lastCart, setLastCart] = React.useState(defaultValues.lastCart)

    const [checkoutState, setCheckoutState] = React.useState(defaultValues.checkoutState)
    const [events, setEvents] = React.useState(defaultValues.events)

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
                updateCheckoutState,
                updateShippingAddress,
                updateBillingAddress,
                emptyCart,
                cart,
                checkoutState,
                lastCart,
                events
            }}
        >
            {children}
        </StoreContext.Provider>
    )
}
