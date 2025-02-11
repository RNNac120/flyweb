"use client"

import { useEffect, useState } from "react"
import BarraLatEsq from "../ui/barralatesq"
import BarraLatDir from "../ui/barralatdir"
import Meio from "../ui/meio"

export default function Home() {
    const [userRole, setUserRole] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const role = localStorage.getItem("userRole")
        if (role) {
            setUserRole(role.toLowerCase())
        }
        setLoading(false)
    }, [])

    if (loading) {
        return <div>Loading...</div>
    }

    if (!userRole) {
        return <div>Error: User role not found. Please log in again.</div>
    }

    return (
        <main className="p-2 flex h-screen bg-sky-700 justify-between items-center">
            <BarraLatEsq userRole={userRole} />
            <Meio />
            <BarraLatDir userRole={userRole} />
        </main>
    )
}
