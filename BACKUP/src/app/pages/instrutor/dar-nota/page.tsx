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
    status: "agendado" | "realizado" | "cancelado"
}

export default function DarNota() {
    const [voos, setVoos] = useState<Voo[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedVoo, setSelectedVoo] = useState<number | null>(null)
    const [nota, setNota] = useState("")
    const [comentarios, setComentarios] = useState("")

    useEffect(() => {
        const fetchVoos = async () => {
            try {
                const response = await fetch("/api/voos/pendentes")
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedVoo) return

        try {
            const response = await fetch(`/api/voos/${selectedVoo}/nota`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nota: Number(nota),
                    comentarios,
                }),
            })

            if (response.ok) {
                alert("Nota registrada com sucesso!")
                setVoos((prev) => prev.filter((voo) => voo.id !== selectedVoo))
                setSelectedVoo(null)
                setNota("")
                setComentarios("")
            } else {
                alert("Erro ao registrar nota")
            }
        } catch (error) {
            console.error("Erro ao registrar nota:", error)
            alert("Erro ao registrar nota")
        }
    }

    return (
        <main className="p-2 flex h-screen bg-sky-700 justify-between items-center">
            <BarraLatEsq userRole="Instrutor" />
            <div className="flex flex-col p-8 text-black w-3/5 h-5/6 items-center rounded-lg bg-slate-200 overflow-auto">
                <h1 className="text-2xl font-bold mb-6">Dar Nota de Voo</h1>

                {loading ? (
                    <div>Carregando voos...</div>
                ) : (
                    <div className="w-full max-w-4xl">
                        <div className="bg-white rounded-lg p-6 shadow-md">
                            <h2 className="text-lg font-semibold mb-4">Voos Pendentes de Avaliação</h2>

                            <div className="space-y-4">
                                {voos.map((voo) => (
                                    <div
                                        key={voo.id}
                                        className={`p-4 rounded-lg border ${selectedVoo === voo.id ? "border-blue-500 bg-blue-50" : "border-gray-200"
                                            } cursor-pointer hover:bg-gray-50`}
                                        onClick={() => setSelectedVoo(voo.id)}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-medium">{voo.aluno}</p>
                                                <p className="text-sm text-gray-600">
                                                    {new Date(voo.data).toLocaleDateString()} - {voo.modulo}
                                                </p>
                                            </div>
                                            <div className="text-sm text-gray-600">{voo.aviao}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {selectedVoo && (
                                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Nota</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="10"
                                            step="0.1"
                                            value={nota}
                                            onChange={(e) => setNota(e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Comentários</label>
                                        <textarea
                                            value={comentarios}
                                            onChange={(e) => setComentarios(e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            rows={4}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        Registrar Nota
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <BarraLatDir userRole="Instrutor" />
        </main>
    )
}


