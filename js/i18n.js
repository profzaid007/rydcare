/**
 * Internationalization (i18n) - Multi-Language Support
 * Supports: English (EN), Tamil (TA), Hindi (HI)
 * Progressive Enhancement: Works without JS (defaults to English)
 */

// Get nested translation value from object using dot notation (e.g., "nav.home")
function getTranslation(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
}

// Update all elements with data-i18n attributes
function updateContent(translations) {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getTranslation(translations, key);
        
        if (translation) {
            // Update text content
            element.textContent = translation;
        }
    });
    
    // Update placeholder attributes
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        const translation = getTranslation(translations, key);
        
        if (translation) {
            element.placeholder = translation;
        }
    });
}

// Load language from JSON file
async function loadLanguage(lang) {
    try {
        const response = await fetch(`translations/${lang}.json`);
        const translations = await response.json();
        updateContent(translations);
        
        // Save preference
        localStorage.setItem('preferredLang', lang);
        
        // Update select dropdown
        const select = document.getElementById('lang-select');
        if (select) {
            select.value = lang;
        }
    } catch (error) {
        console.error(`Failed to load language: ${lang}`, error);
        // Fallback to English if load fails
        if (lang !== 'en') {
            loadLanguage('en');
        }
    }
}

// Initialize language switcher
document.addEventListener('DOMContentLoaded', () => {
    // Get saved preference or default to English
    const savedLang = localStorage.getItem('preferredLang') || 'en';
    loadLanguage(savedLang);
    
    // Listen for language changes
    const langSelect = document.getElementById('lang-select');
    if (langSelect) {
        langSelect.addEventListener('change', (e) => {
            loadLanguage(e.target.value);
        });
    }
});
