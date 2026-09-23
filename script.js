const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const serviceSelect = document.getElementById("service");
const textTypeGroup = document.getElementById("textTypeGroup");
const languageGroup = document.getElementById("languageGroup");
const textType = document.getElementById("textType");
const sourceLanguage = document.getElementById("sourceLanguage");
const targetLanguage = document.getElementById("targetLanguage");
const quoteForm = document.getElementById("quoteForm");
const feedback = document.getElementById("formFeedback");

// Menu mobile
menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
});

document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
    });
});

// Atualiza os campos de acordo com o serviço escolhido
function updateConditionalFields() {
    const service = serviceSelect.value;

    textTypeGroup.classList.toggle(
        "hidden",
        service !== "revisao" && service !== "preparacao"
    );

    languageGroup.classList.toggle("hidden", service !== "traducao");

    textType.required = service === "revisao" || service === "preparacao";
    sourceLanguage.required = service === "traducao";
    targetLanguage.required = service === "traducao";

    if (service === "traducao") {
        textType.value = "";
    } else {
        sourceLanguage.value = "";
        targetLanguage.value = "";
    }
}

serviceSelect.addEventListener("change", updateConditionalFields);

// Botões "Solicitar orçamento" dos cards
document.querySelectorAll("[data-service]").forEach(button => {
    button.addEventListener("click", () => {
        const service = button.dataset.service;
        serviceSelect.value = service;
        updateConditionalFields();
    });
});

function clearErrors() {
    document.querySelectorAll(".error-message").forEach(error => {
        error.textContent = "";
    });
}

function showError(input, message) {
    const group = input.closest(".form-group");
    if (!group) return;

    const error = group.querySelector(".error-message");
    if (error) {
        error.textContent = message;
    }
}

function validateForm() {
    clearErrors();
    let valid = true;

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const pages = document.getElementById("pages");
    const service = serviceSelect.value;

    if (!name.value.trim()) {
        showError(name, "Informe seu nome.");
        valid = false;
    }

    if (!email.value.trim()) {
        showError(email, "Informe seu e-mail.");
        valid = false;
    } else if (!email.validity.valid) {
        showError(email, "Informe um e-mail válido.");
        valid = false;
    }

    if (!service) {
        showError(serviceSelect, "Selecione um serviço.");
        valid = false;
    }

    if ((service === "revisao" || service === "preparacao") && !textType.value) {
        showError(textType, "Selecione o tipo de texto.");
        valid = false;
    }

    if (service === "traducao") {
        if (!sourceLanguage.value) {
            showError(sourceLanguage, "Selecione o idioma de origem.");
            valid = false;
        }

        if (!targetLanguage.value) {
            showError(targetLanguage, "Selecione o idioma de destino.");
            valid = false;
        }

        if (
            sourceLanguage.value &&
            targetLanguage.value &&
            sourceLanguage.value === targetLanguage.value
        ) {
            showError(targetLanguage, "Os idiomas devem ser diferentes.");
            valid = false;
        }
    }

    if (!pages.value || Number(pages.value) < 1) {
        showError(pages, "Informe a quantidade de laudas.");
        valid = false;
    }

    return valid;
}

// Protótipo: simula o envio.
// Para colocar em produção, substitua esta etapa por backend ou serviço de formulário.
quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();

    feedback.className = "form-feedback";
    feedback.textContent = "";

    if (!validateForm()) {
        feedback.className = "form-feedback error";
        feedback.textContent = "Revise os campos destacados antes de enviar.";
        return;
    }

    const file = document.getElementById("file").files[0];

    if (file) {
        const allowedExtensions = ["pdf", "doc", "docx", "txt"];
        const extension = file.name.split(".").pop().toLowerCase();

        if (!allowedExtensions.includes(extension)) {
            feedback.className = "form-feedback error";
            feedback.textContent = "Formato de arquivo não permitido.";
            return;
        }
    }

    feedback.className = "form-feedback success";
    feedback.textContent =
        "Solicitação registrada com sucesso! No protótipo, o envio está sendo simulado. " +
        "Em uma versão publicada, os dados seriam encaminhados por e-mail à profissional.";

    quoteForm.reset();
    updateConditionalFields();
    window.scrollTo({
        top: document.getElementById("formFeedback").getBoundingClientRect().top +
             window.scrollY - 120,
        behavior: "smooth"
    });
});

updateConditionalFields();
