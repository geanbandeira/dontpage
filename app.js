// DontPage - A Modern Alternative to Dontpad
document.addEventListener('DOMContentLoaded', function() {
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
    }
    
    function checkUrlForPageId() {
        const urlParams = new URLSearchParams(window.location.search);
        const pageId = urlParams.get('page');
        const password = urlParams.get('pwd');
        
        if (pageId) {
            // Check if page exists
            const page = pages.find(p => p.id === pageId);
            
            if (page) {
                // Check if password protected
                if (page.password) {
                    if (password && password === page.password) {
                        loadPage(pageId);
                    } else {
                        showPasswordPrompt(pageId);
                    }
                } else {
                    loadPage(pageId);
                }
            } else {
                // Create new page with this ID
                createPage(pageId);
            }
        } else {
            // Load default page
            loadPage(currentPageId);
        }
    }
    
    function showPasswordPrompt(pageId) {
        const password = prompt('This page is password protected. Please enter the password:');
        if (password) {
            const page = pages.find(p => p.id === pageId);
            if (page && page.password === password) {
                // Add password to URL
                const newUrl = new URL(window.location.href);
                newUrl.searchParams.set('pwd', password);
                window.history.pushState({}, '', newUrl);
                
                loadPage(pageId);
            } else {
                alert('Incorrect password');
                window.location.href = window.location.origin;
            }
        } else {
            window.location.href = window.location.origin;
        }
    }
    
    function generatePageId() {
        return Math.random().toString(36).substring(2, 10);
    }
    
    function loadPages() {
        const savedPages = localStorage.getItem('dontpage-pages');
        if (savedPages) {
            pages = JSON.parse(savedPages);
        } else {
            // Create default page
            pages = [{
                id: currentPageId,
                name: 'welcome',
                content: '# Welcome to DontPage\n\nStart typing here...\n\n- [ ] This is a todo item\n- [x] Completed item\n\n```javascript\nconsole.log("Hello World!");\n```',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                password: null,
                isPrivate: false,
                versions: []
            }];
            savePages();
        }
    }
    
    function savePages() {
        localStorage.setItem('dontpage-pages', JSON.stringify(pages));
    }
    
    function createPage(name = null, template = 'blank') {
        const pageId = name ? name.toLowerCase().replace(/[^a-z0-9-]/g, '-') : generatePageId();
        const now = new Date().toISOString();
        
        // Check if page already exists
        const existingPage = pages.find(p => p.id === pageId);
        if (existingPage) {
            showToast('Page already exists', 'error');
            return false;
        }
        
        // Get template content
        let content = '';
        switch (template) {
            case 'notes':
                content = '# Notes\n\n- \n- \n- ';
                break;
            case 'todo':
                content = '# To-Do List\n\n- [ ] Task 1\n- [ ] Task 2\n- [ ] Task 3';
                break;
            case 'meeting':
                content = '# Meeting Notes\n\n## Date: \n## Attendees: \n\n### Agenda\n1. \n2. \n3. \n\n### Action Items\n- [ ] \n- [ ] \n- [ ] ';
                break;
            case 'blog':
                content = '# Blog Post Title\n\n## Introduction\n\nStart writing your blog post here...\n\n## Main Content\n\nAdd your content here.\n\n## Conclusion\n\nWrap up your post.';
                break;
            case 'code':
                content = '```javascript\n// Write your code here\nfunction hello() {\n  console.log("Hello World!");\n}\n```';
                break;
            default:
                content = '';
        }
        
        const newPage = {
            id: pageId,
            name: name || pageId,
            content: content,
            createdAt: now,
            updatedAt: now,
            password: null,
            isPrivate: false,
            versions: []
        };
        
        pages.push(newPage);
        savePages();
        
        // Update URL
        updateUrl(pageId);
        
        // Load the new page
        loadPage(pageId);
        
        showToast('Page created successfully', 'success');
        return true;
    }
    
    function loadPage(pageId) {
        const page = pages.find(p => p.id === pageId);
        if (!page) return false;
        
        currentPageId = pageId;
        editor.innerHTML = page.content;
        pageName.value = page.name;
        pageDate.textContent = `Created: ${formatDate(page.createdAt)}`;
        
        // Update last saved time
        lastSavedTime = new Date(page.updatedAt);
        updateLastSaved();
        
        // Update word count and cursor position
        updateWordCount();
        updateCursorPosition();
        
        // Update line numbers
        updateLineNumbers();
        
        // Update UI
        updateUI();
        
        return true;
    }
    
    function savePage() {
        const pageIndex = pages.findIndex(p => p.id === currentPageId);
        if (pageIndex === -1) return false;
        
        // Create version history if content changed
        if (pages[pageIndex].content !== editor.innerHTML) {
            pages[pageIndex].versions.push({
                content: pages[pageIndex].content,
                savedAt: pages[pageIndex].updatedAt
            });
            
            // Keep only last 10 versions
            if (pages[pageIndex].versions.length > 10) {
                pages[pageIndex].versions.shift();
            }
        }
        
        // Update page
        pages[pageIndex].content = editor.innerHTML;
        pages[pageIndex].name = pageName.value;
        pages[pageIndex].updatedAt = new Date().toISOString();
        pages[pageIndex].password = isPasswordProtected ? pagePassword.value : null;
        
        savePages();
        lastSavedTime = new Date();
        updateLastSaved();
        
        showToast('Page saved successfully', 'success');
        return true;
    }
    
    function deletePage(pageId) {
        if (pageId === currentPageId) {
            showToast('Cannot delete current page', 'error');
            return false;
        }
        
        const pageIndex = pages.findIndex(p => p.id === pageId);
        if (pageIndex === -1) return false;
        
        pages.splice(pageIndex, 1);
        savePages();
        
        showToast('Page deleted successfully', 'success');
        return true;
    }
    
    function updateUrl(pageId) {
        const url = new URL(window.location.href);
        url.searchParams.set('page', pageId);
        window.history.pushState({ pageId }, '', url);
    }
    
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }
    
    function updateLastSaved() {
        if (!lastSavedTime) {
            lastSaved.textContent = 'Never saved';
            return;
        }
        
        const now = new Date();
        const diff = Math.floor((now - lastSavedTime) / 1000); // in seconds
        
        if (diff < 60) {
            lastSaved.textContent = 'Saved just now';
        } else if (diff < 3600) {
            const mins = Math.floor(diff / 60);
            lastSaved.textContent = `Saved ${mins} minute${mins === 1 ? '' : 's'} ago`;
        } else if (diff < 86400) {
            const hours = Math.floor(diff / 3600);
            lastSaved.textContent = `Saved ${hours} hour${hours === 1 ? '' : 's'} ago`;
        } else {
            const days = Math.floor(diff / 86400);
            lastSaved.textContent = `Saved ${days} day${days === 1 ? '' : 's'} ago`;
        }
    }
    
    function updateWordCount() {
        const text = editor.innerText || '';
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        wordCount.textContent = words;
        pageSize.textContent = `${text.length} chars`;
    }
    
    function updateCursorPosition() {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
        
        const range = selection.getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(editor);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        
        const text = preCaretRange.toString();
        const lines = text.split('\n');
        const line = lines.length;
        const col = lines[lines.length - 1].length + 1;
        
        cursorPos = { line, col };
        cursorPosition.textContent = `Ln ${line}, Col ${col}`;
    }
    
    function updateLineNumbers() {
        const text = editor.innerText || '';
        const lines = text.split('\n').length || 1;
        
        let numbers = '';
        for (let i = 1; i <= lines; i++) {
            numbers += `<div>${i}</div>`;
        }
        
        lineNumbers.innerHTML = numbers;
    }
    
    function setupAutoSave() {
        if (autoSaveInterval) {
            clearInterval(autoSaveInterval);
        }
        
        if (autoSaveToggle.checked) {
            autoSaveInterval = setInterval(() => {
                if (editor.innerHTML !== getCurrentPageContent()) {
                    savePage();
                }
            }, 30000); // 30 seconds
        }
    }
    
    function getCurrentPageContent() {
        const page = pages.find(p => p.id === currentPageId);
        return page ? page.content : '';
    }
    
    function initEditor() {
        // Set up editor event listeners
        editor.addEventListener('input', () => {
            updateWordCount();
            updateLineNumbers();
            
            // Debounce auto-save
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                if (autoSaveToggle.checked) {
                    savePage();
                }
            }, 2000);
        });
        
        editor.addEventListener('keydown', (e) => {
            // Tab key support
            if (e.key === 'Tab') {
                e.preventDefault();
                document.execCommand('insertText', false, '    '); // 4 spaces
            }
            
            // Save shortcut (Ctrl+S or Cmd+S)
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                savePage();
            }
            
            // Bold shortcut (Ctrl+B)
            if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
                e.preventDefault();
                document.execCommand('bold', false, null);
            }
            
            // Italic shortcut (Ctrl+I)
            if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
                e.preventDefault();
                document.execCommand('italic', false, null);
            }
            
            // Underline shortcut (Ctrl+U)
            if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
                e.preventDefault();
                document.execCommand('underline', false, null);
            }
        });
        
        editor.addEventListener('click', updateCursorPosition);
        editor.addEventListener('keyup', updateCursorPosition);
        
        // Set initial content
        const page = pages.find(p => p.id === currentPageId);
        if (page) {
            editor.innerHTML = page.content;
        }
    }
    
    function setupEventListeners() {
        // Theme toggle
        themeToggle.addEventListener('click', toggleTheme);
        
        // Fullscreen toggle
        fullscreenBtn.addEventListener('click', toggleFullscreen);
        
        // Sidebar toggle
        sidebarToggle.addEventListener('click', toggleSidebar);
        
        // Save button
        saveNowBtn.addEventListener('click', savePage);
        
        // New page button
        newPageBtn.addEventListener('click', () => {
            showModal(newPageModal);
        });
        
        // My pages button
        myPagesBtn.addEventListener('click', () => {
            showModal(myPagesModal);
            renderMyPages();
        });
        
        // Export buttons
        exportPdfBtn.addEventListener('click', exportToPdf);
        exportMdBtn.addEventListener('click', exportToMarkdown);
        exportTxtBtn.addEventListener('click', exportToText);
        exportHtmlBtn.addEventListener('click', exportToHtml);
        
        // Share buttons
        copyLinkBtn.addEventListener('click', copyPageLink);
        shareEmailBtn.addEventListener('click', shareViaEmail);
        shareSocialBtn.addEventListener('click', () => {
            showModal(shareModal);
            updateShareLink();
        });
        
        // Collaboration
        startCollabBtn.addEventListener('click', toggleCollaboration);
        
        // Read-only toggle
        readOnlyToggle.addEventListener('change', () => {
            isReadOnly = readOnlyToggle.checked;
            editor.contentEditable = !isReadOnly;
            showToast(isReadOnly ? 'Read-only mode enabled' : 'Read-only mode disabled', 'info');
        });
        
        // Password protection toggle
        passwordProtectToggle.addEventListener('change', () => {
            isPasswordProtected = passwordProtectToggle.checked;
            passwordInputContainer.classList.toggle('hidden', !isPasswordProtected);
            
            if (isPasswordProtected && !pagePassword.value) {
                showToast('Please set a password', 'warning');
            } else if (!isPasswordProtected) {
                pagePassword.value = '';
                showToast('Password protection disabled', 'info');
            }
        });
        
        // Set password button
        setPasswordBtn.addEventListener('click', () => {
            if (pagePassword.value.length < 4) {
                showToast('Password must be at least 4 characters', 'error');
                return;
            }
            
            isPasswordProtected = true;
            passwordProtectToggle.checked = true;
            showToast('Password set successfully', 'success');
        });
        
        // Editor settings
        editorTheme.addEventListener('change', updateEditorTheme);
        editorFont.addEventListener('change', updateEditorFont);
        fontSize.addEventListener('input', updateFontSize);
        lineNumbersToggle.addEventListener('change', () => {
            lineNumbers.classList.toggle('hidden', !lineNumbersToggle.checked);
        });
        autoSaveToggle.addEventListener('change', setupAutoSave);
        
        // Features
        versionHistoryBtn.addEventListener('click', () => {
            showModal(versionHistoryModal);
            renderVersionHistory();
        });
        
        analyzeTextBtn.addEventListener('click', analyzeText);
        aiAssistantBtn.addEventListener('click', () => {
            showModal(aiAssistantModal);
        });
        
