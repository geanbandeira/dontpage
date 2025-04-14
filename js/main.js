// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC0AkBC5batGFJ_UvF5hxwswl0HsWd417s",
    authDomain: "dontpage-7fc6c.firebaseapp.com",
    projectId: "dontpage-7fc6c",
    storageBucket: "dontpage-7fc6c.appspot.com",
    messagingSenderId: "541814912651",
    appId: "1:541814912651:web:dfa3399a6a6aee25ed868e"
};

// Inicializa o Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getDatabase, ref, set, onValue, off } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Estado da aplicação
const state = {
    currentPageId: generatePageId(),
    pages: [],
    isCollaborating: false,
    isReadOnly: false,
    autoSaveEnabled: true,
    lastSavedTime: null,
    currentTheme: 'system',
    editorMode: 'edit', // 'edit' or 'preview'
    debounceTimer: null
};

// Elementos DOM
const elements = {
    editor: document.getElementById('editor'),
    preview: document.getElementById('preview'),
    lineNumbers: document.getElementById('line-numbers'),
    wordCount: document.getElementById('word-count'),
    cursorPosition: document.getElementById('cursor-position'),
    lastSaved: document.getElementById('last-saved'),
    pageName: document.getElementById('page-name'),
    pageDate: document.getElementById('page-date'),
    pageSize: document.getElementById('page-size'),
    themeToggle: document.getElementById('theme-toggle'),
    fullscreenBtn: document.getElementById('fullscreen-btn'),
    sidebarToggle: document.getElementById('sidebar-toggle'),
    mobileMenuBtn: document.getElementById('mobile-menu-btn'),
    saveNowBtn: document.getElementById('save-now-btn'),
    newPageBtn: document.getElementById('new-page-btn'),
    exportPdfBtn: document.getElementById('export-pdf'),
    exportMdBtn: document.getElementById('export-md'),
    copyLinkBtn: document.getElementById('copy-link'),
    editorTheme: document.getElementById('editor-theme'),
    autoSaveToggle: document.getElementById('auto-save-toggle'),
    previewBtn: document.getElementById('preview-btn'),
    newPageModal: document.getElementById('new-page-modal'),
    createPageBtn: document.getElementById('create-page-btn'),
    newPageName: document.getElementById('new-page-name'),
    toastContainer: document.getElementById('toast-container')
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    initEditor();
    setupEventListeners();
    checkSystemTheme();
    loadPage(state.currentPageId);
    setupServiceWorker();
});

// Funções do Editor
function initEditor() {
    updateLineNumbers();
    setupAutoSave();
    
    elements.editor.addEventListener('input', () => {
        updateLineNumbers();
        updateWordCount();
        updatePageSize();
        debounceSave();
    });
    
    elements.editor.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            document.execCommand('insertText', false, '    ');
        }
    });
    
    elements.editor.addEventListener('scroll', syncScroll);
    elements.preview.addEventListener('scroll', syncScroll);
    
    // Comandos de formatação
    document.querySelectorAll('[data-command]').forEach(button => {
        button.addEventListener('click', () => {
            const command = button.getAttribute('data-command');
            execCommand(command);
        });
    });
}

function execCommand(command) {
    switch(command) {
        case 'bold': document.execCommand('bold', false, null); break;
        case 'italic': document.execCommand('italic', false, null); break;
        case 'underline': document.execCommand('underline', false, null); break;
        case 'heading1': document.execCommand('formatBlock', false, '<h1>'); break;
        case 'heading2': document.execCommand('formatBlock', false, '<h2>'); break;
        case 'ul': document.execCommand('insertUnorderedList', false, null); break;
        case 'ol': document.execCommand('insertOrderedList', false, null); break;
        case 'quote': document.execCommand('formatBlock', false, '<blockquote>'); break;
        case 'code': 
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const pre = document.createElement('pre');
                const code = document.createElement('code');
                code.textContent = range.toString();
                pre.appendChild(code);
                range.deleteContents();
                range.insertNode(pre);
            }
            break;
        case 'link':
            const url = prompt('Enter URL:', 'https://');
            if (url) document.execCommand('createLink', false, url);
            break;
        case 'undo': document.execCommand('undo', false, null); break;
        case 'redo': document.execCommand('redo', false, null); break;
    }
    elements.editor.focus();
}

function updateLineNumbers() {
    const lines = elements.editor.innerText.split('\n').length;
    let numbers = '';
    for (let i = 1; i <= lines; i++) {
        numbers += `${i}\n`;
    }
    elements.lineNumbers.innerHTML = numbers;
}

function updateWordCount() {
    const text = elements.editor.innerText.trim();
    const words = text ? text.split(/\s+/).length : 0;
    elements.wordCount.textContent = words;
}

function updatePageSize() {
    const size = elements.editor.innerText.length;
    elements.pageSize.textContent = `${size} chars`;
}

function syncScroll() {
    if (elements.editor.scrollTop !== elements.preview.scrollTop) {
        elements.preview.scrollTop = elements.editor.scrollTop;
    }
}

function togglePreview() {
    if (state.editorMode === 'edit') {
        elements.editor.classList.add('hidden');
        elements.preview.classList.remove('hidden');
        elements.preview.innerHTML = marked.parse(elements.editor.innerHTML);
        state.editorMode = 'preview';
        elements.previewBtn.innerHTML = '<i class="ph ph-pencil"></i>';
    } else {
        elements.editor.classList.remove('hidden');
        elements.preview.classList.add('hidden');
        state.editorMode = 'edit';
        elements.previewBtn.innerHTML = '<i class="ph ph-eye"></i>';
    }
}

// Gerenciamento de Páginas
function generatePageId() {
    return Math.random().toString(36).substring(2, 10);
}

function loadPage(pageId) {
    state.currentPageId = pageId;
    const pageRef = ref(db, `pages/${pageId}`);
    
    onValue(pageRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            elements.editor.innerHTML = data.content || '';
            if (elements.pageName) elements.pageName.value = data.name || pageId;
            if (elements.pageDate) {
                elements.pageDate.textContent = `Created: ${formatDate(data.createdAt || new Date().toISOString())}`;
            }
            updateWordCount();
            updateLineNumbers();
            updatePageSize();
            updateLastSaved(data.updatedAt);
        }
    });
    
    updateUrl(pageId);
}

function savePage() {
    const content = elements.editor.innerHTML;
    const pageData = {
        content,
        name: elements.pageName.value || state.currentPageId,
        updatedAt: new Date().toISOString(),
        createdAt: state.lastSavedTime || new Date().toISOString()
    };
    
    set(ref(db, `pages/${state.currentPageId}`), pageData)
        .then(() => {
            state.lastSavedTime = new Date().toISOString();
            updateLastSaved(state.lastSavedTime);
            showToast('Page saved successfully', 'success');
        })
        .catch(error => {
            console.error('Error saving page:', error);
            showToast('Error saving page', 'error');
        });
}

function createNewPage() {
    const name = elements.newPageName.value.trim() || generatePageId();
    const newPageId = name.toLowerCase().replace(/\s+/g, '-');
    
    state.currentPageId = newPageId;
    elements.editor.innerHTML = '';
    elements.pageName.value = name;
    savePage();
    closeModal(elements.newPageModal);
    showToast(`New page "${name}" created`, 'success');
}

function debounceSave() {
    clearTimeout(state.debounceTimer);
    if (state.autoSaveEnabled) {
        state.debounceTimer = setTimeout(savePage, 2000);
    }
}

function setupAutoSave() {
    if (state.autoSaveEnabled) {
        showToast('Auto-save enabled', 'success');
    }
}

// UI Functions
function updateLastSaved(timestamp) {
    if (!timestamp) {
        elements.lastSaved.textContent = 'Never saved';
        return;
    }
    
    const now = new Date();
    const savedTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - savedTime) / (1000 * 60));
    
    if (diffInMinutes < 1) {
        elements.lastSaved.textContent = 'Saved just now';
    } else if (diffInMinutes < 60) {
        elements.lastSaved.textContent = `Saved ${diffInMinutes} min ago`;
    } else {
        elements.lastSaved.textContent = `Saved on ${formatDate(timestamp)}`;
    }
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function toggleTheme() {
    const themes = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(state.currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    state.currentTheme = themes[nextIndex];
    
    document.documentElement.setAttribute('data-theme', state.currentTheme);
    
    // Atualiza o ícone do botão
    if (state.currentTheme === 'dark') {
        elements.themeToggle.innerHTML = '<i class="ph ph-sun"></i>';
    } else {
        elements.themeToggle.innerHTML = '<i class="ph ph-moon"></i>';
    }
    
    localStorage.setItem('theme', state.currentTheme);
    showToast(`Theme set to ${state.currentTheme}`, 'success');
}

function checkSystemTheme() {
    const savedTheme = localStorage.getItem('theme') || 'system';
    state.currentTheme = savedTheme;
    
    if (savedTheme === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
    
    // Atualiza o ícone do botão
    if (state.currentTheme === 'dark') {
        elements.themeToggle.innerHTML = '<i class="ph ph-sun"></i>';
    } else {
        elements.themeToggle.innerHTML = '<i class="ph ph-moon"></i>';
    }
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
        elements.fullscreenBtn.innerHTML = '<i class="ph ph-arrows-in"></i>';
    } else {
        document.exitFullscreen();
        elements.fullscreenBtn.innerHTML = '<i class="ph ph-arrows-out"></i>';
    }
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('visible');
    
    if (window.innerWidth <= 1024) {
        const overlay = document.querySelector('.menu-overlay');
        overlay.classList.toggle('visible');
    }
}

function showModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="ph ph-${type === 'success' ? 'check-circle' : 'warning-circle'}"></i>
        <span>${message}</span>
    `;
    
    elements.toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

function copyPageLink() {
    const url = `${window.location.origin}/${state.currentPageId}`;
    navigator.clipboard.writeText(url)
        .then(() => showToast('Link copied to clipboard', 'success'))
        .catch(() => showToast('Failed to copy link', 'error'));
}

function exportAsPdf() {
    showToast('Exporting to PDF...', 'info');
    // Implementação real exigiria uma biblioteca como pdf-lib ou jsPDF
    setTimeout(() => showToast('PDF export feature coming soon', 'info'), 1000);
}

function exportAsMarkdown() {
    const content = elements.editor.innerText;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.currentPageId}.md`;
    a.click();
    
    URL.revokeObjectURL(url);
    showToast('Exported as Markdown', 'success');
}

function updateUrl(pageId) {
    const url = new URL(window.location.origin);
    url.pathname = `/${pageId}`;
    window.history.pushState({ pageId }, '', url);
}

// Event Listeners
function setupEventListeners() {
    // Botões da barra de ferramentas
    elements.themeToggle.addEventListener('click', toggleTheme);
    elements.fullscreenBtn.addEventListener('click', toggleFullscreen);
    elements.sidebarToggle.addEventListener('click', toggleSidebar);
    elements.mobileMenuBtn.addEventListener('click', toggleSidebar);
    elements.saveNowBtn.addEventListener('click', savePage);
    elements.previewBtn.addEventListener('click', togglePreview);
    
    // Botões da sidebar
    elements.newPageBtn.addEventListener('click', () => showModal(elements.newPageModal));
    elements.exportPdfBtn.addEventListener('click', exportAsPdf);
    elements.exportMdBtn.addEventListener('click', exportAsMarkdown);
    elements.copyLinkBtn.addEventListener('click', copyPageLink);
    
    // Modal
    elements.createPageBtn.addEventListener('click', createNewPage);
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            closeModal(btn.closest('.modal'));
        });
    });
    
    // Overlay do menu mobile
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    overlay.addEventListener('click', toggleSidebar);
    document.body.appendChild(overlay);
    
    // Eventos de teclado
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'b': e.preventDefault(); execCommand('bold'); break;
                case 'i': e.preventDefault(); execCommand('italic'); break;
                case 's': e.preventDefault(); savePage(); break;
                case 'n': e.preventDefault(); showModal(elements.newPageModal); break;
            }
        }
    });
    
    // Atualizações do editor
    elements.editor.addEventListener('keyup', (e) => {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const pre = range.startContainer.parentElement.closest('pre');
        
        if (pre) {
            pre.classList.add('code-block');
            if (!pre.querySelector('code')) {
                const code = document.createElement('code');
                code.textContent = pre.textContent;
                pre.textContent = '';
                pre.appendChild(code);
            }
        }
    });
    
    // Configurações
    elements.autoSaveToggle.addEventListener('change', (e) => {
        state.autoSaveEnabled = e.target.checked;
        localStorage.setItem('autoSave', e.target.checked);
        showToast(`Auto-save ${e.target.checked ? 'enabled' : 'disabled'}`);
    });
    
    elements.editorTheme.addEventListener('change', (e) => {
        document.documentElement.setAttribute('data-theme', e.target.value);
        localStorage.setItem('editorTheme', e.target.value);
    });
}

// Service Worker
function setupServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('ServiceWorker registration successful');
                })
                .catch(err => {
                    console.log('ServiceWorker registration failed: ', err);
                });
        });
    }
}