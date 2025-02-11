// src/context/CSVContext.tsx
import React, { createContext, useState } from 'react'

// Define la estructura de los datos que vas a manejar
export interface CSVRowData {
  Codigo: string
  Cliente: string
  Servicio: string
  Destinatario: string
  Telefono: string
  Direccion: string
  Referencia: string
  Bultos: string
  VisitaEstimada: string
  Estado: string
  timeRange: number
}

// Interfaz del Context: qué datos y setters expone
interface CSVContextProps {
  csvData: CSVRowData[]
  setCSVData: React.Dispatch<React.SetStateAction<CSVRowData[]>>
}

export const CSVContext = createContext<CSVContextProps>({} as CSVContextProps)

export const CSVProvider = ({ children }: { children: React.ReactNode }) => {
  const [csvData, setCSVData] = useState<CSVRowData[]>([])

  return (
    <CSVContext.Provider value={{ csvData, setCSVData }}>
      {children}
    </CSVContext.Provider>
  )
}
