import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { Menu } from "../components/Menu";
import menuIcon from "../assets/menu.png";


Modal.setAppElement('#root');

// Componente reutilizable para botón rojo (igual que en Dashboard)
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

export function UploadPage() {

  const [isMenuOpen, setIsMenuOpen] = useState(false);


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Cambia el estado del menú
  };


  const navigate = useNavigate();
  // estados de carga de CSV
  const [status, setStatus] = useState({ a: false, b: false, prerrequisitos: false });
  const [loading, setLoading] = useState({ a: false, b: false, prerrequisitos: false });

  // modal de proyección
  const [modalOpen, setModalOpen] = useState(false);
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [periodo, setPeriodo] = useState(1);
  const [version, setVersion] = useState('Final');

  // usuario autenticado
  const [user, setUser] = useState(null);
  useEffect(() => {
    const u = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;
    setUser(u);
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    toast.success("Sesión finalizada", { position: "top-center" });
    navigate("/login");
  };

  // subir CSV (a, b o prerrequisitos)
  const handleFile = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(l => ({ ...l, [type]: true }));
    const form = new FormData();
    form.append('file', file);

    try {
      await axios.post(`http://localhost:8000/api/upload/${type}/`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success(`Archivo ${type.toUpperCase()} cargado`);
      setStatus(s => ({ ...s, [type]: true }));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al subir');
    } finally {
      setLoading(l => ({ ...l, [type]: false }));
    }
  };

  // abrir modal de Proyección, diferenciando versión
  const openModal = (ver) => {
    setVersion(ver);
    setModalOpen(true);
  };

  // confirmar generación de Proyección
  const handleConfirm = async () => {
    const url =
      version === 'Preliminar'
        ? '/api/proyecciones/proyeccionesPreyFin/generate_preliminar/'
        : '/api/proyecciones/proyeccionesPreyFin/generate/';

    try {
      await axios.post(
        `http://localhost:8000${url}`,
        { anio, periodo, version },
        { headers: { Authorization: `Token ${Cookies.get('token')}` } }
      );
      toast.success(`Proyección ${version.toLowerCase()} generada`);
      setModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.error || `Error al generar proyección ${version.toLowerCase()}`);
    }
  };

  // configuracion de uploads
  const uploads = [
    { key: 'a', label: 'Cargar Cursos' },
    { key: 'b', label: 'Cargar Comportamiento' },
    { key: 'prerrequisitos', label: 'Cargar Prerrequisitos' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header fijo igual que en Dashboard */}
      <div className='mt-20'>
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

            {/* Sección de título + Botón "Cerrar sesión" */}
            <div className="bg-gradient-to-r from-[#00498B] to-[#001325] text-white py-4 px-8 text-lg font-bold w-4/5 flex justify-between items-center">
              <h1 className="text-lg font-semibold">CARGAR ARCHIVOS CSV</h1>
              <RedButton 
              onClick={() => navigate('/dashboard')}
              className="w-auto bg-[#1572E8] text-white py-1 rounded-lg font-bold hover:bg-[#0f5fc7] transition-all duration-300"
              >Inicio</RedButton > 
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

      {/* Contenido principal */}
      <div className="flex justify-center items-center flex-1 mt-20">
        <div className="bg-[#d7e9ff] p-10 rounded-lg max-w-4xl w-full">
          <h2 className="text-xl font-bold mb-6 text-[#00498B]">Sube tus archivos:</h2>

          <div className="space-y-6">
            {uploads.map(({ key, label }) => (
              <div key={key} className="mb-6">
                <label className="block mb-2 font-semibold text-gray-700">
                  {label}
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => handleFile(e, key)}
                    disabled={loading[key]}
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1572E8] focus:border-transparent"
                  />
                  
                    {loading[key] && <span className="text-yellow-500">Subiendo…</span>}
                    {status[key] && <span className="text-green-600 font-semibold">✔ Cargado</span>}
                  
                </div>
              </div>
            ))}
          </div>

          {/* Botones de proyección */}
          <div className="mt-8 flex flex-col space-y-4">
            <button
              onClick={() => openModal('Preliminar')}
              className="w-1/2 bg-[#1572E8] text-white py-1 mx-auto rounded-lg font-bold hover:bg-[#0f5fc7] transition-all duration-300"
            >
              Realizar Proyección Preliminar
            </button>
            <button
              onClick={() => openModal('Final')}
              className="w-1/2 bg-[#1572E8] text-white py-1 mx-auto rounded-lg font-bold hover:bg-[#0f5fc7] transition-all duration-300"
            >
              Realizar Proyección Final
            </button>
            <button
              onClick={() => navigate("/filtro-de-informacion")}
              className="w-1/2 bg-[#1572E8] text-white py-1 mx-auto rounded-lg font-bold hover:bg-[#0f5fc7] transition-all duration-300"
            >
              Ver Proyección
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Proyección */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        className="bg-white p-8 max-w-md mx-auto rounded-lg shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h2 className="text-xl font-bold mb-4 text-[#00498B]">Nueva Proyección {version}</h2>

        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Año:</label>
            <input
              type="number"
              value={anio}
              onChange={(e) => setAnio(+e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#1572E8] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Periodo:</label>
            <select
              value={periodo}
              onChange={(e) => setPeriodo(+e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#1572E8] focus:border-transparent"
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Versión:</label>
            <input
              type="text"
              value={version}
              disabled
              className="w-full p-2 border border-gray-300 rounded bg-gray-100"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button 
            onClick={() => setModalOpen(false)} 
            className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
          >
            Cancelar
          </button>
          <button 
            onClick={handleConfirm} 
            className="px-4 py-2 bg-[#1572E8] text-white rounded-lg font-semibold hover:bg-[#0f5fc7] transition-all duration-300"
          >
            Confirmar
          </button>
        </div>
      </Modal>

      {/* Footer fijo igual que en Dashboard */}
      <div className='mt-40'>
        <footer className="bg-gradient-to-r from-[#00498B] to-[#001325] text-white py-4 fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center">
        <div className="text-center">
          <p>© 2025 Sistema de Proyección de Cursos</p>
          <p className="mt-1">Contacto: <a href="mailto:fredy.perez.i@uniautonoma.edu.co" className="hover:text-blue-300">fredy.perez.i@uniautonoma.edu.co</a><a href="mailto:juan.delgado.c@uniautonoma.edu.co" className="hover:text-blue-300"> - juan.delgado.c@uniautonoma.edu.co</a><a> - </a> <a href="mailto:juan.valencia.c@uniautonoma.edu.co" className="hover:text-blue-300">juan.valencia.c@uniautonoma.edu.co</a></p>

        </div>
      </footer>
      </div>
    </div>
  );
}
