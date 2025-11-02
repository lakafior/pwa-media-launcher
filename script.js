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
            body.style.setProperty('--wallpaper-url', `url('${path}')`);
        }
    }// Handle app launch (supports file:// and custom URL schemes)
    // PWA mode: Always open in external browser (Safari)
    function handleAppLaunch(url) {
        if (url.startsWith('file://')) {
            // For local apps, create hidden iframe to trigger app open
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = url;
            document.body.appendChild(iframe);
            setTimeout(() => iframe.remove(), 1000);
        } else {
            // Open in external browser (Safari) - works in PWA mode
            window.location.href = url;
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
        const gradient = generateGradient(el.dataset.color);
        body.style.setProperty('--hover-gradient', gradient);
        body.classList.add('has-background');
        
        // Update title with app name
        const appName = el.querySelector('.icon-name').textContent;
        titleElement.textContent = appName;
        
        // Clear keyboard focus when hovering with mouse
        icons.forEach(icon => icon.classList.remove('keyboard-focused'));
    }    function handleIconLeave() {
        setTimeout(() => {
            if (!document.querySelector('.icon-link:hover')) {
                body.classList.remove('has-background');
                // Clear keyboard focus when mouse leaves and there's no hover
                icons.forEach(icon => icon.classList.remove('keyboard-focused'));
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
    let icons = [];    function focusIcon(index) {
        // Remove focus from all icons
        icons.forEach(icon => icon.classList.remove('keyboard-focused'));
        
        // Add focus to current icon
        if (icons[index]) {
            icons[index].classList.add('keyboard-focused');
            currentFocusIndex = index;
            
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
    
    // Adjust grid layout to fit all icons on desktop without scrolling
    function adjustGridForViewport() {
        if (window.innerWidth >= 1024 && icons.length > 0) {
            const containerHeight = iconGrid.clientHeight;
            const containerWidth = iconGrid.clientWidth;
            
            // Calculate optimal grid to fit all items
            const itemCount = icons.length;
            const aspectRatio = containerWidth / containerHeight;
            
            // Estimate optimal columns based on aspect ratio and item count
            let cols = Math.ceil(Math.sqrt(itemCount * aspectRatio));
            let rows = Math.ceil(itemCount / cols);
            
            // Ensure it fits in viewport
            while (rows > 4 && cols < 8) {
                cols++;
                rows = Math.ceil(itemCount / cols);
            }
            
            // Apply dynamic column sizing
            const minSize = Math.max(140, Math.floor(containerWidth / cols) - 40);
            iconGrid.style.gridTemplateColumns = `repeat(auto-fit, minmax(${minSize}px, 1fr))`;
        }
    }

    function handleKeyboard(e) {
        if (icons.length === 0) return;

        const cols = getGridColumns();
        const maxIndex = icons.length - 1;

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
    async function init() {
        const config = await loadConfig();
        
        setWallpaper(config.wallpaper);
        
        document.title = config.title;
        defaultTitle = config.title.split(' ')[0]; // Set default title
        titleElement.textContent = defaultTitle;
        
        config.apps.forEach((app, i) => {
            iconGrid.appendChild(createIcon(app, i));
        });
          // Setup keyboard navigation
        icons = Array.from(document.querySelectorAll('.icon-link'));
        if (icons.length > 0) {
            focusIcon(0); // Focus first icon by default
        }
        
        // Adjust grid layout for desktop
        adjustGridForViewport();
        
        document.addEventListener('keydown', handleKeyboard);
        
        // Setup search
        setupSearch();
        
        updateClock();
        setInterval(updateClock, 1000);
    }    // Help Overlay
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
    let filteredApps = [];    function setupSearch() {
        // Open search with / or Cmd+K
        document.addEventListener('keydown', (e) => {
            // Toggle help with ?
            if (e.key === '?' && !isSearchActive) {
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
            if (e.key === '/' || (e.metaKey && e.key === 'k') || (e.ctrlKey && e.key === 'k')) {
                e.preventDefault();
                openSearch();
            }
              // Close search with ESC
            if (e.key === 'Escape' && isSearchActive) {
                closeSearch();
            }
            
            // Number shortcuts (1-9, 0) when search is NOT active
            if (!isSearchActive && !isHelpActive) {
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
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            adjustGridForViewport();
        }, 250);
    });


    init();
});