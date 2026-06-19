import axios from "axios";

console.log(
  "API URL =",
  process.env.NEXT_PUBLIC_API_URL
);

export const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});