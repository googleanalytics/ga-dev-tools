import * as React from "react"
import {graphql, PageProps} from "gatsby"

import Layout from "@/components/Layout"
import {Header} from "@/components/ga4/EnhancedEcommerce/header";
import {Footer} from "@/components/ga4/EnhancedEcommerce/footer";
import {AddToCart} from "@/components/ga4/EnhancedEcommerce/add-to-cart"
import {NumericInput} from "@/components/ga4/EnhancedEcommerce/numeric-input"
import {GatsbyImage, GatsbyImageProps, IGatsbyImageData} from "gatsby-plugin-image";
import {
    productBox,
    container,
    header,
    productImageWrapper,
    priceValue,
    addToCartStyle,
    productDescription,
} from "./product-page.module.css"
import {ChangeEvent} from 'react';

type ImageInfo = GatsbyImageProps & {
    childImageSharp: {gatsbyImageData: IGatsbyImageData};
}
type Props = {
    location: { pathname: string },
        productsJson: {
            id: number
            brand: string
            category: string
            price: string,
            title: string,
            description: string,
            image: ImageInfo
        }

}

export default (props: PageProps<Props>) => {
    const {
        price,
        title,
        description,
        image,
    } = props.data.productsJson
    const initialVariant = 'M'
    const [variant, setVariant] = React.useState(initialVariant)
    const productVariant = variant;
    const [quantity, setQuantity] = React.useState(1)
    return (
        <Layout
            title="Enhanced Ecommerce Demo"
            pathname={props.location.pathname}
            description=""
        >
            <Header/>
            <div className={container}>
                <div className={productBox}>
                    <div className={productImageWrapper}>
                        <div
                            aria-label="gallery"
                            aria-describedby="instructions"
                        >
                            <GatsbyImage objectFit="contain"
                                         alt={title}
                                         image={image!.childImageSharp!.gatsbyImageData}/>
                        </div>
                    </div>
                    <div>
                        <h1 className={header}>{title}</h1>
                        <p className={productDescription}>{description}</p>
                        <h2 className={priceValue}>
                            <span>${price}</span>
                        </h2>
                        <div className={addToCartStyle}>
                            <NumericInput
                                aria-label="Quantity"
                                onIncrement={() => setQuantity((q) => Math.min(q + 1, 20))}
                                onDecrement={() => setQuantity((q) => Math.max(1, q - 1))}
                                onChange={(event: ChangeEvent<HTMLInputElement>) => setQuantity(parseInt(event.currentTarget.value))}
                                value={quantity}
                                disabled={false}
                                min="1"
                                max="20"
                            />
                            <AddToCart
                                variantId={productVariant}
                                quantity={quantity}
                                product={props.data.productsJson}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </Layout>
    )
}

export const query = graphql`
query($id: String!) {
     productsJson(id: { eq: $id }) { 
            id
            title
            price
            brand
            category
            description
            image {
                childImageSharp {
                    gatsbyImageData(width: 640)
                }
            }
            thumbnail: 
            image {
                childImageSharp {
                    gatsbyImageData(width: 100)
                }
            }
                 }
}
`