"use client"

import { useState, useEffect } from "react"
import BarraLatEsq from "@/app/ui/barralatesq"
import BarraLatDir from "@/app/ui/barralatdir"
import { FileText, Download } from "lucide-react"

interface Manual {
    id: string
    titulo: string
    categoria: string
    arquivo: string
}

export default function ManuaisAluno() {
    const [manuais, setManuais] = useState<Manual[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchManuais = async () => {
            try {
                const response = await fetch("/api/manuais/aluno")
                if (!response.ok) throw new Error("Erro ao carregar manuais")
                const data = await response.json()
                setManuais(data)
            } catch (error) {
                console.error("Erro ao carregar manuais:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchManuais()
    }, [])

    const handleDownload = async (manualId: string) => {
        try {
            const response = await fetch(`/api/manuais/download/${manualId}`)
            if (!response.ok) throw new Error("Erro ao baixar manual")
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `manual-${manualId}.pdf`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
        } catch (error) {
            console.error("Erro ao baixar manual:", error)
            alert("Erro ao baixar o manual")
        }
    }

    return (
        <main className="p-2 flex h-screen bg-sky-700 justify-between items-center">
            <BarraLatEsq userRole="aluno" />
            <div className="flex flex-col p-8 text-black w-3/5 h-5/6 items-center rounded-lg bg-slate-200 overflow-auto">
                <h1 className="text-2xl font-bold mb-6">Manuais</h1>

                {loading ? (
                    <div>Carregando manuais...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        {manuais.map((manual) => (
                            <div key={manual.id} className="bg-white p-6 rounded-lg shadow-md">
                                <div className="flex items-center gap-4 mb-4">
                                    <FileText className="h-8 w-8 text-blue-600" />
                                    <div>
                                        <h3 className="font-semibold">{manual.titulo}</h3>
                                        <p className="text-sm text-gray-600">{manual.categoria}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDownload(manual.id)}
                                    className="flex items-center justify-center w-full gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Download className="h-4 w-4" />
                                    Download
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <BarraLatDir userRole="aluno" />
        </main>
    )
}


