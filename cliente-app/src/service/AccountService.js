import axios from "axios";
import {AuthService} from "./AuthService.js";

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
        try {
            const response = await axios.get(this.getProfile, {
                headers: {
                    "Authorization": `Bearer ${this.getToken}`
                }
            });
            return {response: {ok: true}, responseData: response.data};
        } catch (error) {
            if (error.response) {
                return {
                    response: {ok: false},
                    responseData: error.response.data,
                    status: error.response.status
                };
            }
            throw new Error("Erro ao buscar perfil do usuário");
        }
    }

    async updateData(formData) {
        if (!formData || typeof formData !== 'object') {
            throw new Error("Dados do formulário inválidos");
        }

        try {
            const response = await axios.put(this.getDetails, formData, {
                headers: {
                    "Authorization": `Bearer ${this.getToken}`,
                    "Content-Type": "application/json"
                }
            });
            return {
                response: {ok: true}, 
                responseData: response.data,
                status: response.status
            };
        } catch (error) {
            console.error("AccountService - Erro ao atualizar dados:", error);
            if (error.response) {
                return {
                    response: {ok: false},
                    responseData: error.response.data,
                    status: error.response.status
                };
            }
            throw new Error("Erro ao atualizar dados do usuário");
        }
    }
}