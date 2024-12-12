import React from 'react'
import Home from './page'
import { NextIntlClientProvider } from 'next-intl'
import { NextUIProvider } from '@nextui-org/react'
import messages from '../../messages/fr.json'

describe('<Home />', () => {
  it('renders', () => {
    cy.mount(
      <NextUIProvider>
        <NextIntlClientProvider messages={messages} locale="fr">
          <Home />
        </NextIntlClientProvider>
      </NextUIProvider>
    )
  })
})