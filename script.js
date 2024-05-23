document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://api.ficticia.com/user';  // API fictícia
    const userName = document.getElementById('user-name');
    const profileImg = document.getElementById('profile-img');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const editButton = document.getElementById('edit-button');
    let isEditing = false;

    // Função para preencher os dados do usuário
    async function fetchUserData() {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            userName.textContent = data.name;
            profileImg.src = data.profilePicture || 'default-profile.png';
            nameInput.value = data.name;
            emailInput.value = data.email;
            phoneInput.value = data.phone;
        } catch (error) {
            console.error('Erro ao buscar dados do usuário:', error);
        }
    }

    // Função para habilitar/desabilitar edição
    function toggleEdit() {
        isEditing = !isEditing;
        nameInput.disabled = !isEditing;
        emailInput.disabled = !isEditing;
        phoneInput.disabled = !isEditing;
        editButton.textContent = isEditing ? 'Salvar' : 'Editar';

        if (!isEditing) {
            saveUserData();
        }
    }

    // Função para salvar os dados do usuário
    async function saveUserData() {
        const updatedData = {
            name: nameInput.value,
            email: emailInput.value,
            phone: phoneInput.value
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });
            if (!response.ok) {
                throw new Error('Erro ao salvar dados');
            }
        } catch (error) {
            console.error('Erro ao salvar dados do usuário:', error);
        }
    }

    // Função para fazer upload da imagem
    function uploadImage(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profileImg.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    editButton.addEventListener('click', toggleEdit);
    fetchUserData();
});
