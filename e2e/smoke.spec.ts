import { test, expect } from '@playwright/test'

test('muestra pantalla principal', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('button', { name: /cargar archivo csv o excel/i })).toBeVisible()
  await expect(page.getByLabel(/rango horario/i)).toBeVisible()
})
