import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Menu } from "../components/Menu";
import menuIcon from "../assets/menu.png";

// Importa los íconos
import IconModUser from "../assets/Iconos/gui-user-edit-svgrepo-com.png";
import IconRegUser from "../assets/Iconos/new-user-svgrepo-com.png";

// Componente reutilizable para botón rojo/azul
function RedButton({ children, onClick, type = "button", className = "" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-2 rounded transition-colors duration-300 ${className}`}
    >
      {children}
    </button>
  );
}

export function GestionUsuarios() {

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Cambia el estado del menú
  };

  const navigate = useNavigate();
  const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="flex w-full">
          {/* Sección de usuario */}
          <div className="bg-[#1572E8] text-white py-4 px-4 text-xl font-bold w-1/5 flex items-center space-x-4">
            <div>
              <img
                src={menuIcon}
                alt="Menu"
                className="w-6 h-6 ml-5"
                onClick={toggleMenu}
              />
            </div>
            <div>
              <h1 className="text-md font-semibold mb-4">
                {user?.nombre || "Desconocido"}
              </h1>
              <p className="text-lg">{user?.rol || "Desconocido"}</p>
            </div>
          </div>

          {/* Sección de título + Botón "Volver" */}
          <div className="bg-gradient-to-r from-[#00498B] to-[#001325] text-white py-8 px-8 text-xl font-bold w-4/5 flex justify-between items-center">
            <h1 className="text-lg font-semibold">GESTIÓN DE USUARIOS</h1>
            <RedButton onClick={() => navigate("/dashboard")}>Inicio</RedButton>
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
      <div className="flex-grow flex items-center justify-center mt-20">
        <div className="bg-[#d7e9ff] w-full max-w-4xl mx-auto px-10 py-16 rounded-lg flex items-center justify-center space-x-20 shadow-md">
          {/* Registrar usuario */}
          <div className="flex flex-col items-center">
            <img
              src={IconRegUser}
              alt="Registrar Usuario"
              className="w-20 h-20 mb-2"
            />
            <Link to="/formulario-registro-usuarios">
              <button className="font-bold bg-[#1572E8] px-3 py-2 rounded-lg text-white hover:bg-[#0f5fc7] transition-all duration-300">
                Registrar usuario
              </button>
            </Link>
          </div>

          {/* Modificar usuario */}
          <div className="flex flex-col items-center">
            <img
              src={IconModUser}
              alt="Modificar Usuario"
              className="w-20 h-20 mb-2"
            />
            <Link to="/lista-usuarios">
              <button className="font-bold bg-[#1572E8] px-3 py-2 rounded-lg text-white hover:bg-[#0f5fc7] transition-all duration-300">
                Modificar usuario
              </button>
            </Link>
          </div>
        </div>
      </div>

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
