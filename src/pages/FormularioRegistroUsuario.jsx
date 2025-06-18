import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { Menu } from "../components/Menu";
import menuIcon from "../assets/menu.png";

import {
  createUsuarios,
  deleteUsuarios,
  updateUsuarios,
  getUsuarios,
} from "../api/registroUsuarios.api";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

const PROGRAMAS_PERMITIDOS = [
  "Coordinador Programas Contaduría Pública",
  "Coordinador Finanzas y Negocios Internacionales",
  "Coordinador Facultad Ciencias Ambientales y Desarrollo Sostenible",
  "Coordinadora Programa Ingeniería Electrónica",
  "Coordinador Programa Ingeniería de Software y Computación",
  "Coordinación Entrenamiento Deportivo",
  "Coordinación Gobierno y Relaciones Internacionales",
  "Coordinador del programa de Ing. Ambiental y Saneamiento",
  "Coordinadora del programa de Ingeniería Civil",
];



export function FormularioRegistroUsuarios() {

  const [isMenuOpen, setIsMenuOpen] = useState(false);


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Cambia el estado del menú
  };

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


  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();
  const navigate = useNavigate();
  const params = useParams();
  const rol = watch("rol", "");
  

  const onSubmit = handleSubmit(async (data) => {
    if (data.rol !== "Coordinador") {
      data.programa = "";
    }

    if (params.id && (!data.password || data.password.trim() === "")) {
      delete data.password;
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
    } else {
      await createUsuarios(data);
      toast.success("Usuario creado", {
        position: "top-right",
        style: {
          background: "#101010",
          color: "#fff",
        },
      });
    }
    navigate("/lista-usuarios");
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#d7e9ff] to-[#ffffff]">
      {/* Header */}
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
              <h1 className="text-md font-semibold mb-4">
                {user?.nombre || 'Desconocido'}
              </h1>
              <p className="text-lg">{user?.rol || 'Desconocido'}</p>
            </div>
          </div>

          {/* Sección de título */}
          <div className="bg-gradient-to-r from-[#00498B] to-[#001325] text-white py-8 px-8 text-xl font-bold w-4/5 flex justify-between items-center">
            <h1 className="text-lg font-semibold">REGISTRAR USUARIOS</h1>
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

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white w-full max-w-4xl mx-auto px-10 py-16 mt-16 mb-16 rounded-lg shadow-md">
          <form onSubmit={onSubmit}>
            <h2 className="text-xl font-bold text-[#00498B] mb-6">
            Ingrese los Datos
            </h2>
            <input
              type="text"
              placeholder="Nombres y apellidos"
              {...register("nombre", { required: true })}
              className="bg-gray-100 p-3 rounded-lg block w-full mb-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1572E8]"
            />
            {errors.nombre && (
              <span className="text-red-500 text-sm">El nombre es requerido</span>
            )}

            <input
              type="email"
              placeholder="Correo"
              {...register("correo", {
                required: "El correo es requerido",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Ingresa un correo válido",
                },
              })}
              className="bg-gray-100 p-3 rounded-lg block w-full mb-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1572E8]"
            />
            {errors.correo && (
              <span className="text-red-500 text-sm">{errors.correo.message}</span>
            )}

            <input
              type="password"
              placeholder="Contraseña"
              {...register("password", {
                required: !params.id ? "El password es requerido" : false,
              })}
              className="bg-gray-100 p-3 rounded-lg block w-full mb-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1572E8]"
            />
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password.message}</span>
            )}

            <select
              {...register("rol", { required: "El rol es requerido" })}
              className="bg-gray-100 p-3 rounded-lg block w-full mb-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1572E8]"
            >
              <option value="" disabled>
                Seleccione un rol
              </option>
              <option value="Administrador">Administrador</option>
              <option value="Coordinador">Coordinador</option>
              <option value="Vicerrector">Vicerrector</option>
            </select>
            {errors.rol && (
              <span className="text-red-500 text-sm">{errors.rol.message}</span>
            )}

            {rol === "Coordinador" && (
              <select
                {...register("programa", {
                  required: "El programa es requerido para Coordinador",
                })}
                className="bg-gray-100 p-3 rounded-lg block w-full mb-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1572E8]"
              >
                <option value="">Seleccione un programa</option>
                {PROGRAMAS_PERMITIDOS.map((prog, index) => (
                  <option key={index} value={prog}>
                    {prog}
                  </option>
                ))}
              </select>
            )}
            {rol === "Coordinador" && errors.programa && (
              <span className="text-red-500 text-sm">{errors.programa.message}</span>
            )}

            <div className="flex items-center mb-3">
              <input
                type="checkbox"
                id="is_active"
                {...register("is_active")}
                className="mr-2"
              />
              <label htmlFor="is_active" className="text-gray-700">
                Activo
              </label>
            </div>

            <div className="flex justify-end mt-4">
              <button
                className="bg-[#1572E8] text-white px-4 py-2 rounded-lg w-full hover:bg-[#0f5fc7] transition-all duration-300"
              >
                Guardar
              </button>
            </div>
          </form>

          {params.id && (
            <div className="flex justify-end mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg w-full hover:bg-red-700 transition-all duration-300"
                onClick={async () => {
                  const accepted = window.confirm("¿Estás seguro?");
                  if (accepted) {
                    await deleteUsuarios(params.id);
                    toast.success("Usuario eliminado", {
                      position: "top-right",
                      style: {
                        background: "#101010",
                        color: "#fff",
                      },
                    });
                    navigate("/lista-usuarios");
                  }
                }}
              >
                Eliminar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
        <footer className="bg-gradient-to-r from-[#00498B] to-[#001325] text-white py-4 fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center">
        <div className="text-center">
          <p>© 2025 Sistema de Proyección de Cursos</p>
          <p className="mt-1">Contacto: <a href="mailto:fredy.perez.i@uniautonoma.edu.co" className="hover:text-blue-300">fredy.perez.i@uniautonoma.edu.co</a><a href="mailto:juan.delgado.c@uniautonoma.edu.co" className="hover:text-blue-300"> - juan.delgado.c@uniautonoma.edu.co</a><a> - </a><a href="mailto:juan.valencia.c@uniautonoma.edu.co" className="hover:text-blue-300">juan.valencia.c@uniautonoma.edu.co</a></p>

        </div>
      </footer>
    </div>
  );
}