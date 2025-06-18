import { AccountService } from "../../service/AccountService.js";
import { AuthService } from "../../service/AuthService.js";

export class Account {
    #btnAddDadosModal = document.querySelector("#add-dados-modal");
    #modal = document.querySelector("#myModal");
    #span = document.getElementsByClassName("close")[0];

    constructor(accountService = new AccountService()) {
        this.accountService = accountService;
        this.init();
    }

    get getbtnAddDadosModal() {
        return this.#btnAddDadosModal;
    }

    get getModal() {
        return this.#modal;
    }

    get getSpan() {
        return this.#span;
    }

    init() {
        this.profile();
        this.openModal();
        this.updateData();
    }

    async profile() {
        try {
            const {response, responseData} = await this.accountService.profile();

            if (response.ok) {
                this.updateProfileUI(responseData);
                return true;
            } else {
                console.error("Erro ao obter dados:", responseData);
                return false;
            }
        } catch (e) {
            console.error("Erro na requisição:", e);
            return false;
        }
    }

    updateProfileUI(userData) {
        document.getElementById('user-name').textContent = userData.name || 'Não informado';
        document.getElementById('user-email').textContent = userData.email || 'Não informado';
        document.getElementById('user-phone').textContent = userData.phone || 'Não informado';
        document.getElementById('user-address').textContent = [
            userData.address.street || 'Não informado',
            userData.address.number || 'Não informado',
            userData.address.neighborhood || 'Não informado',
            userData.address.city || 'Não informado',
            userData.address.state || 'Não informado'
        ].join(', ');
        document.getElementById('user-cpf').textContent = userData.cpf || 'Não informado';
    }

    openModal() {
        this.getbtnAddDadosModal.onclick = () => {
            this.getModal.style.display = "block";
        }

        this.getSpan.onclick = () => {
            this.getModal.style.display = "none";
        }

        window.onclick = (e) => {
            if (e.target == this.getModal) {
                this.getModal.style.display = "none";
            }
        }
    }

    updateData() {
        document.addEventListener("DOMContentLoaded", () => {
            const form = document.querySelector("#add-dados-user");

            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = {
                    name: form.querySelector("#name").value.trim() || document.querySelector("#user-name").textContent,
                    phone: form.querySelector("#phone").value.trim() || document.querySelector("#user-phone").textContent,
                    address: {
                        street: form.querySelector("#street").value.trim() || document.querySelector("#user-address").textContent.split(',')[0],
                        number: form.querySelector("#number").value.trim() || document.querySelector("#user-address").textContent.split(',')[1],
                        neighborhood: form.querySelector("#neighborhood").value.trim() || document.querySelector("#user-address").textContent.split(',')[2],
                        city: form.querySelector("#city").value.trim() || document.querySelector("#user-address").textContent.split(',')[3],
                        state: form.querySelector("#state").value.trim() || document.querySelector("#user-address").textContent.split(',')[4]
                    },
                    cpf: form.querySelector("#cpf").value.trim() || document.querySelector("#user-cpf").textContent
                };

                try {
                    const { response, responseData } = await this.accountService.updateData(formData);
                    this.getModal.style.display = "none";
                    await this.profile();
                } catch (error) {
                    console.error('Erro ao atualizar dados:', error);
                }
            });
        })
    }
}

const account = new Account();
account.init();
