import { AuthService } from "../../service/AuthService.js";

export class Login {
    constructor(authService = new AuthService()) {
        this.authService = authService;
    }

    login() {
        const form = document.querySelector("#login-form");
        if (!form) return console.error("Formulário de login não encontrado!");

        this.addInputListeners();
        form.addEventListener("submit", (e) => this.handleSubmit(e, form));
    }

    async handleSubmit(e, form) {
        e.preventDefault();

        const email = form.querySelector("#email")?.value.trim();
        const password = form.querySelector("#password")?.value;

        this.clearErrors();

        if (!email) return this.showFieldError("email", "Email é obrigatório");
        if (!password) return this.showFieldError("password", "Senha é obrigatória");

        await this.handleLogin(email, password);
    }

    async handleLogin(email, password) {
        this.setLoading(true);

        try {
            const { response, responseData } = await this.authService.login(email, password);
            return response.ok ? this.handleSuccess() : this.handleFailure(responseData);
        } catch (error) {
            console.error("Erro na requisição:", error);
            this.showMessage("Erro de conexão. Verifique sua internet e tente novamente.", "error");
            return false;
        } finally {
            this.setLoading(false);
        }
    }

    handleSuccess() {
        this.showMessage("Login realizado com sucesso!", "success");
        setTimeout(() => (window.location.href = "../../../index.html"), 1000);
        return true;
    }

    handleFailure(responseData) {
        console.log("Erros do backend:", responseData);

        if (Array.isArray(responseData)) {
            responseData.forEach(({ field, message }) => {
                if (field && message) this.showFieldError(field, message);
            });
            this.showMessage("Por favor, corrija os erros abaixo.", "error");
        } else if (responseData?.field && responseData?.message) {
            this.showFieldError(responseData.field, responseData.message);
        } else {
            const message = responseData?.message || "Email ou senha incorretos.";
            this.showMessage(message, "error");
        }

        return false;
    }

    showMessage(message, type) {
        const el = document.getElementById("response-message");
        if (!el) return;

        el.innerText = message;
        el.style.display = "block";
        el.className = `text-sm font-medium ${type === "success" ? "text-green-600" : "text-red-600"}`;
    }

    showFieldError(field, message) {
        const input = document.querySelector(`#${field}`);
        const errorEl = document.querySelector(`#${field}-error`);

        input?.classList.remove(
            "bg-gray-50", "border-gray-300", "focus:ring-primary-600", "focus:border-primary-600"
        );
        input?.classList.add(
            "bg-red-50", "border-red-500", "text-red-900", "placeholder-red-700",
            "focus:ring-red-500", "focus:border-red-500"
        );

        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = "block";
        }
    }

    clearFieldError(field) {
        const input = document.querySelector(`#${field}`);
        const errorEl = document.querySelector(`#${field}-error`);

        input?.classList.remove(
            "bg-red-50", "border-red-500", "text-red-900", "placeholder-red-700",
            "focus:ring-red-500", "focus:border-red-500"
        );
        input?.classList.add(
            "bg-gray-50", "border-gray-300", "focus:ring-primary-600", "focus:border-primary-600"
        );

        if (errorEl) {
            errorEl.style.display = "none";
            errorEl.textContent = "";
        }
    }

    clearErrors() {
        ["email", "password"].forEach((field) => this.clearFieldError(field));

        const messageEl = document.getElementById("response-message");
        if (messageEl) {
            messageEl.style.display = "none";
            messageEl.innerText = "";
        }

        document.getElementById("error-messages")?.replaceChildren();
    }

    setLoading(isLoading) {
        const button = document.getElementById("login-button");
        const form = document.getElementById("login-form");

        if (button) {
            button.disabled = isLoading;
            button.innerHTML = isLoading ? this.loadingButtonContent() : "Sign in";
        }

        form?.querySelectorAll("input").forEach((input) => {
            input.disabled = isLoading;
        });
    }

    loadingButtonContent() {
        return `
      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042
              1.135 5.824 3 7.938l3-2.647z">
        </path>
      </svg>
      Entrando...
    `;
    }

    addInputListeners() {
        ["email", "password"].forEach((field) => {
            const input = document.querySelector(`#${field}`);
            if (input) {
                input.addEventListener("input", () => {
                    this.clearFieldError(field);
                    document.getElementById("response-message")?.style.setProperty("display", "none");
                });
            }
        });
    }
}

const login = new Login();
login.login();
