"use client"

import { useState, useEffect } from "react"
import BarraLatEsq from "@/app/ui/barralatesq"
import BarraLatDir from "@/app/ui/barralatdir"

interface Voo {
    id: number
    data: string
    hora_inicio: string
    hora_fim: string
    aviao: string
    status: "disponivel" | "indisponivel" | "feito"
    nota?: number
}

interface Modulo {
    id_modulo: number
    tipo_modulo: string
    aulas: Voo[]
}

export default function VoosAluno() {
    const [modulos, setModulos] = useState<Modulo[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchVoos = async () => {
            try {
                const userCpf = localStorage.getItem("userCpf")
                const response = await fetch(`/api/voos/aluno/${userCpf}`)
                if (!response.ok) throw new Error("Erro ao carregar voos")
                const data = await response.json()
                setModulos(data)
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
            <BarraLatEsq userRole="aluno" />
            <div className="flex flex-col p-8 text-black w-3/5 h-5/6 items-center rounded-lg bg-slate-200 overflow-auto">
                <h1 className="text-2xl font-bold mb-6">Meus Voos</h1>

                {loading ? (
                    <div>Carregando voos...</div>
                ) : (
                    <div className="w-full">
                        {modulos.map((modulo) => (
                            <div key={modulo.id_modulo} className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">{modulo.tipo_modulo}</h2>
                                <table className="w-full bg-white rounded-lg overflow-hidden">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-2 text-left">Data</th>
                                            <th className="px-4 py-2 text-left">Horário</th>
                                            <th className="px-4 py-2 text-left">Avião</th>
                                            <th className="px-4 py-2 text-left">Status</th>
                                            <th className="px-4 py-2 text-left">Nota</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {modulo.aulas.map((voo) => (
                                            <tr key={voo.id} className="border-t">
                                                <td className="px-4 py-2">{new Date(voo.data).toLocaleDateString()}</td>
                                                <td className="px-4 py-2">
                                                    {voo.hora_inicio} - {voo.hora_fim}
                                                </td>
                                                <td className="px-4 py-2">{voo.aviao}</td>
                                                <td className="px-4 py-2">
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-sm ${voo.status === "feito"
                                                                ? "bg-green-100 text-green-800"
                                                                : voo.status === "disponivel"
                                                                    ? "bg-yellow-100 text-yellow-800"
                                                                    : "bg-red-100 text-red-800"
                                                            }`}
                                                    >
                                                        {voo.status === "feito"
                                                            ? "Realizado"
                                                            : voo.status === "disponivel"
                                                                ? "Disponível"
                                                                : "Indisponível"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2">{voo.nota || "-"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <BarraLatDir userRole="aluno" />
        </main>
    )
}


