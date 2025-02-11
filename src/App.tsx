import { Suspense } from 'react'
import './App.css'
import { RouterProvider } from 'react-router-dom'
import { CSVProvider } from './context/CSVContext';
import { router } from './router';

// Importar PackagesForm de manera lazy

function App() {

  return (
    <CSVProvider>
        <Suspense fallback={<h1>Cargando...</h1>}>
            <RouterProvider router={router} />
        </Suspense>
    </CSVProvider>
  )
}

export default App
