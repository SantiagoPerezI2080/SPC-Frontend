import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { ListarProyecciones } from "../components/ListarProyecciones";
import { ListarCursos } from "../components/listarcursos";
import { ListarComportamiento } from "../components/ListarComportamiento";
import { Menu } from "../components/Menu";
import menuIcon from "../assets/menu.png";

export function VisualizarProyecciones() {
  const [types, setTypes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const [appliedFilters, setAppliedFilters] = useState({});
  const [selectedTipo, setSelectedTipo] = useState("proyecciones");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.filters) {
      setAppliedFilters(location.state.filters);
      setSelectedTipo(location.state.filters.tipo || "proyecciones");
    }

    const fetchedUser = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;
    setUser(fetchedUser);

    axios.get('http://localhost:8000/api/uploaded/')
      .then(res => setTypes(res.data.types))
      .catch(() => toast.error('Error al listar archivos', { position: 'top-center' }));
  }, [location.state]);

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

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Cambia el estado del menú
  };

  function regresarfiltros(){
    navigate("/filtro-de-informacion")
  }

 function DualButtons({ leftButton, rightButton }) {
  return (
    <div className="inline-flex rounded overflow-hidden border-[#1572E8]">
      <button
        type={leftButton.type || "button"}
        onClick={regresarfiltros}
        className={`bg-[#1572E8] hover:bg-[#0f5fc7] text-white font-semibold py-1 px-2 transition-colors duration-300 rounded-l ${leftButton.className || ""}`}
      >
        {leftButton.label}
      </button>
      <button
        type={rightButton.type || "button"}
        onClick={rolnavigation}
        className={`bg-[#1572E8] hover:bg-[#0f5fc7] text-white font-semibold py-1 px-2 transition-colors duration-300 rounded-r ${rightButton.className || ""}`}
      >
        {rightButton.label}
      </button>
    </div>
  );

}
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#d7e9ff] to-[#ffffff] w-full">
      {/* Header fijo */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="flex w-full">
          {/* Sección de usuario */}
          <div className="bg-[#1572E8] text-white py-4 px-4 text-lg font-bold w-1/5 flex items-center space-x-4">
            <div>
              <img
                src={menuIcon}
                alt="Menu"
                className="w-6 h-6 ml-3"
                onClick={toggleMenu}
              />
            </div>
            <div>
              <h1 className="text-md font-bold mb-4">
                {user?.nombre || 'Desconocido'}
              </h1>
              <p className="text-md">{user?.rol || 'Desconocido'}</p>
            </div>
          </div>

          {/* Sección de título */}
          <div className="bg-gradient-to-r from-[#00498B] to-[#001325] text-white py-8 px-8 text-xl font-bold w-4/5 flex justify-between items-center">
            <h1 className="text-lg font-semibold">
              VISUALIZAR {selectedTipo === "proyecciones" ? "PROYECCIONES" : 
                         selectedTipo === "cursos" ? "CURSOS" : "COMPORTAMIENTO"}
            </h1>
            <DualButtons
              leftButton={{
                label: "Volver",
                className: "mr-2",
              }}
              rightButton={{
                label: "Inicio",
                onClick: () => alert("Botón derecho presionado"),
              }}
            />
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
      <main className="flex flex-1 pt-24 pb-16"> {/* Añadido padding para el header fijo */}
        <div className="w-full px-8">
          {selectedTipo === "proyecciones" && (
            <ListarProyecciones 
              searchQuery={searchQuery} 
              appliedFilters={appliedFilters} 
            />
          )}
          {selectedTipo === "cursos" && <ListarCursos searchQuery={searchQuery}/>}
          {selectedTipo === "comportamiento" && <ListarComportamiento searchQuery={searchQuery}/>}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#00498B] to-[#001325] text-white py-4 fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center">
        <div className="text-center">
          <p>© 2025 Sistema de Proyección de Cursos</p>
          <p className="mt-1">Contacto: <a href="mailto:fredy.perez.i@uniautonoma.edu.co" className="hover:text-blue-300">fredy.perez.i@uniautonoma.edu.co</a><a href="mailto:juan.delgado.c@uniautonoma.edu.co" className="hover:text-blue-300"> - juan.delgado.c@uniautonoma.edu.co</a><a> - </a> <a href="mailto:juan.valencia.c@uniautonoma.edu.co" className="hover:text-blue-300">juan.valencia.c@uniautonoma.edu.co</a></p>
        </div>
      </footer>
    </div>
  );
}