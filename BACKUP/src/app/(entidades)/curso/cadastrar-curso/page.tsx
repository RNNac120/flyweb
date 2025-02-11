"use client";

import { useState } from "react";
import BarraLatEsq from "../../../ui/barralatesq";
import BarraLatDir from "../../../ui/barralatdir";
import { isDeepStrictEqual } from "util";

export default function CadastrarCurso() {
    const [formData, setFormData] = useState({
        nome_curso: "",
        id_curso: ""
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/cursos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nome_curso: formData.nome_curso,
                    id_curso: parseInt(formData.id_curso)
                }),
            });

            if (response.ok) {
                alert("Curso cadastrado com sucesso!");
                setFormData({
                    nome_curso: "",
                    id_curso: "",
                });
            } else {
                alert("Erro ao cadastrar o curso!");
            }
        } catch (error) {
            console.error("Erro ao enviar formulário:", error);
            alert("Erro ao cadastrar o curso!");
        }
    };


    return (
        <main className="p-2 flex h-screen bg-sky-700 justify-between items-center">
            <BarraLatEsq />
            <div className="flex flex-col p-8 text-black w-3/5 h-5/6 items-center rounded-lg border bg-slate-200 justify-center">
                <h1 className="self-start mb-4 text-lg font-bold">Cadastrar Curso</h1>
                <form onSubmit={handleSubmit} className="w-full"> {[
                    { name: "nome_curso", label: "Nome do Curso" }
                ].map((field) => (
                    <div key={field.name} className="mb-4">
                        <label htmlFor={field.name} className="block text-gray-600">Nome do Curso</label>
                        <input
                            type={field.type || "text"}
                            id={field.name}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                ))}

                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none"
                    >
                        Cadastrar
                    </button>
                </form>
            </div>
            <BarraLatDir />
        </main>
    );
}
