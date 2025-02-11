"use client"

import dynamic from "next/dynamic"

const Map = dynamic(() => import("./map-component").then((mod) => mod.default), { ssr: false })

export default function Meio() {
    return (
        <div
            key="meio"
            className="text-black flex w-3/5 h-5/6 items-center rounded-lg border bg-slate-200 justify-center overflow-hidden"
        >
            <Map posix={[-21.106016282941873, -44.24965143017836]} />
        </div>
    )
}
