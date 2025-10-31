# 📺 Media Launcher


> Apple TV-inspired PWA media launcher for macOS. Install it as a standalone app in your Dock.


![Status](https://img.shields.io/badge/Status-Ready-green) ![PWA](https://img.shields.io/badge/PWA-Enabled-blue) ![Platform](https://img.shields.io/badge/Platform-macOS-blue)


## 🎯 What is this?


A beautiful, keyboard-navigable launcher for your favorite streaming services and apps. Works as a Progressive Web App (PWA) - install it once, launch from Dock like a native app.


**Key Features:**
- 🎨 **Apple TV-style UI** with smooth animations and hover effects
- ⌨️ **Full keyboard navigation** (arrows, number shortcuts 0-9, search)
- 🔍 **Spotlight-style search** (`/` or `Cmd+K`)
- 📱 **PWA support** - install to Dock, works offline
- 🌐 **Custom URL schemes** - supports `plex://`, `stremio://`, `music://`, etc.
- 🎭 **Dynamic gradients** - generated from app colors
- 🖱️ **Mouse + keyboard harmony** - no conflicts between navigation modes


## 🚀 Deploy


### Option 1: GitHub Pages (Recommended)
```bash
# Clone or download this repo
git clone https://github.com/yourusername/media-launcher.git
cd media-launcher


# Edit config.json with your apps
# Push to GitHub and enable Pages in Settings → Pages
```


### Option 2: Local Server
```bash
# Using Python
python -m http.server 8080


# Using Node.js
npx serve


# Using PHP
php -S localhost:8080
```


Then open `http://localhost:8080` in Safari.


### Install as PWA (Safari only)
1. Open the page in Safari
2. Click **Share** → **Add to Dock**
3. Done! Launch from Dock 🎉


## ⚙️ Customize


### 1. Add/Edit Apps
Edit `config.json`:
```json
{
  "title": "Media Launcher",
  "wallpaper": "images/wallpaper.jpg",
  "apps": [
    {
      "name": "YouTube",
      "url": "https://www.youtube.com",
      "icon": "images/youtube.png",
      "color": "#FF0000"
    }
  ]
}
```


**Fields:**
- `name` - Display name
- `url` - Website URL or custom scheme (`plex://`, `music://`, etc.)
- `icon` - Path to icon image (PNG/SVG, 512x512+ recommended)
- `color` - Brand color in hex (for gradients)


### 2. Change Wallpaper
Replace `images/wallpaper.jpg` or update path in `config.json`:
```json
"wallpaper": "images/your-wallpaper.jpg"
```
Recommended: 1920x1080 or higher.


### 3. Generate Icons
Open `icon-generator.html` in browser to create PWA icons from emoji or images.


Or use your own:
- `images/icon-192.png` (192x192)
- `images/icon-512.png` (512x512)


### 4. Popular Brand Colors
```
YouTube:  #FF0000    Netflix:  #E50914    Twitch:   #9146FF
Spotify:  #1DB954    Disney+:  #113CCF    Prime:    #00A8E1
Plex:     #E5A00D    Stremio:  #113CCF    Apple TV: #2c302d
```


## ⌨️ Keyboard Shortcuts


| Shortcut | Action |
|----------|--------|
| `←` `→` `↑` `↓` | Navigate icons |
| `Enter` / `Space` | Open selected app |
| `1`-`9`, `0` | Quick launch (first 10 apps) |
| `/` or `Cmd+K` | Open search |
| `?` | Show help overlay |
| `ESC` | Clear selection / Close |


## 📁 Project Structure
```
media-launcher/
├── index.html              # Main HTML
├── style.css               # Styles
├── script.js               # JavaScript
├── config.json             # App configuration
├── manifest.json           # PWA manifest
├── service-worker.js       # Offline support
├── icon-generator.html     # Icon generator tool
└── images/                 # Icons & wallpaper
    ├── icon-192.png
    ├── icon-512.png
    ├── wallpaper.jpg
    └── *.png / *.svg       # App icons
```


## 🛠️ Tech Stack
- Vanilla JavaScript (no frameworks)
- CSS3 (custom properties, animations, backdrop-filter)
- Progressive Web App (Service Worker, Manifest)
- San Francisco font (Apple's system font)


## 📝 Requirements
- **HTTP server** (GitHub Pages, local server, etc.)
- **Safari** for PWA installation on macOS
- **macOS** for best experience (custom URL schemes)


---


**Made with ❤️ for macOS** • [Report Issues](https://github.com/yourusername/media-launcher/issues)