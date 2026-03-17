![logo-siempre](<./src/assets/logos/logo-siempre.png>)
# Gestión de avisos Siempre :package: :truck:
[![QA](https://github.com/agusnarvaez/siempre-app-wp/actions/workflows/qa.yml/badge.svg)](https://github.com/agusnarvaez/siempre-app-wp/actions/workflows/qa.yml)
[![Build](https://img.shields.io/github/actions/workflow/status/agusnarvaez/siempre-app-wp/qa.yml?branch=main&label=build)](https://github.com/agusnarvaez/siempre-app-wp/actions/workflows/qa.yml)
[![codecov](https://codecov.io/gh/agusnarvaez/siempre-app-wp/branch/main/graph/badge.svg)](https://codecov.io/gh/agusnarvaez/siempre-app-wp)

## Descripción :page_facing_up:
La aplicación de gestión de avisos de entregas de paquetes al cliente para Siempre Logística es una app web que permite a los administradores de Siempre subir un archivo CSV con los datos de los paquetes a entregar, y la aplicación se encarga de generar los links de whatsapp con sus respectivos mensajes para que los clientes puedan ser notificados de la entrega de su paquete.
## Requerimientos :gear:
- Node v22.0.0
- NPM v11.1.0

## Instalación  :inbox_tray:
1. Clonar el repositorio
```bash
git clone https://github.com/agusnarvaez/siempre-app-wp
```
2. Instalar las dependencias
  ```bash
  npm install
  ```
3. Iniciar la aplicación
  ```bash
  npm run dev
  ```

## Uso :computer:
1. Ingresar a la aplicación en el navegador
2. Seleccionar el archivo UTF-8 CSV con los datos de los paquetes.
   - Si el archivo no es UTF-8, la aplicación no podrá leerlo.
   - El archivo debe tener la siguiente estructura:
     ```
     Nombre,Apellido,Telefono,Direccion,Localidad,Provincia
     ```
     Ejemplo:
     ```
     Agustin,Narvaez,1123456789,Calle 123,Localidad,Provincia
     ```
   - Si el archivo contiene errores, la aplicación no podrá leerlo y se mostrará un mensaje de error con los detalles.

3. Hacer click en el botón "Avanzar" para procesar el CSV.
4. La aplicación mostrará la tabla con acciones por paquete para notificar y enviar mensaje de posventa.

## Calidad y Tests :white_check_mark:

Scripts disponibles:

```bash
npm run test
npm run test:watch
npm run test:coverage
npm run test:e2e
```

Cobertura inicial objetivo (iteración 1):

- Statements: 80%
- Branches: 80%
- Functions: 80%
- Lines: 80%
- Política: evaluación por archivo (`perFile`) en Vitest.

Estrategia de automatización:

- Unit tests para utilidades y servicios.
- Integration tests para componentes críticos del flujo.
- E2E smoke test para validar el camino principal del usuario.
