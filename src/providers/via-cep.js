import axios from "axios";

export const viaCepClient = axios.create({
  baseURL: "https://viacep.com.br/ws",
  timeout: 5000,
});