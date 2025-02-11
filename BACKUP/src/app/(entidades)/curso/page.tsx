"use client";

import { useState, useEffect } from "react";
import BarraLatEsq from "../../ui/barralatesq";
import BarraLatDir from "../../ui/barralatdir";
import Link from "next/link";

export default function ListarCursos() {
    const [cursos, setCursos] = useState([]);
    const [pesquisa, setPesquisa] = useState("");

    const fetchCursos = async () => {
        const response = await fetch("/api/cursos");
        if (response.ok) {
            const data = await response.json();
            setCursos(data);
        } else {
            console.error("Erro ao buscar cursos");
        }
    };

    const handleDelete = async (id_curso: number) => {
        if (!confirm("Tem certeza que deseja excluir este curso?")) return;

        const response = await fetch(`/api/cursos/${id_curso}`, { method: "DELETE" });
        if (response.ok) {
            alert("Curso excluído com sucesso!");
            fetchCursos(); 
        } else {
            alert("Erro ao excluir o curso.");
        }
    };

    useEffect(() => {
        fetchCursos();
    }, []);

    const cursosFiltrados = cursos.filter((curso) =>
        curso.nome_curso.toLowerCase().includes(pesquisa.toLowerCase())
    );

    return (
        <main className="p-2 flex h-screen bg-sky-700 justify-between items-center">
            <BarraLatEsq />
            <div className="flex flex-col p-8 text-black w-3/5 h-5/6 rounded-lg border bg-slate-200">
                <h1 className="text-lg font-bold mb-4">Gerenciar Cursos</h1>

                <div className="mb-6 flex gap-4 w-full">
                    <input
                        type="text"
                        placeholder="Pesquisar curso..."
                        value={pesquisa}
                        onChange={(e) => setPesquisa(e.target.value)}
                        className="w-full mb-4 border border-gray-300 rounded-md py-2 px-3 focus:outline-none"
                    />
                </div>

                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="border p-2">ID</th>
                            <th className="border p-2">Nome do Curso</th>
                            <th className="border p-2">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cursosFiltrados.map((curso: any) => (
                            <tr key={curso.id_curso}>
                                <td className="border p-2 text-center">{curso.id_curso}</td>
                                <td className="border p-2">{curso.nome_curso}</td>
                                <td className="border p-2 flex justify-center gap-2">
                                    <Link 
                                        href={`/curso/alterar-curso/${curso.id_curso}`}
                                    >
                                        <button
                                            className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600"
                                        >
                                            Alterar
                                        </button>
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(curso.id_curso)}
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
                <Link href={'/curso/cadastrar-curso/'}>
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

