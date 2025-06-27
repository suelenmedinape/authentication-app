import { AccountService } from "../../service/AccountService.js";
import { AuthService } from "../../service/AuthService.js";

export class Account {
    #elements = {
        btnAddDadosModal: document.querySelector("#add-dados-modal"),
        modal: document.querySelector("#myModal"),
        span: document.getElementsByClassName("close")[0],
        cancelBtn: document.querySelector(".cancel-btn"),
        form: document.querySelector("#add-dados-user"),
        loginBtn: document.querySelector("#loginBtn"),
        registerBtn: document.querySelector("#registerBtn"),
        userDropdownBtn: document.querySelector("#userDropdownButton1"),
        accountBtn: document.querySelector("#accountBtn"),
        logoutBtn: document.querySelector("#logoutBtn"),
        adminBar: document.querySelector("#adminBar"),
    };

    #role = localStorage.getItem("role");
    #token = localStorage.getItem("token");
    #currentUserData = null;

    constructor(accountService = new AccountService(), authService = new AuthService()) {
        this.accountService = accountService;
        this.authService = authService;
        this.init();
    }

    init() {
        this.profile();
        this.openModal();
        this.setupFormSubmit();
        this.checkAuth();
        this.setupLogout();
    }

    get getRole() {
        return this.#role;
    }

    get getToken() {
        return this.#token;
    }

    async profile() {
        try {
            const { response, responseData } = await this.accountService.profile();
            if (response.ok) {
                this.#currentUserData = responseData;
                this.updateProfileUI(responseData);
            } else {
                console.error("Erro ao obter dados:", responseData);
            }
        } catch (e) {
            console.error("Erro na requisição:", e);
        }
    }

    updateProfileUI(userData) {
        const safeGet = (val, fallback = "Não informado") => val || fallback;

        this.setText("user-name", safeGet(userData.name));
        this.setText("user-email", safeGet(userData.email));
        this.setText("user-phone", safeGet(userData.phone));
        this.setText("user-cpf", safeGet(userData.cpf));

        const addr = userData.address || {};
        const addressParts = ["street", "number", "neighborhood", "city", "state"]
            .map(key => safeGet(addr[key]))
            .filter(val => val !== "Não informado");

        this.setText("user-address", addressParts.length ? addressParts.join(", ") : "Não informado");
    }

    setText(id, text) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    openModal() {
        const { btnAddDadosModal, modal, span, cancelBtn } = this.#elements;

        btnAddDadosModal?.addEventListener("click", () => {
            this.populateForm(this.#currentUserData);
            modal.style.display = "flex";
        });

        span?.addEventListener("click", () => this.closeModal());
        cancelBtn?.addEventListener("click", () => this.closeModal());

        window.addEventListener("click", (e) => {
            if (e.target === modal) this.closeModal();
        });
    }

    closeModal() {
        this.#elements.modal.style.display = "none";
        this.clearForm();
    }

    clearForm() {
        this.#elements.form?.reset();
    }

    populateForm(data) {
        if (!data) return;

        ["name", "phone", "cpf"].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = data[id] || "";
        });

        const addr = data.address || {};
        ["street", "number", "neighborhood", "city", "state"].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = addr[id] || "";
        });
    }

    setupFormSubmit() {
        this.#elements.form?.addEventListener("submit", async (e) => {
            e.preventDefault();

            const btn = e.target.querySelector('button[type="submit"]');
            const originalText = btn.textContent;

            btn.disabled = true;
            btn.textContent = "Saving...";

            try {
                const formData = this.collectFormData();
                const { response } = await this.accountService.updateData(formData);
                if (response.ok) {
                    this.closeModal();
                    await this.profile();
                }
            } catch (error) {
                console.error("Erro ao atualizar dados:", error);
            } finally {
                btn.disabled = false;
                btn.textContent = originalText;
            }
        });
    }

    collectFormData() {
        const get = (id) => this.#elements.form.querySelector(`#${id}`)?.value.trim() || "";
        const current = this.#currentUserData;

        return {
            name: get("name") || current?.name || "",
            phone: get("phone") || current?.phone || "",
            cpf: get("cpf") || current?.cpf || "",
            address: {
                street: get("street") || current?.address?.street || "",
                number: get("number") || current?.address?.number || "",
                neighborhood: get("neighborhood") || current?.address?.neighborhood || "",
                city: get("city") || current?.address?.city || "",
                state: get("state") || current?.address?.state || "",
            },
        };
    }

    checkAuth() {
        const { loginBtn, registerBtn, userDropdownBtn, accountBtn, logoutBtn, adminBar } = this.#elements;

        const hideAll = () => {
            loginBtn.style.display = "none";
            registerBtn.style.display = "none";
            userDropdownBtn.style.display = "none";
            accountBtn.style.display = "none";
            logoutBtn.style.display = "none";
            adminBar.style.display = "none";
        };

        hideAll();

        if (this.getToken && this.getRole === "ROLE_CLIENT") {
            userDropdownBtn.style.display = "inline-flex";
            accountBtn.style.display = "block";
            logoutBtn.style.display = "block";
        } else if (this.getToken && this.getRole === "ROLE_ADMIN") {
            userDropdownBtn.style.display = "inline-flex";
            accountBtn.style.display = "block";
            logoutBtn.style.display = "block";
            adminBar.style.display = "block";
        } else {
            loginBtn.style.display = "block";
            registerBtn.style.display = "block";
        }
    }

    setupLogout() {
        this.#elements.logoutBtn?.addEventListener("click", (e) => {
            e.preventDefault();
            this.authService.logout();
            window.location.reload();
        });
    }
}

document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", () => new Account())
    : new Account();
