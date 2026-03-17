import { Suspense } from 'react'
import './App.css'
import { RouterProvider } from 'react-router-dom'
import { CSVProvider } from './context/CSVContext';
import { router } from './router';
import LoadingOverlay from './components/common/LoadingOverlay'
import ErrorBoundary from './components/common/ErrorBoundary'

// Importar PackagesForm de manera lazy

function App() {

  return (
    <ErrorBoundary>
      <CSVProvider>
          <Suspense fallback={<LoadingOverlay />}>
              <RouterProvider router={router} />
          </Suspense>
      </CSVProvider>
    </ErrorBoundary>
  )
}

export default App
