import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import NotFound from '../NotFound'

describe('NotFound', () => {
  it('muestra mensaje 404', { timeout: 15000 }, () => {
    render(<NotFound />)
    expect(screen.getByRole('heading', { name: /404 Not Found/i })).toBeTruthy()
  })
})
