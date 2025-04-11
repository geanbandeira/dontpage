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
        customCssBtn.addEventListener('click', editCustomCss);
        findReplaceBtn.addEventListener('click', () => {
            showModal(findReplaceModal);
        });
        
        // Account
        accountBtn.addEventListener('click', () => {
            showModal(accountModal);
        });
        
        // Search
        searchBtn.addEventListener('click', searchPages);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchPages();
            }
        });
        
        // Toolbar buttons
        document.querySelectorAll('[data-command]').forEach(button => {
            button.addEventListener('click', () => {
                const command = button.getAttribute('data-command');
                execEditorCommand(command);
            });
        });
        
        // Preview toggle
        document.querySelector('[data-command="preview"]').addEventListener('click', togglePreview);
        
        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(button => {
            button.addEventListener('click', () => {
                hideModal(button.closest('.modal'));
            });
        });
        
        // Create page modal
        document.getElementById('create-page-btn').addEventListener('click', () => {
            const name = document.getElementById('new-page-name').value.trim();
            const template = document.getElementById('new-page-template').value;
            const isPrivate = document.getElementById('new-page-private').checked;
            
            if (!name) {
                showToast('Please enter a page name', 'error');
                return;
            }
            
            if (createPage(name, template)) {
                hideModal(newPageModal);
            }
        });
        
        // Share modal tabs
        document.querySelectorAll('.share-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.share-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.share-method').forEach(m => m.classList.remove('active'));
                
                tab.classList.add('active');
                const target = tab.getAttribute('data-target');
                document.getElementById(target).classList.add('active');
            });
        });
        
        // Copy link button in share modal
        document.getElementById('copy-link-btn').addEventListener('click', () => {
            copyPageLink();
            hideModal(shareModal);
        });
        
        // Social share buttons
        document.getElementById('share-twitter').addEventListener('click', shareToTwitter);
        document.getElementById('share-facebook').addEventListener('click', shareToFacebook);
        document.getElementById('share-linkedin').addEventListener('click', shareToLinkedIn);
        document.getElementById('share-reddit').addEventListener('click', shareToReddit);
        document.getElementById('share-whatsapp').addEventListener('click', shareToWhatsApp);
        
        // Account modal tabs
        document.querySelectorAll('.account-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.account-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.account-content').forEach(c => c.classList.remove('active'));
                
                tab.classList.add('active');
                const target = tab.getAttribute('data-target');
                document.getElementById(target).classList.add('active');
            });
        });
        
        // AI Assistant tabs
        document.querySelectorAll('.ai-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.ai-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.ai-content').forEach(c => c.classList.remove('active'));
                
                tab.classList.add('active');
                const target = tab.getAttribute('data-target');
                document.getElementById(target).classList.add('active');
            });
        });
        
        // AI Assistant buttons
        document.getElementById('ai-improve-btn').addEventListener('click', improveText);
        document.getElementById('ai-summarize-btn').addEventListener('click', summarizeText);
        document.getElementById('ai-expand-btn').addEventListener('click', expandText);
        document.getElementById('ai-translate-btn').addEventListener('click', translateText);
        document.getElementById('ai-code-btn').addEventListener('click', processCode);
        document.getElementById('ai-apply-btn').addEventListener('click', applyAiResult);
        
        // Find & Replace
        document.getElementById('find-next').addEventListener('click', findNext);
        document.getElementById('find-prev').addEventListener('click', findPrev);
        document.getElementById('replace-btn').addEventListener('click', replaceText);
        document.getElementById('replace-all-btn').addEventListener('click', replaceAllText);
        
        // Window events
        window.addEventListener('resize', updateLineNumbers);
        window.addEventListener('beforeunload', (e) => {
            if (editor.innerHTML !== getCurrentPageContent()) {
                e.preventDefault();
                e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
                return e.returnValue;
            }
        });
    }
    
    function updateUI() {
        // Update page info
        const page = pages.find(p => p.id === currentPageId);
        if (page) {
            pageName.value = page.name;
            pageDate.textContent = `Created: ${formatDate(page.createdAt)}`;
            updateWordCount();
            
            // Update password protection UI
            isPasswordProtected = !!page.password;
            passwordProtectToggle.checked = isPasswordProtected;
            passwordInputContainer.classList.toggle('hidden', !isPasswordProtected);
            if (page.password) {
                pagePassword.value = page.password;
            }
        }
        
        // Update collaboration status
        collabStatus.className = isCollaborating ? 'collab-online' : 'collab-offline';
        collabStatus.innerHTML = `<i class="fas fa-circle"></i> ${isCollaborating ? 'Online' : 'Offline'}`;
        collabUsers.classList.toggle('hidden', !isCollaborating);
        
        // Update editor state
        editor.contentEditable = !isReadOnly;
    }
    
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        themeToggle.innerHTML = `<i class="fas fa-${newTheme === 'dark' ? 'sun' : 'moon'}"></i>`;
        localStorage.setItem('dontpage-theme', newTheme);
    }
    
    function checkSystemTheme() {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('dontpage-theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            themeToggle.innerHTML = `<i class="fas fa-${savedTheme === 'dark' ? 'sun' : 'moon'}"></i>`;
            return;
        }
        
        // Check for system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }
    
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
            document.body.classList.add('fullscreen');
        } else {
            document.exitFullscreen();
            fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
            document.body.classList.remove('fullscreen');
        }
    }
    
    function toggleSidebar() {
        sidebar.classList.toggle('collapsed');
        const isCollapsed = sidebar.classList.contains('collapsed');
        sidebarToggle.innerHTML = `<i class="fas fa-chevron-${isCollapsed ? 'right' : 'left'}"></i>`;
    }
    
    function showModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function hideModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 
                                   type === 'error' ? 'times-circle' : 
                                   type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            </div>
            <div class="toast-message">${message}</div>
            <button class="toast-close">&times;</button>
        `;
        
        const container = document.getElementById('toast-container');
        container.appendChild(toast);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 5000);
        
        // Close button
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        });
    }
    
    function execEditorCommand(command) {
        switch (command) {
            case 'bold':
            case 'italic':
            case 'underline':
            case 'strikethrough':
                document.execCommand(command, false, null);
                break;
            case 'heading1':
                document.execCommand('formatBlock', false, '<h1>');
                break;
            case 'heading2':
                document.execCommand('formatBlock', false, '<h2>');
                break;
            case 'heading3':
                document.execCommand('formatBlock', false, '<h3>');
                break;
            case 'ul':
                document.execCommand('insertUnorderedList', false, null);
                break;
            case 'ol':
                document.execCommand('insertOrderedList', false, null);
                break;
            case 'tasklist':
                insertTaskListItem();
                break;
            case 'quote':
                document.execCommand('formatBlock', false, '<blockquote>');
                break;
            case 'code':
                insertCodeBlock();
                break;
            case 'table':
                insertTable();
                break;
            case 'link':
                insertLink();
                break;
            case 'image':
                insertImage();
                break;
            case 'horizontalRule':
                document.execCommand('insertHorizontalRule', false, null);
                break;
            case 'undo':
                document.execCommand('undo', false, null);
                break;
            case 'redo':
                document.execCommand('redo', false, null);
                break;
            case 'clearFormat':
                document.execCommand('removeFormat', false, null);
                break;
        }
    }
    
    function insertTaskListItem() {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
        
        const range = selection.getRangeAt(0);
        const li = document.createElement('li');
        li.innerHTML = '<input type="checkbox" class="task-list-item"> ';
        
        range.deleteContents();
        range.insertNode(li);
        
        // Move cursor after the checkbox
        const newRange = document.createRange();
        newRange.setStartAfter(li.firstChild);
        newRange.collapse(true);
        
        selection.removeAllRanges();
        selection.addRange(newRange);
    }
    
    function insertCodeBlock() {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
        
        const range = selection.getRangeAt(0);
        const pre = document.createElement('pre');
        const code = document.createElement('code');
        
        // Get selected text or use empty line
        const selectedText = range.toString();
        code.textContent = selectedText || '// Enter your code here';
        
        pre.appendChild(code);
        range.deleteContents();
        range.insertNode(pre);
        
        // Highlight the code
        hljs.highlightElement(code);
        
        // Move cursor inside the code block
        const newRange = document.createRange();
        newRange.setStart(code, 0);
        newRange.collapse(true);
        
        selection.removeAllRanges();
        selection.addRange(newRange);
    }
    
    function insertTable() {
        const rows = prompt('Enter number of rows:', '3');
        const cols = prompt('Enter number of columns:', '3');
        
        if (!rows || !cols || isNaN(rows) || isNaN(cols)) return;
        
        const table = document.createElement('table');
        let tableHtml = '';
        
        for (let i = 0; i < parseInt(rows); i++) {
            tableHtml += '<tr>';
            for (let j = 0; j < parseInt(cols); j++) {
                tableHtml += `<td>${i === 0 ? '<strong>Header</strong>' : 'Content'}</td>`;
            }
            tableHtml += '</tr>';
        }
        
        table.innerHTML = tableHtml;
        
        const selection = window.getSelection();
        if (selection.rangeCount) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(table);
        } else {
            editor.appendChild(table);
        }
    }
    
    function insertLink() {
        const url = prompt('Enter the URL:', 'https://');
        if (!url) return;
        
        const text = prompt('Enter the link text:', url);
        document.execCommand('createLink', false, url);
        
        // If text was provided, replace the selected text
        if (text && text !== url) {
            const selection = window.getSelection();
            if (selection.rangeCount) {
                const range = selection.getRangeAt(0);
                range.deleteContents();
                range.insertNode(document.createTextNode(text));
            }
        }
    }
    
    function insertImage() {
        const url = prompt('Enter the image URL:', 'https://');
        if (!url) return;
        
        const alt = prompt('Enter alternative text:', '');
        const img = document.createElement('img');
        img.src = url;
        img.alt = alt || '';
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        
        const selection = window.getSelection();
        if (selection.rangeCount) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(img);
        } else {
            editor.appendChild(img);
        }
    }
    
    function togglePreview() {
        preview.classList.toggle('hidden');
        editor.classList.toggle('hidden');
        
        if (!preview.classList.contains('hidden')) {
            // Convert markdown to HTML
            const markdown = editor.innerText;
            preview.innerHTML = DOMPurify.sanitize(marked.parse(markdown));
            
            // Highlight code blocks
            document.querySelectorAll('pre code').forEach(block => {
                hljs.highlightElement(block);
            });
        }
    }
    
    function updateEditorTheme() {
        const theme = editorTheme.value;
        editor.className = `editor-textarea theme-${theme}`;
    }
    
    function updateEditorFont() {
        const font = editorFont.value;
        let fontFamily = '';
        
        switch (font) {
            case 'roboto':
                fontFamily = '"Roboto", sans-serif';
                break;
            case 'fira':
                fontFamily = '"Fira Code", monospace';
                break;
            case 'courier':
                fontFamily = '"Courier New", monospace';
                break;
            case 'arial':
                fontFamily = 'Arial, sans-serif';
                break;
            case 'times':
                fontFamily = '"Times New Roman", serif';
                break;
            default:
                fontFamily = 'system-ui, -apple-system, sans-serif';
        }
        
        editor.style.fontFamily = fontFamily;
        lineNumbers.style.fontFamily = fontFamily;
    }
    
    function updateFontSize() {
        const size = fontSize.value;
        editor.style.fontSize = `${size}px`;
        lineNumbers.style.fontSize = `${size}px`;
    }
    
    function renderMyPages() {
        const grid = document.getElementById('pages-grid');
        grid.innerHTML = '';
        
        if (pages.length === 0) {
            grid.innerHTML = `
                <div class="pages-empty">
                    <i class="fas fa-folder-open"></i>
                    <p>You don't have any pages yet</p>
                    <button class="btn-primary" id="create-first-page">Create your first page</button>
                </div>
            `;
            
            document.getElementById('create-first-page').addEventListener('click', () => {
                hideModal(myPagesModal);
                showModal(newPageModal);
            });
            return;
        }
        
        // Sort pages
        const sortBy = document.getElementById('pages-sort').value;
        let sortedPages = [...pages];
        
        switch (sortBy) {
            case 'date-asc':
                sortedPages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case 'date-desc':
                sortedPages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'name-asc':
                sortedPages.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                sortedPages.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'size-asc':
                sortedPages.sort((a, b) => (a.content || '').length - (b.content || '').length);
                break;
            case 'size-desc':
                sortedPages.sort((a, b) => (b.content || '').length - (a.content || '').length);
                break;
        }
        
        // Filter pages
        const searchTerm = document.getElementById('pages-search').value.toLowerCase();
        if (searchTerm) {
            sortedPages = sortedPages.filter(page => 
                page.name.toLowerCase().includes(searchTerm) || 
                page.content.toLowerCase().includes(searchTerm)
            );
        }
        
        // Render pages
        sortedPages.forEach(page => {
            const pageCard = document.createElement('div');
            pageCard.className = 'page-card';
            pageCard.innerHTML = `
                <h4>${page.name}</h4>
                <div class="page-card-meta">
                    <span>${formatDate(page.updatedAt)}</span>
                    <span>${page.content.length} chars</span>
                </div>
                <div class="page-card-actions">
                    <button class="btn-small open-page" data-id="${page.id}">Open</button>
                    ${page.id !== currentPageId ? `<button class="btn-small delete-page" data-id="${page.id}">Delete</button>` : ''}
                </div>
            `;
            
            grid.appendChild(pageCard);
        });
        
        // Add event listeners
        document.querySelectorAll('.open-page').forEach(button => {
            button.addEventListener('click', () => {
                const pageId = button.getAttribute('data-id');
                loadPage(pageId);
                hideModal(myPagesModal);
            });
        });
        
        document.querySelectorAll('.delete-page').forEach(button => {
            button.addEventListener('click', () => {
                const pageId = button.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this page?')) {
                    deletePage(pageId);
                    renderMyPages();
                }
            });
        });
    }
    
    function renderVersionHistory() {
        const page = pages.find(p => p.id === currentPageId);
        if (!page) return;
        
        const versionList = document.getElementById('version-list');
        versionList.innerHTML = '';
        
        if (page.versions.length === 0) {
            versionList.innerHTML = `
                <div class="version-empty">
                    <i class="fas fa-history"></i>
                    <p>No version history available</p>
                </div>
            `;
            return;
        }
        
        // Add current version
        const currentVersion = document.createElement('div');
        currentVersion.className = 'version-item active';
        currentVersion.innerHTML = `
            <div class="version-title">Current Version</div>
            <div class="version-date">${formatDate(page.updatedAt)}</div>
        `;
        versionList.appendChild(currentVersion);
        
        currentVersion.addEventListener('click', () => {
            document.querySelectorAll('.version-item').forEach(item => item.classList.remove('active'));
            currentVersion.classList.add('active');
            
            document.getElementById('version-preview-title').textContent = 'Current Version';
            document.getElementById('version-preview-content').innerHTML = DOMPurify.sanitize(marked.parse(page.content || ''));
            document.getElementById('version-actions').classList.add('hidden');
        });
        
        // Add previous versions
        page.versions.forEach((version, index) => {
            const versionItem = document.createElement('div');
            versionItem.className = 'version-item';
            versionItem.innerHTML = `
                <div class="version-title">Version ${page.versions.length - index}</div>
                <div class="version-date">${formatDate(version.savedAt)}</div>
            `;
            versionList.appendChild(versionItem);
            
            versionItem.addEventListener('click', () => {
                document.querySelectorAll('.version-item').forEach(item => item.classList.remove('active'));
                versionItem.classList.add('active');
                
                document.getElementById('version-preview-title').textContent = `Version ${page.versions.length - index}`;
                document.getElementById('version-preview-content').innerHTML = DOMPurify.sanitize(marked.parse(version.content || ''));
                document.getElementById('version-actions').classList.remove('hidden');
                
                // Set up restore button
                document.getElementById('restore-version-btn').onclick = () => {
                    if (confirm('Are you sure you want to restore this version? Current changes will be lost.')) {
                        editor.innerHTML = version.content;
                        savePage();
                        hideModal(versionHistoryModal);
                    }
                };
                
                // Set up compare button
                document.getElementById('compare-version-btn').onclick = () => {
                    compareVersions(page.content, version.content);
                };
            });
        });
        
        // Set initial preview to current version
        document.getElementById('version-preview-content').innerHTML = DOMPurify.sanitize(marked.parse(page.content || ''));
    }
    
    function compareVersions(currentContent, oldContent) {
        // This is a simplified diff implementation
        // In a real app, you'd want to use a proper diffing library
        const currentLines = currentContent.split('\n');
        const oldLines = oldContent.split('\n');
        
        let diffHtml = '<div class="version-diff">';
        diffHtml += '<h5>Current Version (left) vs. Selected Version (right)</h5>';
        diffHtml += '<table class="diff-table">';
        diffHtml += '<tr><th>Line</th><th>Current</th><th>Previous</th></tr>';
        
        const maxLines = Math.max(currentLines.length, oldLines.length);
        
        for (let i = 0; i < maxLines; i++) {
            const currentLine = currentLines[i] || '';
            const oldLine = oldLines[i] || '';
            
            if (currentLine !== oldLine) {
                diffHtml += `<tr class="diff-changed">
                    <td>${i + 1}</td>
                    <td>${currentLine}</td>
                    <td>${oldLine}</td>
                </tr>`;
            } else {
                diffHtml += `<tr>
                    <td>${i + 1}</td>
                    <td>${currentLine}</td>
                    <td>${oldLine}</td>
                </tr>`;
            }
        }
        
        diffHtml += '</table></div>';
        
        document.getElementById('version-preview-content').innerHTML = diffHtml;
    }
    
    function exportToPdf() {
        showToast('Exporting to PDF...', 'info');
        
        // In a real implementation, you would use a library like pdf-lib or jsPDF
        // This is a simplified example
        const content = editor.innerText;
        const page = pages.find(p => p.id === currentPageId);
        const title = page ? page.name : 'untitled';
        
        // Create a PDF (simulated)
        setTimeout(() => {
            showToast('PDF exported successfully', 'success');
            
            // In a real app, you would generate and download the PDF
            const link = document.createElement('a');
            link.href = `data:text/plain;charset=utf-8,${encodeURIComponent('PDF export would contain:\n\n' + content)}`;
            link.download = `${title}.pdf`;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }, 1000);
    }
    
    function exportToMarkdown() {
        const content = editor.innerText;
        const page = pages.find(p => p.id === currentPageId);
        const title = page ? page.name : 'untitled';
        
        const link = document.createElement('a');
        link.href = `data:text/markdown;charset=utf-8,${encodeURIComponent(content)}`;
        link.download = `${title}.md`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showToast('Markdown exported successfully', 'success');
    }
    
    function exportToText() {
        const content = editor.innerText;
        const page = pages.find(p => p.id === currentPageId);
        const title = page ? page.name : 'untitled';
        
        const link = document.createElement('a');
        link.href = `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`;
        link.download = `${title}.txt`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showToast('Text exported successfully', 'success');
    }
    
    function exportToHtml() {
        const content = editor.innerHTML;
        const page = pages.find(p => p.id === currentPageId);
        const title = page ? page.name : 'untitled';
        
        const html = `<!DOCTYPE html>
<html>
<head>
    <title>${title}</title>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
        pre { background: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto; }
        code { font-family: monospace; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
${content}
</body>
</html>`;
        
        const link = document.createElement('a');
        link.href = `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;
        link.download = `${title}.html`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showToast('HTML exported successfully', 'success');
    }
    
    function copyPageLink() {
        const page = pages.find(p => p.id === currentPageId);
        if (!page) return;
        
        const url = new URL(window.location.href);
        url.searchParams.set('page', currentPageId);
        
        if (page.password) {
            url.searchParams.set('pwd', page.password);
        }
        
        if (readOnlyToggle.checked) {
            url.searchParams.set('ro', '1');
        }
        
        navigator.clipboard.writeText(url.toString()).then(() => {
            showToast('Page link copied to clipboard', 'success');
        }).catch(() => {
            // Fallback for browsers that don't support clipboard API
            const textarea = document.createElement('textarea');
            textarea.value = url.toString();
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showToast('Page link copied to clipboard', 'success');
        });
    }
    
    function updateShareLink() {
        const page = pages.find(p => p.id === currentPageId);
        if (!page) return;
        
        const url = new URL(window.location.href);
        url.searchParams.set('page', currentPageId);
        
        if (document.getElementById('share-readonly').checked) {
            url.searchParams.set('ro', '1');
        }
        
        if (document.getElementById('share-expiry').checked) {
            const expiryDate = document.getElementById('expiry-date').value;
            if (expiryDate) {
                url.searchParams.set('exp', expiryDate);
            }
        }
        
        document.getElementById('share-link').value = url.toString();
        
        // Update embed code
        const embedOptions = document.getElementById('embed-options').value;
        let embedCode = `<iframe src="${url.toString()}&embed=${embedOptions}" width="100%" height="500px" frameborder="0"></iframe>`;
        document.getElementById('embed-code').value = embedCode;
    }
    
    function shareViaEmail() {
        const page = pages.find(p => p.id === currentPageId);
        if (!page) return;
        
        const url = new URL(window.location.href);
        url.searchParams.set('page', currentPageId);
        
        if (readOnlyToggle.checked) {
            url.searchParams.set('ro', '1');
        }
        
        const subject = `Check out my DontPage: ${page.name}`;
        const body = `I've shared a page with you on DontPage:\n\n${url.toString()}\n\n`;
        
        window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
    }
    
    function shareToTwitter() {
        const page = pages.find(p => p.id === currentPageId);
        if (!page) return;
        
        const url = new URL(window.location.href);
        url.searchParams.set('page', currentPageId);
        
        if (readOnlyToggle.checked) {
            url.searchParams.set('ro', '1');
        }
        
        const text = `Check out my DontPage: ${page.name}`;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url.toString())}`, '_blank');
    }
    
    function shareToFacebook() {
        const url = new URL(window.location.href);
        url.searchParams.set('page', currentPageId);
        
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url.toString())}`, '_blank');
    }
    
    function shareToLinkedIn() {
        const url = new URL(window.location.href);
        url.searchParams.set('page', currentPageId);
        
        window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url.toString())}`, '_blank');
    }
    
    function shareToReddit() {
        const page = pages.find(p => p.id === currentPageId);
        if (!page) return;
        
        const url = new URL(window.location.href);
        url.searchParams.set('page', currentPageId);
        
        const title = `DontPage: ${page.name}`;
        window.open(`https://www.reddit.com/submit?title=${encodeURIComponent(title)}&url=${encodeURIComponent(url.toString())}`, '_blank');
    }
    
    function shareToWhatsApp() {
        const page = pages.find(p => p.id === currentPageId);
        if (!page) return;
        
        const url = new URL(window.location.href);
        url.searchParams.set('page', currentPageId);
        
        const text = `Check out my DontPage: ${page.name} - ${url.toString()}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
    
    function toggleCollaboration() {
        if (isCollaborating) {
            // Stop collaboration
            if (collaborationChannel) {
                collaborationChannel.unsubscribe();
                collaborationChannel = null;
            }
            
            isCollaborating = false;
            showToast('Collaboration stopped', 'info');
        } else {
            // Start collaboration
            const page = pages.find(p => p.id === currentPageId);
            if (!page) return;
            
            // In a real app, you would connect to a WebSocket or similar real-time service
            // This is a simplified simulation
            collaborationChannel = {
                subscribe: () => {},
                unsubscribe: () => {},
                broadcast: (data) => {
                    // Simulate other users
                    setTimeout(() => {
                        if (Math.random() > 0.7) {
                            const fakeUsers = ['Alice', 'Bob', 'Charlie'];
                            const randomUser = fakeUsers[Math.floor(Math.random() * fakeUsers.length)];
                            
                            const userList = document.createElement('li');
                            userList.textContent = randomUser;
                            document.querySelector('#collab-users ul').appendChild(userList);
                            
                            showToast(`${randomUser} joined the collaboration`, 'info');
                        }
                    }, 2000);
                }
            };
            
            isCollaborating = true;
            showToast('Collaboration started. Share the link with others to collaborate in real-time.', 'success');
            
            // Simulate other users joining
            document.querySelector('#collab-users ul').innerHTML = '<li>You</li>';
            collaborationChannel.broadcast({ type: 'join' });
        }
        
        updateUI();
    }
    
    function analyzeText() {
        const text = editor.innerText;
        if (!text.trim()) {
            showToast('No text to analyze', 'warning');
            return;
        }
        
        // In a real app, you would use more sophisticated analysis
        const words = text.trim().split(/\s+/).length;
        const chars = text.length;
        const lines = text.split('\n').length;
        const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
        const paragraphs = text.split('\n\n').filter(p => p.trim()).length;
        
        // Calculate reading time (average 200 words per minute)
        const readingTime = Math.ceil(words / 200);
        
        // Calculate word frequency
        const wordFreq = {};
        text.toLowerCase().match(/\b\w+\b/g)?.forEach(word => {
            wordFreq[word] = (wordFreq[word] || 0) + 1;
        });
        
        // Get top 5 words
        const topWords = Object.entries(wordFreq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([word, count]) => `${word} (${count})`)
            .join(', ');
        
        const analysis = `
            <h4>Text Analysis</h4>
            <div class="analysis-stats">
                <div class="stat">
                    <span class="stat-number">${words}</span>
                    <span class="stat-label">Words</span>
                </div>
                <div class="stat">
                    <span class="stat-number">${chars}</span>
                    <span class="stat-label">Characters</span>
                </div>
                <div class="stat">
                    <span class="stat-number">${lines}</span>
                    <span class="stat-label">Lines</span>
                </div>
                <div class="stat">
                    <span class="stat-number">${sentences}</span>
                    <span class="stat-label">Sentences</span>
                </div>
                <div class="stat">
                    <span class="stat-number">${paragraphs}</span>
                    <span class="stat-label">Paragraphs</span>
                </div>
                <div class="stat">
                    <span class="stat-number">${readingTime}</span>
                    <span class="stat-label">Min read</span>
                </div>
            </div>
            <div class="analysis-details">
                <h5>Top Words</h5>
                <p>${topWords || 'N/A'}</p>
                
                <h5>Readability</h5>
                <p>${calculateReadability(text)}</p>
            </div>
        `;
        
        // Show in a modal or toast
        showToast('Text analysis complete', 'success');
        
        // In a real app, you might show this in a modal
        const analysisModal = document.createElement('div');
        analysisModal.className = 'modal active';
        analysisModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Text Analysis</h3>
                    <button class="btn-icon modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    ${analysis}
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary modal-close">Close</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(analysisModal);
        
        analysisModal.querySelector('.modal-close').addEventListener('click', () => {
            analysisModal.remove();
        });
    }
    
    function calculateReadability(text) {
        // Simplified Flesch-Kincaid readability score
        const words = text.trim().split(/\s+/);
        const sentences = text.split(/[.!?]+/).filter(s => s.trim());
        const syllables = words.reduce((count, word) => count + countSyllables(word), 0);
        
        if (words.length === 0 || sentences.length === 0) return 'N/A';
        
        const score = 206.835 - (1.015 * (words.length / sentences.length)) - (84.6 * (syllables / words.length));
        
        if (score >= 90) return 'Very Easy (5th grade)';
        if (score >= 80) return 'Easy (6th grade)';
        if (score >= 70) return 'Fairly Easy (7th grade)';
        if (score >= 60) return 'Standard (8th-9th grade)';
        if (score >= 50) return 'Fairly Difficult (10th-12th grade)';
        if (score >= 30) return 'Difficult (College)';
        return 'Very Difficult (Post-graduate)';
    }
    
    function countSyllables(word) {
        // Simplified syllable counting
        word = word.toLowerCase();
        if (word.length <= 3) return 1;
        
        word = word.replace(/(?:[^laeiouy]|ed|[^laeiouy]e)$/, '');
        word = word.replace(/^y/, '');
        
        const syllables = word.match(/[aeiouy]{1,2}/g);
        return syllables ? syllables.length : 1;
    }
    
    function improveText() {
        const text = document.getElementById('ai-improve-text').value;
        const style = document.getElementById('ai-improve-style').value;
        
        if (!text.trim()) {
            showToast('Please enter text to improve', 'error');
            return;
        }
        
        // Simulate AI processing
        showToast('AI is improving your text...', 'info');
        
        setTimeout(() => {
            // In a real app, you would call an AI API
            const improvedText = simulateAIImprovement(text, style);
            
            const result = document.getElementById('ai-improve-result');
            result.innerHTML = DOMPurify.sanitize(marked.parse(improvedText));
            result.classList.remove('hidden');
            
            document.getElementById('ai-apply-btn').disabled = false;
            document.getElementById('ai-apply-btn').onclick = () => {
                editor.innerHTML = improvedText;
                hideModal(aiAssistantModal);
            };
            
            showToast('Text improved successfully', 'success');
        }, 1500);
    }
    
    function summarizeText() {
        const text = document.getElementById('ai-summarize-text').value;
        const length = document.getElementById('ai-summarize-length').value;
        
        if (!text.trim()) {
            showToast('Please enter text to summarize', 'error');
            return;
        }
        
        // Simulate AI processing
        showToast('AI is summarizing your text...', 'info');
        
        setTimeout(() => {
            // In a real app, you would call an AI API
            const summary = simulateAISummary(text, length);
            
            const result = document.getElementById('ai-summarize-result');
            result.innerHTML = DOMPurify.sanitize(marked.parse(summary));
            result.classList.remove('hidden');
            
            document.getElementById('ai-apply-btn').disabled = false;
            document.getElementById('ai-apply-btn').onclick = () => {
                editor.innerHTML = summary;
                hideModal(aiAssistantModal);
            };
            
            showToast('Text summarized successfully', 'success');
        }, 1500);
    }
    
    function expandText() {
        const text = document.getElementById('ai-expand-text').value;
        const detail = document.getElementById('ai-expand-detail').value;
        
        if (!text.trim()) {
            showToast('Please enter text to expand', 'error');
            return;
        }
        
        // Simulate AI processing
        showToast('AI is expanding your text...', 'info');
        
        setTimeout(() => {
            // In a real app, you would call an AI API
            const expandedText = simulateAIExpansion(text, detail);
            
            const result = document.getElementById('ai-expand-result');
            result.innerHTML = DOMPurify.sanitize(marked.parse(expandedText));
            result.classList.remove('hidden');
            
            document.getElementById('ai-apply-btn').disabled = false;
            document.getElementById('ai-apply-btn').onclick = () => {
                editor.innerHTML = expandedText;
                hideModal(aiAssistantModal);
            };
            
            showToast('Text expanded successfully', 'success');
        }, 1500);
    }
    
    function translateText() {
        const text = document.getElementById('ai-translate-text').value;
        const from = document.getElementById('ai-translate-from').value;
        const to = document.getElementById('ai-translate-to').value;
        
        if (!text.trim()) {
            showToast('Please enter text to translate', 'error');
            return;
        }
        
        if (from === to) {
            showToast('Source and target languages are the same', 'error');
            return;
        }
        
        // Simulate AI processing
        showToast('AI is translating your text...', 'info');
        
        setTimeout(() => {
            // In a real app, you would call an AI API
            const translatedText = simulateAITranslation(text, from, to);
            
            const result = document.getElementById('ai-translate-result');
            result.innerHTML = DOMPurify.sanitize(marked.parse(translatedText));
            result.classList.remove('hidden');
            
            document.getElementById('ai-apply-btn').disabled = false;
            document.getElementById('ai-apply-btn').onclick = () => {
                editor.innerHTML = translatedText;
                hideModal(aiAssistantModal);
            };
            
            showToast('Text translated successfully', 'success');
        }, 1500);
    }
    
    function processCode() {
        const code = document.getElementById('ai-code-text').value;
        const action = document.getElementById('ai-code-action').value;
        const language = document.getElementById('ai-code-language').value;
        
        if (!code.trim()) {
            showToast('Please enter code or description', 'error');
            return;
        }
        
        // Simulate AI processing
        showToast('AI is processing your code...', 'info');
        
        setTimeout(() => {
            // In a real app, you would call an AI API
            const processedCode = simulateAIProcessCode(code, action, language);
            
            const result = document.getElementById('ai-code-result');
            result.innerHTML = `<pre><code class="language-${language}">${processedCode}</code></pre>`;
            hljs.highlightElement(result.querySelector('code'));
            result.classList.remove('hidden');
            
            document.getElementById('ai-apply-btn').disabled = false;
            document.getElementById('ai-apply-btn').onclick = () => {
                editor.innerHTML = `<pre><code class="language-${language}">${processedCode}</code></pre>`;
                hideModal(aiAssistantModal);
            };
            
            showToast('Code processed successfully', 'success');
        }, 1500);
    }
    
    function applyAiResult() {
        // This is handled in each individual AI function
    }
    
    function simulateAIImprovement(text, style) {
        // Simulate different improvement styles
        switch (style) {
            case 'formal':
                return `After careful consideration, I have revised the text to enhance its formal tone:\n\n"${text}" has been transformed into a more professional version that maintains the original meaning while adhering to formal writing standards.`;
            case 'casual':
                return `Here's a more casual version of your text:\n\n"${text}"\n\nI've made it sound more relaxed and conversational while keeping the main points.`;
            case 'academic':
                return `Academic revision:\n\nBased on scholarly writing conventions, the text "${text}" has been refined to meet academic standards, with appropriate terminology and structure.`;
            case 'creative':
                return `Creative enhancement:\n\nYour original text "${text}" has been transformed into a more imaginative and expressive version that captures the essence while adding creative flair.`;
            case 'business':
                return `Business-optimized version:\n\n"${text}"\n\nRevised for clarity and impact in a business context, focusing on key messages and professional tone.`;
            default:
                return `Improved version:\n\n"${text}"\n\nThis revised version maintains your original meaning while improving clarity, flow, and readability.`;
        }
    }
    
    function simulateAISummary(text, length) {
        // Simulate different summary lengths
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
        
        switch (length) {
            case 'short':
                return sentences[0] || text;
            case 'medium':
                return sentences.slice(0, Math.ceil(sentences.length / 3)).join(' ');
            default:
                return sentences.slice(0, Math.ceil(sentences.length / 2)).join(' ');
        }
    }
    
    function simulateAIExpansion(text, detail) {
        // Simulate different expansion levels
        switch (detail) {
            case 'moderate':
                return `${text}\n\nThis expanded version provides additional context and details to better explain the original point. The core idea remains the same but is now more thoroughly developed with supporting information.`;
            case 'detailed':
                return `${text}\n\nIn this comprehensive expansion, the original text has been significantly elaborated upon. Multiple aspects are now covered in depth, with examples, explanations, and related concepts included to create a complete picture. The expansion maintains the original meaning while adding substantial value through detailed analysis and additional information.`;
            default:
                return `${text}\n\nThis is a light expansion of the original text, adding some additional context and clarification while keeping close to the initial content.`;
        }
    }
    
    function simulateAITranslation(text, from, to) {
        const languages = {
            en: 'English',
            es: 'Spanish',
            fr: 'French',
            de: 'German',
            pt: 'Portuguese',
            zh: 'Chinese',
            ja: 'Japanese'
        };
        
        return `[Translated from ${languages[from] || 'auto'} to ${languages[to]}]\n\n${text}\n\nThis is a simulated translation. In a real application, this would be the actual translated text generated by the AI.`;
    }
    
    function simulateAIProcessCode(code, action, language) {
        switch (action) {
            case 'explain':
                return `// Explanation:\n// This code ${code} performs the following operations:\n// 1. First step\n// 2. Second step\n// 3. Final result\n\n${code}`;
            case 'optimize':
                return `// Optimized version of the original code\n${code.replace(/ {4}/g, '  ').replace(/\n{3,}/g, '\n\n')}`;
            case 'debug':
                return `// Debugged version - fixed potential issues\n${code}\n\n// Fixes:\n// 1. Added null checks\n// 2. Fixed off-by-one error\n// 3. Improved error handling`;
            case 'convert':
                return `// Converted to ${language}\n// Original code was in another language\n\n${code}\n\n// Note: Conversion may require additional adjustments`;
            case 'generate':
                return `// Generated ${language} code based on description\n${code}\n\n// This implements the requested functionality`;
            default:
                return code;
        }
    }
    
    function editCustomCss() {
        const css = localStorage.getItem('dontpage-custom-css') || '';
        const cssEditor = document.createElement('textarea');
        cssEditor.className = 'custom-css-editor';
        cssEditor.value = css;
        
        const cssModal = document.createElement('div');
        cssModal.className = 'modal active';
        cssModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Custom CSS Editor</h3>
                    <button class="btn-icon modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>Add your custom CSS rules below:</p>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" id="cancel-css-btn">Cancel</button>
                    <button class="btn-primary" id="save-css-btn">Save CSS</button>
                </div>
            </div>
        `;
        
        cssModal.querySelector('.modal-body').appendChild(cssEditor);
        document.body.appendChild(cssModal);
        
        cssModal.querySelector('.modal-close').addEventListener('click', () => {
            cssModal.remove();
        });
        
        cssModal.querySelector('#cancel-css-btn').addEventListener('click', () => {
            cssModal.remove();
        });
        
        cssModal.querySelector('#save-css-btn').addEventListener('click', () => {
            localStorage.setItem('dontpage-custom-css', cssEditor.value);
            applyCustomCss();
            cssModal.remove();
            showToast('Custom CSS saved and applied', 'success');
        });
    }
    
    function applyCustomCss() {
        let styleElement = document.getElementById('custom-css-style');
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'custom-css-style';
            document.head.appendChild(styleElement);
        }
        
        const css = localStorage.getItem('dontpage-custom-css') || '';
        styleElement.textContent = css;
    }
    
    function findNext() {
        const findInput = document.getElementById('find-input').value;
        if (!findInput) return;
        
        const caseSensitive = document.getElementById('find-case-sensitive').checked;
        const wholeWord = document.getElementById('find-whole-word').checked;
        const isRegex = document.getElementById('find-regex').checked;
        
        findText(findInput, caseSensitive, wholeWord, isRegex, false);
    }
    
    function findPrev() {
        const findInput = document.getElementById('find-input').value;
        if (!findInput) return;
        
        const caseSensitive = document.getElementById('find-case-sensitive').checked;
        const wholeWord = document.getElementById('find-whole-word').checked;
        const isRegex = document.getElementById('find-regex').checked;
        
        findText(findInput, caseSensitive, wholeWord, isRegex, true);
    }
    
    function findText(text, caseSensitive, wholeWord, isRegex, backward) {
        const editorText = editor.innerText;
        let searchText = text;
        let flags = 'g';
        
        if (!caseSensitive) flags += 'i';
        
        if (isRegex) {
            try {
                new RegExp(text, flags);
            } catch (e) {
                showToast('Invalid regular expression', 'error');
                return;
            }
        } else {
            searchText = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            if (wholeWord) searchText = `\\b${searchText}\\b`;
        }
        
        const regex = new RegExp(searchText, flags);
        const matches = [...editorText.matchAll(regex)];
        
        if (matches.length === 0) {
            showToast('No matches found', 'warning');
            document.getElementById('find-count').textContent = '0 matches found';
            return;
        }
        
        document.getElementById('find-count').textContent = `${matches.length} matches found`;
        
        // Get current selection
        const selection = window.getSelection();
        let currentPos = 0;
        
        if (selection.rangeCount > 0 && !selection.isCollapsed) {
            const range = selection.getRangeAt(0);
            const preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(editor);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            currentPos = preCaretRange.toString().length;
        }
        
        // Find next/previous match
        let matchIndex = -1;
        
        if (backward) {
            for (let i = matches.length - 1; i >= 0; i--) {
                if (matches[i].index < currentPos) {
                    matchIndex = i;
                    break;
                }
            }
            
            if (matchIndex === -1) matchIndex = matches.length - 1;
        } else {
            for (let i = 0; i < matches.length; i++) {
                if (matches[i].index > currentPos) {
                    matchIndex = i;
                    break;
                }
            }
            
            if (matchIndex === -1) matchIndex = 0;
        }
        
        // Highlight the match
        const match = matches[matchIndex];
        const range = document.createRange();
        
        // Find the text node and offset
        let pos = 0;
        const textNodes = getTextNodes(editor);
        let startNode, startOffset, endNode, endOffset;
        
        for (const node of textNodes) {
            const nodeText = node.textContent;
            const nodeLength = nodeText.length;
            
            if (pos + nodeLength > match.index) {
                startNode = node;
                startOffset = match.index - pos;
                break;
            }
            
            pos += nodeLength;
        }
        
        if (!startNode) {
            showToast('Could not find match in DOM', 'error');
            return;
        }
        
        pos = 0;
        for (const node of textNodes) {
            const nodeText = node.textContent;
            const nodeLength = nodeText.length;
            
            if (pos + nodeLength > match.index + match[0].length) {
                endNode = node;
                endOffset = match.index + match[0].length - pos;
                break;
            }
            
            pos += nodeLength;
        }
        
        if (!endNode) endNode = startNode, endOffset = startOffset + match[0].length;
        
        range.setStart(startNode, startOffset);
        range.setEnd(endNode, endOffset);
        
        // Remove previous highlights
        document.querySelectorAll('.find-highlight').forEach(el => {
            const parent = el.parentNode;
            parent.replaceChild(document.createTextNode(el.textContent), el);
            parent.normalize();
        });
        
        // Add new highlight
        const highlight = document.createElement('span');
        highlight.className = 'find-highlight';
        range.surroundContents(highlight);
        
        // Scroll to highlight
        highlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Select the text
        selection.removeAllRanges();
        selection.addRange(range);
    }
    
    function getTextNodes(node) {
        const textNodes = [];
        
        function getNodes(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                textNodes.push(node);
            } else {
                for (const child of node.childNodes) {
                    getNodes(child);
                }
            }
        }
        
        getNodes(node);
        return textNodes;
    }
    
    function replaceText() {
        const findInput = document.getElementById('find-input').value;
        const replaceInput = document.getElementById('replace-input').value;
        
        if (!findInput) return;
        
        const selection = window.getSelection();
        if (!selection.rangeCount || selection.isCollapsed) {
            showToast('No text selected to replace', 'warning');
            return;
        }
        
        const range = selection.getRangeAt(0);
        const selectedText = range.toString();
        
        // Check if selected text matches find input
        const caseSensitive = document.getElementById('find-case-sensitive').checked;
        const isRegex = document.getElementById('find-regex').checked;
        
        let regex;
        if (isRegex) {
            try {
                regex = new RegExp(findInput, caseSensitive ? 'g' : 'gi');
            } catch (e) {
                showToast('Invalid regular expression', 'error');
                return;
            }
        } else {
            regex = new RegExp(findInput.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), caseSensitive ? 'g' : 'gi');
        }
        
        if (!regex.test(selectedText)) {
            showToast('Selected text does not match search term', 'error');
            return;
        }
        
        // Replace the text
        const replacedText = selectedText.replace(regex, replaceInput);
        range.deleteContents();
        range.insertNode(document.createTextNode(replacedText));
        
        // Update find count
        findNext();
    }
    
    function replaceAllText() {
        const findInput = document.getElementById('find-input').value;
        const replaceInput = document.getElementById('replace-input').value;
        
        if (!findInput) return;
        
        const caseSensitive = document.getElementById('find-case-sensitive').checked;
        const wholeWord = document.getElementById('find-whole-word').checked;
        const isRegex = document.getElementById('find-regex').checked;
        
        let searchText = findInput;
        let flags = 'g';
        
        if (!caseSensitive) flags += 'i';
        
        if (isRegex) {
            try {
                new RegExp(searchText, flags);
            } catch (e) {
                showToast('Invalid regular expression', 'error');
                return;
            }
        } else {
            searchText = findInput.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            if (wholeWord) searchText = `\\b${searchText}\\b`;
        }
        
        const regex = new RegExp(searchText, flags);
        const editorHtml = editor.innerHTML;
        const newHtml = editorHtml.replace(regex, replaceInput);
        
        if (newHtml === editorHtml) {
            showToast('No matches found to replace', 'warning');
            return;
        }
        
        editor.innerHTML = newHtml;
        showToast(`Replaced all occurrences of "${findInput}"`, 'success');
    }
    
    function searchPages() {
        const query = searchInput.value.trim();
        if (!query) return;
        
        // In a real app, you would implement proper search functionality
        const results = pages.filter(page => 
            page.name.toLowerCase().includes(query.toLowerCase()) || 
            page.content.toLowerCase().includes(query.toLowerCase())
        );
        
        if (results.length === 0) {
            showToast('No pages found matching your search', 'info');
            return;
        }
        
        // Show results in my pages modal
        showModal(myPagesModal);
        
        // Set search term and trigger render
        document.getElementById('pages-search').value = query;
        renderMyPages();
        
        showToast(`Found ${results.length} pages matching "${query}"`, 'success');
    }
    
    function registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').then(registration => {
                    console.log('ServiceWorker registration successful');
                }).catch(err => {
                    console.log('ServiceWorker registration failed: ', err);
                });
            });
        }
    }
    
    // Apply custom CSS on load
    applyCustomCss();
    
    // Initialize editor theme and font
    updateEditorTheme();
    updateEditorFont();
});

// Service Worker (sw.js)
// Note: This would be in a separate file in a real implementation
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
