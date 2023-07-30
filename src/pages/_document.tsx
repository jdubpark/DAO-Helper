import { ServerStyleSheets } from '@mui/styles'
import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'

import { generateCsp } from '@/utils/misc'

const meta = {
  title: 'DAO Helper',
  description: 'Easy-to-read stats for DAO proposals',
}

export default function MyDocument() {
  const [csp, nonce] = generateCsp()

  return (
    <Html lang="en">
      <Head>
        <meta name="robots" content="follow, index" />
        <meta name="description" content={meta.description} />
        {/* PWA primary color */}
        {/* <meta name='theme-color' content={theme.palette.primary.main} /> */}
        <meta property="csp-nonce" content={nonce} />
        <meta httpEquiv="Content-Security-Policy" content={csp} />
      </Head>
      <body>
        <Main />
        <NextScript nonce={nonce} />
      </body>
    </Html>
  )
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
MyDocument.getInitialProps = async (ctx: any) => {
  const sheets = new ServerStyleSheets()
  const originalRenderPage = ctx.renderPage

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App: any) => (props: any) =>
        sheets.collect(<App {...props} />),
    })

  const initialProps = await Document.getInitialProps(ctx)

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [
      ...React.Children.toArray(initialProps.styles),
      sheets.getStyleElement(),
    ],
  }
}
