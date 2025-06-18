import axios from 'axios';

const registroUsuariosApi = axios.create({
    baseURL: "https://spc-backend-r97v.onrender.com/cursos/cursos/v1/cursos/",
});

export const getAllCursos = () => registroUsuariosApi.get("/");


