import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import uploadIcon from "../assets/upload-svgrepo-com.png";
import viewIcon from "../assets/view-svgrepo-com.png";
import userCogIcon from "../assets/user-cog-svgrepo-com.png";
import IconModUser from "../assets/Iconos/gui-user-edit-svgrepo-com.png";
import IconRegUser from "../assets/Iconos/new-user-svgrepo-com.png";

export function Menu() {
  const navigate = useNavigate();
  
  // Leer datos desde las cookies
  const userRol = Cookies.get("userRol");
  const userId = Cookies.get("userId");

  return (
    <div className="flex justify-center gap-6 mt-10">
      {/* Mostrar solo si es administrador */}
      {userRol === "Administrador" && (
        <div
          className="cursor-pointer hover:scale-110 transition-transform bg-white shadow-lg rounded-lg p-4 flex flex-col items-center w-auto"
          onClick={() => navigate("/upload")}
        >
          <img src={uploadIcon} alt="Upload" className="w-16 h-16" />
          <p className="font-bold mb-6 text-[#00498B]">Subir Archivos</p>
        </div>
      )}

      {/* Mostrar a todos los usuarios */}
      <div
        className="cursor-pointer hover:scale-110 transition-transform bg-white shadow-lg rounded-lg p-4 flex flex-col items-center w-auto"
        onClick={() => navigate("/filtro-de-informacion")}
      >
        <img src={viewIcon} alt="Ver Información" className="w-16 h-16" />
        <p className="font-bold mb-6 text-[#00498B]">Visualizar Proyeccion</p>
      </div>

      {/* Gestión de usuarios o actualización de contraseña */}
      <div
        className="cursor-pointer hover:scale-110 transition-transform bg-white shadow-lg rounded-lg p-4 flex flex-col items-center w-auto"
        onClick={() =>
          userRol === "Administrador"
            ? navigate("/gestion-usuarios")
            : navigate(`/Actualizar-contraseña/${userId}`)
        }
      >
        <img src={userCogIcon} alt="Gestión Usuarios" className="w-16 h-16" />
        <p className="font-bold mb-6 text-[#00498B]">
          {userRol === "Administrador" ? "Gestión Usuarios" : "Actualizar Contraseña"}
        </p>
      </div>



    </div>
  );
}
