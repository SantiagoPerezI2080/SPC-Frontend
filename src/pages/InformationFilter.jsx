import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { FilterPopup } from "../components/FilterPopup";
import { ValidacionDatos } from "../components/ValidacionDatos";
import { Menu } from "../components/Menu";
import menuIcon from "../assets/menu.png";

// Componente reutilizable para botón azul (estilo de la primera página)
function BlueButton({ children, onClick, type = "button", className = "" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-[#1572E8] hover:bg-[#0f5fc7] text-white font-semibold py-1 px-2 rounded transition-colors duration-300 ${className}`}
    >
      {children}
    </button>
  );
}

export function InformationFilter() {
  const navigate = useNavigate();
  const [selectedTipo, setSelectedTipo] = useState("proyecciones");
  const [selectedPrograma, setSelectedPrograma] = useState("Todos");
  const [selectedAño, setSelectedAño] = useState(null);
  const [selectedPeriodo, setSelectedPeriodo] = useState("Todos");
  const [selectedSemestre, setSelectedSemestre] = useState("Todos");
  const [selectedVersion, setSelectedVersion] = useState("Todos");
  const [selectedCurso, setSelectedCurso] = useState("Todos");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [userRol, setUserRol] = useState(Cookies.get("userRol"));
  const [programaCoordinador, setProgramaCoordinador] = useState(null);

  const TIPOS_VISUALIZACION = [
    { value: "proyecciones", label: "Proyecciones" },
    { value: "cursos", label: "Cursos" },
    { value: "comportamiento", label: "Comportamiento" }
  ];

  const PROGRAMAS_PERMITIDOS = [
    "Todos",
    "EDUCACIÓN INFANTIL",
    "CONTADURÍA PÚBLICA",
    "FINANZAS Y NEGOCIOS INTERNACIONALES",
    "INGENIERÍA ELECTRÓNICA",
    "INGENIERÍA DE SOFTWARE Y COMPUTACIÓN",
    "ENTRENAMIENTO DEPORTIVO",
    "GOBIERNO Y RELACIONES INTERNACIONALES",
    "INGENIERÍA AMBIENTAL Y SANEAMIENTO",
    "INGENIERÍA CIVIL"
  ];

  const PERIODOS_PERMITIDOS = ["Todos", "1", "2"];

  const SEMESTRE_PERMITIDOS = [
    "Todos",
    "Primero",
    "Segundo",
    "Tercero",
    "Cuarto",
    "Quinto",
    "Sexto",
    "Séptimo",
    "Octavo",
    "Noveno"
  ];

  const VERSION_PERMITIDOS = ["Todos", "Preliminar", "Final"];

  const CURSOS_PERMITIDOS = [
    "Todos",
    "ALGEBRA MODERNA",
    "INTRODUCCION A LA INGENIERÍA",
    "INTRODUCCIÓN A LA PROGRAMACIÓN",
    "CALCULO I",
    "ALGEBRA LINEAL",
    "FISICA I",
    "PROGRAMACION I",
    "CALCULO II",
    "MATEMATICAS DISCRETAS",
    "FISICA II",
    "ARQUITECTURA DE COMPUTADORES",
    "PROGRAMACION II",
    "ECUACIONES DIFERENCIALES",
    "BASE DE DATOS I",
    "ESTRUCTURA DE DATOS",
    "INGENIERIA DEL SOFTWARE I",
    "PROBABILIDAD COMPUTACIONAL Y ESTADISTICA",
    "BASE DE DATOS II",
    "COMPLEJIDAD ALGORITMICA",
    "DESARROLLO APLICACIONES WEB",
    "INGENIERIA DEL SOFTWARE II",
    "ANALISIS NUMÉRICO",
    "ARQUITECTURA DE SISTEMAS OPERATIVOS",
    "BASE DE DATOS AVANZADAS",
    "TEORIA DE LA COMPUTACION",
    "DESARROLLO DE APLICACIONES MÓVILES",
    "CALIDAD DEL SOFTWARE I",
    "MODELADO PARA LA COMPUTACIÓN",
    "REDES DE COMPUTADORES",
    "SEGURIDAD INFORMATICA",
    "ARQUITECTURA DE SOFTWARE",
    "CALIDAD DE SOFTWARE II",
    "GESTIÓN DE REDES",
    "SISTEMA DE INFORMACIÓN EMPRESARIAL",
    "ELECTIVA I (Optativa)",
    "ELECTIVA III (Especializada)",
    "ELECTIVA V (Especizalizada)",
    "HCI",
    "PRACTICA PROFESIONAL",
    "GESTIÓN TECNOLÓGICA Y FINANCIERA",
    "ELECTIVA II (Optativa)",
    "ELECTIVA IV (Especializada)",
    "ELECTIVA VI (Especializada)",
    "96 HORAS SEMINARIOS DE ACTUALIZACION",
    "CERT ACTIVIDAD DEP FORMATIVO"
  ];

  // Mapeo de IDs de programa a nombres
  const programasIdMap = {
    1: "CONTADURÍA PÚBLICA",
    2: "FINANZAS Y NEGOCIOS INTERNACIONALES",
    3: "CIENCIAS AMBIENTALES Y DESARROLLO SOSTENIBLE",
    4: "INGENIERÍA ELECTRÓNICA",
    5: "INGENIERÍA DE SOFTWARE Y COMPUTACIÓN",
    6: "ENTRENAMIENTO DEPORTIVO",
    7: "GOBIERNO Y RELACIONES INTERNACIONALES",
    8: "INGENIERÍA AMBIENTAL Y SANEAMIENTO",
    9: "INGENIERÍA CIVIL"
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Cambia el estado del menú
  };

  // Efecto para actualizar el programa seleccionado cuando se recibe el ID del coordinador
  useEffect(() => {
    if (programaCoordinador && userRol === "Coordinador") {
      const programaNombre = programasIdMap[programaCoordinador];
      if (programaNombre) {
        setSelectedPrograma(programaNombre);
      }
    }
  }, [programaCoordinador, userRol]);

  const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;

  const handleVisualizarClick = () => {
    const filters = {
      tipo: selectedTipo,
      programa: selectedPrograma === "Todos" ? "" : selectedPrograma,
      año: selectedAño ? selectedAño.getFullYear().toString() : "",
      periodo: selectedPeriodo === "Todos" ? "" : selectedPeriodo,
      semestre: selectedSemestre === "Todos" ? "" : selectedSemestre,
      version: selectedVersion === "Todos" ? "" : selectedVersion,
      curso: selectedCurso === "Todos" ? "" : selectedCurso
    };

    navigate("/visualizar-proyecciones", { state: { filters } });
  };

  const handleDownloadClick = () => {
    setIsPopupOpen(true);
  };

  const handleDownload = (filters) => {
    const query = new URLSearchParams(filters).toString();
    window.open(`/proyeccion/exportar-proyecciones?${query}`, "_blank");
  };

  const isFiltrosDisabled = selectedTipo !== "proyecciones";
  const opacityClass = isFiltrosDisabled ? "opacity-50" : "opacity-100";

  function rolnavigation() {
    const userRol = Cookies.get("userRol");
    if (userRol === "Coordinador") {
      navigate("/dashboard-coordinador");
    } else if (userRol === "Vicerrector") {
      navigate("/dashboard-vicerrector");
    } else {
      navigate("/dashboard");
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Componente ValidacionDatos (invisible) */}
      <ValidacionDatos onDatosRecibidos={setProgramaCoordinador} />
      
      {/* Header fijo */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="flex w-full">
          {/* Sección de usuario */}
          <div className="bg-[#1572E8] text-white py-4 px-4 text-xl font-bold w-1/5 flex items-center space-x-4">
            <div>
              <img
                src={menuIcon}
                alt="Menu"
                className="w-6 h-6 ml-3"
                onClick={toggleMenu}
              />
            </div>
            <div>
              <h1 className="text-md font-semibold mb-4">
                {user && user.nombre ? user.nombre : "Desconocido"}
              </h1>
              <p className="text-lg ">{user ? user.rol : "Desconocido"}</p>
            </div>
          </div>

          {/* Sección de título */}
          <div className="bg-gradient-to-r from-[#00498B] to-[#001325] text-white py-8 px-8 text-xl font-bold w-4/5 flex justify-between items-center">
            <h1 className="text-lg font-semibold">VISUALIZAR INFORMACIÓN</h1>
            <BlueButton onClick={rolnavigation}>Inicio</BlueButton>
          </div>
        </div>
      </header>
      {/* Popup del menú */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-auto font-bold relative">
            <button
              className="text-xl text-blue-700 absolute top-4 right-4 hover:text-gray-900 font-bold"
              onClick={toggleMenu}
            >
              X
            </button>
            <Menu /> {/* Renderizar el componente del menú */}
          </div>
        </div>)}

      {/* Contenido principal */}
      <div className="flex justify-center items-center flex-1 mt-32 pt-4 mb-40 mt-20">
        <div className="bg-[#d7e9ff] p-10 rounded-lg max-w-4xl w-full">
          <h2 className="text-xl font-bold mb-6 text-[#00498B]">Filtros de visualización:</h2>

          {/* Tipo de Visualización */}
          <div className="mb-6">
            <label className="block mb-2 font-semibold text-gray-700">Tipo de Visualización</label>
            <select
              className="block w-full p-3 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1572E8] focus:border-transparent"
              value={selectedTipo}
              onChange={(e) => setSelectedTipo(e.target.value)}
            >
              {TIPOS_VISUALIZACION.map((tipo) => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filtros (solo habilitados para proyecciones) */}
          <div className={opacityClass}>
            {/* Programa */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-700">Programa</label>
              <select
                className="block w-full p-3 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1572E8] focus:border-transparent"
                value={selectedPrograma}
                onChange={(e) => setSelectedPrograma(e.target.value)}
                disabled={isFiltrosDisabled || userRol === "Coordinador"}
              >
                {PROGRAMAS_PERMITIDOS.map((programa) => (
                  <option key={programa} value={programa}>
                    {programa}
                  </option>
                ))}
              </select>
            </div>

            {/* Año */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-700">Año</label>
              <DatePicker
                selected={selectedAño}
                onChange={(date) => setSelectedAño(date)}
                showYearPicker
                dateFormat="yyyy"
                className="block w-full p-3 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1572E8] focus:border-transparent"
                placeholderText="Seleccione un año"
                disabled={isFiltrosDisabled}
              />
            </div>

            {/* Periodo */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-700">Periodo</label>
              <select
                className="block w-full p-3 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1572E8] focus:border-transparent"
                value={selectedPeriodo}
                onChange={(e) => setSelectedPeriodo(e.target.value)}
                disabled={isFiltrosDisabled}
              >
                {PERIODOS_PERMITIDOS.map((periodo) => (
                  <option key={periodo} value={periodo}>
                    {periodo}
                  </option>
                ))}
              </select>
            </div>

            {/* Semestre */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-700">Semestre</label>
              <select
                className="block w-full p-3 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1572E8] focus:border-transparent"
                value={selectedSemestre}
                onChange={(e) => setSelectedSemestre(e.target.value)}
                disabled={isFiltrosDisabled}
              >
                {SEMESTRE_PERMITIDOS.map((semestre) => (
                  <option key={semestre} value={semestre}>
                    {semestre}
                  </option>
                ))}
              </select>
            </div>

            {/* Versión */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-700">Versión</label>
              <select
                className="block w-full p-3 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1572E8] focus:border-transparent"
                value={selectedVersion}
                onChange={(e) => setSelectedVersion(e.target.value)}
                disabled={isFiltrosDisabled}
              >
                {VERSION_PERMITIDOS.map((version) => (
                  <option key={version} value={version}>
                    {version}
                  </option>
                ))}
              </select>
            </div>

            {/* Curso */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-700">Curso</label>
              <select
                className="block w-full p-3 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1572E8] focus:border-transparent"
                value={selectedCurso}
                onChange={(e) => setSelectedCurso(e.target.value)}
                disabled={isFiltrosDisabled}
              >
                {CURSOS_PERMITIDOS.map((curso) => (
                  <option key={curso} value={curso}>
                    {curso}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Botones Visualizar y Descargar */}
          <div className="mt-8 flex justify-center space-x-4">
            <BlueButton onClick={handleVisualizarClick} className="px-6 py-3">
              Visualizar
            </BlueButton>
            <BlueButton onClick={handleDownloadClick} className="px-6 py-3">
              Descargar
            </BlueButton>
          </div>
        </div>
      </div>

      {/* Popup de filtros para descarga */}
      <FilterPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onDownload={handleDownload}
      />

      {/* Footer */}
     <footer className="mt-10 bg-gradient-to-r from-[#00498B] to-[#001325] text-white py-4 fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center">
        <div className="text-center">
          <p>© 2025 Sistema de Proyección de Cursos</p>
          <p className="mt-1">Contacto: <a href="mailto:fredy.perez.i@uniautonoma.edu.co" className="hover:text-blue-300">fredy.perez.i@uniautonoma.edu.co</a><a href="mailto:juan.delgado.c@uniautonoma.edu.co" className="hover:text-blue-300"> - juan.delgado.c@uniautonoma.edu.co</a><a> - </a> <a href="mailto:juan.valencia.c@uniautonoma.edu.co" className="hover:text-blue-300">juan.valencia.c@uniautonoma.edu.co</a></p>

        </div>
      </footer>

    </div>
  );
}