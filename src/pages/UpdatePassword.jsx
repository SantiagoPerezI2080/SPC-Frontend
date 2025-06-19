import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { updateUsuarios, getUsuarios } from "../api/registroUsuarios.api";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Menu } from "../components/Menu";
import menuIcon from "../assets/menu.png";

export function UpdatePassword() {

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

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();
  const navigate = useNavigate();
  const params = useParams();

  const nuevaPassword = watch("password");
  const confirmarPassword = watch("confirmarPassword");


  const onSubmit = handleSubmit(async (data) => {
    if (nuevaPassword !== confirmarPassword) {
      toast.error("Las contraseñas no coinciden", {
        position: "top-right",
        style: { background: "#101010", color: "#fff" },
      });
      return;
    }

    if (params.id) {
      await updateUsuarios(params.id, data);
      toast.success("Usuario actualizado", {
        position: "top-right",
        style: {
          background: "#101010",
          color: "#fff",
        },
      });
      rolnavigation();
    }
  });

  useEffect(() => {
    async function loadUsuarios() {
      if (params.id) {
        const {
          data: { nombre, correo, rol, programa, is_active },
        } = await getUsuarios(params.id);
        setValue("nombre", nombre);
        setValue("correo", correo);
        setValue("rol", rol);
        setValue("programa", programa);
        setValue("is_active", is_active);
      }
    }
    loadUsuarios();
  }, []);

  const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;

  const [isMenuOpen, setIsMenuOpen] = useState(false);


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Cambia el estado del menú
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#d7e9ff] to-[#ffffff]">
      {/* Header fijo */}
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
            <h1 className="text-lg font-semibold">ACTUALIZAR CONTRASEÑA</h1>
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

      <main className="flex flex-1 justify-center items-center">
        <form
          onSubmit={onSubmit}
          className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md"
        >
          <h2 className="text-xl font-bold text-[#00498B] mb-6">
            Cambiar Contraseña
          </h2>
          <div className="mb-4">
            <label className="block font-semibold text-gray-700 mb-2">
              Nueva Contraseña
            </label>
            <input
              type="password"
              {...register("password", { required: true })}
              className="block w-full p-3 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1572E8] focus:border-transparent"
            />
            {errors.password && (
              <span className="text-red-500 text-sm">
                Este campo es obligatorio.
              </span>
            )}
          </div>
          <div className="mb-4">
            <label className="block font-semibold text-gray-700 mb-2">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              {...register("confirmarPassword", { required: true })}
              className="block w-full p-3 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1572E8] focus:border-transparent"
            />
            {errors.confirmarPassword && (
              <span className="text-red-500 text-sm">
                Este campo es obligatorio.
              </span>
            )}
          </div>
          <button
            type="submit"
            className="bg-[#1572E8] hover:bg-[#0f5fc7] text-white font-semibold py-2 px-4 rounded-lg w-full transition-colors duration-300"
          >
            Guardar Cambios
          </button>
        </form>
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
