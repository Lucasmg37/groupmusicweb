import axios from "axios";
const api = axios.create({
    baseURL: "http://groupmusicapi.lucasjunior.com.br",
    headers: {Authorization: `Bearer ${localStorage.getItem("st_token")}`}
});

export default api;