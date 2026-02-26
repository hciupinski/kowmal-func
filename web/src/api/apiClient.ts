import axios from "axios";
import {getEnv} from "../config/env";

const apiClient = axios.create({
    baseURL: `${getEnv("AUTH_BASE_URL")}/api`,
});

export default apiClient;
