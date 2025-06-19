import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-hot-toast";
import ImgLogin from "../assets/Iconos/imagenLogin.jpg";
import LogoAutonoma from "../assets/Iconos/logo_white.png";

export function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      data.correo = data.correo.toLowerCase();
      const res = await axios.post("http://localhost:8000/api/login/", data);
      const { token, user } = res.data;
      Cookies.set("token", token, { expires: 7 });
      Cookies.set("user", JSON.stringify(user), { expires: 7 });
      Cookies.set("userId", user.id, { expires: 7 });
      Cookies.set("userRol", user.rol, { expires: 7 });
  
      toast.success("Login exitoso", { position: "top-center" });
      console.log("Login exitoso", res.data);
  
      // Redirige según rol
      if (user.rol === "Administrador") {
        navigate("/dashboard");
      } else if (user.rol === "Coordinador") {
        navigate("/dashboard-coordinador");
      } else if (user.rol === "Vicerrector") {
        navigate("/dashboard-vicerrector");
      } else {
        toast.error("Rol no válido", { position: "top-center" });
      }
  
    } catch (error) {
      console.error(error);
      toast.error("Credenciales incorrectas", { position: "top-center" });
    }
    setLoading(false);
  };
  

  return (
    <div className="min-h-screen flex">
      {/* Columna Izquierda: Imagen y texto descriptivo */}
      <div className="w-1/2 bg-white flex flex-col items-center justify-center">
        <p className="text-[#00498B] font-bold text-2xl mb-12 ">
          SISTEMA DE PROYECCIÓN DE CURSOS
        </p>

        {/* Imagen con overlay azul */}
        <div className="relative w-[390px] h-[360px] mb-4 border rounded overflow-hidden">
          <img
            src={ImgLogin}
            alt="Coorporacion Universitaria Autonoma del Cauca"
            className="w-full h-full object-cover"
          />
          {/* Overlay azul semitransparente */}
          <d className="absolute inset-0 bg-[#00498B] opacity-30 pointer-events-none"></d>
        </div>
      </div>

      {/* Columna Derecha: Formulario de Login */}
      <div className="w-1/2 bg-[#00498B] flex flex-col items-center justify-center p-8">
        <img src={LogoAutonoma} alt="Logo Autonoma" className="w-[30%] mb-4" />
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl text-[#00498B] font-bold mb-6 text-center">
            Inicia sesión
          </h2>
          <h2 className="text-sm text-black mb-6 text-left">
            Por favor, ingresa tus datos:
          </h2>
          <form onSubmit={handleSubmit(onSubmit)}>
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
              className="w-full p-3 mb-4 border rounded"
            />
            {errors.correo && (
              <p className="text-red-500 mb-4">{errors.correo.message}</p>
            )}

            <input
              type="password"
              placeholder="Contraseña"
              {...register("password", {
                required: "La contraseña es requerida",
              })}
              className="w-full p-3 mb-4 border rounded"
            />
            {errors.password && (
              <p className="text-red-500 mb-4">{errors.password.message}</p>
            )}

            

            <button
              type="submit"
              className=" w-full bg-[#00498B] text-white py-3 rounded hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? "Iniciando..." : "Iniciar sesión"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
