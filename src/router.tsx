import { createBrowserRouter } from "react-router-dom"
import PackagesForm from './components/pages/PackagesForm'
import PackagesTable from './components/pages/PackagesTable'
import NotFound from './components/pages/NotFound'
import Main from './components/pages/Main'
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