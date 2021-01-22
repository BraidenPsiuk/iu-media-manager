const { ipcRenderer, clipboard } = require("electron");

window.ipcRenderer = ipcRenderer;
window.clipboard = clipboard;