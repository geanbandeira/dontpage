// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC0AkBC5batGFJ_UvF5hxwswl0HsWd417s",
    authDomain: "dontpage-7fc6c.firebaseapp.com",
    databaseURL: "https://dontpage-7fc6c-default-rtdb.firebaseio.com",
    projectId: "dontpage-7fc6c",
    storageBucket: "dontpage-7fc6c.appspot.com",
    messagingSenderId: "541814912651",
    appId: "1:541814912651:web:dfa3399a6a6aee25ed868e"
};

// Variáveis globais
let database;
let currentPageId = '';
let lastSavedTime = null;
let saveTimer = null;

// Inicializa o Firebase
function initializeFirebase() {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    return firebase.database();
}

// Inicializa a aplicação
function initializeApp() {
    database = initializeFirebase();
    
    // Configura elementos da UI
    const editor = document.getElementById('editor');
    const pageIdDisplay = document.getElementById('page-id-display');
    const lastSaved = document.getElementById('last-saved');
    const charCount = document.getElementById('char-count');
    const pageUrl = document.getElementById('page-url');
    const copyUrlBtn = document.getElementById('copy-url');
    const shareWhatsappBtn = document.getElementById('share-whatsapp');
    const newPageBtn = document.getElementById('new-page');

    // Função para carregar uma página
    function loadPage(pageId) {
        currentPageId = pageId;
        if (pageIdDisplay) pageIdDisplay.textContent = currentPageId;
        updateShareUrl();
        
        const pageRef = database.ref(`pages/${currentPageId}`);
        
        pageRef.on('value', (snapshot) => {
            const data = snapshot.val();
            if (editor) {
                editor.value = data?.content || '';
                lastSavedTime = data?.updatedAt || null;
                updateLastSaved();
                updateCharCount();
                setTimeout(() => editor.focus(), 100);
            }
        });
    }

    // Atualiza URL de compartilhamento
    function updateShareUrl() {
        if (pageUrl) {
            pageUrl.value = window.location.origin + '/' + currentPageId;
        }
    }

    // Atualiza status de salvamento
    function updateLastSaved() {
        if (!lastSaved) return;
        
        if (!lastSavedTime) {
            lastSaved.textContent = 'Não salvo ainda';
            return;
        }
        
        const now = new Date();
        const savedTime = new Date(lastSavedTime);
        const diffInMinutes = Math.floor((now - savedTime) / (1000 * 60));
        
        if (diffInMinutes < 1) {
            lastSaved.textContent = 'Salvo agora há pouco';
        } else if (diffInMinutes < 60) {
            lastSaved.textContent = `Salvo há ${diffInMinutes} minuto${diffInMinutes !== 1 ? 's' : ''}`;
        } else {
            const options = { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' };
            lastSaved.textContent = `Salvo em ${savedTime.toLocaleDateString('pt-BR', options)}`;
        }
    }

    // Atualiza contagem de caracteres
    function updateCharCount() {
        if (!editor || !charCount) return;
        const count = editor.value.length;
        charCount.textContent = `${count} caractere${count !== 1 ? 's' : ''}`;
    }

    // Salva a página
    function savePage() {
        if (!editor || !currentPageId) return;
        
        const content = editor.value;
        const pageData = {
            content: content,
            updatedAt: new Date().toISOString()
        };
        
        database.ref(`pages/${currentPageId}`).set(pageData)
            .then(() => {
                lastSavedTime = new Date().toISOString();
                updateLastSaved();
            })
            .catch(error => {
                console.error('Erro ao salvar:', error);
            });
    }

    // Debounce para salvamento automático
    function debounceSave() {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(savePage, 2000);
    }

    // Cria nova página
    function createNewPage() {
        const newPageName = prompt('Digite um nome para a nova página:');
        if (newPageName) {
            const cleanName = newPageName.toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '');
            if (cleanName) {
                window.location.href = `/${cleanName}`;
            } else {
                alert('Por favor, use apenas letras, números e hífens');
            }
        }
    }

    // Configura event listeners
    if (editor) {
        editor.addEventListener('input', () => {
            updateCharCount();
            debounceSave();
        });
    }

    if (copyUrlBtn) {
        copyUrlBtn.addEventListener('click', () => {
            pageUrl.select();
            document.execCommand('copy');
            copyUrlBtn.textContent = 'Copiado!';
            setTimeout(() => {
                copyUrlBtn.textContent = 'Copiar URL';
            }, 2000);
        });
    }

    if (shareWhatsappBtn) {
        shareWhatsappBtn.addEventListener('click', () => {
            const url = encodeURIComponent(pageUrl.value);
            window.open(`https://wa.me/?text=${url}`, '_blank');
        });
    }

    if (newPageBtn) {
        newPageBtn.addEventListener('click', createNewPage);
    }

    // Exporta funções para uso no 404.html
    window.initializeEditor = initializeEditor;
    window.loadPage = loadPage;
}

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registrado com sucesso');
            })
            .catch(err => {
                console.log('Falha no registro do ServiceWorker:', err);
            });
    });
}