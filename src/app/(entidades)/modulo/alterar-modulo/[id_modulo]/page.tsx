"use client";

import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function AlterarModulo() {
    const router = useRouter();
    const { id_modulo } = router.query;
    const [modulo, setModulo] = useState(null);
    const [tipo_modulo, setTipoModulo] = useState("");

    useEffect(() => {
        if (id_modulo) {
            const fetchModulo = async () => {
                const response = await fetch(`/api/modulos/${id_modulo}`);
                if (response.ok) {
                    const data = await response.json();
                    setModulo(data);
                    setTipoModulo(data.tipo_modulo);
                }
            };
            fetchModulo();
        }
    }, [id_modulo]);

    const handleUpdate = async () => {
        try {
            const response = await fetch(`/api/modulos/${id_modulo}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tipo_modulo }),
            });

            if (response.ok) {
                alert("Módulo atualizado com sucesso!");
                router.push("/modulos"); // Redireciona de volta à lista de módulos
            } else {
                alert("Erro ao atualizar o módulo!");
            }
        } catch (error) {
            console.error("Erro ao atualizar módulo:", error);
            alert("Erro ao atualizar o módulo!");
        }
    };

    if (!modulo) return <p>Carregando...</p>;

    return (
        <main className="p-2 flex h-screen bg-sky-700 justify-center items-center">
            <div className="flex flex-col p-8 text-black w-3/5 h-5/6 items-center rounded-lg border bg-slate-200">
                <h1 className="mb-4 text-lg font-bold">Alterar Módulo</h1>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">
                        Tipo de Módulo:
                    </label>
                    <input
                        type="text"
                        value={tipo_modulo}
                        onChange={(e) => setTipoModulo(e.target.value)}
                        className="border p-2 rounded w-full"
                    />
                </div>
                <button
                    onClick={handleUpdate}
                    className="bg-amber-500 text-white py-2 px-4 rounded-md hover:bg-amber-700"
                >
                    Salvar Alterações
                </button>
            </div>
        </main>
    );
}

