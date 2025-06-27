import axios from "axios";

export class AuthService {
  #baseUrl = "http://localhost:8080/auth";
  #registerUrl = `${this.#baseUrl}/register`;
  #loginUrl = `${this.#baseUrl}/login`;
  #logoutTimer = null;
  #FOUR_HOURS_MS = 4 * 60 * 60 * 1000;

  get getRegisterUrl() {
    return this.#registerUrl;
  }

  get getLoginUrl() {
    return this.#loginUrl;
  }

  async login(email, password) {
    const payload = { email, password };

    try {
      const response = await axios.post(this.getLoginUrl, payload, {
        headers: { "Content-Type": "application/json" },
      });

      const responseData = response.data;
      this.saveToken(responseData);
      this.startLogoutTimer();

      return { response: { ok: true }, responseData };

    } catch (error) {
      return this.#handleError(error);
    }
  }

  async register(name, email, password) {
    const payload = { name, email, password };

    try {
      const response = await axios.post(this.getRegisterUrl, payload, {
        headers: { "Content-Type": "application/json" },
      });

      return { response: { ok: true }, responseData: response.data };

    } catch (error) {
      return this.#handleError(error);
    }
  }

  saveToken(responseData) {
    localStorage.setItem("token", responseData.token);
    localStorage.setItem("role", responseData.role);
  }

  getToken() {
    return localStorage.getItem("token");
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    this.stopLogoutTimer();
    window.location.reload();
  }

  startLogoutTimer() {
    this.stopLogoutTimer();
    this.#logoutTimer = setTimeout(() => this.logout(), this.#FOUR_HOURS_MS);
  }

  stopLogoutTimer() {
    if (this.#logoutTimer) {
      clearTimeout(this.#logoutTimer);
      this.#logoutTimer = null;
    }
  }

  #handleError(error) {
    if (error.response) {
      return {
        response: { ok: false },
        responseData: error.response.data,
      };
    }
    throw error;
  }
}
