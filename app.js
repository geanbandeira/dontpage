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
function initializeFirebase() {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    return firebase.database();
}

// Elementos DOM
let editor, pageIdDisplay, lastSaved, charCount, pageUrl, copyUrlBtn, shareWhatsappBtn, newPageBtn;

// Estado da aplicação
let currentPageId = 'home';
let lastSavedTime = null;
let saveTimer = null;
let database;

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
    
    if (pageIdDisplay) pageIdDisplay.textContent = currentPageId;
    updateUrl(currentPageId);
    
    const pageRef = database.ref(`pages/${currentPageId}`);
    
    pageRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (editor) {
            if (data) {
                editor.value = data.content || '';
                lastSavedTime = data.updatedAt;
                updateLastSaved();
            } else {
                editor.value = '';
                lastSavedTime = null;
                if (lastSaved) lastSaved.textContent = 'Não salvo ainda';
            }
            updateCharCount();
        }
    });
    
    if (editor) setTimeout(() => editor.focus(), 100);
}

// Função para salvar a página
function savePage() {
    if (!editor) return;
    
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

// Função para atualizar a contagem de caracteres
function updateCharCount() {
    if (!editor || !charCount) return;
    
    const count = editor.value.length;
    charCount.textContent = `${count} caractere${count !== 1 ? 's' : ''}`;
}

// Debounce para salvar automaticamente
function debounceSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(savePage, 2000);
}

// Criar nova página
function createNewPage() {
    const newPageName = prompt('Digite um nome para a nova página:');
    if (newPageName) {
        const cleanName = newPageName.toLowerCase().replace(/[^a-z0-9-]/g, '');
        if (cleanName) {
            window.location.href = `/${cleanName}`;
        } else {
            alert('Use apenas letras, números e hífens');
        }
    }
}

// Inicialização do editor
function initializePage() {
    // Obter referências aos elementos DOM
    editor = document.getElementById('editor');
    pageIdDisplay = document.getElementById('page-id-display');
    lastSaved = document.getElementById('last-saved');
    charCount = document.getElementById('char-count');
    pageUrl = document.getElementById('page-url');
    copyUrlBtn = document.getElementById('copy-url');
    shareWhatsappBtn = document.getElementById('share-whatsapp');
    newPageBtn = document.getElementById('new-page');

    // Inicializar Firebase
    database = initializeFirebase();

    // Carregar a página
    loadPage(getPageIdFromUrl());
    
    // Configurar event listeners
    if (editor) {
        editor.addEventListener('input', () => {
            updateCharCount();
            debounceSave();
        });
    }
    
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

    if (newPageBtn) {
        newPageBtn.addEventListener('click', createNewPage);
    }
}

// Inicialização para páginas regulares (index.html)
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('create-page')) {
        // Estamos na página inicial
        document.getElementById('create-page').addEventListener('click', () => {
            const pageName = document.getElementById('page-name').value.trim();
            if (pageName) {
                const cleanName = pageName.toLowerCase().replace(/[^a-z0-9-]/g, '');
                if (cleanName) {
                    window.location.href = `/${cleanName}`;
                } else {
                    alert('Use apenas letras, números e hífens');
                }
            }
        });

        document.getElementById('page-name').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('create-page').click();
            }
        });
    } else if (window.location.pathname !== '/' && !window.location.pathname.includes('.')) {
        // Estamos em uma página de conteúdo (/nome-da-pagina)
        initializeFirebase();
        initializePage();
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