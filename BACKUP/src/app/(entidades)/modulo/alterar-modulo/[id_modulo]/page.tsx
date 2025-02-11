"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import BarraLatEsq from "../../../../ui/barralatesq";
import BarraLatDir from "../../../../ui/barralatdir";

export default function AlterarModulo() {
    const { id_modulo } = useParams() as { id_modulo: string };
    const router = useRouter();
    const [tipoModulo, setTipoModulo] = useState("");

    useEffect(() => {
        const fetchModulo = async () => {
            try {
                const response = await fetch(`/api/modulos/${id_modulo}`);

                if (response.ok) {
                    const modulo = await response.json();
                    setTipoModulo(modulo.tipo_modulo);
                } else {
                    alert("Erro ao carregar dados do módulo.");
                }
            } catch (error) {
                console.error("Erro ao buscar módulo:", error);
                alert("Erro ao carregar dados do módulo.");
            }
        };

        fetchModulo();
    }, [id_modulo]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(`/api/modulos/${id_modulo}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tipo_modulo: tipoModulo }),
            });

            if (response.ok) {
                alert("Módulo atualizado com sucesso!");
                router.push("/modulo");
            } else {
                alert("Erro ao atualizar o módulo!");
            }
        } catch (error) {
            console.error("Erro ao atualizar módulo:", error);
            alert("Erro ao atualizar o módulo!");
        }
    };

    return (
        <main className="p-2 flex h-screen bg-sky-700 justify-between items-center">
            <BarraLatEsq />
            <div className="flex flex-col p-8 text-black w-3/5 h-5/6 items-center rounded-lg border bg-slate-200 justify-center">
                <h1 className="self-start mb-4 text-lg font-bold">Alterar Módulo</h1>
                <form onSubmit={handleSubmit} className="w-full">
                    <div className="mb-4">
                        <label htmlFor="tipoModulo" className="block text-gray-600">Tipo do Módulo</label>
                        <input
                            type="text"
                            id="tipoModulo"
                            name="tipoModulo"
                            value={tipoModulo}
                            onChange={(e) => setTipoModulo(e.target.value)}
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

