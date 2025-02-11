import { lazy } from "react"
import { createBrowserRouter } from "react-router-dom"
const PackagesForm = lazy(() => import('./components/pages/PackagesForm'))
const PackagesTable = lazy(() => import('./components/pages/PackagesTable'))
const NotFound = lazy(() => import('./components/pages/NotFound'))
const Main = lazy(() => import('./components/pages/Main'))
export const router = createBrowserRouter([
    {
        path: "/",
        element: <Main/>,
        errorElement: <NotFound/>,
        children: [
            { path: "/", element: <PackagesForm/> },
            { path: "/tabla-de-paquetes", element: <PackagesTable/> }
        ]
    }
])