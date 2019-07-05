"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
function setTheme(newTheme) {
    let theme = newTheme || localStorage.USER_THEME || localStorage.OS_THEME;
    if (theme !== 'dark' && theme !== 'light') {
        theme = 'light';
    }
    document.documentElement.setAttribute('data-theme', theme);
    if (newTheme) {
        localStorage.USER_THEME = theme;
    }
}
exports.setTheme = setTheme;
function handleOSTheme() {
    window.__setTheme = setTheme;
    if (process.platform === 'darwin') {
        const { systemPreferences } = electron_1.remote;
        const setOSTheme = () => {
            localStorage.OS_THEME = systemPreferences.isDarkMode() ? 'dark' : 'light';
        };
        systemPreferences.subscribeNotification('AppleInterfaceThemeChangedNotification', () => {
            setOSTheme();
            setTheme();
        });
        setOSTheme();
    }
}
exports.handleOSTheme = handleOSTheme;
