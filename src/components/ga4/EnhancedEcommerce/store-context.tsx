import * as React from "react"
import {ReactNode} from 'react';
import {GatsbyImageProps, IGatsbyImageData} from 'gatsby-plugin-image';

interface GAEvent {
  key: number
  timestamp: string
  name: string
  description: string
  snippet: string
}

type ImageInfo = GatsbyImageProps & {
  childImageSharp: {gatsbyImageData: IGatsbyImageData};
}

export interface Product {
  id: number
  title: string
  brand: string
  variant?: string
  category: string
  price: string
  slug?: string
  image: ImageInfo
  thumbnail?: ImageInfo
}

export interface CartItem {
  id: number
  product: Product
  variantId: string
  quantity: number
}

interface PostalAddress {
  firstName: string
  lastName: string
  addressLine1: string
  addressLine2: string
  city: string
  provinceState: string
  zipPostalCode: string
  country: string
}

interface CheckoutState {
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
  emptyCart: () => {
    return []
  }
}


export const StoreContext = React.createContext(defaultValues)

type Props = {
  children: ReactNode
}

export const StoreProvider = (props: Props) => {
  const [cart, setCart] = React.useState(defaultValues.cart)
  const [lastCart, setLastCart] = React.useState(defaultValues.lastCart)

  const [checkoutState, setCheckoutState] = React.useState(defaultValues.checkoutState)
  const [events, setEvents] = React.useState(defaultValues.events)

  const addEvent = (name: string, description: string, snippet: string) => {
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
  const addVariantToCart = (product: Product, variantId: string, quantity: number) => {
    const id = cart.length;
    const cartItems:CartItem[] = [
      {
        id,
        product,
        variantId,
        quantity: quantity,
      },
    ]
    const newCart = cart.concat(cartItems)
    setCart(newCart)
  }

  const removeLineItem = (id: number) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart)
  }

  const updateLineItem = (id: number, quantity: number) => {
    const newCart = [...cart]
    const item = newCart.find(item => item.id === id);
    if (item) {
      item.quantity = quantity;
    }
    setCart(newCart);
  }

  const getCartSubtotal = () => {
    return cart.reduce((sum, x) => sum + parseInt(x.product.price) * x.quantity, 0);
  }

  const emptyCart = () => {
    const cartSnapshot = [...cart];
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
            emptyCart,
            cart,
            checkoutState,
            lastCart,
            events
          }}
      >
        {props.children}
      </StoreContext.Provider>
  )
}
