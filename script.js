document.addEventListener('DOMContentLoaded', () => {
    const classifyBtn = document.getElementById('classify-btn');
    const commentInput = document.getElementById('comment-input');
    const resultContainer = document.getElementById('result-container');
    const resultText = document.getElementById('result-text');
    const loader = document.getElementById('loader');

    // IMPORTANTE: Substitua pela URL da sua API no Hugging Face Spaces
    const API_URL = 'https://SEU-USUARIO-SEU-SPACE.hf.space/predict';

    classifyBtn.addEventListener('click', async () => {
        const comment = commentInput.value.trim();
        if (comment === '') {
            alert('Por favor, digite um comentário.');
            return;
        }

        // Mostra o loader e esconde o resultado anterior
        loader.classList.remove('hidden');
        resultContainer.classList.add('hidden');
        classifyBtn.disabled = true;

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ texto: comment }),
            });

            if (!response.ok) {
                throw new Error(`Erro na API: ${response.statusText}`);
            }

            const data = await response.json();
            displayResult(data);

        } catch (error) {
            console.error('Falha ao chamar a API:', error);
            resultText.textContent = 'Ocorreu um erro ao processar seu comentário. Tente novamente.';
            resultContainer.className = 'result-container toxic'; // Estilo de erro
            resultContainer.classList.remove('hidden');
        } finally {
            // Esconde o loader e reabilita o botão
            loader.classList.add('hidden');
            classifyBtn.disabled = false;
        }
    });

    function displayResult(data) {
        const confidencePercent = (data.confianca * 100).toFixed(2);
        let classificationText = `${data.classificacao} (Confiança: ${confidencePercent}%)`;

        resultText.textContent = classificationText;
        
        // Remove classes antigas e adiciona a nova para estilização condicional
        resultContainer.className = 'result-container';
        if (data.classificacao === 'Tóxico') {
            resultContainer.classList.add('toxic');
        } else {
            resultContainer.classList.add('not-toxic');
        }
        
        resultContainer.classList.remove('hidden');
    }
});