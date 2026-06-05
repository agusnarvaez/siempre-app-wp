![logo-siempre](<./src/assets/logos/logo-siempre.png>)
# Gestion de avisos Siempre :package: :truck:

[![QA](https://github.com/agusnarvaez/siempre-app-wp/actions/workflows/qa.yml/badge.svg)](https://github.com/agusnarvaez/siempre-app-wp/actions/workflows/qa.yml)
[![Build](https://img.shields.io/github/actions/workflow/status/agusnarvaez/siempre-app-wp/qa.yml?branch=main&label=build)](https://github.com/agusnarvaez/siempre-app-wp/actions/workflows/qa.yml)
[![codecov](https://codecov.io/gh/agusnarvaez/siempre-app-wp/branch/main/graph/badge.svg)](https://codecov.io/gh/agusnarvaez/siempre-app-wp)

## Descripcion :page_facing_up:

La aplicacion de gestion de avisos de entregas de paquetes para Siempre Logistica permite subir un archivo CSV o Excel con los datos de los paquetes y genera links de WhatsApp con mensajes personalizados para notificar entregas y enviar posventa.

## Requerimientos :gear:

- Node v22.0.0
- NPM v11.1.0

## Instalacion :inbox_tray:

1. Clonar el repositorio
```bash
git clone https://github.com/agusnarvaez/siempre-app-wp
```

2. Instalar las dependencias
```bash
npm install
```

3. Iniciar la aplicacion
```bash
npm run dev
```

## Uso :computer:

1. Ingresar a la aplicacion en el navegador.
2. Seleccionar un archivo `.csv` o `.xlsx`.
3. Para el formato generico Excel, la columna `CORREO` se interpreta como `Rango Horario` en la UI.
4. Hacer click en el boton "Avanzar" para procesar el archivo.
5. La aplicacion mostrara la tabla con acciones por paquete para notificar y enviar mensaje de posventa.

## Calidad y Tests :white_check_mark:

Scripts disponibles:

```bash
npm run test
npm run test:watch
npm run test:coverage
npm run test:e2e
```

Cobertura inicial objetivo:

- Statements: 80%
- Branches: 80%
- Functions: 80%
- Lines: 80%
- Politica: evaluacion por archivo (`perFile`) en Vitest.

Estrategia de automatizacion:

- Unit tests para utilidades y servicios.
- Integration tests para componentes criticos del flujo.
- E2E smoke test para validar el camino principal del usuario.
