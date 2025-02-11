"use client"

import { useState, useEffect } from "react"
import BarraLatEsq from "@/app/ui/barralatesq"
import BarraLatDir from "@/app/ui/barralatdir"
import { FileText } from "lucide-react"

interface Manual {
    id: string
    title: string
    filename: string
    category: string
}

export default function Manuais({ userRole }: { userRole: string }) {
    const [manuais, setManuais] = useState<Manual[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const mockManuais = [
            { id: "1", title: "Manual de Operações", filename: "manual-operacoes.pdf", category: "Operacional" },
            { id: "2", title: "Manual de Segurança", filename: "manual-seguranca.pdf", category: "Segurança" },
            { id: "3", title: "Manual de Manutenção", filename: "manual-manutencao.pdf", category: "Manutenção" },
            { id: "4", title: "Manual do Aluno", filename: "manual-aluno.pdf", category: "Treinamento" },
        ]
        setManuais(mockManuais)
        setLoading(false)
    }, [])

    const handleDownload = (filename: string) => {
        console.log(`Downloading ${filename}`)
    }

    return (
        <main className="p-2 flex h-screen bg-sky-700 justify-between items-center">
            <BarraLatEsq userRole={userRole} />
            <div className="flex flex-col p-8 text-black w-3/5 h-5/6 items-center rounded-lg bg-slate-200 overflow-auto">
                <h1 className="text-2xl font-bold mb-6">Manuais Técnicos</h1>

                {loading ? (
                    <div>Carregando manuais...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        {manuais.map((manual) => (
                            <div key={manual.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                                <div className="flex items-center gap-3">
                                    <FileText className="h-8 w-8 text-blue-600" />
                                    <div className="flex-1">
                                        <h3 className="font-semibold">{manual.title}</h3>
                                        <p className="text-sm text-gray-600">{manual.category}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDownload(manual.filename)}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        Download
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <BarraLatDir userRole={userRole} />
        </main>
    )
}


