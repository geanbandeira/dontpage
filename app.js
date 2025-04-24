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

// Mostra notificação toast
function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
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
    const shareTelegramBtn = document.getElementById('share-telegram');
    const newPageBtn = document.getElementById('new-page');
    const themeToggle = document.getElementById('theme-toggle');

    
    
    // Verifica tema preferido do usuário
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', initialTheme);
    updateThemeIcon(initialTheme);

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
        }, (error) => {
            console.error('Erro ao carregar página:', error);
            showToast('Erro ao carregar a página');
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
                showToast('Erro ao salvar a página');
            });
    }

    // Debounce para salvamento automático
    function debounceSave() {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(savePage, 2000);
    }

    // Cria nova página
    function createNewPage() {
        Swal.fire({
            title: 'Criar nova página',
            input: 'text',
            inputLabel: 'Digite um nome para a nova página:',
            inputPlaceholder: 'Ex: minha-pagina',
            showCancelButton: true,
            confirmButtonText: 'Criar',
            cancelButtonText: 'Cancelar',
            inputValidator: (value) => {
                if (!value) {
                    return 'Você precisa digitar um nome!';
                }
                const cleanName = value.toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^a-z0-9-]/g, '');
                if (!cleanName) {
                    return 'Use apenas letras, números e hífens';
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const cleanName = result.value.toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^a-z0-9-]/g, '');
                if (cleanName) {
                    window.location.href = `/${cleanName}`;
                }
            }
        });
    }

    // Alterna entre temas claro/escuro
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    }

    // Atualiza ícone do tema
    function updateThemeIcon(theme) {
        if (!themeToggle) return;
        const icon = themeToggle.querySelector('i');
        
        if (theme === 'dark') {
            icon.classList.replace('fa-moon', 'fa-sun');
            themeToggle.setAttribute('title', 'Tema claro');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
            themeToggle.setAttribute('title', 'Tema escuro');
        }
    }

    // Exporta conteúdo para diferentes formatos
    function exportContent(format) {
        const content = editor.value;
        const filename = `dontpage-${currentPageId}.${format}`;
        
        switch(format) {
            case 'pdf':
    // Usando jsPDF para gerar PDF com múltiplas páginas
    const { jsPDF } = window.jspdf;
    
    // Configurações do PDF
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    // Margens do documento
    const margins = {
        top: 30,
        bottom: 20,
        left: 30,
        right: 20
    };

    // Tamanho útil da página
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const usableWidth = pageWidth - margins.left - margins.right;
    const usableHeight = pageHeight - margins.top - margins.bottom;

    // Configurações do texto
    const lineHeight = 5;
    const fontSize = 12;
    doc.setFontSize(fontSize);

    // Dividir o conteúdo em linhas que cabem na página
    const splitText = doc.splitTextToSize(content, usableWidth);

    let y = margins.top;
    let pageNumber = 1;

    // Adicionar texto página por página
    for (let i = 0; i < splitText.length; i++) {
        // Verificar se precisa de nova página
        if (y + lineHeight > pageHeight - margins.bottom) {
            doc.addPage();
            y = margins.top;
            pageNumber++;
        }
        
        // Adicionar linha de texto
        doc.text(splitText[i], margins.left, y);
        y += lineHeight;
    }

    // Salvar o PDF
    doc.save(filename);
    break;
                
            case 'html':
                const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${filename}</title>
</head>
<body>
    <pre>${content}</pre>
</body>
</html>`;
                downloadFile(htmlContent, filename, 'text/html');
                break;
                
                case 'docx':
                    try {
                        // Verifica se as dependências estão carregadas
                        if (!window.docx || !window.docx.Packer || !window.saveAs) {
                            throw new Error("Bibliotecas docx ou FileSaver não carregadas corretamente");
                        }
                
                        const { Document, Paragraph, TextRun, Packer } = window.docx;
                        
                        // Cria o documento com formatação básica
                        const doc = new Document({
                            sections: [{
                                properties: {},
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: content,
                                                size: 24,      // Tamanho da fonte (opcional)
                                                font: "Arial"  // Fonte (opcional)
                                            })
                                        ]
                                    })
                                ]
                            }]
                        });
                
                        // Gera o blob e faz o download
                        Packer.toBlob(doc).then(blob => {
                            window.saveAs(blob, filename);
                        }).catch(err => {
                            console.error("Erro ao gerar documento:", err);
                            showToast("Falha ao gerar arquivo Word");
                        });
                        
                    } catch (err) {
                        console.error("Erro no export DOCX:", err);
                        showToast("Erro ao exportar para Word");
                        // Tentativa alternativa de fallback
                        const fallbackBlob = new Blob([content], { 
                            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
                        });
                        window.saveAs(fallbackBlob, filename);
                    }
                    break;
                
            case 'odt':
                // Implementação simplificada para ODT
                const odtContent = `<?xml version="1.0" encoding="UTF-8"?>
<office:document xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0">
    <office:body>
        <office:text>
            <text:p>${content}</text:p>
        </office:text>
    </office:body>
</office:document>`;
                downloadFile(odtContent, filename, 'application/vnd.oasis.opendocument.text');
                break;
                
            case 'txt':
                downloadFile(content, filename, 'text/plain');
                break;
        }
    }

    // Função auxiliar para download de arquivo
    function downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
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
            showToast('URL copiada para a área de transferência');
        });
    }

    if (shareWhatsappBtn) {
        shareWhatsappBtn.addEventListener('click', () => {
            const url = encodeURIComponent(pageUrl.value);
            window.open(`https://wa.me/?text=${url}`, '_blank');
        });
    }

    if (shareTelegramBtn) {
        shareTelegramBtn.addEventListener('click', () => {
            const url = encodeURIComponent(pageUrl.value);
            window.open(`https://t.me/share/url?url=${url}`, '_blank');
        });
    }

    if (newPageBtn) {
        newPageBtn.addEventListener('click', createNewPage);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Configura exportação
    document.querySelectorAll('.export-option').forEach(option => {
        option.addEventListener('click', () => {
            const format = option.dataset.format;
            
            // Carrega bibliotecas necessárias dinamicamente
            if (format === 'pdf' && !window.jspdf) {
                loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')
                    .then(() => exportContent(format))
                    .catch(() => showToast('Erro ao carregar biblioteca PDF'));
            } else if (format === 'docx' && !window.docx) {
                loadScript('https://cdn.jsdelivr.net/npm/docx@7.8.2/build/index.min.js')
                    .then(() => {
                        if (!window.saveAs) {
                            return loadScript('https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js');
                        }
                    })
                    .then(() => {
                        if (!window.docx) {
                            throw new Error("docx não carregou");
                        }
                        exportContent(format);
                    })
                    .catch((err) => {
                        console.error("Erro ao carregar bibliotecas:", err);
                        showToast('Erro ao carregar biblioteca Word');
                    });
            
            } else {
                exportContent(format);
            }
        });
    });

    // Função para carregar scripts dinamicamente
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Exporta funções para uso no HTML
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