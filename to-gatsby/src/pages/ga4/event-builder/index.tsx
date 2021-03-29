import * as React from "react"
import EventBuilder from "./_EventBuilder"
import Layout from "../../../components/layout"

export default () => {
  return (
    <Layout title="Event Builder" requireLogin>
      <EventBuilder />
    </Layout>
  )
}
