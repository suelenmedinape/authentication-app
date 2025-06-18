import "./style.css";
import "./style-main.css"
import { AuthService } from "./service/AuthService.js";

export class Main {
  #loginBtn = document.querySelector("#loginBtn");
  #registerBtn = document.querySelector("#registerBtn");
  #userDropdownBtn = document.querySelector("#userDropdownButton1");
  #accountBtn = document.querySelector("#accountBtn");
  #logoutBtn = document.querySelector("#logoutBtn");
  #adminBar = document.querySelector("#adminBar");
  #role = localStorage.getItem("role");
  #token = localStorage.getItem("token");

  constructor(authService = new AuthService()) {
    this.authService = authService;
    this.init();
  }

  get getRole() {
    return this.#role;
  }

  get getToken() {
    return this.#token;
  }

  get getAdminBar() {
    return this.#adminBar;
  }

  init() {
    this.checkAuth();
    this.setupLogout();
  }

  checkAuth() {
    this.#loginBtn.style.display = "none";
    this.#registerBtn.style.display = "none";
    this.#userDropdownBtn.style.display = "none";
    this.#accountBtn.style.display = "none";
    this.#logoutBtn.style.display = "none";
    this.#adminBar.style.display = "none";

    if (this.getToken && this.getRole === "ROLE_CLIENT") {
      this.#userDropdownBtn.style.display = "inline-flex";
      this.#accountBtn.style.display = "block";
      this.#logoutBtn.style.display = "block";
      this.#adminBar.style.display = "none"
    } else if (this.getToken && this.getRole === "ROLE_ADMIN") {
      this.#userDropdownBtn.style.display = "inline-flex";
      this.#accountBtn.style.display = "block";
      this.#logoutBtn.style.display = "block";
      this.#adminBar.style.display = "block";
    } else {
      this.#loginBtn.style.display = "block";
      this.#registerBtn.style.display = "block";
    }
  }

  setupLogout() {
    if (this.#logoutBtn) {
      this.#logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.authService.logout();
        window.location.reload();
      });
    }
  }
}

const main = new Main();
