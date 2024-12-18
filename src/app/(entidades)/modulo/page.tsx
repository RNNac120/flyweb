"use client";

import { useState, useEffect } from "react";
import BarraLatEsq from "../../ui/barralatesq";
import BarraLatDir from "../../ui/barralatdir";
import Link from "next/link";

export default function ListarModulos() {
    const [modulos, setModulos] = useState([]);
    const [pesquisa, setPesquisa] = useState("");

    const fetchModulos = async () => {
        const response = await fetch("/api/modulos");
        if (response.ok) {
            const data = await response.json();
            setModulos(data);
        } else {
            console.error("Erro ao buscar módulos");
        }
    };

    const handleDelete = async (id_modulo: number) => {
        if (!confirm("Tem certeza que deseja excluir este módulo?")) return;

        const response = await fetch(`/api/modulos/${id_modulo}`, { method: "DELETE" });
        if (response.ok) {
            alert("Módulo excluído com sucesso!");
            fetchModulos();
        } else {
            alert("Erro ao excluir o módulo.");
        }
    };

    useEffect(() => {
        fetchModulos();
    }, []);

    const modulosFiltrados = modulos.filter((modulo) =>
        modulo.tipo_modulo.toLowerCase().includes(pesquisa.toLowerCase())
    );

    return (
        <main className="p-2 flex h-screen bg-sky-700 justify-between items-center">
            <BarraLatEsq />
            <div className="flex flex-col p-8 text-black w-3/5 h-5/6 rounded-lg border bg-slate-200">
                <h1 className="text-lg font-bold mb-4">Gerenciar Módulos</h1>

                <div className="mb-6 flex gap-4 w-full">
                    <input
                        type="text"
                        placeholder="Pesquisar módulo..."
                        value={pesquisa}
                        onChange={(e) => setPesquisa(e.target.value)}
                        className="w-full mb-4 border border-gray-300 rounded-md py-2 px-3 focus:outline-none"
                    />
                </div>

                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="border p-2">ID</th>
                            <th className="border p-2">Nome do Módulo</th>
                            <th className="border p-2">Nome do Curso</th>
                            <th className="border p-2">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {modulosFiltrados.map((modulo: any) => (
                            <tr key={modulo.id_modulo}>
                                <td className="border p-2 text-center">{modulo.id_modulo}</td>
                                <td className="border p-2">{modulo.tipo_modulo}</td>
                                <td className="border p-2 text-center">
                                    {modulo.nome_curso ? modulo.nome_curso : "Curso não encontrado"}
                                </td>
                                <td className="border p-2 flex justify-center gap-2">
                                    <Link href={`/modulo/alterar-modulo/${modulo.id_modulo}`}>
                                        <button className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600">
                                            Alterar
                                        </button>
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(modulo.id_modulo)}
                                        className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                                    >
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex self-center">
                    <Link href={'/modulo/cadastrar-modulo/'}>
                        <button
                            className="bg-green-500 text-white py-1 px-4 rounded-md hover:bg-green-700"
                        >
                            Inserir
                        </button>
                    </Link>
                </div>
            </div>
            <BarraLatDir />
        </main>
    );
}
