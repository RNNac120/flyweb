"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import BarraLatEsq from "../../../../ui/barralatesq";
import BarraLatDir from "../../../../ui/barralatdir";

export default function AlterarCompetencia() {
    const { id_comp } = useParams() as { id_comp: string };
    const router = useRouter();

    const [formData, setFormData] = useState({
        comentarios: "",
        nota: "",
    });

    useEffect(() => {
        if (id_comp) {
            const fetchCompetencias = async () => {
                try {
                    const response = await fetch(`/api/competencias/${id_comp}`);
                    if (response.ok) {
                        const aula = await response.json();
                        setFormData({
                            comentarios: aula.comentarios,
                            nota: aula.nota.toString(),
                        });
                    } else {
                        alert("Erro ao carregar dados da competência.");
                    }
                } catch (error) {
                    console.error("Erro ao buscar aula:", error);
                    alert("Erro ao carregar dados da aula.");
                }
            };
            fetchCompetencias();
        }
    }, [id_comp]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/competencias/${id_comp}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    nota: parseInt(formData.nota),
                    comentarios: formData.comentarios,
                }),
            });

            if (response.ok) {
                alert("Competência atualizada com sucesso!");
                router.push("/competencia");
            } else {
                alert("Erro ao atualizar a competência!");
            }
        } catch (error) {
            console.error("Erro ao enviar formulário:", error);
            alert("Erro ao atualizar a competência!");
        }
    };

    return (
        <main className="p-2 flex h-screen bg-sky-700 justify-between items-center">
            <BarraLatEsq />
            <div className="flex flex-col p-8 text-black w-3/5 h-5/6 items-center rounded-lg border bg-slate-200 justify-center overflow-scroll">
                <h1 className="self-start mt-12 mb-4 text-lg font-bold">Alterar Aula</h1>
                <form onSubmit={handleSubmit} className="w-full">
                    <div className="mb-4">
                        <label htmlFor="comentarios" className="block text-gray-600">Avião Usado</label>
                        <input
                            id="comentarios"
                            name="comentarios"
                            value={formData.comentarios}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="nota" className="block text-gray-600">Nota</label>
                        <input
                            type="text"
                            id="nota"
                            name="nota"
                            value={formData.nota}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none"
                    >
                        Atualizar
                    </button>
                </form>
            </div>
            <BarraLatDir />
        </main>
    );
}

