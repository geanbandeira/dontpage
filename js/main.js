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

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Elementos DOM
const editor = document.getElementById('editor');
const pageIdDisplay = document.getElementById('page-id-display');
const lastSaved = document.getElementById('last-saved');
const charCount = document.getElementById('char-count');

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
    const url = new URL(window.location.origin);
    url.pathname = pageId;
    window.history.pushState({ pageId }, '', url);
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
    
    // Foca no editor após carregar
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
    // Carrega a página baseada na URL
    loadPage(getPageIdFromUrl());
    
    // Event listeners
    editor.addEventListener('input', () => {
        updateCharCount();
        debounceSave();
    });
    
    // Lidar com mudanças de URL (back/forward)
    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.pageId) {
            loadPage(event.state.pageId);
        }
    });
});

// Service Worker para funcionar offline
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