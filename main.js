const CLOUD_NAME = "dnlzjnobc";
const UPLOAD_PRESET = "Preset5A";

const fileInput = document.getElementById('file-input');
const uploadBtn = document.getElementById('upload-btn');
const loadingContainer = document.getElementById('loading-container');
const statusMessage = document.getElementById('status-message');
const previewImg = document.getElementById('preview');

fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImg.src = e.target.result;
            previewImg.style.display = 'block';
            if(placeholderText) placeholderText.style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
});

uploadBtn.addEventListener('click', () => {
    const file = fileInput.files[0];

    // Validación
    if (!file) {
        statusMessage.innerText = "Error: Por favor selecciona una imagen.";
        statusMessage.className = "text-error";
        return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    uploadBtn.disabled = true;
    loadingContainer.style.display = 'flex';
    statusMessage.innerText = "";
    previewImg.style.display = 'none';

    fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            
            throw new Error("No se pudo completar la carga. Verifica tu conexión.");
        }
        return response.json();
    })
    .then(data => {
        statusMessage.innerText = "¡Imagen cargada exitosamente!";
        statusMessage.className = "text-success";
        
        previewImg.src = data.secure_url; 
        previewImg.style.display = 'block';

        const urlDisplay = document.getElementById('url-display');
        urlDisplay.innerHTML = `<strong>URL:</strong> <a href="${data.secure_url}" target="_blank">${data.secure_url}</a>`;
    })
    .catch(error => {
        console.error("Error en el proceso:", error);
        statusMessage.innerText = error.message || "Ocurrió un error inesperado.";
        statusMessage.className = "text-error";
    })
    .finally(() => {
        uploadBtn.disabled = false;
        loadingContainer.style.display = 'none';
    });
});