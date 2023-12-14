// Copyright 2022 Google Inc. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as React from "react"

import Layout from "@/components/Layout"
import {graphql} from "gatsby";
import {Header} from "@/components/ga4/EnhancedEcommerce/header";
import {ProductListing} from "@/components/ga4/EnhancedEcommerce/product-listing";
import {Footer} from "@/components/ga4/EnhancedEcommerce/footer";
import {Product} from "@/components/ga4/EnhancedEcommerce/store-context";
interface AllProductsJson {
  nodes: Product[]
}

interface Props {
  location: { pathname: string },
  data: { allProductsJson: AllProductsJson }
}

export default (props: Props) => {
  return (
      <Layout
          title="Enhanced Ecommerce Demo"
          pathname={props.location.pathname}
          description=""
      >
        <Header/>
        <ProductListing products={props.data.allProductsJson.nodes}/>
        <Footer/>
      </Layout>
  )
}

export const query = graphql`
  query {
     allProductsJson {
        nodes {
            id
            title
            price
            brand
            category
            slug: gatsbyPath(
             filePath: "/ga4/enhanced-ecommerce/products/{ProductsJson.title}"
            )
            image: image {
                childImageSharp {
                    gatsbyImageData(width: 400)
                }
            }
        }
     }
  }
`