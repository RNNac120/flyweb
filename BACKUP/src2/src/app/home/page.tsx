"use client"

import { useEffect, useState } from "react"
import BarraLatEsq from "../ui/barralatesq"
import BarraLatDir from "../ui/barralatdir"
import Meio from "../ui/meio"

export default function Home() {
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    // In a real app, this would come from your authentication system
    // For now, we'll get it from localStorage or default to "Aluno"
    const role = localStorage.getItem("userRole") || "Aluno"
    setUserRole(role)
  }, [])

  if (!userRole) {
    return <div>Loading...</div>
  }

  return (
    <main className="p-2 flex h-screen bg-sky-700 justify-between items-center">
      <BarraLatEsq userRole={userRole} />
      <Meio />
      <BarraLatDir userRole={userRole} />
    </main>
  )
}

