import axios from 'axios';

const registroUsuariosApi = axios.create({
    baseURL: "https://spc-backend-r97v.onrender.com/proyeccion/proyecciones/v1/Proyeccion/",
});

export const getAllProllecciones = () => registroUsuariosApi.get("/");

export const getProlleccione = (id) => registroUsuariosApi.get(`/${id}/`);

export const createProllecciones = (registro) => registroUsuariosApi.post("/", registro);

export const deleteProllecciones = (id) => registroUsuariosApi.delete(`/${id}/`);

export const updateProllecciones = (id, registro) => registroUsuariosApi.patch(`/${id}/`, registro);

