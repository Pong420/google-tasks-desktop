"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const theme_1 = require("./theme");
process.once('loaded', () => {
    theme_1.handleOSTheme();
});
window.__setAccentColor = newColor => {
    const color = newColor || localStorage.ACCENT_COLOR || 'blue';
    document.documentElement.setAttribute('data-accent-color', color);
    if (newColor) {
        localStorage.ACCENT_COLOR = color;
    }
};
