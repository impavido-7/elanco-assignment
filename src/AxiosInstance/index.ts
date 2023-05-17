import axios from "axios";

import { BASE_URL } from "../modules/constants";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
});
