// src/pages/Dashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
// Importa los íconos
import uploadIcon from "../assets/upload-svgrepo-com.png";
import viewIcon from "../assets/view-svgrepo-com.png";
import userCogIcon from "../assets/user-cog-svgrepo-com.png";

// Componente reutilizable para botón rojo
function RedButton({ children, onClick, type = "button", className = "" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-2 rounded transition-colors duration-300 ${className}`}
    >
      {children}
    </button>
  );
}

export function Dashboard() {
  const navigate = useNavigate();
  const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;

  const handleLogout = () => {
    // Elimina el token y los datos del usuario
    Cookies.remove("token");
    Cookies.remove("user");
    toast.success("Sesión finalizada", { position: "top-center" });
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="flex w-full">
          {/* Sección de usuario */}
          <div className="bg-[#1572E8] text-white py-4 px-4 text-lg font-bold w-1/5 flex items-center space-x-4">
            <div>
              <h1 className="text-md font-semibold mb-4 ml-8">
                {user && user.nombre ? user.nombre : "Desconocido"}
              </h1>
              <p className="text-md ml-8">{user ? user.rol : "Desconocido"}</p>
            </div>
          </div>

          {/* Sección de título + Botón "Cerrar sesión" */}
          <div className="bg-gradient-to-r from-[#00498B] to-[#001325] text-white py-4 px-8 text-lg font-bold w-4/5 flex justify-between items-center">
            <h1 className="text-lg font-semibold">SISTEMA DE PROYECCIÓN DE CURSOS</h1>
            <RedButton onClick={handleLogout}>Cerrar sesión</RedButton>
          </div>
        </div>
      </header>

      <div className="flex justify-center items-center flex-1">
        <div className="bg-[#d7e9ff] p-10 rounded-lg max-w-4xl w-full">
          <div className="flex flex-wrap justify-center items-center gap-10">
            {/* Cargar archivos */}
            <div className="flex flex-col items-center space-y-4">
              <img src={uploadIcon} alt="Cargar archivos" className="w-16 h-16" />
              <button
                onClick={() => navigate('/upload')}
                className="bg-[#1572E8] px-4 py-2 rounded-lg text-white font-bold hover:bg-[#0f5fc7] transition-all duration-300"
              >
                Cargar archivos
              </button>
            </div>

            {/* Visualizar proyecciones */}
            <div className="flex flex-col items-center space-y-4">
              <img
                src={viewIcon}
                alt="Visualizar proyecciones"
                className="w-16 h-16"
              />
              <button
                onClick={() => navigate('/filtro-de-informacion')}
                className="bg-[#1572E8] px-4 py-2 rounded-lg text-white font-bold hover:bg-[#0f5fc7] transition-all duration-300"
              >
                Visualizar proyecciones
              </button>
            </div>

            {/* Gestión de usuario */}
            <div className="flex flex-col items-center space-y-4">
              <img
                src={userCogIcon}
                alt="Gestión de usuario"
                className="w-16 h-16"
              />
              <Link to="/gestion-usuarios">
                <button className="bg-[#1572E8] px-4 py-2 rounded-lg text-white font-bold hover:bg-[#0f5fc7] transition-all duration-300">
                  Gestión de usuario
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer con tamaño igual al header */}
      <footer className="bg-gradient-to-r from-[#00498B] to-[#001325] text-white py-4 fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center">
        <div className="text-center">
          <p>© 2025 Sistema de Proyección de Cursos</p>
          <p className="mt-1">Contacto: <a href="mailto:fredy.perez.i@uniautonoma.edu.co" className="hover:text-blue-300">fredy.perez.i@uniautonoma.edu.co</a> <a> - </a> <a href="mailto:juan.delgado.c@uniautonoma.edu.co" className="hover:text-blue-300">juan.delgado.c@uniautonoma.edu.co</a><a> - </a> <a href="mailto:juan.valencia.c@uniautonoma.edu.co" className="hover:text-blue-300">juan.valencia.c@uniautonoma.edu.co</a></p>

        </div>
      </footer>
    </div>
  );
}
