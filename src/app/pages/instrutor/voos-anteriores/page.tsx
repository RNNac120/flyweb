"use client"

import { useState, useEffect } from "react"
import BarraLatEsq from "@/app/ui/barralatesq"
import BarraLatDir from "@/app/ui/barralatdir"

interface Voo {
    id: number
    data: string
    aluno: string
    aviao: string
    modulo: string
    nota?: number
    status: "agendado" | "realizado" | "cancelado"
}

export default function VoosAnteriores() {
    const [voos, setVoos] = useState<Voo[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchVoos = async () => {
            try {
                const response = await fetch("/api/voos/instrutor")
                if (response.ok) {
                    const data = await response.json()
                    setVoos(data)
                }
            } catch (error) {
                console.error("Erro ao carregar voos:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchVoos()
    }, [])

    return (
        <main className="p-2 flex h-screen bg-sky-700 justify-between items-center">
            <BarraLatEsq userRole="Instrutor" />
            <div className="flex flex-col p-8 text-black w-3/5 h-5/6 items-center rounded-lg bg-slate-200 overflow-auto">
                <h1 className="text-2xl font-bold mb-6">Voos Anteriores</h1>

                {loading ? (
                    <div>Carregando voos...</div>
                ) : (
                    <div className="w-full">
                        <table className="w-full bg-white rounded-lg overflow-hidden">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 text-left">Data</th>
                                    <th className="px-4 py-2 text-left">Aluno</th>
                                    <th className="px-4 py-2 text-left">Avião</th>
                                    <th className="px-4 py-2 text-left">Módulo</th>
                                    <th className="px-4 py-2 text-left">Nota</th>
                                    <th className="px-4 py-2 text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {voos.map((voo) => (
                                    <tr key={voo.id} className="border-t">
                                        <td className="px-4 py-2">{new Date(voo.data).toLocaleDateString()}</td>
                                        <td className="px-4 py-2">{voo.aluno}</td>
                                        <td className="px-4 py-2">{voo.aviao}</td>
                                        <td className="px-4 py-2">{voo.modulo}</td>
                                        <td className="px-4 py-2">{voo.nota || "-"}</td>
                                        <td className="px-4 py-2">
                                            <span
                                                className={`px-2 py-1 rounded-full text-sm ${voo.status === "realizado"
                                                        ? "bg-green-100 text-green-800"
                                                        : voo.status === "cancelado"
                                                            ? "bg-red-100 text-red-800"
                                                            : "bg-yellow-100 text-yellow-800"
                                                    }`}
                                            >
                                                {voo.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <BarraLatDir userRole="Instrutor" />
        </main>
    )
}


