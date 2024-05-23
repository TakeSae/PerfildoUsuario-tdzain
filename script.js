document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "https://api.ficticia.com/user"; // API fictícia
  const userName = document.getElementById("user-name");
  const profileImg = document.getElementById("profile-img");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const cpfInput = document.getElementById("cpf");
  const cepInput = document.getElementById("cep");
  const streetInput = document.getElementById("street");
  const neighborhoodInput = document.getElementById("neighborhood");
  const cityInput = document.getElementById("city");
  const stateInput = document.getElementById("state");
  const addressFields = document.getElementById("address-fields");
  const errorMessage = document.getElementById("error-message");
  const editButton = document.getElementById("edit-button");
  let isEditing = false;

  // Dados fictícios
  const userData = {
    name: "João Silva",
    email: "joao.silva@example.com",
    phone: "(11) 91234-5678",
    cpf: "123.456.789-00",
    cep: "01001-000",
    profilePicture: "assets/default.jpg",
  };

  // Função para preencher os dados do usuário
  function fillUserData() {
    userName.textContent = userData.name;
    profileImg.src = userData.profilePicture || "assets/default.jpg";
    nameInput.value = userData.name;
    emailInput.value = userData.email;
    phoneInput.value = userData.phone;
    cpfInput.value = userData.cpf;
    cepInput.value = userData.cep;
  }

  // Função para habilitar/desabilitar edição
  function toggleEdit() {
    isEditing = !isEditing;
    nameInput.disabled = !isEditing;
    emailInput.disabled = !isEditing;
    phoneInput.disabled = !isEditing;
    cpfInput.disabled = !isEditing;
    cepInput.disabled = !isEditing;
    editButton.textContent = isEditing ? "Salvar" : "Editar";

    if (!isEditing) {
      saveUserData();
    }
  }

  // Função para salvar os dados do usuário
  async function saveUserData() {
    const updatedData = {
      name: nameInput.value,
      email: emailInput.value,
      phone: phoneInput.value,
      cpf: cpfInput.value,
      cep: cepInput.value,
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        throw new Error("Erro ao salvar dados");
      }
    } catch (error) {
      console.error("Erro ao salvar dados do usuário:", error);
    }
  }

  // Função para fazer upload da imagem
  function uploadImage(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        profileImg.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Função para buscar endereço pelo CEP
  async function fetchAddress(cep) {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (data.erro) {
        throw new Error("CEP não encontrado");
      }
      streetInput.value = data.logradouro;
      neighborhoodInput.value = data.bairro;
      cityInput.value = data.localidade;
      stateInput.value = data.uf;
      addressFields.style.display = "block";
      errorMessage.style.display = "none";
    } catch (error) {
      console.error("Erro ao buscar endereço:", error);
      addressFields.style.display = "none";
      errorMessage.style.display = "block";
    }
  }

  // Adiciona máscara de CPF e CEP
  VMasker(cpfInput).maskPattern("999.999.999-99");
  VMasker(cepInput).maskPattern("99999-999");

  // Evento de saída do campo CEP para buscar endereço
  cepInput.addEventListener("blur", () => {
    const cep = cepInput.value.replace(/\D/g, "");
    if (cep.length === 8) {
      fetchAddress(cep);
    }
  });

  editButton.addEventListener("click", toggleEdit);
  fillUserData();
});
