// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC0AkBC5batGFJ_UvF5hxwswl0HsWd417s",
  authDomain: "dontpage-7fc6c.firebaseapp.com",
  databaseURL: "https://dontpage-7fc6c-default-rtdb.firebaseio.com",
  projectId: "dontpage-7fc6c",
  storageBucket: "dontpage-7fc6c.firebasestorage.app",
  messagingSenderId: "541814912651",
  appId: "1:541814912651:web:dfa3399a6a6aee25ed868e",
  measurementId: "G-9Y35DH0M3Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Inicialize o Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Estado do menu mobile
let menuVisible = false;
let menuOverlay = null;

// Função para criar o overlay do menu
function createMenuOverlay() {
    menuOverlay = document.createElement('div');
    menuOverlay.className = 'menu-overlay';
    menuOverlay.addEventListener('click', toggleMenu);
    document.body.appendChild(menuOverlay);
}

function toggleMenu() {
    const sidebar = document.querySelector('.sidebar');
    const isMobile = window.matchMedia('(max-width: 1024px)').matches;
    
    if (isMobile) {
        menuVisible = !menuVisible;
        
        if (menuVisible) {
            sidebar.classList.add('visible');
            menuOverlay.classList.add('visible');
        } else {
            sidebar.classList.remove('visible');
            menuOverlay.classList.remove('visible');
        }
    }
}

// Função para lidar com as mudanças de URL
function handleUrlChanges() {
    // Atualiza a URL quando a página muda
    function updateUrl(pageId) {
        const url = new URL(window.location.origin);
        url.pathname = '/' + pageId;
        window.history.pushState({ pageId }, '', url);
    }

    // Verifica mudanças na URL
    window.addEventListener('popstate', (event) => {
        const pageId = window.location.pathname.slice(1);
        if (pageId && pageId !== currentPageId) {
            checkUrlForPageId();
        }
    });

    return { updateUrl };
}

// Sincronização em tempo real com Firebase
function setupRealtimeSync(pageId) {
    // Remove listener anterior se existir
    if (window.currentPageRef) {
        window.currentPageRef.off();
    }

    // Cria referência para a página no Firebase
    window.currentPageRef = database.ref('pages/' + pageId);

    // Flag para evitar loops de atualização
    let isSyncing = false;

    // Sincroniza alterações do editor para o Firebase
    editor.addEventListener('input', () => {
        if (isSyncing) return;
        
        const content = editor.innerHTML;
        window.currentPageRef.set({
            content: content,
            updatedAt: firebase.database.ServerValue.TIMESTAMP
        });
    });

    // Atualiza o editor quando houver mudanças no Firebase
    window.currentPageRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data && data.content !== editor.innerHTML) {
            isSyncing = true;
            editor.innerHTML = data.content || '';
            updateWordCount();
            updateLineNumbers();
            setTimeout(() => { isSyncing = false; }, 100);
        }
    });
}

// Modifique a função loadPage para incluir a sincronização
function loadPage(pageId) {
    const pageRef = database.ref('pages/' + pageId);
    
    pageRef.once('value').then((snapshot) => {
        const page = snapshot.val();
        if (!page) {
            createPage(pageId);
            return;
        }

        currentPageId = pageId;
        editor.innerHTML = page.content || '';
        if (pageName) pageName.value = page.name || pageId;
        if (pageDate) pageDate.textContent = `Created: ${formatDate(page.createdAt || new Date().toISOString())}`;

        // Configura sincronização em tempo real
        setupRealtimeSync(pageId);

        updateWordCount();
        updateLineNumbers();
        updateCursorPosition();
    }).catch((error) => {
        console.error("Error loading page:", error);
        showToast('Error loading page', 'error');
    });
}

function checkUrlForPageId() {
    const urlParams = new URLSearchParams(window.location.search);
    const pageId = urlParams.get('page') || window.location.pathname.slice(1);

    if (pageId) {
        // Verifica se a página existe no Firebase
        database.ref('pages/' + pageId).once('value').then((snapshot) => {
            if (snapshot.exists()) {
                // Página existe - carrega
                loadPage(pageId);
            } else {
                // Página não existe - cria nova
                createPage(pageId);
            }
        });
    } else {
        // Carrega página padrão
        loadPage(currentPageId);
    }
}

// DontPage - A Modern Alternative to Dontpad
document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const editor = document.getElementById('editor');
    const preview = document.getElementById('preview');
    const lineNumbers = document.getElementById('line-numbers');
    const wordCount = document.getElementById('word-count');
    const cursorPosition = document.getElementById('cursor-position');
    const lastSaved = document.getElementById('last-saved');
    const pageName = document.getElementById('page-name');
    const pageDate = document.getElementById('page-date');
    const pageSize = document.getElementById('page-size');
    const themeToggle = document.getElementById('theme-toggle');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const saveNowBtn = document.getElementById('save-now-btn');
    const newPageBtn = document.getElementById('new-page-btn');
    const myPagesBtn = document.getElementById('my-pages-btn');
    const exportPdfBtn = document.getElementById('export-pdf');
    const exportMdBtn = document.getElementById('export-md');
    const exportTxtBtn = document.getElementById('export-txt');
    const exportHtmlBtn = document.getElementById('export-html');
    const copyLinkBtn = document.getElementById('copy-link');
    const shareEmailBtn = document.getElementById('share-email');
    const shareSocialBtn = document.getElementById('share-social');
    const startCollabBtn = document.getElementById('start-collab');
    const collabStatus = document.getElementById('collab-status');
    const collabUsers = document.getElementById('collab-users');
    const readOnlyToggle = document.getElementById('read-only-toggle');
    const passwordProtectToggle = document.getElementById('password-protect-toggle');
    const passwordInputContainer = document.getElementById('password-input-container');
    const setPasswordBtn = document.getElementById('set-password-btn');
    const pagePassword = document.getElementById('page-password');
    const editorTheme = document.getElementById('editor-theme');
    const editorFont = document.getElementById('editor-font');
    const fontSize = document.getElementById('font-size');
    const lineNumbersToggle = document.getElementById('line-numbers-toggle');
    const autoSaveToggle = document.getElementById('auto-save-toggle');
    const versionHistoryBtn = document.getElementById('version-history');
    const analyzeTextBtn = document.getElementById('analyze-text');
    const aiAssistantBtn = document.getElementById('ai-assistant');
    const customCssBtn = document.getElementById('custom-css');
    const findReplaceBtn = document.getElementById('find-replace-btn');
    const accountBtn = document.getElementById('account-btn');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    // Modals
    const modals = document.querySelectorAll('.modal');
    const newPageModal = document.getElementById('new-page-modal');
    const myPagesModal = document.getElementById('my-pages-modal');
    const findReplaceModal = document.getElementById('find-replace-modal');
    const shareModal = document.getElementById('share-modal');
    const accountModal = document.getElementById('account-modal');
    const versionHistoryModal = document.getElementById('version-history-modal');
    const aiAssistantModal = document.getElementById('ai-assistant-modal');

    // State variables
    let currentPageId = generatePageId();
    let pages = [];
    let isCollaborating = false;
    let isReadOnly = false;
    let isPasswordProtected = false;
    let autoSaveInterval;
    let lastSavedTime = null;
    let cursorPos = { line: 1, col: 1 };
    let debounceTimer;
    let collaborationChannel;

    // Initialize the app
    init();

    function init() {
        // Cria o botão do menu mobile
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.id = 'mobile-menu-btn';
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        document.querySelector('.header-left').prepend(mobileMenuBtn);
        mobileMenuBtn.addEventListener('click', toggleMenu);
        
        createMenuOverlay();
        
        // Configura manipulador de URLs
        handleUrlChanges();
        
        // Load saved pages from localStorage
        loadPages();
    
        // Check URL for page ID
        checkUrlForPageId();
    
        // Set up event listeners
        setupEventListeners();
    
        // Initialize editor
        initEditor();
    
        // Set up auto-save
        setupAutoSave();
    
        // Update UI
        updateUI();
    
        // Check for system theme preference
        checkSystemTheme();
    
        // Register service worker for PWA
        registerServiceWorker();

        // Handle window resize
        window.addEventListener('resize', handleResize);
        handleResize(); // Call once on init
    }

    function handleResize() {
        const isMobile = window.matchMedia('(max-width: 1024px)').matches;
        const sidebar = document.querySelector('.sidebar');
        
        if (isMobile) {
            sidebar.style.transform = 'translateX(-100%)';
            menuVisible = false;
            if (menuOverlay) menuOverlay.classList.remove('visible');
        } else {
            sidebar.style.transform = 'translateX(0)';
            if (menuOverlay) menuOverlay.classList.remove('visible');
        }
    }

    // Restante do seu código JavaScript existente...
});

// Service Worker (sw.js)
const CACHE_NAME = 'dontpage-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/app.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/base16/dracula.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/marked/5.0.2/marked.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.0.1/purify.min.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});