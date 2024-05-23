// Este evento é acionado quando o DOM está completamente carregado
document.addEventListener("DOMContentLoaded", () => {
  // URL da API fictícia para o usuário
  const apiUrl = "https://api.ficticia.com/user";

  // Elementos da página
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
  let isEditing = false; // Flag para indicar se o formulário está em modo de edição

  // Dados fictícios
  const userData = {
    name: "João Silva",
    email: "joao.silva@example.com",
    phone: "(11) 91234-5678",
    cpf: "123.456.789-00",
    cep: "01001-000",
    profilePicture: "assets/default.jpg",
  };

  // Função para preencher os dados do usuário na página
  function fillUserData(userData) {
    userName.textContent = userData.name;
    profileImg.src = userData.profilePicture || "assets/default.jpg";
    nameInput.value = userData.name;
    emailInput.value = userData.email;
    phoneInput.value = userData.phone;
    cpfInput.value = userData.cpf;
    cepInput.value = userData.cep;
  }

  // Função para habilitar ou desabilitar o modo de edição
  function toggleEdit() {
    isEditing = !isEditing;
    nameInput.disabled = !isEditing;
    emailInput.disabled = !isEditing;
    phoneInput.disabled = !isEditing;
    cpfInput.disabled = !isEditing;
    cepInput.disabled = !isEditing;
    editButton.textContent = isEditing ? "Salvar" : "Editar"; // Alterna o texto do botão entre "Salvar" e "Editar"

    if (!isEditing) {
      saveUserData(); // Se o modo de edição estiver sendo desativado, salva os dados do usuário
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

  // Função para fazer upload da imagem do perfil do usuário
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

  // Função para buscar endereço pelo CEP utilizando a API ViaCEP
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
      addressFields.style.display = "block"; // Exibe os campos de endereço na página
      errorMessage.style.display = "none"; // Esconde a mensagem de erro, se estiver sendo exibida
    } catch (error) {
      console.error("Erro ao buscar endereço:", error);
      addressFields.style.display = "none"; // Esconde os campos de endereço na página
      errorMessage.style.display = "block"; // Exibe a mensagem de erro na página
    }
  }

  // Adiciona máscaras nos campos de CPF e CEP utilizando a biblioteca Vanilla Masker
  VMasker(cpfInput).maskPattern("999.999.999-99");
  VMasker(cepInput).maskPattern("99999-999");

  // Função para obter os dados do usuário
  async function getUserData() {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Erro ao obter dados do usuário");
      }
      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error("Erro ao obter dados do usuário:", error);
      // Em caso de erro, retorna os dados fictícios
      return userData;
    }
  }

  // Preenche os dados do usuário ao carregar a página
  getUserData()
    .then((userData) => {
      if (userData) {
        fillUserData(userData);
      }
    })
    .catch((error) => {
      console.error("Erro ao obter os dados do usuário:", error);
      // Em caso de erro, preenche os dados com os dados fictícios
      fillUserData(userData);
    });

  // Evento acionado quando o campo de CEP perde o foco, disparando a busca de endereço
  cepInput.addEventListener("blur", () => {
    const cep = cepInput.value.replace(/\D/g, ""); // Remove caracteres não numéricos do CEP
    if (cep.length === 8) {
      // Verifica se o CEP possui o tamanho correto
      fetchAddress(cep); // Busca o endereço correspondente ao CEP informado
    }
  });

  // Evento acionado ao clicar no botão de edição, alternando entre os modos de edição e visualização
  editButton.addEventListener("click", toggleEdit);

});
