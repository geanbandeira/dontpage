// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC0AkBC5batGFJ_UvF5hxwswl0HsWd417s",
    authDomain: "dontpage-7fc6c.firebaseapp.com",
    projectId: "dontpage-7fc6c",
    storageBucket: "dontpage-7fc6c.appspot.com",
    messagingSenderId: "541814912651",
    appId: "1:541814912651:web:dfa3399a6a6aee25ed868e",
    databaseURL: "https://dontpage-7fc6c-default-rtdb.firebaseio.com"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Estado da aplicação
const state = {
    currentPageId: getPageIdFromUrl() || generatePageId(),
    pages: [],
    isCollaborating: false,
    isReadOnly: false,
    autoSaveEnabled: true,
    lastSavedTime: null,
    currentTheme: 'system',
    editorMode: 'edit',
    debounceTimer: null,
    connectionStatus: 'online',
    collaborators: {},
    userId: generateUserId(),
    syncScroll: true
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
    exportTxtBtn: document.getElementById('export-txt'),
    exportHtmlBtn: document.getElementById('export-html'),
    copyLinkBtn: document.getElementById('copy-link'),
    editorTheme: document.getElementById('editor-theme'),
    autoSaveToggle: document.getElementById('auto-save-toggle'),
    previewBtn: document.getElementById('preview-btn'),
    newPageModal: document.getElementById('new-page-modal'),
    createPageBtn: document.getElementById('create-page-btn'),
    newPageName: document.getElementById('new-page-name'),
    toastContainer: document.getElementById('toast-container'),
    connectionStatus: document.getElementById('connection-status'),
    collaboratorsList: document.getElementById('collaborators-list'),
    shareMode: document.getElementById('share-mode'),
    syncScrollToggle: document.getElementById('sync-scroll-toggle'),
    imageUploadModal: document.getElementById('image-upload-modal'),
    insertImageBtn: document.getElementById('insert-image-btn'),
    imageUrl: document.getElementById('image-url'),
    imageUpload: document.getElementById('image-upload'),
    newPageTemplate: document.getElementById('new-page-template'),
    fontSize: document.getElementById('font-size')
};

// Templates para novas páginas
const pageTemplates = {
    blank: '',
    markdown: `# Título da Página\n\nEscreva seu conteúdo em Markdown aqui...\n\n## Subtítulo\n\n- Item 1\n- Item 2\n- Item 3\n\n\`\`\`javascript\n// Código de exemplo\nfunction hello() {\n  console.log("Hello, world!");\n}\n\`\`\``,
    html: `<!DOCTYPE html>\n<html>\n<head>\n    <title>Minha Página</title>\n</head>\n<body>\n    <h1>Minha Página HTML</h1>\n    <p>Edite este conteúdo HTML...</p>\n</body>\n</html>`,
    todo: `# Lista de Tarefas\n\n- [ ] Tarefa 1\n- [ ] Tarefa 2\n- [ ] Tarefa 3\n\n## Concluídas\n\n- [x] Tarefa concluída`,
    notes: `# Reunião - ${new Date().toLocaleDateString()}\n\n## Participantes\n\n- Nome 1\n- Nome 2\n- Nome 3\n\n## Tópicos Discutidos\n\n1. Tópico 1\n2. Tópico 2\n3. Tópico 3\n\n## Ações\n\n- [ ] Ação 1 (Responsável: Nome)\n- [ ] Ação 2 (Responsável: Nome)`
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    initEditor();
    setupEventListeners();
    checkSystemTheme();
    loadPage(state.currentPageId);
    setupConnectionMonitoring();
    setupServiceWorker();
    setupCollaboration();
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
    
    elements.editor.addEventListener('scroll', () => {
        if (state.syncScroll) {
            syncScroll();
        }
    });
    
    elements.preview.addEventListener('scroll', () => {
        if (state.syncScroll) {
            syncScroll();
        }
    });
    
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
        case 'image':
            showModal(elements.imageUploadModal);
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
        const percentage = elements.editor.scrollTop / (elements.editor.scrollHeight - elements.editor.clientHeight);
        elements.preview.scrollTop = percentage * (elements.preview.scrollHeight - elements.preview.clientHeight);
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

function generateUserId() {
    return 'user-' + Math.random().toString(36).substring(2, 9);
}

function getPageIdFromUrl() {
    const path = window.location.pathname.substring(1);
    return path || null;
}

function loadPage(pageId) {
    state.currentPageId = pageId;
    const pageRef = database.ref(`pages/${pageId}`);
    
    // Atualiza a URL
    updateUrl(pageId);
    
    // Carrega os dados da página
    pageRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            // Verifica se o conteúdo mudou para evitar piscar na tela
            if (elements.editor.innerHTML !== data.content) {
                elements.editor.innerHTML = data.content || '';
            }
            
            if (elements.pageName && elements.pageName.value !== data.name) {
                elements.pageName.value = data.name || pageId;
            }
            
            if (elements.pageDate) {
                elements.pageDate.textContent = `Created: ${formatDate(data.createdAt || new Date().toISOString())}`;
            }
            
            updateWordCount();
            updateLineNumbers();
            updatePageSize();
            updateLastSaved(data.updatedAt);
            
            // Atualiza o modo de compartilhamento
            if (data.shareMode && elements.shareMode) {
                elements.shareMode.value = data.shareMode;
                state.isReadOnly = data.shareMode === 'read-only';
            }
        } else {
            // Página não existe, cria uma nova
            savePage();
        }
    });
    
    // Configura a colaboração
    setupCollaboration();
}

function savePage() {
    const content = elements.editor.innerHTML;
    const pageData = {
        content,
        name: elements.pageName.value || state.currentPageId,
        updatedAt: new Date().toISOString(),
        createdAt: state.lastSavedTime || new Date().toISOString(),
        shareMode: elements.shareMode ? elements.shareMode.value : 'read-write'
    };
    
    database.ref(`pages/${state.currentPageId}`).set(pageData)
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
    const template = elements.newPageTemplate.value;
    
    state.currentPageId = newPageId;
    elements.editor.innerHTML = pageTemplates[template] || '';
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
    const savedAutoSave = localStorage.getItem('autoSave');
    state.autoSaveEnabled = savedAutoSave !== null ? savedAutoSave === 'true' : true;
    elements.autoSaveToggle.checked = state.autoSaveEnabled;
    
    if (state.autoSaveEnabled) {
        showToast('Auto-save enabled', 'success');
    }
}

// Exportação de arquivos
async function exportAsPdf() {
    try {
        showToast('Generating PDF...', 'info');
        
        const { PDFDocument, rgb } = PDFLib;
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([595, 842]); // A4 size
        
        const content = elements.editor.innerText;
        const lines = content.split('\n');
        
        let y = 800;
        const fontSize = 12;
        
        lines.forEach(line => {
            if (y < 50) {
                page = pdfDoc.addPage([595, 842]);
                y = 800;
            }
            
            page.drawText(line, {
                x: 50,
                y: y,
                size: fontSize,
                color: rgb(0, 0, 0),
            });
            
            y -= (fontSize + 2);
        });
        
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        saveAs(blob, `${state.currentPageId}.pdf`);
        
        showToast('PDF exported successfully', 'success');
    } catch (error) {
        console.error('Error generating PDF:', error);
        showToast('Error generating PDF', 'error');
    }
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

function exportAsText() {
    const content = elements.editor.innerText;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.currentPageId}.txt`;
    a.click();
    
    URL.revokeObjectURL(url);
    showToast('Exported as Text', 'success');
}

function exportAsHtml() {
    const content = elements.editor.innerHTML;
    const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${elements.pageName.value || state.currentPageId}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
        pre { background: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; }
        code { font-family: monospace; }
        img { max-width: 100%; height: auto; }
    </style>
</head>
<body>
${content}
</body>
</html>`;
    
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.currentPageId}.html`;
    a.click();
    
    URL.revokeObjectURL(url);
    showToast('Exported as HTML', 'success');
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
    const themes = ['light', 'dark', 'solarized', 'monokai', 'system'];
    const currentIndex = themes.indexOf(state.currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    state.currentTheme = themes[nextIndex];
    
    if (state.currentTheme === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
        document.documentElement.setAttribute('data-theme', state.currentTheme);
    }
    
    // Atualiza o ícone do botão
    if (state.currentTheme === 'dark' || state.currentTheme === 'monokai') {
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
    if (state.currentTheme === 'dark' || state.currentTheme === 'monokai') {
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
        <i class="ph ph-${type === 'success' ? 'check-circle' : 
                         type === 'error' ? 'warning-circle' : 
                         type === 'warning' ? 'warning' : 'info'}"></i>
        <span>${message}</span>
    `;
    
    elements.toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 5000);
}

function copyPageLink() {
    const url = `${window.location.origin}/${state.currentPageId}`;
    navigator.clipboard.writeText(url)
        .then(() => showToast('Link copied to clipboard', 'success'))
        .catch(() => showToast('Failed to copy link', 'error'));
}

function updateUrl(pageId) {
    const url = new URL(window.location.origin);
    url.pathname = `/${pageId}`;
    window.history.pushState({ pageId }, '', url);
}

// Colaboração em tempo real
function setupCollaboration() {
    // Remove listeners antigos
    if (state.collaborationRef) {
        state.collaborationRef.off();
    }
    
    // Configura a referência para colaboração
    state.collaborationRef = database.ref(`collaborators/${state.currentPageId}`);
    
    // Adiciona o usuário atual como colaborador
    state.collaborationRef.child(state.userId).set({
        name: `User ${state.userId.substring(5, 9)}`,
        lastActive: firebase.database.ServerValue.TIMESTAMP
    });
    
    // Remove o usuário quando ele sair
    window.addEventListener('beforeunload', () => {
        state.collaborationRef.child(state.userId).remove();
    });
    
    // Monitora outros colaboradores
    state.collaborationRef.on('value', (snapshot) => {
        const collaborators = snapshot.val() || {};
        state.collaborators = collaborators;
        updateCollaboratorsList();
    });
}

function updateCollaboratorsList() {
    elements.collaboratorsList.innerHTML = '';
    
    Object.entries(state.collaborators).forEach(([userId, data]) => {
        if (userId !== state.userId) {
            const li = document.createElement('li');
            li.textContent = data.name || `User ${userId.substring(5, 9)}`;
            elements.collaboratorsList.appendChild(li);
        }
    });
}

// Monitoramento de conexão
function setupConnectionMonitoring() {
    const connectedRef = database.ref(".info/connected");
    
    connectedRef.on("value", (snap) => {
        if (snap.val() === true) {
            state.connectionStatus = 'online';
            elements.connectionStatus.innerHTML = '<i class="ph ph-plug-connected"></i> Connected';
            elements.connectionStatus.classList.remove('offline');
            showToast('Back online', 'success');
        } else {
            state.connectionStatus = 'offline';
            elements.connectionStatus.innerHTML = '<i class="ph ph-plug-disconnected"></i> Offline';
            elements.connectionStatus.classList.add('offline');
            showToast('Connection lost - working offline', 'warning');
        }
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
    elements.exportTxtBtn.addEventListener('click', exportAsText);
    elements.exportHtmlBtn.addEventListener('click', exportAsHtml);
    elements.copyLinkBtn.addEventListener('click', copyPageLink);
    
    // Modal
    elements.createPageBtn.addEventListener('click', createNewPage);
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            closeModal(btn.closest('.modal'));
        });
    });
    
    // Inserir imagem
    elements.insertImageBtn.addEventListener('click', () => {
        const url = elements.imageUrl.value.trim();
        if (url) {
            document.execCommand('insertImage', false, url);
            closeModal(elements.imageUploadModal);
            elements.imageUrl.value = '';
        } else if (elements.imageUpload.files[0]) {
            const file = elements.imageUpload.files[0];
            const reader = new FileReader();
            
            reader.onload = (e) => {
                document.execCommand('insertImage', false, e.target.result);
                closeModal(elements.imageUploadModal);
                elements.imageUpload.value = '';
            };
            
            reader.readAsDataURL(file);
        }
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
                case 'u': e.preventDefault(); execCommand('underline'); break;
                case 's': e.preventDefault(); savePage(); break;
                case 'n': e.preventDefault(); showModal(elements.newPageModal); break;
                case 'p': e.preventDefault(); togglePreview(); break;
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
    
    elements.fontSize.addEventListener('change', (e) => {
        elements.editor.style.fontSize = e.target.value;
        localStorage.setItem('fontSize', e.target.value);
    });
    
    elements.syncScrollToggle.addEventListener('change', (e) => {
        state.syncScroll = e.target.checked;
        localStorage.setItem('syncScroll', e.target.checked);
    });
    
    elements.shareMode.addEventListener('change', (e) => {
        savePage();
    });
    
    // Carrega configurações salvas
    const savedEditorTheme = localStorage.getItem('editorTheme');
    if (savedEditorTheme) {
        elements.editorTheme.value = savedEditorTheme;
        document.documentElement.setAttribute('data-theme', savedEditorTheme);
    }
    
    const savedFontSize = localStorage.getItem('fontSize') || '14px';
    elements.fontSize.value = savedFontSize;
    elements.editor.style.fontSize = savedFontSize;
    
    const savedSyncScroll = localStorage.getItem('syncScroll');
    if (savedSyncScroll !== null) {
        state.syncScroll = savedSyncScroll === 'true';
        elements.syncScrollToggle.checked = state.syncScroll;
    }
    
    // Atualiza a posição do cursor
    elements.editor.addEventListener('keyup', updateCursorPosition);
    elements.editor.addEventListener('click', updateCursorPosition);
}

function updateCursorPosition() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
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
    
    // Calcula linha e coluna
    const content = elements.editor.innerText.substring(0, range.startOffset);
    const lines = content.split('\n');
    const line = lines.length;
    const column = lines[lines.length - 1].length + 1;
    
    elements.cursorPosition.textContent = `Ln ${line}, Col ${column}`;
}