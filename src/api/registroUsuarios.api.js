import axios from 'axios';

const registroUsuariosApi = axios.create({
    baseURL: "https://spc-backend-r97v.onrender.com/registro_usuarios/api/v1/registro/",
});

export const getAllUsuarios = () => registroUsuariosApi.get("/");

export const getUsuarios = (id) => registroUsuariosApi.get(`/${id}/`);

export const createUsuarios = (registro) => registroUsuariosApi.post("/", registro);

export const deleteUsuarios = (id) => registroUsuariosApi.delete(`/${id}/`);

export const updateUsuarios = (id, registro) => registroUsuariosApi.patch(`/${id}/`, registro);

