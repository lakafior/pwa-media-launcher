# 📦 Export/Import Configuration Guide

## 🎯 Overview

Your Media Launcher now supports exporting and importing configurations with icons encoded as Base64. This means you can:

- ✅ Backup your entire setup in one file
- ✅ Share your configuration with other devices
- ✅ No need to manage separate icon files
- ✅ Everything works offline

## 🚀 How to Use

### Export Configuration

1. Click the **⚙️ Settings** button in the top right
2. Click **💾 Export Configuration**
3. Wait while icons are converted to Base64 (may take a few seconds)
4. Your configuration will download as a `.json` file

**Options:**
- ☑️ **Include icons as base64**: Recommended. Includes all icons in the file.
- ☐ Uncheck if you want a smaller file with just icon URLs.

### Import Configuration

1. Click the **⚙️ Settings** button
2. Click **📥 Import Configuration**
3. Select your exported `.json` file
4. The page will automatically reload with your new configuration

## 📄 Configuration File Format

Your exported JSON looks like this:

```json
{
  "title": "Media",
  "wallpaper": "data:image/jpeg;base64,...",
  "apps": [
    {
      "name": "Netflix",
      "icon": "data:image/png;base64,...",
      "url": "https://netflix.com",
      "color": "#E50914"
    }
  ],
  "_exported": {
    "date": "2025-11-02T...",
    "version": "1.0",
    "includesBase64Icons": true
  }
}
```

## 🔄 Workflow Examples

### Backup Before Changes
```
1. Export current config
2. Make changes
3. If something breaks, import the backup
```

### Share Setup Between Devices
```
1. Export from Device A
2. Transfer JSON file (email, cloud, USB)
3. Import on Device B
4. Done! Same setup everywhere
```

### Version Control
```
Export regularly with dates:
- media-launcher-config-2025-11-02.json
- media-launcher-config-2025-11-15.json
```

## 💾 Storage

Configuration is stored in:
- **Browser localStorage** (automatic)
- **Exported JSON files** (manual)

The app will always check localStorage first. If you want to reset to `config.json`, clear your browser's localStorage.

## ⚠️ Important Notes

### Base64 Icons
- **Pros**: Everything in one file, works offline, easy to share
- **Cons**: Larger file size (usually 2-5MB depending on icon count)
- **Tip**: Use compressed PNG icons to keep file size reasonable

### File Size
- 10 apps with icons: ~2MB
- 50 apps with icons: ~10MB
- Without base64: ~5KB

### Browser Storage
- Most browsers support localStorage up to 10MB
- Base64 icons are stored efficiently
- If you have 100+ apps, consider not using base64 for all

## 🛠️ Troubleshooting

### "Import failed!"
- Check if the JSON file is valid
- Make sure it contains the required fields (`apps`, `title`)
- Try exporting again from the source

### Icons not loading
- Base64 icons might be corrupted
- Try re-exporting from original device
- Check browser console for errors

### File too large
- Uncheck "Include icons as base64"
- Use icon URLs instead
- Compress your icon images before adding them

## 🎨 Advanced: Manual Editing

You can manually edit the exported JSON:

```json
{
  "apps": [
    {
      "name": "Custom App",
      "icon": "https://example.com/icon.png",  // Can use URL
      "icon": "data:image/png;base64,...",     // Or base64
      "icon": "images/local-icon.png",         // Or local path
      "url": "https://example.com",
      "color": "#FF0000"
    }
  ]
}
```

All three icon formats work!

## 📝 Best Practices

1. **Regular Backups**: Export weekly
2. **Naming Convention**: Use dates in filenames
3. **Cloud Storage**: Keep exports in cloud for safety
4. **Test Imports**: Always test on a backup device first
5. **Icon Quality**: Use high-quality icons (512x512 recommended)

## 🎉 That's It!

You now have a fully portable Media Launcher setup! No more manually copying files or managing image folders. Everything you need is in one JSON file.

---

**Happy Launching! 🚀**
