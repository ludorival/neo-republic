import { AppRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import React from 'react'

const defaultRouter = {
  back: () => {},
  forward: () => {},
  push: () => {},
  refresh: () => {},
  replace: () => {},
  prefetch: () => {},
  pathname: '/',
  route: '/',
  query: {},
  asPath: '/',
  basePath: '',
  isLocaleDomain: false,
  events: {
    emit: () => {},
    on: () => {},
    off: () => {}
  }
}

interface RouterProviderProps {
  children: React.ReactNode
  router?: Partial<typeof defaultRouter>
}

export const RouterProvider = ({ children, router = {} }: RouterProviderProps) => {
  const value = React.useMemo(
    () => ({
      ...defaultRouter,
      ...router,
    }),
    [router]
  )

  return (
    <AppRouterContext.Provider value={value}>
      {children}
    </AppRouterContext.Provider>
  )
} 