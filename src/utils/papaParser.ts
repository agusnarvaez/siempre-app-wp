import Papa from 'papaparse'

export function parseCSVFile(file: File): Promise<string[][]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      skipEmptyLines: true,
      delimitersToGuess: [',', ';'],
      complete: (results) => {
        resolve(results.data as string[][])
      },
      error: (err) => {
        reject(new Error(err.message))
      },
    })
  })
}

// Compatibilidad temporal ante imports antiguos con typo de casing.
export const parseCSVFIle = parseCSVFile
