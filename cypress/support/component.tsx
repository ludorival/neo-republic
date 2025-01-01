// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')
import "../../src/app/globals.css";
import { mount } from '@cypress/react18'
import { NextIntlClientProvider } from 'next-intl'
import { NextUIProvider } from '@nextui-org/react'
import messages from '../../messages/fr.json'
import { RouterProvider } from './RouterProvider'
import Layout from '@/app/components/Layout';
import * as repositories from '@/infra/firebase/firestore'
import { UserProvider } from '@/app/contexts/UserContext';
import { User } from '@/domain/models/user';
interface MountOptions {
  router?: {
    push?: () => void
    replace?: () => void
    back?: () => void
    forward?: () => void
    refresh?: () => void
    prefetch?: () => void,
    params?: {
      id?: string
    }
  },
  currentUser?: User
}

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount & ((component: React.ReactNode, options?: MountOptions) => Cypress.Chainable)
    }
  }
}

// Override the existing mount command
Cypress.Commands.add('mount', (component, options: MountOptions = {}) => {
  const { router = {} } = options

  // Clear mock data and create fresh stubs before each mount

  // Create router stubs for this test
  const routerStubs = {
    push: cy.stub().as('routerPush'),
    replace: cy.stub().as('routerReplace'),
    back: cy.stub().as('routerBack'),
    forward: cy.stub().as('routerForward'),
    refresh: cy.stub().as('routerRefresh'),
    prefetch: cy.stub().as('routerPrefetch'),
    ...router
  }
  
  cy.stub(repositories.users, 'read').as('readUser').returns(Promise.resolve(options.currentUser))
  cy.stub(repositories.users, 'create').as('createUser').returns(Promise.resolve())
  cy.stub(repositories.users, 'update').as('updateUser').returns(Promise.resolve())
  return mount(
    <NextUIProvider>
      <NextIntlClientProvider messages={messages} locale="fr">
        <RouterProvider router={routerStubs}>
          <UserProvider>
            <Layout>
              {component}
            </Layout>
          </UserProvider>
        </RouterProvider>
      </NextIntlClientProvider>
    </NextUIProvider>
  )
})


// Example use:
// cy.mount(<MyComponent />)