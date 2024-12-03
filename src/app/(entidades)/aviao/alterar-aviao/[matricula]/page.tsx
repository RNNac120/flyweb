"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import BarraLatEsq from "../../../../ui/barralatesq";
import BarraLatDir from "../../../../ui/barralatdir";

export default function AlterarAviao() {
    const { matricula } = useParams(); // Acessa `params` diretamente
    const router = useRouter(); // Para navegação, se necessário

    const [formData, setFormData] = useState({
        matricula: "",
        horas_voadas: "",
        data_prox_mnt: "",
        fabricante: "",
        modelo_anv: "",
        disp_voo: true,
        num_hangar: "",
    });

    useEffect(() => {
        if (matricula) {
            const fetchAviao = async () => {
                const response = await fetch(`/api/avioes/${matricula}`);
                if (response.ok) {
                    const aviao = await response.json();
                    setFormData(aviao);
                } else {
                    alert("Erro ao carregar dados do avião.");
                }
            };
            fetchAviao();
        }
    }, [matricula]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setFormData({ ...formData, disp_voo: value === "true" });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/avioes/${formData.matricula}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Avião atualizado com sucesso!");
                router.push("/aviao"); // Redireciona após atualização bem-sucedida
            } else {
                alert("Erro ao atualizar o avião!");
            }
        } catch (error) {
            console.error("Erro ao enviar formulário:", error);
            alert("Erro ao atualizar o avião!");
        }
    };

    return (
        <main className="p-2 flex h-screen bg-sky-700 justify-between items-center">
            <BarraLatEsq />
            <div className="flex flex-col p-8 text-black w-3/5 h-5/6 items-center rounded-lg border bg-slate-200 justify-center">
                <h1 className="self-start mb-4 text-lg font-bold">Alterar Avião</h1>
                <form onSubmit={handleSubmit} className="w-full">
                    {/* Matrícula - desabilitada para não ser editada */}
                    <div className="mb-4">
                        <label htmlFor="matricula" className="block text-gray-600">Matrícula</label>
                        <input
                            type="text"
                            id="matricula"
                            name="matricula"
                            value={formData.matricula}
                            onChange={handleInputChange}
                            disabled
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Horas voadas */}
                    <div className="mb-4">
                        <label htmlFor="horas_voadas" className="block text-gray-600">Horas Voadas</label>
                        <input
                            type="number"
                            id="horas_voadas"
                            name="horas_voadas"
                            value={formData.horas_voadas}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Data de próximo manutenção */}
                    <div className="mb-4">
                        <label htmlFor="data_prox_mnt" className="block text-gray-600">Data Próxima Manutenção</label>
                        <input
                            type="date"
                            id="data_prox_mnt"
                            name="data_prox_mnt"
                            value={formData.data_prox_mnt}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Fabricante */}
                    <div className="mb-4">
                        <label htmlFor="fabricante" className="block text-gray-600">Fabricante</label>
                        <input
                            type="text"
                            id="fabricante"
                            name="fabricante"
                            value={formData.fabricante}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Modelo do avião */}
                    <div className="mb-4">
                        <label htmlFor="modelo_anv" className="block text-gray-600">Modelo</label>
                        <input
                            type="text"
                            id="modelo_anv"
                            name="modelo_anv"
                            value={formData.modelo_anv}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Disponibilidade para voo */}
                    <div className="mb-4">
                        <label className="block text-gray-600">Disponível para voo</label>
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    name="disp_voo"
                                    value="true"
                                    checked={formData.disp_voo === true}
                                    onChange={handleRadioChange}
                                    className="mr-2"
                                />
                                Sim
                            </label>
                            <label className="ml-4">
                                <input
                                    type="radio"
                                    name="disp_voo"
                                    value="false"
                                    checked={formData.disp_voo === false}
                                    onChange={handleRadioChange}
                                    className="mr-2"
                                />
                                Não
                            </label>
                        </div>
                    </div>

                    {/* Número do hangar */}
                    <div className="mb-4">
                        <label htmlFor="num_hangar" className="block text-gray-600">Número do Hangar</label>
                        <input
                            type="number"
                            id="num_hangar"
                            name="num_hangar"
                            value={formData.num_hangar}
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

