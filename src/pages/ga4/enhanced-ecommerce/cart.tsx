// Copyright 2020 Google Inc. All rights reserved.
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
import {Header} from "@/components/ga4/EnhancedEcommerce/header";
import {Footer} from "@/components/ga4/EnhancedEcommerce/footer";

import {StoreContext} from '@/components/ga4/EnhancedEcommerce/store-context';
import {collapseColumn, emptyStateContainer, emptyStateHeading, grandTotal, imageHeader, labelColumn, productHeader, summary, table, title, totals, wrap,} from "./cart.module.css"

interface Props {
  location: { pathname: string },
}

export default (props: Props) => {
  const {cart, getCartSubtotal, addEvent} = React.useContext(StoreContext)

  const lineItems = React.useMemo( () => cart ? cart : [], [cart]);
  const emptyCart = cart.length === 0;

  const taxes = 0;
  const subtotal = getCartSubtotal();
  const grandTotalAmount = subtotal + taxes;

  React.useEffect(() => {
    const items = lineItems.map((item, i) => {
      const product = item.product;
      return `    {
        "item_id": "${product.id}",
        "item_name": "${product.title}",
        "price": "${product.price}",
        "item_brand": "${product.brand}",
        "item_category": "${product.category}",
    }`
    }).join(",\n")
    const snippet = `gtag("event",  "view_cart",  {
  "items": [${items}]
});`
    addEvent('view_cart', 'View cart.', snippet)


  }, [addEvent, lineItems]);
  return (
      <Layout
          title="Enhanced Ecommerce Demo"
          pathname={props.location.pathname}
          description=""
      >
        <Header/>
        <div className={wrap}>
          {emptyCart ? (
              <div className={emptyStateContainer}>
                <h1 className={emptyStateHeading}>Your cart is empty</h1>
              </div>
          ) : (
              <div>
                <h1 className={title}>Your cart</h1>
                <table className={table}>
                  <thead>
                  <tr>
                    <th className={imageHeader}>Image</th>
                    <th className={productHeader}>Product</th>
                    <th className={collapseColumn}>Price</th>
                    <th>Qty.</th>
                    <th className={[totals, collapseColumn].join(" ")}>Total</th>
                  </tr>
                  </thead>
                  <tbody>

                  <tr className={summary}>
                    <td className={collapseColumn}></td>
                    <td className={collapseColumn}></td>
                    <td className={collapseColumn}></td>
                    <td className={labelColumn}>Subtotal</td>
                    <td className={totals}>
                      ${subtotal}
                    </td>
                  </tr>
                  <tr className={summary}>
                    <td className={collapseColumn}></td>
                    <td className={collapseColumn}></td>
                    <td className={collapseColumn}></td>
                    <td className={labelColumn}>Taxes</td>
                    <td className={totals}>
                      ${taxes}
                    </td>
                  </tr>
                  <tr className={summary}>
                    <td className={collapseColumn}></td>
                    <td className={collapseColumn}></td>
                    <td className={collapseColumn}></td>
                    <td className={labelColumn}>Shipping</td>
                    <td className={totals}>Calculated at checkout</td>
                  </tr>
                  <tr className={grandTotal}>
                    <td className={collapseColumn}></td>
                    <td className={collapseColumn}></td>
                    <td className={collapseColumn}></td>
                    <td className={labelColumn}>Total Price</td>
                    <td className={totals}>
                      ${grandTotalAmount}
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
          )}
        </div>
        <Footer/>
      </Layout>
  )
}
