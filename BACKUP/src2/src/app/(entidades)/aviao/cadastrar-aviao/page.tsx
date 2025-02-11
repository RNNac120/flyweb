"use client"

import { useState } from "react"
import BarraLatEsq from "../../../ui/barralatesq"
import BarraLatDir from "../../../ui/barralatdir"

export default function Template() {
  const [formData, setFormData] = useState({
    matricula: "",
    horas_voadas: "",
    data_prox_mnt: "",
    fabricante: "",
    modelo_anv: "",
    disp_voo: true,
    num_hangar: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setFormData({ ...formData, disp_voo: value === "true" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/avioes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          matricula: formData.matricula,
          horas_voadas: Number.parseInt(formData.horas_voadas),
          data_prox_mnt: new Date(formData.data_prox_mnt),
          fabricante: formData.fabricante,
          modelo_anv: formData.modelo_anv,
          disp_voo: formData.disp_voo,
          num_hangar: Number.parseInt(formData.num_hangar),
        }),
      })

      if (response.ok) {
        alert("Avião cadastrado com sucesso!")
        setFormData({
          matricula: "",
          horas_voadas: "",
          data_prox_mnt: "",
          fabricante: "",
          modelo_anv: "",
          disp_voo: true,
          num_hangar: "",
        })
      } else {
        alert("Erro ao cadastrar o avião!")
      }
    } catch (error) {
      console.error("Erro ao enviar formulário:", error)
      alert("Erro ao cadastrar o avião!")
    }
  }

  return (
    <main className="p-2 flex h-screen bg-sky-700 justify-between items-center">
      <BarraLatEsq />
      <div className="flex flex-col p-8 text-black w-3/5 h-5/6 items-center rounded-lg border bg-slate-200 justify-center">
        <h1 className="self-start mb-4 text-lg font-bold">Cadastrar Avião</h1>
        <form onSubmit={handleSubmit} className="w-full">
          {[
            { name: "matricula", label: "Matrícula" },
            { name: "horas_voadas", label: "Horas Voadas", type: "number" },
            { name: "data_prox_mnt", label: "Data Próxima Manutenção", type: "date" },
            { name: "fabricante", label: "Fabricante" },
            { name: "modelo_anv", label: "Modelo" },
            { name: "num_hangar", label: "Número do Hangar", type: "number" },
          ].map((field) => (
            <div key={field.name} className="mb-4">
              <label htmlFor={field.name} className="block text-gray-600">
                {field.label}
              </label>
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

          <div className="mb-4">
            <label className="block text-gray-600">Disponibilidade de Voo</label>
            <div className="flex items-center space-x-4">
              <label>
                <input
                  type="radio"
                  name="disp_voo"
                  value="true"
                  checked={formData.disp_voo === true}
                  onChange={handleRadioChange}
                  className="mr-2"
                />
                Disponível
              </label>
              <label>
                <input
                  type="radio"
                  name="disp_voo"
                  value="false"
                  checked={formData.disp_voo === false}
                  onChange={handleRadioChange}
                  className="mr-2"
                />
                Não disponível
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Cadastrar
          </button>
        </form>
      </div>
      <BarraLatDir />
    </main>
  )
}

