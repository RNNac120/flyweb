"use client"

import Link from "next/link"

interface AulaProps {
    aula: {
        id_aula: number
        status: "disponivel" | "indisponivel" | "feita"
    }
}

const statusColors = {
    disponivel: {
        header: "bg-green-700",
        body: "bg-green-500",
    },
    indisponivel: {
        header: "bg-gray-700",
        body: "bg-gray-500",
    },
    feita: {
        header: "bg-blue-700",
        body: "bg-blue-500",
    },
}

const statusText = {
    disponivel: "Disponível",
    indisponivel: "Indisponível",
    feita: "Feita",
}

export default function QuadAula({ aula }: AulaProps) {
    const status = aula.status as keyof typeof statusColors
    return (
        <Link href={`/aula/${aula.id_aula}`}>
            <div className="w-32 flex flex-col rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                <div className={`${statusColors[status].header} p-2 text-center`}>
                    <span className="text-white font-bold">Aula {aula.id_aula}</span>
                </div>
                <div className={`${statusColors[status].body} p-4 text-center`}>
                    <span className="text-white text-sm">{statusText[status]}</span>
                </div>
            </div>
        </Link>
    )
}


