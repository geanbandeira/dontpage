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
const homePage = document.getElementById('home-page');
const editorContainer = document.getElementById('editor-container');
const editor = document.getElementById('editor');
const pageIdDisplay = document.getElementById('page-id-display');
const lastSaved = document.getElementById('last-saved');
const charCount = document.getElementById('char-count');
const pageInput = document.getElementById('page-input');
const goButton = document.getElementById('go-button');

// Estado da aplicação
let currentPageId = 'home';
let lastSavedTime = null;
let saveTimer = null;

// Funções auxiliares
function getPageIdFromUrl() {
    const path = window.location.pathname.substring(1);
    return path || null;
}

function updateUrl(pageId) {
    const url = new URL(window.location.origin);
    url.pathname = pageId;
    window.history.pushState({ pageId }, '', url);
}

function showEditor() {
    homePage.style.display = 'none';
    editorContainer.style.display = 'block';
    editor.focus();
}

function showHome() {
    homePage.style.display = 'flex';
    editorContainer.style.display = 'none';
    pageInput.focus();
}

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

function updateCharCount() {
    const count = editor.value.length;
    charCount.textContent = `${count} caractere${count !== 1 ? 's' : ''}`;
}

function debounceSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(savePage, 2000);
}

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

function loadPage(pageId) {
    // Limpa e formata o ID da página
    pageId = (pageId || 'home').toLowerCase()
        .replace(/[^a-z0-9-]/g, '') // Remove caracteres especiais
        .replace(/-+/g, '-')        // Remove hífens múltiplos
        .replace(/^-|-$/g, '');     // Remove hífens no início/fim
    
    if (!pageId) pageId = 'home';
    
    currentPageId = pageId;
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
    
    showEditor();
}

// Event Listeners
goButton.addEventListener('click', () => {
    const pageId = pageInput.value.trim();
    if (pageId) {
        loadPage(pageId);
    }
});

pageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const pageId = pageInput.value.trim();
        if (pageId) {
            loadPage(pageId);
        }
    }
});

editor.addEventListener('input', () => {
    updateCharCount();
    debounceSave();
});

window.addEventListener('popstate', (event) => {
    const pageId = getPageIdFromUrl();
    if (pageId) {
        loadPage(pageId);
    } else {
        showHome();
    }
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    const pageId = getPageIdFromUrl();
    
    if (pageId) {
        loadPage(pageId);
    } else {
        showHome();
    }
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