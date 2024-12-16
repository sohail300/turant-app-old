import axios from "axios";

const BASE_URL = "http://localhost:3000/api/web";
// const BASE_URL = "https://turrant.webyaparsolutions.com/api/web";

export const api = axios.create({
  baseURL: BASE_URL,
});
