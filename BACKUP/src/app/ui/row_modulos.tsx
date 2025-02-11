"use client"

import { useRef, useEffect } from "react"
import QuadAula from "./quad_aula"

interface Aula {
    id_aula: number
    status: "disponivel" | "indisponivel" | "feita"
}

interface ModuloProps {
    modulo: {
        id_modulo: number
        tipo_modulo: string
        aulas: Aula[]
    }
}

export default function ModuloAulas({ modulo }: ModuloProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (scrollContainerRef.current) {
                e.preventDefault()
                scrollContainerRef.current.scrollLeft += e.deltaY
            }
        }

        const container = scrollContainerRef.current
        if (container) {
            container.addEventListener("wheel", handleWheel)
        }

        return () => {
            if (container) {
                container.removeEventListener("wheel", handleWheel)
            }
        }
    }, [])

    return (
        <div className="relative">
            <div ref={scrollContainerRef} className="overflow-x-auto scrollbar-hide" style={{ scrollBehavior: "smooth" }}>
                <div className="flex gap-4 pb-4" style={{ minWidth: "max-content" }}>
                    {modulo.aulas?.length > 0 ? (
                        modulo.aulas.map((aula) => <QuadAula key={aula.id_aula} aula={aula} />)
                    ) : (
                        <p className="text-gray-600 text-lg">Nenhuma aula disponível</p>
                    )}
                </div>
            </div>
        </div>
    )
}


