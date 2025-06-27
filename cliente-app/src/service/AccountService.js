import axios from "axios";
import { AuthService } from "./AuthService.js";

export class AccountService {
    #baseUrl = "http://localhost:8080/my";
    #details = `${this.#baseUrl}/details`;
    #profile;
    #token;

    constructor(authService = new AuthService()) {
        this.authService = authService;
        this.#profile = `${this.#baseUrl}/profile`;
        this.#token = this.authService.getToken();

        if (!this.#token) {
            throw new Error("Token não encontrado. Usuário não autenticado.");
        }
    }

    get getProfile() {
        return this.#profile;
    }

    get getToken() {
        return this.#token;
    }

    get getDetails() {
        return this.#details;
    }

    async profile() {
        return this.#makeRequest("get", this.getProfile);
    }

    async updateData(formData) {
        if (!formData || typeof formData !== "object") {
            throw new Error("Dados do formulário inválidos");
        }

        return this.#makeRequest("put", this.getDetails, formData);
    }

    async #makeRequest(method, url, data = null) {
        try {
            const config = {
                method,
                url,
                headers: {
                    "Authorization": `Bearer ${this.getToken}`,
                    ...(method === "put" && { "Content-Type": "application/json" }),
                },
                ...(data && { data }),
            };

            const response = await axios(config);
            return {
                response: { ok: true },
                responseData: response.data,
                status: response.status,
            };

        } catch (error) {
            return this.#handleError(error, `Erro ao executar ${method.toUpperCase()} em ${url}`);
        }
    }

    #handleError(error, fallbackMessage) {
        if (error.response) {
            return {
                response: { ok: false },
                responseData: error.response.data,
                status: error.response.status,
            };
        }
        throw new Error(fallbackMessage);
    }
}
