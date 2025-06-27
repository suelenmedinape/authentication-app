import { AuthService } from "../../service/AuthService.js";
import { Login } from "../login/login.js";

export class Register {
  constructor(authService = new AuthService(), login = new Login()) {
    this.authService = authService;
    this.login = login;
  }

  register() {
    const form = document.querySelector("#register-form");
    if (!form) return console.error("Formulário não encontrado!");

    this.addInputListeners(form);

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      this.clearErrors();

      const name = form.querySelector("#name")?.value.trim();
      const email = form.querySelector("#email")?.value.trim();
      const password = form.querySelector("#password")?.value;
      const terms = form.querySelector("#terms")?.checked;

      if (!terms) {
        alert("Você deve aceitar os termos e condições"); // tirar esse alert
        return;
      }

      try {
        const { response, responseData } = await this.authService.register(name, email, password);

        if (response.ok) {
          console.log("Registro realizado com sucesso!");
          this.login.handleLogin(email, password);
        } else {
          this.handleBackendErrors(responseData);
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Erro de conexão. Verifique sua internet e tente novamente.");
      }
    });
  }

  addInputListeners(form) {
    ["name", "email", "password"].forEach((field) => {
      const input = form.querySelector(`#${field}`);
      if (input) {
        input.addEventListener("input", () => this.clearFieldError(field));
      }
    });
  }

  handleBackendErrors(responseData) {
    if (Array.isArray(responseData)) {
      responseData.forEach(({ field, message }) => {
        if (field && message) this.showError(field, message);
      });
    } else if (responseData?.field && responseData?.message) {
      this.showError(responseData.field, responseData.message);
    } else {
      alert("Erro ao criar conta. Verifique os dados e tente novamente.");
    }
  }

  showError(field, message) {
    const input = document.querySelector(`#${field}`);
    const errorElement = document.querySelector(`#${field}-error`);

    if (input) {
      input.classList.remove(
          "bg-gray-50", "border-gray-300", "text-gray-900",
          "focus:ring-primary-600", "focus:border-primary-600"
      );
      input.classList.add(
          "bg-red-50", "border-red-500", "text-red-900",
          "placeholder-red-700", "focus:ring-red-500", "focus:border-red-500"
      );
    }

    if (errorElement) {
      if (errorElement.textContent && errorElement.textContent !== message) {
        errorElement.textContent += " " + message;
      } else {
        errorElement.textContent = message;
      }
      errorElement.style.display = "block";
    }
  }

  clearFieldError(field) {
    const input = document.querySelector(`#${field}`);
    const errorElement = document.querySelector(`#${field}-error`);

    if (input) {
      input.classList.remove(
          "bg-red-50", "border-red-500", "text-red-900",
          "placeholder-red-700", "focus:ring-red-500", "focus:border-red-500"
      );
      input.classList.add(
          "bg-gray-50", "border-gray-300", "text-gray-900",
          "focus:ring-primary-600", "focus:border-primary-600"
      );
    }

    if (errorElement) {
      errorElement.style.display = "none";
      errorElement.textContent = "";
    }
  }

  clearErrors() {
    ["name", "email", "password"].forEach((field) => this.clearFieldError(field));
  }
}

const register = new Register();
register.register();
