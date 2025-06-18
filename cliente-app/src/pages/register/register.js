import { AuthService } from "../../service/AuthService.js"
import { Login } from "../login/login.js"

export class Register {
  constructor(authService = new AuthService(), login = new Login()) {
    this.authService = authService;
    this.login = login
  }

  register() {
    const form = document.querySelector("#register-form")
    if (!form) {
      console.error("Formulário não encontrado!")
      return
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault()

      // Limpar erros anteriores
      this.clearErrors()

      const nameInput = form.querySelector("#name")
      const emailInput = form.querySelector("#email")
      const passwordInput = form.querySelector("#password")
      const termsInput = form.querySelector("#terms")

      const name = nameInput.value.trim()
      const email = emailInput.value.trim()
      const password = passwordInput.value
      const terms = termsInput.checked

      if (!terms) {
        alert("Você deve aceitar os termos e condições")
        return
      }

      console.log({ name, email, password, terms })

      try {
        const { response, responseData } = await this.authService.register(name, email, password)

        if (response.ok) {
          console.log("Registro realizado com sucesso!")
          this.login.handleLogin(email, password);
        } else {
          console.log("Erros do backend:", responseData)

          if (Array.isArray(responseData)) {
            responseData.forEach((error) => {
              if (error.field && error.message) {
                this.showError(error.field, error.message)
              }
            })
          } else if (responseData.field && responseData.message) {
            this.showError(responseData.field, responseData.message)
          } else {
            alert("Erro ao criar conta. Verifique os dados e tente novamente.")
          }
        }
      } catch (error) {
        console.error("Erro na requisição:", error)
        alert("Erro de conexão. Verifique sua internet e tente novamente.")
      }
    })

    this.addInputListeners(form)
  }

  addInputListeners(form) {
    const fields = ["name", "email", "password"]

    fields.forEach((field) => {
      const input = form.querySelector(`#${field}`)
      if (input) {
        input.addEventListener("input", () => {
          this.clearFieldError(field)
        })
      }
    })
  }

  showError(field, message) {
    const input = document.querySelector(`#${field}`)
    const errorElement = document.querySelector(`#${field}-error`)

    if (input) {
      input.classList.remove(
          "bg-gray-50",
          "border-gray-300",
          "text-gray-900",
          "focus:ring-primary-600",
          "focus:border-primary-600",
      )
      input.classList.add(
          "bg-red-50",
          "border-red-500",
          "text-red-900",
          "placeholder-red-700",
          "focus:ring-red-500",
          "focus:border-red-500",
      )
    }

    if (errorElement) {
      const existingMessage = errorElement.textContent
      if (existingMessage && existingMessage !== message) {
        errorElement.textContent = existingMessage + " " + message
      } else {
        errorElement.textContent = message
      }
      errorElement.style.display = "block"
    }
  }

  clearFieldError(field) {
    const input = document.querySelector(`#${field}`)
    const errorElement = document.querySelector(`#${field}-error`)

    if (input) {
      input.classList.remove(
          "bg-red-50",
          "border-red-500",
          "text-red-900",
          "placeholder-red-700",
          "focus:ring-red-500",
          "focus:border-red-500",
      )
      input.classList.add(
          "bg-gray-50",
          "border-gray-300",
          "text-gray-900",
          "focus:ring-primary-600",
          "focus:border-primary-600",
      )
    }

    if (errorElement) {
      errorElement.style.display = "none"
      errorElement.textContent = ""
    }
  }

  clearErrors() {
    const fields = ["name", "email", "password"]
    fields.forEach((field) => this.clearFieldError(field))
  }
}

const register = new Register()
register.register()
