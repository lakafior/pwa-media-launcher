# 📺 Media Launcher

> Apple TV-inspired PWA media launcher with direct app search. Better than Apple TV.

![Status](https://img.shields.io/badge/Status-Ready-green) ![PWA](https://img.shields.io/badge/PWA-Enabled-blue) ![Platform](https://img.shields.io/badge/Platform-macOS-blue)

<img width="1470" height="814" alt="image" src="https://github.com/user-attachments/assets/23781d83-0f54-4a64-a7ac-72b92f9dabea" />

## ✨ Features

**Navigation:**
- 🎨 Apple TV-style UI with smooth animations
- ⌨️ Full keyboard navigation (arrows, 1-9/0 shortcuts)
- 🔍 **Quick Search** - search directly in apps (YouTube, Twitch, Plex, etc.)
- 📍 Spotlight search (`/`) - find and launch apps
- 🖱️ Mouse + keyboard harmony

**Configuration:**
- 💾 Export/Import with Base64 icons - portable, no separate files needed
- 🔄 Reset to default config from GitHub
- 💿 localStorage caching for speed
- 🌐 Custom URL schemes support (`plex://`, `stremio://`, etc.)

**Installation:**
- 📱 PWA - install to Dock, works offline
- 🎭 Dynamic gradients from app colors

## 🚀 Quick Start

```bash
git clone https://github.com/lakafior/pwa-media-launcher.git
cd pwa-media-launcher

# Edit config.json with your apps
# Deploy to GitHub Pages or run locally:
npx serve
```

**Install as PWA:**
1. Open in Safari
2. Share → **Add to Dock**
3. Launch from Dock 🎉

## 🔍 Quick Search

<img width="615" height="480" alt="image" src="https://github.com/user-attachments/assets/550ae979-b82b-445f-b7cc-b36f1e2fb7e5" />

Search directly in your apps from the header bar:

**With prefix:**
- `y inception` → Search "inception" in YouTube
- `t summit1g` → Search "summit1g" in Twitch  
- `k xqc` → Search in Kick
- `o breaking bad` → Search in Omni
- `p avatar` → Search in Plex
- `s interstellar` → Search in Stremio
- `d movies` → Search in DMM

**Without prefix:**
- `inception` → Shows dropdown of all searchable apps
- Use ↑↓ arrows to select, Enter to search

**Visual hints:** Search keys appear in bottom-right corner on hover (Y, T, K, etc.)

## ⚙️ Configuration

### config.json Structure

```json
{
  "title": "Media Launcher",
  "wallpaper": "images/wallpaper.jpg",
  "apps": [
    {
      "name": "YouTube",
      "url": "https://www.youtube.com",
      "icon": "images/youtube.png",
      "color": "#FF0000",
      "searchUrl": "https://www.youtube.com/results?search_query=%s",
      "searchKey": "y"
    }
  ]
}
```

**Fields:**
- `name` - Display name
- `url` - Launch URL (supports custom schemes)
- `icon` - Icon path (PNG/SVG, 512x512+)
- `color` - Hex color for gradients
- `searchUrl` - Search URL template (`%s` = query) *(optional)*
- `searchKey` - Single letter for quick search *(optional)*

### Export/Import

<img width="608" height="700" alt="image" src="https://github.com/user-attachments/assets/bef38ac2-c516-4d77-96d6-a8f5dcdbd2d5" />

**Export:**
1. ⚙️ Settings → 💾 Export Configuration
2. Downloads JSON with icons as Base64
3. Share between devices or backup

**Import:**
1. ⚙️ Settings → 📥 Import Configuration
2. Select exported JSON
3. Page reloads with new config

**Reset:**
- ⚙️ Settings → 🔄 Reset to Default
- Clears localStorage, loads from GitHub

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `←` `→` `↑` `↓` | Navigate icons |
| `Enter` / `Space` | Launch app |
| `1`-`9`, `0` | Quick launch (first 10 apps) |
| `/` or `Cmd+K` | Search apps (Spotlight) |
| `?` | Help overlay |
| `ESC` | Clear / Close |

**Quick Search shortcuts:** Type search key + space + query (e.g., `y cats`)

## 🎨 Popular Brand Colors

```
YouTube: #FF0000  Twitch: #9146FF  Kick: #53FC18  Netflix: #E50914
Plex: #E5A00D  Stremio: #113CCF  Spotify: #1DB954  Prime: #00A8E1
Apple TV: #2c302d  Disney+: #113CCF  Omni: #DC08A4
```

## 📁 Project Structure

```
├── index.html              # Main app
├── style.css               # Styles
├── script.js               # Logic
├── config.json             # App configuration
├── manifest.json           # PWA manifest
├── service-worker.js       # Offline support
├── icon-generator.html     # Emoji → icon tool
└── images/                 # Icons & wallpaper
```

## 🛠️ Tech Stack

- Vanilla JavaScript (no frameworks)
- CSS3 (backdrop-filter, animations, custom properties)
- Progressive Web App
- localStorage API

## 📝 Requirements

- HTTP server (GitHub Pages, local, etc.)
- Safari for PWA on macOS
- macOS for custom URL schemes

---

**Made with ❤️ for macOS**


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


### 4. Export/Import Configuration 💾

**NEW!** No need to manually edit `config.json` or manage icon files anymore!

**Export:**
1. Click ⚙️ Settings button (top right)
2. Click "💾 Export Configuration"
3. Download includes all apps + icons as Base64
4. Share file between devices or keep as backup

**Import:**
1. Click ⚙️ Settings → "📥 Import Configuration"  
2. Select your exported `.json` file
3. Done! Everything restored including icons

📖 **See [EXPORT-IMPORT-GUIDE.md](./EXPORT-IMPORT-GUIDE.md) for detailed instructions**


### 5. Popular Brand Colors
```
YouTube:  #FF0000    Netflix:  #E50914    Twitch:   #9146FF
Spotify:  #1DB954    Disney+:  #113CCF    Prime:    #00A8E1
Plex:     #E5A00D    Stremio:  #113CCF    Apple TV: #2c302d
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
