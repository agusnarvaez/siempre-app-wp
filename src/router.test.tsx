import { describe, expect, it } from 'vitest'
import { router } from './router'

describe('router configuration', () => {
  it('define rutas principales del flujo', () => {
    const rootRoute = router.routes[0]

    expect(rootRoute.path).toBe('/')
    expect(rootRoute.children?.length).toBe(2)
    expect(rootRoute.children?.some((route) => route.path === '/')).toBe(true)
    expect(rootRoute.children?.some((route) => route.path === '/tabla-de-paquetes')).toBe(true)
  })
})
