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

// Inicialização do Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Elementos DOM
const editor = document.getElementById('editor');
const pageIdDisplay = document.getElementById('page-id-display');
const lastSaved = document.getElementById('last-saved');
const charCount = document.getElementById('char-count');
const pageUrl = document.getElementById('page-url');
const copyUrlBtn = document.getElementById('copy-url');
const shareWhatsappBtn = document.getElementById('share-whatsapp');

// Estado da aplicação
let currentPageId = 'home';
let lastSavedTime = null;
let saveTimer = null;

// Função para obter o ID da página da URL
function getPageIdFromUrl() {
    const path = window.location.pathname.substring(1);
    return path || 'home';
}

// Função para atualizar a URL
function updateUrl(pageId) {
    const newUrl = `/${pageId}`;
    if (window.location.pathname !== newUrl) {
        window.history.replaceState({ pageId }, '', newUrl);
    }
    updateShareUrl();
}

// Função para atualizar o URL de compartilhamento
function updateShareUrl() {
    if (pageUrl) {
        pageUrl.value = window.location.origin + '/' + currentPageId;
    }
}

// Função para carregar uma página
function loadPage(pageId) {
    currentPageId = pageId.toLowerCase().replace(/[^a-z0-9-]/g, '') || 'home';
    pageIdDisplay.textContent = currentPageId;
    updateUrl(currentPageId);
    
    const pageRef = database.ref(`pages/${currentPageId}`);
    
    pageRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            editor.value = data.content || '';
            lastSavedTime = data.updatedAt;
            updateLastSaved();
        } else {
            editor.value = '';
            lastSavedTime = null;
            lastSaved.textContent = 'Não salvo ainda';
        }
        updateCharCount();
    });
    
    setTimeout(() => editor.focus(), 100);
}

// Função para salvar a página
function savePage() {
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

// Função para atualizar o status "Último salvamento"
function updateLastSaved() {
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

// Função para atualizar a contagem de caracteres
function updateCharCount() {
    const count = editor.value.length;
    charCount.textContent = `${count} caractere${count !== 1 ? 's' : ''}`;
}

// Debounce para salvar automaticamente
function debounceSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(savePage, 2000);
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    if (editor) {
        loadPage(getPageIdFromUrl());
        
        editor.addEventListener('input', () => {
            updateCharCount();
            debounceSave();
        });
        
        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.pageId) {
                loadPage(event.state.pageId);
            }
        });

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
    }
});

// Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registrado');
            })
            .catch(err => {
                console.log('Falha no ServiceWorker:', err);
            });
    });
}