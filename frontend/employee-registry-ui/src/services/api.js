import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5026/api",
});

export default API;