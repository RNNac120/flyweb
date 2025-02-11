import clsx from "clsx"

export default function BarraLatDir({ userRole }) {
    return (
        <div key="bld" className="w-1/6 h-full rounded-lg flex flex-col bg-sky-950">
            <div
                key="voando"
                className={clsx("flex flex-col p-4", {
                    "bg-sky-700": userRole === "aluno" || userRole === "instrutor" || userRole === "mecanico",
                    "bg-sky-900": userRole === "secretaria",
                })}
            >
                <h2 className="text-xl font-bold mb-2 text-white">Voando Agora</h2>
                {/* Add content for currently flying planes/students */}
            </div>
            <div key="proximos" className="flex flex-col p-4">
                <h2 className="text-xl font-bold mb-2 text-white">Próximos Voos</h2>
                {/* Add content for upcoming flights */}
            </div>
            <div key="avioes_hangar" className="flex flex-col p-4">
                <h2 className="text-xl font-bold mb-2 text-white">Aviões no Hangar</h2>
                {/* Add content for planes in the hangar */}
            </div>
        </div>
    )
}


