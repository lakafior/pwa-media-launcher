// Apple TV-inspired Media Launcher
document.addEventListener('DOMContentLoaded', async () => {
    const iconGrid = document.getElementById('icon-grid');
    const body = document.body;
    const titleElement = document.querySelector('.title');
    let defaultTitle = 'Media';// Load config.json
    async function loadConfig() {
        const response = await fetch('config.json');
        return await response.json();
    }

    // Set wallpaper from config
    function setWallpaper(path) {
        if (path) {
            console.log('Setting wallpaper:', path);
            body.style.setProperty('--wallpaper-url', `url('${path}')`);
        } else {
            console.warn('No wallpaper path provided');
        }
    }// Handle app launch (supports file:// and custom URL schemes)
    // PWA mode: Always open in external browser (Safari)
    function openInBrowser(url) {
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function handleAppLaunch(url) {
        if (url.startsWith('file://')) {
            // For local apps, create hidden iframe to trigger app open
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = url;
            document.body.appendChild(iframe);
            setTimeout(() => iframe.remove(), 1000);
        } else {
            // Open in external browser (Safari) using anchor tag
            openInBrowser(url);
        }
    }

    // Create icon
    function createIcon(app, index) {
        const link = document.createElement('a');
        link.href = '#';
        link.className = 'icon-link';
        link.dataset.url = app.url;
        link.dataset.color = app.color;
        link.style.animationDelay = `${index * 0.05}s`;

        const card = document.createElement('div');
        card.className = 'icon-card';
        card.style.setProperty('--glow-color', `${app.color}80`);
        
        const img = document.createElement('img');
        img.src = app.icon;
        img.alt = app.name;
        
        // Detect image aspect ratio and adjust padding accordingly
        img.onload = function() {
            const aspectRatio = this.naturalWidth / this.naturalHeight;
            
            // If image is square or taller (ratio close to 1:1 or taller)
            if (aspectRatio >= 0.8 && aspectRatio <= 1.2) {
                card.classList.add('app-icon');
            } 
            // If image is portrait or very square-ish
            else if (aspectRatio > 0.6 && aspectRatio < 0.8) {
                card.classList.add('square-icon');
            }
            // Wide/landscape images keep default padding
        };
        
        // Add search key badge if available
        if (app.searchKey) {
            const searchKeyBadge = document.createElement('div');
            searchKeyBadge.className = 'search-key-badge';
            searchKeyBadge.textContent = app.searchKey.toUpperCase();
            card.appendChild(searchKeyBadge);
        }
        
        const name = document.createElement('div');
        name.className = 'icon-name';
        name.textContent = app.name;

        card.appendChild(img);
        link.appendChild(card);
        link.appendChild(name);        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Add bounce animation
            link.classList.add('bounce');
            
            // Remove bounce class after animation
            setTimeout(() => {
                link.classList.remove('bounce');
            }, 400);
            
            // Launch app after brief delay for animation feedback
            setTimeout(() => {
                handleAppLaunch(app.url);
            }, 200);
        });
        link.addEventListener('mouseenter', () => handleIconHover(link));
        link.addEventListener('mouseleave', () => handleIconLeave());

        return link;
    }

    // Color adjustment helper
    function adjustColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.max(0, Math.min(255, (num >> 16) + amt));
        const G = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amt));
        const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
        return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
    }    // Generate gradient
    function generateGradient(color) {
        const dark = adjustColor(color, -30);
        const light = adjustColor(color, 20);
        const darkest = adjustColor(color, -50);
        
        return `radial-gradient(circle at 20% 50%, ${light}08 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, ${color}06 0%, transparent 50%),
                radial-gradient(circle at 40% 20%, ${dark}04 0%, transparent 50%),
                linear-gradient(135deg, ${darkest}18 0%, ${dark}14 50%, ${color}10 100%)`;
    }    // Hover handlers
    function handleIconHover(el) {
        // Ignore mouse hover if user is actively using keyboard
        if (isUsingKeyboard) {
            return;
        }
        
        const gradient = generateGradient(el.dataset.color);
        body.style.setProperty('--hover-gradient', gradient);
        body.classList.add('has-background');
        
        // Update title with app name
        const appName = el.querySelector('.icon-name').textContent;
        titleElement.textContent = appName;
        
        // Clear keyboard focus when hovering with mouse
        icons.forEach(icon => icon.classList.remove('keyboard-focused'));
    }    function handleIconLeave() {
        // Don't clear background if using keyboard
        if (isUsingKeyboard) {
            return;
        }
        
        setTimeout(() => {
            if (!document.querySelector('.icon-link:hover') && !isUsingKeyboard) {
                body.classList.remove('has-background');
                // Restore default title
                titleElement.textContent = defaultTitle;
            }
        }, 50);
    }// Clock
    function updateClock() {
        const time = document.getElementById('current-time');
        if (time) {
            const now = new Date();
            time.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        }
    }    // Keyboard Navigation
    let currentFocusIndex = 0;
    let icons = [];
    let isUsingKeyboard = false; // Track input method
    let keyboardModeTimeout = null;    function focusIcon(index) {
        // Remove focus from all icons
        icons.forEach(icon => icon.classList.remove('keyboard-focused'));
        
        // Add focus to current icon
        if (icons[index]) {
            icons[index].classList.add('keyboard-focused');
            currentFocusIndex = index;
            
            // Scroll icon into view
            scrollIconIntoView(icons[index]);
            
            // Update title with app name
            const appName = icons[index].querySelector('.icon-name').textContent;
            titleElement.textContent = appName;
            
            // Trigger hover effect
            const color = icons[index].dataset.color;
            if (color) {
                const gradient = generateGradient(color);
                body.style.setProperty('--hover-gradient', gradient);
                body.classList.add('has-background');
            }
        }
    }

    function getGridColumns() {
        // Calculate how many columns based on grid
        const gridStyle = window.getComputedStyle(iconGrid);
        const gridCols = gridStyle.gridTemplateColumns.split(' ').length;
        return gridCols;
    }

    // Smooth scroll focused icon into view
    function scrollIconIntoView(icon) {
        if (icon) {
            icon.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center'
            });
        }
    }

    // Enable keyboard mode (blocks mouse hover)
    function enableKeyboardMode() {
        isUsingKeyboard = true;
        body.classList.add('keyboard-mode');
        
        // Clear any existing timeout
        if (keyboardModeTimeout) {
            clearTimeout(keyboardModeTimeout);
        }
        
        // Auto-disable keyboard mode after 2 seconds of inactivity
        keyboardModeTimeout = setTimeout(() => {
            isUsingKeyboard = false;
            body.classList.remove('keyboard-mode');
        }, 2000);
    }

    // Disable keyboard mode on mouse movement
    let mouseMoveTimeout;
    document.addEventListener('mousemove', () => {
        // Debounce mouse movement
        clearTimeout(mouseMoveTimeout);
        mouseMoveTimeout = setTimeout(() => {
            // Only disable keyboard mode if user is actually moving mouse
            // (not just incidental movement during scrolling)
            if (!isUsingKeyboard) return;
            
            // Check if mouse is over an icon
            const hoveredIcon = document.querySelector('.icon-link:hover');
            if (hoveredIcon) {
                isUsingKeyboard = false;
                body.classList.remove('keyboard-mode');
                // Clear keyboard focus
                icons.forEach(icon => icon.classList.remove('keyboard-focused'));
            }
        }, 100);
    });

    function handleKeyboard(e) {
        if (icons.length === 0) return;
        
        // Don't handle if any modal is open
        if (isAnyModalOpen()) {
            return;
        }
        
        // Don't handle keyboard navigation if Quick Search is focused
        const quickSearchInput = document.getElementById('quick-search');
        if (quickSearchInput && document.activeElement === quickSearchInput) {
            return;
        }

        const cols = getGridColumns();
        const maxIndex = icons.length - 1;
        
        // Activate keyboard mode on arrow key usage
        const isNavigationKey = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key);
        
        if (isNavigationKey) {
            enableKeyboardMode();
        }

        switch(e.key) {
            case 'ArrowRight':
                e.preventDefault();
                currentFocusIndex = currentFocusIndex < maxIndex ? currentFocusIndex + 1 : 0;
                focusIcon(currentFocusIndex);
                break;
                
            case 'ArrowLeft':
                e.preventDefault();
                currentFocusIndex = currentFocusIndex > 0 ? currentFocusIndex - 1 : maxIndex;
                focusIcon(currentFocusIndex);
                break;
                
            case 'ArrowDown':
                e.preventDefault();
                const nextRow = currentFocusIndex + cols;
                currentFocusIndex = nextRow <= maxIndex ? nextRow : currentFocusIndex % cols;
                focusIcon(currentFocusIndex);
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                const prevRow = currentFocusIndex - cols;
                if (prevRow >= 0) {
                    currentFocusIndex = prevRow;
                } else {
                    // Jump to last row, same column
                    const col = currentFocusIndex % cols;
                    const lastRowStart = Math.floor(maxIndex / cols) * cols;
                    currentFocusIndex = Math.min(lastRowStart + col, maxIndex);
                }
                focusIcon(currentFocusIndex);
                break;
                  case 'Enter':
            case ' ':
                e.preventDefault();
                if (icons[currentFocusIndex]) {
                    icons[currentFocusIndex].click();
                }
                break;            case 'Escape':
                // Clear keyboard focus
                icons.forEach(icon => icon.classList.remove('keyboard-focused'));
                body.classList.remove('has-background');
                // Restore default title
                titleElement.textContent = defaultTitle;
                break;
        }
    }    // Init
    // Help Overlay
    const helpOverlay = document.getElementById('help-overlay');
    let isHelpActive = false;

    function toggleHelp() {
        isHelpActive = !isHelpActive;
        helpOverlay.classList.toggle('active', isHelpActive);
    }

    // Close help on overlay click
    helpOverlay.addEventListener('click', (e) => {
        if (e.target === helpOverlay) {
            toggleHelp();
        }
    });

    // Spotlight-style Search
    const searchContainer = document.getElementById('search-container');
    const searchInput = document.getElementById('search-input');
    const searchBackdrop = document.getElementById('search-backdrop');
    const searchResults = document.getElementById('search-results');
    let isSearchActive = false;
    let searchSelectedIndex = -1;
    let filteredApps = [];

    // Helper function to check if modals are open
    function isAnyModalOpen() {
        const settingsOverlay = document.getElementById('settings-overlay');
        const editorOverlay = document.getElementById('editor-overlay');
        return settingsOverlay?.classList.contains('active') || editorOverlay?.classList.contains('active');
    }

    function setupSearch() {
        // Open search with / or Cmd+K
        document.addEventListener('keydown', (e) => {
            // Don't handle if any modal is open
            if (isAnyModalOpen()) {
                return;
            }
            
            // Don't handle shortcuts if Quick Search is focused
            const quickSearchInput = document.getElementById('quick-search');
            const isQuickSearchActive = quickSearchInput && document.activeElement === quickSearchInput;
            
            // Activate Quick Search with . (dot)
            if (e.key === '.' && !isSearchActive && !isHelpActive && !isQuickSearchActive) {
                e.preventDefault();
                quickSearchInput.focus();
                return;
            }
            
            // Toggle help with ?
            if (e.key === '?' && !isSearchActive && !isQuickSearchActive) {
                e.preventDefault();
                toggleHelp();
                return;
            }
            
            // Close help with ESC
            if (e.key === 'Escape' && isHelpActive) {
                toggleHelp();
                return;
            }
            
            // Open search
            if ((e.key === '/' || (e.metaKey && e.key === 'k') || (e.ctrlKey && e.key === 'k')) && !isQuickSearchActive) {
                e.preventDefault();
                openSearch();
            }
              // Close search with ESC
            if (e.key === 'Escape' && isSearchActive) {
                closeSearch();
            }
            
            // Number shortcuts (1-9, 0) when search is NOT active and Quick Search is NOT focused
            if (!isSearchActive && !isHelpActive && !isQuickSearchActive && !isAnyModalOpen()) {
                if (e.key >= '1' && e.key <= '9') {
                    const index = parseInt(e.key) - 1;
                    if (icons[index]) {
                        icons[index].click();
                    }
                } else if (e.key === '0') {
                    // 0 = 10th app (index 9)
                    if (icons[9]) {
                        icons[9].click();
                    }
                }
            }
        });

        // Close on backdrop click
        searchBackdrop.addEventListener('click', closeSearch);

        // Filter as you type
        searchInput.addEventListener('input', filterApps);
        
        // Navigate with arrow keys in search
        searchInput.addEventListener('keydown', handleSearchNavigation);
    }    function openSearch() {
        isSearchActive = true;
        searchContainer.classList.add('active');
        searchBackdrop.classList.add('active');
        searchInput.value = '';
        searchSelectedIndex = -1;
        filteredApps = [];
        
        // Clear and show all apps in results
        renderSearchResults([]);
        
        // FORCE FOCUS with slight delay
        setTimeout(() => {
            searchInput.focus();
        }, 100);
    }

    function closeSearch() {
        isSearchActive = false;
        searchContainer.classList.remove('active');
        searchBackdrop.classList.remove('active');
        searchInput.value = '';
        searchInput.blur();
        searchSelectedIndex = -1;
        filteredApps = [];
        searchResults.innerHTML = '';
        
        // Restore keyboard focus
        if (icons.length > 0) {
            focusIcon(currentFocusIndex);
        }
    }

    function filterApps() {
        const query = searchInput.value.toLowerCase().trim();
        
        if (!query) {
            filteredApps = [];
            renderSearchResults([]);
            return;
        }
        
        // Get apps from config (we'll need to store this)
        const allApps = Array.from(icons).map(icon => ({
            name: icon.querySelector('.icon-name').textContent,
            url: icon.dataset.url,
            icon: icon.querySelector('img').src,
            color: icon.dataset.color,
            element: icon
        }));
        
        // Filter apps
        filteredApps = allApps.filter(app => 
            app.name.toLowerCase().includes(query)
        );
        
        renderSearchResults(filteredApps);
        
        // Auto-select first result
        if (filteredApps.length > 0) {
            searchSelectedIndex = 0;
            updateSelection();
        } else {
            searchSelectedIndex = -1;
        }
    }
      function renderSearchResults(apps) {
        if (apps.length === 0 && searchInput.value.trim()) {
            searchResults.innerHTML = '<div class="search-no-results">No apps found</div>';
            return;
        }
        
        if (apps.length === 0) {
            searchResults.innerHTML = '';
            return;
        }
        
        searchResults.innerHTML = apps.map((app, index) => `
            <div class="search-result-item" data-index="${index}">
                <img src="${app.icon}" alt="${app.name}" class="search-result-icon">
                <div class="search-result-info">
                    <div class="search-result-name">${app.name}</div>
                    <div class="search-result-url">${app.url}</div>
                </div>
            </div>
        `).join('');
        
        // Add click and hover handlers
        searchResults.querySelectorAll('.search-result-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                handleAppLaunch(apps[index].url);
                closeSearch();
            });
            
            // Mouse hover changes selection
            item.addEventListener('mouseenter', () => {
                searchSelectedIndex = index;
                updateSelection();
            });
            
            // Mouse leave clears selection
            item.addEventListener('mouseleave', () => {
                searchSelectedIndex = -1;
                updateSelection();
            });
        });
    }
    
    function updateSelection() {
        const items = searchResults.querySelectorAll('.search-result-item');
        items.forEach((item, index) => {
            if (index === searchSelectedIndex) {
                item.classList.add('selected');
                item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                item.classList.remove('selected');
            }
        });
    }
    
    function handleSearchNavigation(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            
            if (searchSelectedIndex >= 0 && filteredApps[searchSelectedIndex]) {
                handleAppLaunch(filteredApps[searchSelectedIndex].url);
                closeSearch();
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (filteredApps.length === 0) return;
            
            searchSelectedIndex = (searchSelectedIndex + 1) % filteredApps.length;
            updateSelection();
            
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (filteredApps.length === 0) return;
            
            searchSelectedIndex = searchSelectedIndex <= 0 ? filteredApps.length - 1 : searchSelectedIndex - 1;
            updateSelection();
        }
    }

    // Settings Panel
    const settingsOverlay = document.getElementById('settings-overlay');
    const settingsBtn = document.getElementById('settings-btn');
    const closeSettings = document.getElementById('close-settings');
    const exportBtn = document.getElementById('export-config');
    const importBtn = document.getElementById('import-config');
    const importFile = document.getElementById('import-file');
    const includeIconsCheckbox = document.getElementById('include-icons');
    const totalAppsEl = document.getElementById('total-apps');
    const lastModifiedEl = document.getElementById('last-modified');

    let currentConfig = null;

    function showToast(message, duration = 3000) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    }

    function openSettings() {
        settingsOverlay.classList.add('active');
        updateSettingsInfo();
    }

    function closeSettingsPanel() {
        settingsOverlay.classList.remove('active');
    }

    function updateSettingsInfo() {
        if (currentConfig) {
            totalAppsEl.textContent = currentConfig.apps.length;
            lastModifiedEl.textContent = new Date().toLocaleDateString();
        }
    }

    // Convert image to base64
    async function imageToBase64(imageUrl) {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.warn(`Failed to convert image ${imageUrl} to base64:`, error);
            return imageUrl; // Fallback to original URL
        }
    }

    // Export Configuration
    async function exportConfiguration() {
        if (!currentConfig) return;

        const includeIcons = includeIconsCheckbox.checked;
        const exportData = JSON.parse(JSON.stringify(currentConfig)); // Deep clone

        if (includeIcons) {
            // Show loading state
            exportBtn.disabled = true;
            exportBtn.querySelector('span').textContent = '⏳ Converting icons...';

            // Convert all icons to base64
            for (let i = 0; i < exportData.apps.length; i++) {
                const app = exportData.apps[i];
                if (app.icon && !app.icon.startsWith('data:')) {
                    exportData.apps[i].icon = await imageToBase64(app.icon);
                }
            }

            // Convert wallpaper too
            if (exportData.wallpaper && !exportData.wallpaper.startsWith('data:')) {
                exportData.wallpaper = await imageToBase64(exportData.wallpaper);
            }

            exportBtn.disabled = false;
            exportBtn.querySelector('span').textContent = '💾 Export Configuration';
        }

        // Add metadata
        exportData._exported = {
            date: new Date().toISOString(),
            version: '1.0',
            includesBase64Icons: includeIcons
        };

        // Download as JSON
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `media-launcher-config-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast('✅ Configuration exported successfully!');
        closeSettingsPanel();
    }

    // Import Configuration
    async function importConfiguration(file) {
        try {
            const text = await file.text();
            const importedConfig = JSON.parse(text);

            // Validate config
            if (!importedConfig.apps || !Array.isArray(importedConfig.apps)) {
                throw new Error('Invalid configuration file');
            }

            // Save to localStorage
            localStorage.setItem('mediaLauncherConfig', JSON.stringify(importedConfig));

            showToast('✅ Configuration imported! Reloading...', 2000);
            
            setTimeout(() => {
                window.location.reload();
            }, 1500);

        } catch (error) {
            console.error('Import failed:', error);
            showToast('❌ Import failed! Invalid configuration file.', 4000);
        }
    }

    // Reset to default configuration
    function resetToDefault() {
        if (!confirm('Are you sure you want to reset to default configuration? This will remove all local changes.')) {
            return;
        }

        try {
            // Clear localStorage
            localStorage.removeItem('mediaLauncherConfig');
            
            // Show success message
            showToast('✅ Configuration reset! Reloading...', 2000);
            
            // Reload page after a short delay
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error) {
            console.error('Reset failed:', error);
            showToast('❌ Failed to reset configuration!', 4000);
        }
    }

    // Event listeners
    settingsBtn.addEventListener('click', openSettings);
    closeSettings.addEventListener('click', closeSettingsPanel);
    settingsOverlay.addEventListener('click', (e) => {
        if (e.target === settingsOverlay) {
            closeSettingsPanel();
        }
    });

    exportBtn.addEventListener('click', exportConfiguration);
    importBtn.addEventListener('click', () => importFile.click());
    importFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            importConfiguration(file);
        }
    });
    
    const resetBtn = document.getElementById('reset-config');
    resetBtn.addEventListener('click', resetToDefault);

    // Close settings with ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && settingsOverlay.classList.contains('active')) {
            closeSettingsPanel();
        }
    });

    // Editor Panel
    const editorOverlay = document.getElementById('editor-overlay');
    const editBtn = document.getElementById('edit-btn');
    const closeEditor = document.getElementById('close-editor');
    const editorContent = document.getElementById('editor-content');
    const addAppBtn = document.getElementById('add-app-btn');
    const saveConfigBtn = document.getElementById('save-config-btn');

    let editingApps = [];

    function openEditor() {
        if (!currentConfig) return;
        
        // Clone current apps for editing
        editingApps = JSON.parse(JSON.stringify(currentConfig.apps));
        renderEditor();
        editorOverlay.classList.add('active');
    }

    function closeEditorPanel() {
        editorOverlay.classList.remove('active');
    }

    function renderEditor() {
        // Render global settings
        const titleInput = document.getElementById('global-title');
        if (titleInput && currentConfig) {
            titleInput.value = currentConfig.title || 'Media Launcher';
        }
        
        // Render apps list
        const appsList = document.getElementById('apps-list');
        if (!appsList) return;
        
        appsList.innerHTML = '';
        
        editingApps.forEach((app, index) => {
            const card = createAppCard(app, index);
            appsList.appendChild(card);
        });
    }

    function createAppCard(app, index) {
        const card = document.createElement('div');
        card.className = 'app-card';
        card.innerHTML = `
            <div class="app-card-header">
                <img src="${app.icon}" alt="${app.name}" class="app-card-icon" id="preview-${index}">
                <div class="app-card-title">${app.name}</div>
                <div class="app-card-actions">
                    <button class="icon-btn delete" onclick="deleteApp(${index})" title="Delete">🗑️</button>
                </div>
            </div>
            <div class="app-card-form">
                <div class="form-group">
                    <label>Name</label>
                    <input type="text" value="${app.name}" onchange="updateApp(${index}, 'name', this.value)" placeholder="App Name">
                </div>
                <div class="form-group">
                    <label>URL</label>
                    <input type="text" value="${app.url}" onchange="updateApp(${index}, 'url', this.value)" placeholder="https://...">
                </div>
                <div class="form-group">
                    <label>Color</label>
                    <input type="color" value="${app.color}" onchange="updateApp(${index}, 'color', this.value)">
                </div>
                <div class="form-group">
                    <label>Icon</label>
                    <div class="file-input-wrapper">
                        <label class="file-input-btn">
                            📁 Choose Icon
                            <input type="file" accept="image/*" onchange="handleIconUpload(${index}, this.files[0])">
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label>Search URL (optional)</label>
                    <input type="text" value="${app.searchUrl || ''}" onchange="updateApp(${index}, 'searchUrl', this.value)" placeholder="https://...?q=%s">
                </div>
                <div class="form-group">
                    <label>Search Key (optional)</label>
                    <input type="text" value="${app.searchKey || ''}" onchange="updateApp(${index}, 'searchKey', this.value)" placeholder="y" maxlength="1">
                </div>
            </div>
        `;
        return card;
    }

    window.updateApp = function(index, field, value) {
        editingApps[index][field] = value;
        
        // Update title if name changed
        if (field === 'name') {
            const titleEl = document.querySelector(`#editor-content .app-card:nth-child(${index + 1}) .app-card-title`);
            if (titleEl) titleEl.textContent = value;
        }
    };

    window.deleteApp = function(index) {
        if (confirm(`Delete ${editingApps[index].name}?`)) {
            editingApps.splice(index, 1);
            renderEditor();
            showToast('🗑️ App removed');
        }
    };

    window.handleIconUpload = async function(index, file) {
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64 = e.target.result;
            editingApps[index].icon = base64;
            
            // Update preview
            const preview = document.getElementById(`preview-${index}`);
            if (preview) preview.src = base64;
            
            showToast('📸 Icon uploaded');
        };
        reader.readAsDataURL(file);
    };

    function addNewApp() {
        const newApp = {
            name: 'New App',
            url: 'https://',
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23666"/><text x="50" y="55" text-anchor="middle" fill="white" font-size="40">?</text></svg>',
            color: '#666666',
            searchUrl: '',
            searchKey: ''
        };
        
        editingApps.push(newApp);
        renderEditor();
        
        // Scroll to bottom
        editorContent.scrollTop = editorContent.scrollHeight;
        showToast('➕ New app added');
    }

    async function saveConfiguration() {
        try {
            // Update global settings
            const titleInput = document.getElementById('global-title');
            if (titleInput) {
                currentConfig.title = titleInput.value || 'Media Launcher';
            }
            
            // Update apps
            currentConfig.apps = editingApps;
            
            // Save to localStorage
            localStorage.setItem('mediaLauncherConfig', JSON.stringify(currentConfig));
            
            showToast('✅ Configuration saved! Reloading...', 2000);
            
            // Reload page
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error) {
            console.error('Save failed:', error);
            showToast('❌ Failed to save configuration!', 4000);
        }
    }

    // Editor event listeners
    editBtn.addEventListener('click', openEditor);
    closeEditor.addEventListener('click', closeEditorPanel);
    editorOverlay.addEventListener('click', (e) => {
        if (e.target === editorOverlay) {
            closeEditorPanel();
        }
    });
    addAppBtn.addEventListener('click', addNewApp);
    saveConfigBtn.addEventListener('click', saveConfiguration);
    
    // Global wallpaper upload
    const wallpaperInput = document.getElementById('global-wallpaper-input');
    if (wallpaperInput) {
        wallpaperInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const base64 = e.target.result;
                    currentConfig.wallpaper = base64;
                    showToast('🖼️ Wallpaper uploaded (save to apply)');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Close editor with ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && editorOverlay.classList.contains('active')) {
            closeEditorPanel();
        }
    });

    // Modified init to store config
    async function initWithConfig() {
        // Try to load from localStorage first
        const savedConfig = localStorage.getItem('mediaLauncherConfig');
        
        if (savedConfig) {
            currentConfig = JSON.parse(savedConfig);
            
            // Fallback: if wallpaper is missing in localStorage, load from config.json
            if (!currentConfig.wallpaper) {
                const defaultConfig = await loadConfig();
                currentConfig.wallpaper = defaultConfig.wallpaper;
                localStorage.setItem('mediaLauncherConfig', JSON.stringify(currentConfig));
            }
        } else {
            currentConfig = await loadConfig();
            // Save initial config to localStorage
            localStorage.setItem('mediaLauncherConfig', JSON.stringify(currentConfig));
        }

        // Continue with original init logic
        setWallpaper(currentConfig.wallpaper);
        
        document.title = currentConfig.title;
        defaultTitle = currentConfig.title.split(' ')[0];
        titleElement.textContent = defaultTitle;
        
        currentConfig.apps.forEach((app, i) => {
            iconGrid.appendChild(createIcon(app, i));
        });
          
        icons = Array.from(document.querySelectorAll('.icon-link'));
        if (icons.length > 0) {
            focusIcon(0);
        }
        
        document.addEventListener('keydown', handleKeyboard);
        setupSearch();
        setupQuickSearch();  // Setup Quick Search after config is loaded
        updateClock();
        setInterval(updateClock, 1000);
        updateSettingsInfo();
    }

    // Quick Search Bar functionality
    function setupQuickSearch() {
        const quickSearchInput = document.getElementById('quick-search');
        const searchHint = document.getElementById('search-hint');
        const searchResults = document.getElementById('quick-search-results');
        
        if (!quickSearchInput) return;
        
        let selectedResultIndex = -1;
        let currentResults = [];
        
        // Get all apps with search capability
        const searchableApps = currentConfig.apps.filter(app => app.searchUrl && app.searchKey);
        
        // Build search key map for quick lookup
        const searchKeyMap = {};
        searchableApps.forEach(app => {
            searchKeyMap[app.searchKey] = app;
        });
        
        // Update hint and results based on input
        quickSearchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            selectedResultIndex = -1;
            
            if (!query) {
                searchHint.textContent = '';
                searchResults.classList.remove('active');
                searchResults.innerHTML = '';
                currentResults = [];
                return;
            }
            
            // Check if query starts with a search key
            const words = query.split(' ');
            const potentialKey = words[0].toLowerCase();
            
            if (words.length > 1 && searchKeyMap[potentialKey]) {
                // Direct search with key (e.g., "y inception")
                const app = searchKeyMap[potentialKey];
                searchHint.textContent = `↵ Search in ${app.name}`;
                searchResults.classList.remove('active');
                searchResults.innerHTML = '';
                currentResults = [];
            } else {
                // Show all searchable apps
                searchHint.textContent = `${searchableApps.length} apps`;
                currentResults = searchableApps;
                renderSearchResults(searchableApps, query);
                searchResults.classList.add('active');
            }
        });
        
        function renderSearchResults(apps, query) {
            searchResults.innerHTML = apps.map((app, index) => `
                <div class="quick-search-result-item" data-index="${index}">
                    <img src="${app.icon}" alt="${app.name}">
                    <span class="result-name">${app.name}</span>
                    <span class="result-key">${app.searchKey}</span>
                </div>
            `).join('');
            
            // Add click handlers
            searchResults.querySelectorAll('.quick-search-result-item').forEach((item, index) => {
                item.addEventListener('click', () => {
                    performSearch(apps[index], query);
                });
            });
        }
        
        // Handle keyboard navigation in results
        quickSearchInput.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                e.stopPropagation();
                if (currentResults.length > 0) {
                    selectedResultIndex = Math.min(selectedResultIndex + 1, currentResults.length - 1);
                    updateSelectedResult();
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                e.stopPropagation();
                if (currentResults.length > 0) {
                    selectedResultIndex = Math.max(selectedResultIndex - 1, -1);
                    updateSelectedResult();
                }
            } else if (e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
                handleQuickSearch(quickSearchInput.value.trim());
            } else if (e.key === 'Escape') {
                e.preventDefault();
                e.stopPropagation();
                quickSearchInput.value = '';
                searchHint.textContent = '';
                searchResults.classList.remove('active');
                searchResults.innerHTML = '';
                currentResults = [];
                selectedResultIndex = -1;
                quickSearchInput.blur();
            }
        });
        
        function updateSelectedResult() {
            const items = searchResults.querySelectorAll('.quick-search-result-item');
            items.forEach((item, index) => {
                item.classList.toggle('selected', index === selectedResultIndex);
            });
            
            // Scroll selected into view
            if (selectedResultIndex >= 0 && items[selectedResultIndex]) {
                items[selectedResultIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        }
        
        function performSearch(app, query) {
            const searchUrl = app.searchUrl.replace('%s', encodeURIComponent(query));
            openInBrowser(searchUrl);
            quickSearchInput.value = '';
            searchHint.textContent = '';
            searchResults.classList.remove('active');
            searchResults.innerHTML = '';
            currentResults = [];
            selectedResultIndex = -1;
            quickSearchInput.blur();
        }
        
        // Close results when clicking outside
        document.addEventListener('click', (e) => {
            if (!quickSearchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.classList.remove('active');
                selectedResultIndex = -1;
            }
        });
    }
    
    function handleQuickSearch(query) {
        const quickSearchInput = document.getElementById('quick-search');
        const searchHint = document.getElementById('search-hint');
        const searchResults = document.getElementById('quick-search-results');
        
        if (!query) return;
        
        const searchableApps = currentConfig.apps.filter(app => app.searchUrl && app.searchKey);
        const searchKeyMap = {};
        searchableApps.forEach(app => {
            searchKeyMap[app.searchKey] = app;
        });
        
        // Check if query starts with a search key
        const words = query.split(' ');
        const potentialKey = words[0].toLowerCase();
        
        if (words.length > 1 && searchKeyMap[potentialKey]) {
            // Direct search with key (e.g., "y inception")
            const app = searchKeyMap[potentialKey];
            const searchQuery = words.slice(1).join(' ');
            const searchUrl = app.searchUrl.replace('%s', encodeURIComponent(searchQuery));
            openInBrowser(searchUrl);
        } else {
            // Use selected result or first app
            const selectedIndex = Array.from(searchResults.querySelectorAll('.quick-search-result-item'))
                .findIndex(item => item.classList.contains('selected'));
            
            if (selectedIndex >= 0 && searchableApps[selectedIndex]) {
                const searchUrl = searchableApps[selectedIndex].searchUrl.replace('%s', encodeURIComponent(query));
                openInBrowser(searchUrl);
            } else if (searchableApps.length > 0) {
                // Default to first searchable app
                const searchUrl = searchableApps[0].searchUrl.replace('%s', encodeURIComponent(query));
                openInBrowser(searchUrl);
            }
        }
        
        // Clean up
        quickSearchInput.value = '';
        searchHint.textContent = '';
        searchResults.classList.remove('active');
        searchResults.innerHTML = '';
        quickSearchInput.blur();
    }

    initWithConfig();
});