import { useEffect, useState } from "react";
import { getAllUsuarios } from "../api/registroUsuarios.api";
import { UsuariosCard } from "./UsuariosCard";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Menu } from "../components/Menu";
import menuIcon from "../assets/menu.png";



export function UsuariosList() {

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Cambia el estado del menú
  };


  const navigate = useNavigate();

  const [registroUsuarios, setUsuarios] = useState([]);

  useEffect(() => {
    async function loadUsuarios() {
      const res = await getAllUsuarios();
      setUsuarios(res.data);
    }
    loadUsuarios();
  }, []);
  const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;

  function regresarfiltros(){
      navigate("/gestion-usuarios")
    }
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
      </div>)}


  return (
  <div className="w-full m-0 p-0">

  {/* header */}
  <div className="mb-40">
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
                {user?.nombre || 'Desconocido'}
              </h1>
              <p className="text-lg">{user?.rol || 'Desconocido'}</p>
            </div>
          </div>

          {/* Sección de título */}
          <div className="bg-gradient-to-r from-[#00498B] to-[#001325] text-white py-8 px-8 text-xl font-bold w-4/5 flex justify-between items-center">
            <h1 className="text-lg font-semibold">MODIFICAR USUARIOS</h1>
            <DualButtons
              leftButton={{
                label: "Volver",
                className: "mr-2",
              }}
              rightButton={{
                label: "Inicio",
                
              }}
            />
          </div>
        </div>
      </header>
  </div>
  
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

  {/* Mapeo de registros de usuarios */}
  <div >
    <div className="m-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Agregado el margen inferior mb-8 */}
      {registroUsuarios.map((registroUsuarios) => (
        <UsuariosCard
          key={registroUsuarios.id}
          registroUsuarios={registroUsuarios}
        />
      ))}
    </div> 
  </div>

  {/* Footer */}
  <div className="mt-40">
    <footer className="bg-gradient-to-r from-[#00498B] to-[#001325] text-white py-4 fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center">
        <div className="text-center">
          <p>© 2025 Sistema de Proyección de Cursos</p>
          <p className="mt-1">Contacto: <a href="mailto:fredy.perez.i@uniautonoma.edu.co" className="hover:text-blue-300">fredy.perez.i@uniautonoma.edu.co</a><a href="mailto:juan.delgado.c@uniautonoma.edu.co" className="hover:text-blue-300"> - juan.delgado.c@uniautonoma.edu.co</a><a> - </a><a href="mailto:juan.valencia.c@uniautonoma.edu.co" className="hover:text-blue-300">juan.valencia.c@uniautonoma.edu.co</a></p>

        </div>
      </footer>
  </div>  
</div>

  );
}
