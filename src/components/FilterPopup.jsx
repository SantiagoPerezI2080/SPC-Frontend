import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { ValidacionDatos } from "./ValidacionDatos";

export function FilterPopup({ isOpen, onClose }) {
  const [selectedPrograma, setSelectedPrograma] = useState("Todos");
  const [selectedAño, setSelectedAño] = useState(null);
  const [selectedPeriodo, setSelectedPeriodo] = useState("Todos");
  const [selectedVersion, setSelectedVersion] = useState("Todos");
  const [programaCoordinadorId, setProgramaCoordinadorId] = useState(null);
  const userRol = Cookies.get("userRol");

  // Mapeo de IDs de programa a nombres
  const programasIdMap = {
    1: "CONTADURIA PUBLICA",
    2: "FINANZAS Y NEGOCIOS INTERNACIONALES",
    3: "CIENCIAS AMBIENTALES Y DESARROLLO SOSTENIBLE",
    4: "INGENIERIA ELECTRONICA",
    5: "INGENIERIA DE SOFTWARE Y COMPUTACION",
    6: "ENTRENAMIENTO DEPORTIVO",
    7: "GOBIERNO Y RELACIONES INTERNACIONALES",
    8: "INGENIERIA AMBIENTAL Y SANEAMIENTO",
    9: "INGENIERIA CIVIL"
  };

  const PROGRAMAS_PERMITIDOS = [
    "Todos",
    "EDUCACION INFANTIL",
    "CONTADURIA PUBLICA",
    "FINANZAS Y NEGOCIOS INTERNACIONALES",
    "INGENIERIA ELECTRONICA",
    "INGENIERIA DE SOFTWARE Y COMPUTACION",
    "ENTRENAMIENTO DEPORTIVO",
    "GOBIERNO Y RELACIONES INTERNACIONALES",
    "INGENIERIA AMBIENTAL Y SANEAMIENTO",
    "INGENIERIA CIVIL",
  ];

  const PERIODOS_PERMITIDOS = ["Todos", "1", "2"];
  const VERSION_PERMITIDOS = ["Todos", "Preliminar", "Final"];

  // Auto-seleccionar programa para coordinadores
  useEffect(() => {
    if (programaCoordinadorId && userRol === "Coordinador") {
      const programaNombre = programasIdMap[programaCoordinadorId];
      if (programaNombre) {
        setSelectedPrograma(programaNombre);
      }
    }
  }, [programaCoordinadorId, userRol]);

  const downloadCSV = async (filters) => {
    const params = new URLSearchParams();
    
    if (filters.programa) params.append('programa', filters.programa);
    if (filters.año) params.append('anio', filters.año);
    if (filters.periodo) params.append('periodo', filters.periodo);
    if (filters.version) params.append('version', filters.version);

    try {
      const response = await fetch(`https://spc-backend-r97v.onrender.com/proyeccion/exportar-proyecciones?${params.toString()}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al descargar el archivo');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'proyecciones.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error al descargar:', error);
      toast.error(error.message);
    }
  };

  const handleDownload = () => {
    const filters = {
      programa: selectedPrograma === "Todos" ? null : selectedPrograma,
      año: selectedAño ? selectedAño.getFullYear().toString() : null,
      periodo: selectedPeriodo === "Todos" ? null : selectedPeriodo,
      version: selectedVersion === "Todos" ? null : selectedVersion,
    };
    
    downloadCSV(filters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      {/* Componente ValidacionDatos (invisible) */}
      <ValidacionDatos onDatosRecibidos={setProgramaCoordinadorId} />
      
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Filtrar para Descargar Proyección</h2>
        
        {/* Programa */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Programa</label>
          <select
            className="bg-gray-100 p-3 rounded-lg block w-full"
            value={selectedPrograma}
            onChange={(e) => setSelectedPrograma(e.target.value)}
            disabled={userRol === "Coordinador"}
          >
            {PROGRAMAS_PERMITIDOS.map((programa) => (
              <option key={programa} value={programa}>
                {programa}
              </option>
            ))}
          </select>
          {userRol === "Coordinador" && (
            <p className="text-sm text-gray-500 mt-1">
              * Como coordinador, solo puedes descargar datos de tu programa
            </p>
          )}
        </div>

        {/* Año */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Año</label>
          <DatePicker
            selected={selectedAño}
            onChange={(date) => setSelectedAño(date)}
            showYearPicker
            dateFormat="yyyy"
            className="bg-gray-100 p-3 rounded-lg block w-full"
            placeholderText="Seleccione un año"
          />
        </div>

        {/* Periodo */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Periodo</label>
          <select
            className="bg-gray-100 p-3 rounded-lg block w-full"
            value={selectedPeriodo}
            onChange={(e) => setSelectedPeriodo(e.target.value)}
          >
            {PERIODOS_PERMITIDOS.map((periodo) => (
              <option key={periodo} value={periodo}>
                {periodo}
              </option>
            ))}
          </select>
        </div>

        {/* Versión */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Versión</label>
          <select
            className="bg-gray-100 p-3 rounded-lg block w-full"
            value={selectedVersion}
            onChange={(e) => setSelectedVersion(e.target.value)}
          >
            {VERSION_PERMITIDOS.map((version) => (
              <option key={version} value={version}>
                {version}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-black py-2 px-4 rounded-lg hover:bg-gray-400 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleDownload}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Descargar
          </button>
        </div>
      </div>
    </div>
  );
}