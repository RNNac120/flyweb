"use client";

import { useState, useEffect } from "react";
import BarraLatEsq from "../../ui/barralatesq";
import BarraLatDir from "../../ui/barralatdir";
import Link from "next/link";
import AlterarAviao from "./alterar-aviao/page";

export default function ExcluirAviao() {
    const [avioes, setAvioes] = useState([]);

    useEffect(() => {
        const fetchAvioes = async () => {
            const response = await fetch("/api/avioes");
            if (response.ok) {
                const data = await response.json();
                setAvioes(data);
            }
        };
        fetchAvioes();
    }, []);

    const handleDelete = async (matricula: string) => {
        if (confirm(`Tem certeza que deseja excluir o avião ${matricula}?`)) {
            try {
                const response = await fetch(`/api/avioes/${matricula}`, {
                    method: "DELETE",
                });

                if (response.ok) {
                    alert("Avião excluído com sucesso!");
                    setAvioes(avioes.filter((aviao) => aviao.matricula !== matricula));
                } else {
                    alert("Erro ao excluir o avião!");
                }
            } catch (error) {
                console.error("Erro ao excluir avião:", error);
                alert("Erro ao excluir o avião!");
            }
        }
    };

    return (
        <main className="p-2 flex h-screen bg-sky-700 justify-between items-center">
            <BarraLatEsq />
            <div className="flex flex-col p-8 text-black w-3/5 h-5/6 items-center rounded-lg border bg-slate-200 justify-center">
                <h1 className="mb-4 text-lg font-bold">Aviões</h1>

                <ul className="w-full">
                    {avioes.map((aviao) => (
                        <li key={aviao.matricula} className="mb-4 flex justify-between items-center">
                            <span>{aviao.matricula}</span>
                            <div className="flex gap-4">

                                <Link
                                    href={`/aviao/alterar-aviao/${aviao.matricula}`}
                                >
                                    <button
                                        className="bg-amber-500 text-white py-1 px-4 rounded-md hover:bg-amber-700" >
                                        Alterar
                                    </button>
                                </Link>
                                <button
                                    onClick={() => handleDelete(aviao.matricula)}
                                    className="bg-red-500 text-white py-1 px-4 rounded-md hover:bg-red-600"
                                >
                                    Excluir
                                </button>

                            </div>
                        </li>
                    ))}
                </ul>
                <button
                    onClick={() => handleInserir(aviao.matricula)}
                    className="bg-green-500 text-white py-1 px-4 rounded-md hover:bg-green-700"
                >
                    Inserir
                </button>
            </div>
            <BarraLatDir />
        </main>
    );
}
