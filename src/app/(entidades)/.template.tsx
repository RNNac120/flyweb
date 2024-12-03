import dynamic from "next/dynamic";
import { useMemo } from "react";
import BarraLatEsq from "../ui/barralatesq";
import BarraLatDir from "../ui/barralatdir";

export default function Template({
    children
}: {
    children: React.ReactNode
}) {
    const Map = useMemo(() => dynamic(
        () => import('@/app/ui/mapa/mapa'),
        {
            loading: () => <p>A map is loading</p>,
            ssr: true
        }
    ), [])

    return (
        <main key="home" className="p-2 flex h-screen bg-sky-700 justify-between items-center">
            <BarraLatEsq />
            <div key="meio" className="text-black flex w-3/5 h-5/6 items-center rounded-lg border bg-slate-200 justify-center">
                <Map posix={[-21.106016282941873, -44.24965143017836]} />
            </div>
            <BarraLatDir />
        </main>
    )
}