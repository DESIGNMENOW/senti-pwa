import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'

import appCss from '../styles.css?url'

import { useEffect } from 'react'

import {
  registerServiceWorker,
} from '#/lib/register-service-worker'


export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1',
      },
      {
        title: 'Senti',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  component: RootComponent,
})

function RootComponent() {
  useEffect(() => {
    registerServiceWorker()
  }, [])
  return (
    <html lang="de">
      <head>
        <HeadContent />
      </head>

      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  )
}
