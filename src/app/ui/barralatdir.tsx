"use client"

import { useState, useEffect } from "react"

interface Aviao {
    matricula: string
    modelo_anv: string
    disp_voo: boolean
}

interface Voo {
    data: string
    instrucao: string
    aluno: string
}

export default function BarraLatDir({ userRole }: { userRole: string }) {
    const [avioes, setAvioes] = useState<Aviao[]>([])
    const [proximosVoos, setProximosVoos] = useState<Voo[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const avioesRes = await fetch("/api/avioes")
                const avioesData = await avioesRes.json()
                setAvioes(avioesData)

                if (userRole === "instrutor") {
                    const userCpf = localStorage.getItem("userCpf")
                    if (userCpf) {
                        const voosRes = await fetch(`/api/voos/proximos/${userCpf}`)
                        const voosData = await voosRes.json()
                        setProximosVoos(voosData)
                    }
                }
            } catch (error) {
                console.error("Erro ao carregar dados:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [userRole])

    if (loading) {
        return <div className="w-1/6 h-full rounded-lg bg-sky-950 p-4 text-white">Carregando...</div>
    }

    return (
        <div className="w-1/6 h-full rounded-lg flex flex-col gap-4 bg-sky-950 p-4">
            {userRole === "instrutor" && (
                <div className="bg-white rounded-lg p-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Próximos Voos</h2>
                    <div className="space-y-2">
                        {proximosVoos.map((voo, index) => (
                            <div key={index} className="text-sm text-gray-600">
                                <div className="font-medium">{new Date(voo.data).toLocaleDateString()}</div>
                                <div>{voo.instrucao}</div>
                                <div className="text-xs">{voo.aluno}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-white rounded-lg p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Aviões no Hangar</h2>
                <div className="space-y-2">
                    {avioes.map((aviao) => (
                        <div key={aviao.matricula} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{aviao.matricula}</span>
                            <span
                                className={`px-2 py-1 rounded-full text-xs ${aviao.disp_voo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                    }`}
                            >
                                {aviao.disp_voo ? "Disponível" : "Indisponível"}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}


