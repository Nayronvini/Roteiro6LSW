document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("location-form");
    const locationsList = document.getElementById("locations-list");
    const apiUrl = "http://localhost:3000/locais";
    let editingLocationId = null;  // Variável para armazenar o ID do local que está sendo editado

    function fetchLocations() {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                locationsList.innerHTML = "";
                data.forEach(location => {
                    const title = location.title || location.titulo;
                    const description = location.description || location.descricao;
                    const image = location.image || location.foto;

                    const locationDiv = document.createElement("div");
                    locationDiv.classList.add("location");
                    locationDiv.innerHTML = `
                        <h3>${title}</h3>
                        <p>${description}</p>
                        <img src="${image}" alt="${title}" width="200">
                        <button onclick="deleteLocation('${location.id}')">Excluir</button>
                        <button onclick="editLocation('${location.id}')">Editar</button>
                    `;
                    locationsList.appendChild(locationDiv);
                });
            });
    }

    // Função para preencher o formulário de edição
    window.editLocation = function(id) {
        fetch(`${apiUrl}/${id}`)
            .then(response => response.json())
            .then(location => {
                const title = location.title || location.titulo;
                const description = location.description || location.descricao;
                const image = location.image || location.foto;

                // Preenchendo os campos de edição
                document.getElementById("title").value = title;
                document.getElementById("description").value = description;
                document.getElementById("image").value = image;

                // Armazenando o ID do local sendo editado
                editingLocationId = id;
            });
    };

    // Função para salvar as alterações de um local
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const title = document.getElementById("title").value;
        const description = document.getElementById("description").value;
        const image = document.getElementById("image").value;

        const updatedLocation = { title, description, image };

        if (editingLocationId) {
            // Atualizar o local existente
            fetch(`${apiUrl}/${editingLocationId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedLocation),
            }).then(() => {
                form.reset();
                editingLocationId = null;  // Limpar a variável após editar
                fetchLocations();
            });
        } else {
            // Adicionar um novo local
            fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedLocation),
            }).then(() => {
                form.reset();
                fetchLocations();
            });
        }
    });

    window.deleteLocation = function(id) {
        fetch(`${apiUrl}/${id}`, { method: "DELETE" })
            .then(() => fetchLocations());
    };

    fetchLocations();
});