import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Main from '../Main'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', () => ({
  Outlet: () => <div>Outlet content</div>,
  useNavigate: () => mockNavigate,
}))

describe('Main page layout', () => {
  it('renderiza header, outlet y navega al home al clickear el logo', () => {
    render(<Main />)

    expect(screen.getByText('Outlet content')).toBeTruthy()
    const logo = screen.getByAltText(/Logo Siempre/i)
    fireEvent.click(logo)

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })
})
