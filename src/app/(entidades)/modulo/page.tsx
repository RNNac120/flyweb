
"use client";

import { useState, useEffect } from "react";
import BarraLatEsq from "../../ui/barralatesq";
import BarraLatDir from "../../ui/barralatdir";
import Link from "next/link";

export default function ExcluirModulo() {
    const [modulos, setModulos] = useState([]);
    const [termoPesquisa, setTermoPesquisa] = useState("");

    useEffect(() => {
        const fetchModulos = async () => {
            const response = await fetch("/api/modulos");
            if (response.ok) {
                const data = await response.json();
                setModulos(data);
            }
        };
        fetchModulos();
    }, []);

    const handleDelete = async (id_modulo: string) => {
        if (confirm(`Tem certeza que deseja excluir o módulo ${id_modulo}?`)) {
            try {
                const response = await fetch(`/api/modulos/${id_modulo}`, {
                    method: "DELETE",
                });

                if (response.ok) {
                    alert("Módulo excluído com sucesso!");
                    setModulos(modulos.filter((modulo) => modulo.id_modulo !== id_modulo));
                } else {
                    alert("Erro ao excluir o módulo!");
                }
            } catch (error) {
                console.error("Erro ao excluir módulo:", error);
                alert("Erro ao excluir o módulo!");
            }
        }
    };

    return (
        <main className="p-2 flex h-screen bg-sky-700 justify-between items-center">
            <BarraLatEsq />
            <div className="flex flex-col p-8 text-black w-3/5 h-5/6 items-center rounded-lg border bg-slate-200 justify-center overflow-scroll">
                <h1 className="mb-4 text-lg font-bold">Modulos</h1>

                <ul className="w-full">
                    <li key={modulos.id_modulo} className="mb-4 flex justify-between items-center">
                        <span>{modulos.tipo_modulo}</span>
                        <div className="flex gap-4">
                            <Link
                                href={`/modulos/alterar-modulo/${modulos.id_modulo}`}
                            >
                                <button
                                    className="bg-amber-500 text-white py-1 px-4 rounded-md hover:bg-amber-700"
                                >
                                    Alterar
                                </button>
                            </Link>
                            <button
                                onClick={() => handleDelete(modulos.id_modulo)}
                                className="bg-red-500 text-white py-1 px-4 rounded-md hover:bg-red-600"
                            >
                                Excluir
                            </button>
                        </div>
                    </li>
                </ul>

                <Link href={`/modulos/cadastrar-modulo/`}>
                    <button
                        className="bg-green-500 text-white py-1 px-4 rounded-md hover:bg-green-700"
                    >
                        Inserir
                    </button>
                </Link>
            </div>
            <BarraLatDir />
        </main>
    );
}

