"use client";

import { useState, useEffect } from "react";
import BarraLatEsq from "../../ui/barralatesq";
import BarraLatDir from "../../ui/barralatdir";
import Link from "next/link";

export default function ExcluirUsuario() {
    const [usuarios, setUsuarios] = useState([]);
    const [termoPesquisa, setTermoPesquisa] = useState("");

    useEffect(() => {
        const fetchUsuarios = async () => {
            const response = await fetch("/api/usuarios");
            if (response.ok) {
                const data = await response.json();
                setUsuarios(data);
            }
        };
        fetchUsuarios();
    }, []);

    const usuariosFiltrados = usuarios.filter((usuario) =>
        usuario.cpf.includes(termoPesquisa) ||
        usuario.nome.toLowerCase().includes(termoPesquisa.toLowerCase())
    );

    const handleDelete = async (cpf: string) => {
        if (confirm(`Tem certeza que deseja excluir o usuário ${cpf}?`)) {
            try {
                const response = await fetch(`/api/usuarios/${cpf}`, {
                    method: "DELETE",
                });

                if (response.ok) {
                    alert("Usuário excluído com sucesso!");
                    setUsuarios(usuarios.filter((usuario) => usuario.cpf !== cpf));
                } else {
                    alert("Erro ao excluir o usuário!");
                }
            } catch (error) {
                console.error("Erro ao excluir usuário:", error);
                alert("Erro ao excluir o usuário!");
            }
        }
    };

    return (
        <main className="p-2 flex h-screen bg-sky-700 justify-between items-center">
            <BarraLatEsq />
            <div className="flex flex-col p-8 text-black w-3/5 h-5/6 items-center rounded-lg border bg-slate-200 justify-center overflow-scroll">
                <h1 className="mb-4 text-lg font-bold">Usuários</h1>

                <div className="mb-6 flex gap-4 w-full">
                    <input
                        type="text"
                        placeholder="Digite o CPF ou Nome"
                        value={termoPesquisa}
                        onChange={(e) => setTermoPesquisa(e.target.value)}
                        className="flex-1 p-2 border rounded"
                    />
                </div>

                <ul className="w-full">
                    {usuariosFiltrados.map((usuario) => (
                        <li key={usuario.cpf} className="mb-4 flex justify-between items-center">
                            <span>{usuario.nome}</span>
                            <span>{usuario.email}</span>
                            <span>{usuario.role}</span>
                            <div className="flex gap-4">
                                <Link
                                    href={`/usuarios/alterar-usuario/${usuario.cpf}`}
                                >
                                    <button
                                        className="bg-amber-500 text-white py-1 px-4 rounded-md hover:bg-amber-700"
                                    >
                                        Alterar
                                    </button>
                                </Link>
                                <button
                                    onClick={() => handleDelete(usuario.cpf)}
                                    className="bg-red-500 text-white py-1 px-4 rounded-md hover:bg-red-600"
                                >
                                    Excluir
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>

                <Link href={`/usuarios/cadastrar-usuario/`}>
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

