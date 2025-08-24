// Main Application JavaScript - Financeiro Inteligente by João Layon
// Global application initialization and utilities

// Application namespace
window.FinanceiroInteligente = window.FinanceiroInteligente || {};

// Application configuration
const APP_CONFIG = {
    name: 'Financeiro Inteligente',
    version: '1.0.0',
    author: 'João Layon',
    apiTimeout: 30000,
    autoSaveInterval: 30000,
    notificationDuration: 5000,
    animationDuration: 300
};

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApplication();
});

// Main application initialization
function initializeApplication() {
    console.log(`Initializing ${APP_CONFIG.name} v${APP_CONFIG.version}`);
    
    // Core initialization
    initializeGlobalFeatures();
    initializeNavigation();
    initializeTheme();
    initializeMobileOptimizations();
    initializeAccessibility();
    initializePerformanceMonitoring();
    
    // UI enhancements
    setupGlobalEventHandlers();
    setupFormEnhancements();
    setupLoadingStates();
    setupTooltips();
    setupModals();
    
    // Application features
    initializeNotificationSystem();
    initializeShortcuts();
    initializeOfflineSupport();
    setupAnalytics();
    
    console.log('Application initialized successfully');
}

// Initialize global features
function initializeGlobalFeatures() {
    // Setup global utilities
    setupCurrencyFormatting();
    setupDateFormatting();
    setupValidationHelpers();
    setupStorageHelpers();
    
    // Setup error handling
    setupGlobalErrorHandling();
    
    // Setup performance optimization
    setupLazyLoading();
    setupImageOptimization();
}

// Initialize navigation enhancements
function initializeNavigation() {
    setupActiveNavigation();
    setupMobileNavigation();
    setupBreadcrumbs();
    setupBackButton();
}

// Setup active navigation highlighting
function setupActiveNavigation() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && currentPath.includes(href) && href !== '/') {
            link.classList.add('active', 'bg-primary', 'text-white');
            link.classList.remove('text-gray-700');
        }
    });
}

// Setup mobile navigation
function setupMobileNavigation() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    
    if (mobileMenuButton && mobileMenu) {
        // Open menu
        mobileMenuButton.addEventListener('click', function() {
            openMobileMenu();
        });
        
        // Close menu button
        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', function() {
                closeMobileMenu();
            });
        }
        
        // Close menu when clicking overlay
        if (mobileMenuOverlay) {
            mobileMenuOverlay.addEventListener('click', function() {
                closeMobileMenu();
            });
        }
        
        // Close menu when clicking nav links
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                closeMobileMenu();
            });
        });
        
        // Close menu with escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && mobileMenu.classList.contains('show')) {
                closeMobileMenu();
            }
        });
        
        // Highlight active navigation
        highlightActiveNavigation();
    }
}

function openMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    
    if (mobileMenu && mobileMenuButton) {
        mobileMenu.classList.remove('hidden');
        mobileMenu.classList.add('show');
        document.body.classList.add('mobile-menu-open');
        
        // Change button icon
        mobileMenuButton.innerHTML = '<i class="bi bi-x text-xl"></i>';
        
        // Animate menu panel
        setTimeout(() => {
            const panel = mobileMenu.querySelector('.max-w-xs');
            if (panel) {
                panel.style.transform = 'translateX(0)';
            }
        }, 10);
    }
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    
    if (mobileMenu && mobileMenuButton) {
        const panel = mobileMenu.querySelector('.max-w-xs');
        if (panel) {
            panel.style.transform = 'translateX(100%)';
        }
        
        setTimeout(() => {
            mobileMenu.classList.remove('show');
            mobileMenu.classList.add('hidden');
            document.body.classList.remove('mobile-menu-open');
        }, 300);
        
        // Change button icon back
        mobileMenuButton.innerHTML = '<i class="bi bi-list text-xl"></i>';
    }
}

function highlightActiveNavigation() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && (currentPath === href || (href !== '/' && currentPath.startsWith(href)))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Setup breadcrumbs
function setupBreadcrumbs() {
    const breadcrumbContainer = document.getElementById('breadcrumbs');
    if (!breadcrumbContainer) return;
    
    const path = window.location.pathname;
    const segments = path.split('/').filter(segment => segment);
    
    let breadcrumbs = '<a href="/" class="text-primary hover:text-primary-dark">Início</a>';
    
    let currentPath = '';
    segments.forEach((segment, index) => {
        currentPath += '/' + segment;
        const isLast = index === segments.length - 1;
        const segmentName = formatBreadcrumbName(segment);
        
        if (isLast) {
            breadcrumbs += ` <i class="bi bi-chevron-right mx-2 text-gray-400"></i> <span class="text-gray-600">${segmentName}</span>`;
        } else {
            breadcrumbs += ` <i class="bi bi-chevron-right mx-2 text-gray-400"></i> <a href="${currentPath}" class="text-primary hover:text-primary-dark">${segmentName}</a>`;
        }
    });
    
    breadcrumbContainer.innerHTML = breadcrumbs;
}

// Format breadcrumb names
function formatBreadcrumbName(segment) {
    const nameMap = {
        'dashboard': 'Dashboard',
        'financial': 'Financeiro',
        'reports': 'Relatórios',
        'settings': 'Configurações',
        'subscription': 'Assinatura',
        'cash-flow': 'Fluxo de Caixa',
        'accounts': 'Contas',
        'auth': 'Autenticação',
        'login': 'Login',
        'register': 'Cadastro'
    };
    
    return nameMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
}

// Initialize theme management
function initializeTheme() {
    loadSavedTheme();
    setupThemeToggle();
    setupSystemThemeDetection();
}

// Load saved theme
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('financeiro-theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        // Use system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark ? 'dark' : 'light');
    }
}

// Apply theme
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('financeiro-theme', theme);
    
    // Update theme toggle button if exists
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = theme === 'dark' ? 'bi bi-sun' : 'bi bi-moon';
        }
    }
}

// Setup theme toggle
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
            
            showNotification(`Tema alterado para ${newTheme === 'dark' ? 'escuro' : 'claro'}`, 'info');
        });
    }
}

// Setup system theme detection
function setupSystemThemeDetection() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addListener(function(event) {
        if (!localStorage.getItem('financeiro-theme')) {
            applyTheme(event.matches ? 'dark' : 'light');
        }
    });
}

// Initialize mobile optimizations
function initializeMobileOptimizations() {
    setupTouchGestures();
    setupMobileViewport();
    setupMobileScrolling();
    setupMobileKeyboard();
}

// Setup touch gestures
function setupTouchGestures() {
    let touchStartX = 0;
    let touchStartY = 0;
    
    document.addEventListener('touchstart', function(event) {
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
    });
    
    document.addEventListener('touchend', function(event) {
        if (!touchStartX || !touchStartY) return;
        
        const touchEndX = event.changedTouches[0].clientX;
        const touchEndY = event.changedTouches[0].clientY;
        
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        // Horizontal swipe
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
                handleSwipeRight();
            } else {
                handleSwipeLeft();
            }
        }
        
        touchStartX = 0;
        touchStartY = 0;
    });
}

// Handle swipe gestures
function handleSwipeRight() {
    // Navigate back if possible
    if (window.history.length > 1) {
        window.history.back();
    }
}

function handleSwipeLeft() {
    // Open mobile menu if exists
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    if (mobileMenuButton) {
        mobileMenuButton.click();
    }
}

// Setup mobile viewport
function setupMobileViewport() {
    // Prevent zoom on input focus for iOS
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            if (window.innerWidth < 768) {
                const viewport = document.querySelector('meta[name="viewport"]');
                if (viewport) {
                    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
                }
            }
        });
        
        input.addEventListener('blur', function() {
            if (window.innerWidth < 768) {
                const viewport = document.querySelector('meta[name="viewport"]');
                if (viewport) {
                    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
                }
            }
        });
    });
}

// Initialize accessibility features
function initializeAccessibility() {
    setupKeyboardNavigation();
    setupFocusManagement();
    setupScreenReaderSupport();
    setupHighContrastMode();
}

// Setup keyboard navigation
function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(event) {
        // Tab navigation enhancement
        if (event.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
        
        // Escape key handling
        if (event.key === 'Escape') {
            closeAllModals();
            clearAllDropdowns();
        }
        
        // Arrow key navigation for menus
        if (event.target.closest('.dropdown-menu')) {
            handleDropdownNavigation(event);
        }
    });
    
    // Remove keyboard navigation class on mouse use
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
}

// Setup global event handlers
function setupGlobalEventHandlers() {
    // Form submission handlers
    setupFormHandlers();
    
    // Click handlers
    setupClickHandlers();
    
    // Scroll handlers
    setupScrollHandlers();
    
    // Resize handlers
    setupResizeHandlers();
    
    // Before unload handlers
    setupBeforeUnloadHandlers();
}

// Setup form handlers
function setupFormHandlers() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Prevent double submission
        form.addEventListener('submit', function(event) {
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton && submitButton.hasAttribute('data-submitting')) {
                event.preventDefault();
                return false;
            }
            
            if (submitButton) {
                submitButton.setAttribute('data-submitting', 'true');
                submitButton.disabled = true;
                
                const originalText = submitButton.textContent;
                submitButton.innerHTML = '<i class="bi bi-spinner-border animate-spin mr-2"></i>Processando...';
                
                // Re-enable after delay (in case of page redirect failure)
                setTimeout(() => {
                    submitButton.removeAttribute('data-submitting');
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                }, 10000);
            }
        });
        
        // Auto-save functionality
        if (form.hasAttribute('data-auto-save')) {
            setupAutoSave(form);
        }
    });
}

// Setup click handlers
function setupClickHandlers() {
    document.addEventListener('click', function(event) {
        // Handle external links
        if (event.target.matches('a[href^="http"]')) {
            event.target.setAttribute('target', '_blank');
            event.target.setAttribute('rel', 'noopener noreferrer');
        }
        
        // Handle confirmation dialogs
        if (event.target.matches('[data-confirm]')) {
            const message = event.target.getAttribute('data-confirm');
            if (!confirm(message)) {
                event.preventDefault();
                return false;
            }
        }
        
        // Handle dropdown toggles
        if (event.target.matches('.dropdown-toggle')) {
            toggleDropdown(event.target);
        }
        
        // Close dropdowns when clicking outside
        if (!event.target.closest('.dropdown')) {
            closeAllDropdowns();
        }
    });
}

// Setup loading states
function setupLoadingStates() {
    const loadingElements = document.querySelectorAll('[data-loading]');
    
    loadingElements.forEach(element => {
        element.addEventListener('click', function() {
            showLoadingState(this);
        });
    });
}

// Show loading state
function showLoadingState(element) {
    const originalContent = element.innerHTML;
    element.setAttribute('data-original-content', originalContent);
    element.innerHTML = '<i class="bi bi-spinner-border animate-spin"></i>';
    element.disabled = true;
    
    // Restore after timeout (fallback)
    setTimeout(() => {
        restoreLoadingState(element);
    }, 30000);
}

// Restore loading state
function restoreLoadingState(element) {
    const originalContent = element.getAttribute('data-original-content');
    if (originalContent) {
        element.innerHTML = originalContent;
        element.removeAttribute('data-original-content');
    }
    element.disabled = false;
}

// Setup tooltips
function setupTooltips() {
    const tooltipElements = document.querySelectorAll('[title], [data-tooltip]');
    
    tooltipElements.forEach(element => {
        const tooltipText = element.getAttribute('data-tooltip') || element.getAttribute('title');
        if (!tooltipText) return;
        
        // Remove default title to prevent browser tooltip
        element.removeAttribute('title');
        
        element.addEventListener('mouseenter', function(event) {
            showTooltip(event.target, tooltipText);
        });
        
        element.addEventListener('mouseleave', function() {
            hideTooltip();
        });
        
        element.addEventListener('focus', function(event) {
            showTooltip(event.target, tooltipText);
        });
        
        element.addEventListener('blur', function() {
            hideTooltip();
        });
    });
}

// Show tooltip
function showTooltip(element, text) {
    hideTooltip(); // Hide any existing tooltip
    
    const tooltip = document.createElement('div');
    tooltip.id = 'global-tooltip';
    tooltip.className = 'absolute bg-gray-800 text-white px-2 py-1 rounded text-sm z-50 pointer-events-none';
    tooltip.textContent = text;
    
    document.body.appendChild(tooltip);
    
    // Position tooltip
    const rect = element.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
    let top = rect.top - tooltipRect.height - 5;
    
    // Adjust if tooltip goes off screen
    if (left < 5) left = 5;
    if (left + tooltipRect.width > window.innerWidth - 5) {
        left = window.innerWidth - tooltipRect.width - 5;
    }
    if (top < 5) {
        top = rect.bottom + 5;
    }
    
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
}

// Hide tooltip
function hideTooltip() {
    const tooltip = document.getElementById('global-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// Setup modals
function setupModals() {
    const modalTriggers = document.querySelectorAll('[data-modal]');
    
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(event) {
            event.preventDefault();
            const modalId = this.getAttribute('data-modal');
            openModal(modalId);
        });
    });
    
    // Close modal on backdrop click
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal-backdrop')) {
            closeModal(event.target.closest('.modal'));
        }
    });
    
    // Close modal on close button click
    document.addEventListener('click', function(event) {
        if (event.target.matches('.modal-close')) {
            closeModal(event.target.closest('.modal'));
        }
    });
}

// Open modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    modal.classList.add('show');
    modal.style.display = 'flex';
    document.body.classList.add('modal-open');
    
    // Focus first focusable element
    const focusableElement = modal.querySelector('input, button, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusableElement) {
        focusableElement.focus();
    }
}

// Close modal
function closeModal(modal) {
    if (!modal) return;
    
    modal.classList.remove('show');
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
}

// Close all modals
function closeAllModals() {
    const modals = document.querySelectorAll('.modal.show');
    modals.forEach(modal => closeModal(modal));
}

// Initialize notification system
function initializeNotificationSystem() {
    // Create notification container if it doesn't exist
    if (!document.getElementById('notification-container')) {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'fixed top-4 right-4 z-50 space-y-2';
        document.body.appendChild(container);
    }
}

// Show notification (enhanced version)
function showNotification(message, type = 'info', duration = null) {
    const container = document.getElementById('notification-container');
    if (!container) return;
    
    const notification = document.createElement('div');
    const notificationId = 'notification-' + Date.now();
    notification.id = notificationId;
    notification.className = `notification transform translate-x-full transition-transform duration-300 max-w-sm bg-white border-l-4 rounded-lg shadow-lg p-4 ${getNotificationStyles(type)}`;
    
    const icon = getNotificationIcon(type);
    notification.innerHTML = `
        <div class="flex items-start">
            <div class="flex-shrink-0">
                <i class="bi ${icon} text-lg"></i>
            </div>
            <div class="ml-3 flex-1">
                <p class="text-sm font-medium">${message}</p>
            </div>
            <div class="ml-4">
                <button class="text-gray-400 hover:text-gray-600" onclick="hideNotification('${notificationId}')">
                    <i class="bi bi-x"></i>
                </button>
            </div>
        </div>
    `;
    
    container.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 10);
    
    // Auto-hide
    const hideDelay = duration || APP_CONFIG.notificationDuration;
    setTimeout(() => {
        hideNotification(notificationId);
    }, hideDelay);
    
    return notificationId;
}

// Hide notification
function hideNotification(notificationId) {
    const notification = document.getElementById(notificationId);
    if (!notification) return;
    
    notification.classList.add('translate-x-full');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Get notification styles
function getNotificationStyles(type) {
    const styles = {
        'success': 'border-green-400 text-green-800',
        'error': 'border-red-400 text-red-800',
        'warning': 'border-yellow-400 text-yellow-800',
        'info': 'border-blue-400 text-blue-800'
    };
    return styles[type] || styles['info'];
}

// Get notification icon
function getNotificationIcon(type) {
    const icons = {
        'success': 'bi-check-circle-fill',
        'error': 'bi-exclamation-circle-fill',
        'warning': 'bi-exclamation-triangle-fill',
        'info': 'bi-info-circle-fill'
    };
    return icons[type] || icons['info'];
}

// Currency formatting utility
function setupCurrencyFormatting() {
    window.formatCurrency = function(value, currency = 'BRL', locale = 'pt-BR') {
        if (typeof value !== 'number') {
            value = parseFloat(value) || 0;
        }
        
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };
    
    // Auto-format currency inputs
    document.addEventListener('input', function(event) {
        if (event.target.matches('input[data-currency]')) {
            formatCurrencyInput(event.target);
        }
    });
}

// Format currency input
function formatCurrencyInput(input) {
    let value = input.value.replace(/\D/g, '');
    if (value === '') {
        input.value = '';
        return;
    }
    
    const numericValue = parseInt(value) / 100;
    input.value = numericValue.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Date formatting utility
function setupDateFormatting() {
    window.formatDate = function(date, format = 'dd/MM/yyyy', locale = 'pt-BR') {
        if (typeof date === 'string') {
            date = new Date(date);
        }
        
        if (!(date instanceof Date) || isNaN(date)) {
            return '';
        }
        
        return date.toLocaleDateString(locale);
    };
    
    window.formatDateTime = function(date, locale = 'pt-BR') {
        if (typeof date === 'string') {
            date = new Date(date);
        }
        
        if (!(date instanceof Date) || isNaN(date)) {
            return '';
        }
        
        return date.toLocaleString(locale);
    };
}

// Setup validation helpers
function setupValidationHelpers() {
    window.validateEmail = function(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    
    window.validateCPF = function(cpf) {
        cpf = cpf.replace(/\D/g, '');
        
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
            return false;
        }
        
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf.charAt(i)) * (10 - i);
        }
        
        let remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.charAt(9))) return false;
        
        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cpf.charAt(i)) * (11 - i);
        }
        
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        
        return remainder === parseInt(cpf.charAt(10));
    };
    
    window.validateCNPJ = function(cnpj) {
        cnpj = cnpj.replace(/\D/g, '');
        
        if (cnpj.length !== 14) return false;
        
        const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        
        let sum1 = 0;
        for (let i = 0; i < 12; i++) {
            sum1 += parseInt(cnpj.charAt(i)) * weights1[i];
        }
        
        let digit1 = sum1 % 11 < 2 ? 0 : 11 - (sum1 % 11);
        if (digit1 !== parseInt(cnpj.charAt(12))) return false;
        
        let sum2 = 0;
        for (let i = 0; i < 13; i++) {
            sum2 += parseInt(cnpj.charAt(i)) * weights2[i];
        }
        
        let digit2 = sum2 % 11 < 2 ? 0 : 11 - (sum2 % 11);
        
        return digit2 === parseInt(cnpj.charAt(13));
    };
}

// Setup storage helpers
function setupStorageHelpers() {
    window.setStorage = function(key, value, type = 'local') {
        try {
            const storage = type === 'session' ? sessionStorage : localStorage;
            storage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Storage error:', error);
            return false;
        }
    };
    
    window.getStorage = function(key, defaultValue = null, type = 'local') {
        try {
            const storage = type === 'session' ? sessionStorage : localStorage;
            const item = storage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Storage error:', error);
            return defaultValue;
        }
    };
    
    window.removeStorage = function(key, type = 'local') {
        try {
            const storage = type === 'session' ? sessionStorage : localStorage;
            storage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Storage error:', error);
            return false;
        }
    };
}

// Setup global error handling
function setupGlobalErrorHandling() {
    window.addEventListener('error', function(event) {
        console.error('Global error:', event.error);
        
        // Show user-friendly error message
        showNotification('Ocorreu um erro inesperado. Tente novamente.', 'error');
        
        // Report error to analytics (if implemented)
        if (window.gtag) {
            window.gtag('event', 'exception', {
                description: event.error.message,
                fatal: false
            });
        }
    });
    
    window.addEventListener('unhandledrejection', function(event) {
        console.error('Unhandled promise rejection:', event.reason);
        
        // Show user-friendly error message
        showNotification('Ocorreu um erro de conexão. Verifique sua internet.', 'error');
    });
}

// Initialize shortcuts
function initializeShortcuts() {
    document.addEventListener('keydown', function(event) {
        // Only handle shortcuts when not in input fields
        if (event.target.matches('input, textarea, select')) {
            return;
        }
        
        // Ctrl/Cmd + K: Global search
        if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
            event.preventDefault();
            openGlobalSearch();
        }
        
        // Ctrl/Cmd + /: Show shortcuts help
        if ((event.ctrlKey || event.metaKey) && event.key === '/') {
            event.preventDefault();
            showShortcutsHelp();
        }
        
        // Alt + D: Go to dashboard
        if (event.altKey && event.key === 'd') {
            event.preventDefault();
            window.location.href = '/dashboard';
        }
        
        // Alt + F: Go to financial
        if (event.altKey && event.key === 'f') {
            event.preventDefault();
            window.location.href = '/financial/cash-flow';
        }
        
        // Alt + R: Go to reports
        if (event.altKey && event.key === 'r') {
            event.preventDefault();
            window.location.href = '/reports';
        }
    });
}

// Setup performance monitoring
function initializePerformanceMonitoring() {
    // Monitor page load time
    window.addEventListener('load', function() {
        const loadTime = performance.now();
        console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
        
        // Report to analytics if available
        if (window.gtag) {
            window.gtag('event', 'timing_complete', {
                name: 'page_load',
                value: Math.round(loadTime)
            });
        }
    });
    
    // Monitor long tasks
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver(function(list) {
            for (const entry of list.getEntries()) {
                if (entry.duration > 50) {
                    console.warn(`Long task detected: ${entry.duration}ms`);
                }
            }
        });
        
        observer.observe({ entryTypes: ['longtask'] });
    }
}

// Initialize offline support
function initializeOfflineSupport() {
    window.addEventListener('online', function() {
        showNotification('Conexão restaurada', 'success');
        document.body.classList.remove('offline');
    });
    
    window.addEventListener('offline', function() {
        showNotification('Você está offline. Algumas funcionalidades podem não estar disponíveis.', 'warning', 10000);
        document.body.classList.add('offline');
    });
    
    // Check initial connection status
    if (!navigator.onLine) {
        document.body.classList.add('offline');
    }
}

// Setup analytics
function setupAnalytics() {
    // Track page views
    trackPageView();
    
    // Track user interactions
    setupInteractionTracking();
}

// Track page view
function trackPageView() {
    const page = window.location.pathname;
    
    if (window.gtag) {
        window.gtag('config', 'GA_MEASUREMENT_ID', {
            page_path: page
        });
    }
    
    console.log(`Page view tracked: ${page}`);
}

// Setup interaction tracking
function setupInteractionTracking() {
    // Track button clicks
    document.addEventListener('click', function(event) {
        if (event.target.matches('button, .btn')) {
            const buttonText = event.target.textContent.trim();
            if (window.gtag && buttonText) {
                window.gtag('event', 'click', {
                    event_category: 'button',
                    event_label: buttonText
                });
            }
        }
    });
    
    // Track form submissions
    document.addEventListener('submit', function(event) {
        const form = event.target;
        const formId = form.id || form.className || 'unknown';
        
        if (window.gtag) {
            window.gtag('event', 'form_submit', {
                event_category: 'form',
                event_label: formId
            });
        }
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Setup auto-save
function setupAutoSave(form) {
    const inputs = form.querySelectorAll('input, select, textarea');
    const formId = form.id || 'auto-save-form';
    
    // Load saved data
    const savedData = getStorage(`auto-save-${formId}`);
    if (savedData) {
        Object.keys(savedData).forEach(key => {
            const input = form.querySelector(`[name="${key}"]`);
            if (input && input.type !== 'password') {
                input.value = savedData[key];
            }
        });
    }
    
    // Save data on input
    inputs.forEach(input => {
        input.addEventListener('input', debounce(() => {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Remove password fields
            Object.keys(data).forEach(key => {
                const input = form.querySelector(`[name="${key}"]`);
                if (input && input.type === 'password') {
                    delete data[key];
                }
            });
            
            setStorage(`auto-save-${formId}`, data);
            showAutoSaveIndicator();
        }, 1000));
    });
    
    // Clear saved data on successful submission
    form.addEventListener('submit', function() {
        removeStorage(`auto-save-${formId}`);
    });
}

// Show auto-save indicator
function showAutoSaveIndicator() {
    let indicator = document.getElementById('auto-save-indicator');
    
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'auto-save-indicator';
        indicator.className = 'fixed bottom-4 left-4 bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded-lg text-sm opacity-0 transition-opacity duration-300';
        indicator.innerHTML = '<i class="bi bi-check-circle mr-1"></i>Salvo automaticamente';
        document.body.appendChild(indicator);
    }
    
    indicator.style.opacity = '1';
    
    setTimeout(() => {
        indicator.style.opacity = '0';
    }, 2000);
}

// Dropdown functions
function toggleDropdown(trigger) {
    const dropdown = trigger.closest('.dropdown');
    const menu = dropdown.querySelector('.dropdown-menu');
    
    closeAllDropdowns();
    
    if (menu) {
        menu.classList.toggle('show');
    }
}

function closeAllDropdowns() {
    const openDropdowns = document.querySelectorAll('.dropdown-menu.show');
    openDropdowns.forEach(menu => {
        menu.classList.remove('show');
    });
}

function clearAllDropdowns() {
    closeAllDropdowns();
}

// Handle dropdown navigation
function handleDropdownNavigation(event) {
    const menu = event.target.closest('.dropdown-menu');
    const items = menu.querySelectorAll('a, button');
    const currentIndex = Array.from(items).indexOf(event.target);
    
    let nextIndex;
    
    switch (event.key) {
        case 'ArrowDown':
            event.preventDefault();
            nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
            items[nextIndex].focus();
            break;
        case 'ArrowUp':
            event.preventDefault();
            nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
            items[nextIndex].focus();
            break;
        case 'Enter':
        case ' ':
            event.preventDefault();
            event.target.click();
            break;
    }
}

// Global search function
function openGlobalSearch() {
    // Implementation would depend on search functionality
    console.log('Global search opened');
    showNotification('Busca global será implementada em breve', 'info');
}

// Show shortcuts help
function showShortcutsHelp() {
    const shortcuts = [
        { key: 'Ctrl/Cmd + K', description: 'Busca global' },
        { key: 'Ctrl/Cmd + /', description: 'Mostrar atalhos' },
        { key: 'Alt + D', description: 'Ir para Dashboard' },
        { key: 'Alt + F', description: 'Ir para Financeiro' },
        { key: 'Alt + R', description: 'Ir para Relatórios' },
        { key: 'Esc', description: 'Fechar modais/menus' }
    ];
    
    let shortcutsHtml = '<h3 class="font-semibold mb-3">Atalhos do Teclado</h3><ul class="space-y-2">';
    
    shortcuts.forEach(shortcut => {
        shortcutsHtml += `
            <li class="flex justify-between">
                <span class="font-mono text-sm bg-gray-100 px-2 py-1 rounded">${shortcut.key}</span>
                <span class="text-sm">${shortcut.description}</span>
            </li>
        `;
    });
    
    shortcutsHtml += '</ul>';
    
    // Create and show modal with shortcuts
    const modal = document.createElement('div');
    modal.className = 'modal fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            ${shortcutsHtml}
            <div class="mt-4 text-right">
                <button class="modal-close px-4 py-2 bg-primary text-white rounded-md">Fechar</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
    modal.classList.add('show');
    
    // Close on button click
    modal.querySelector('.modal-close').addEventListener('click', () => {
        closeModal(modal);
        modal.remove();
    });
    
    // Close on backdrop click
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal(modal);
            modal.remove();
        }
    });
}

// Setup lazy loading
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// Setup image optimization
function setupImageOptimization() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            // Replace with placeholder on error
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbSBuw6NvIGVuY29udHJhZGE8L3RleHQ+PC9zdmc+';
            this.alt = 'Imagem não encontrada';
        });
    });
}

// Setup scroll handlers
function setupScrollHandlers() {
    let ticking = false;
    
    function updateScrollPosition() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class to navbar
        const navbar = document.querySelector('nav');
        if (navbar) {
            if (scrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        
        // Show/hide back to top button
        const backToTop = document.getElementById('back-to-top');
        if (backToTop) {
            if (scrollTop > 300) {
                backToTop.classList.remove('hidden');
            } else {
                backToTop.classList.add('hidden');
            }
        }
        
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateScrollPosition);
            ticking = true;
        }
    });
    
    // Setup back to top button
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        backToTop.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// Setup resize handlers
function setupResizeHandlers() {
    let resizeTimeout;
    
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Update mobile navigation
            if (window.innerWidth > 768) {
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu) {
                    mobileMenu.classList.remove('show');
                }
            }
            
            // Update charts if they exist
            if (window.FinanceiroInteligente && window.FinanceiroInteligente.resizeCharts) {
                window.FinanceiroInteligente.resizeCharts();
            }
            
            // Update tooltips
            hideTooltip();
        }, 250);
    });
}

// Setup before unload handlers
function setupBeforeUnloadHandlers() {
    window.addEventListener('beforeunload', function(event) {
        // Check for unsaved forms
        const dirtyForms = document.querySelectorAll('form[data-dirty="true"]');
        
        if (dirtyForms.length > 0) {
            event.preventDefault();
            event.returnValue = 'Você tem alterações não salvas. Deseja realmente sair?';
            return event.returnValue;
        }
    });
    
    // Mark forms as dirty when modified
    document.addEventListener('input', function(event) {
        if (event.target.closest('form')) {
            const form = event.target.closest('form');
            form.setAttribute('data-dirty', 'true');
        }
    });
    
    // Mark forms as clean when submitted
    document.addEventListener('submit', function(event) {
        const form = event.target;
        form.removeAttribute('data-dirty');
    });
}

// Setup back button
function setupBackButton() {
    const backButton = document.getElementById('back-button');
    if (backButton) {
        backButton.addEventListener('click', function() {
            if (window.history.length > 1) {
                window.history.back();
            } else {
                window.location.href = '/dashboard';
            }
        });
    }
}

// Setup mobile scrolling
function setupMobileScrolling() {
    // Prevent body scroll when modal is open on mobile
    const originalStyle = window.getComputedStyle(document.body).overflow;
    
    document.addEventListener('click', function(event) {
        if (event.target.matches('[data-modal]')) {
            if (window.innerWidth < 768) {
                document.body.style.overflow = 'hidden';
            }
        }
    });
    
    // Restore scroll when modal closes
    document.addEventListener('click', function(event) {
        if (event.target.matches('.modal-close, .modal-backdrop')) {
            document.body.style.overflow = originalStyle;
        }
    });
}

// Setup mobile keyboard
function setupMobileKeyboard() {
    // Adjust viewport when keyboard opens/closes on mobile
    if (window.innerWidth < 768) {
        let initialViewportHeight = window.innerHeight;
        
        window.addEventListener('resize', function() {
            const currentHeight = window.innerHeight;
            const heightDifference = initialViewportHeight - currentHeight;
            
            if (heightDifference > 150) { // Keyboard is likely open
                document.body.classList.add('keyboard-open');
            } else {
                document.body.classList.remove('keyboard-open');
            }
        });
    }
}

// Setup focus management
function setupFocusManagement() {
    // Trap focus in modals
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Tab') {
            const activeModal = document.querySelector('.modal.show');
            if (activeModal) {
                trapFocus(event, activeModal);
            }
        }
    });
}

// Trap focus within element
function trapFocus(event, element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    if (event.shiftKey && document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
    } else if (!event.shiftKey && document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
    }
}

// Setup screen reader support
function setupScreenReaderSupport() {
    // Announce page changes
    const pageTitle = document.title;
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.id = 'page-announcement';
    document.body.appendChild(announcement);
    
    // Announce when page loads
    setTimeout(() => {
        announcement.textContent = `Página carregada: ${pageTitle}`;
    }, 1000);
}

// Setup high contrast mode
function setupHighContrastMode() {
    // Detect if user prefers high contrast
    if (window.matchMedia('(prefers-contrast: high)').matches) {
        document.body.classList.add('high-contrast');
    }
    
    // Listen for changes
    window.matchMedia('(prefers-contrast: high)').addEventListener('change', function(event) {
        if (event.matches) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }
    });
}

// Setup form enhancements
function setupFormEnhancements() {
    // Auto-focus first input in forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const firstInput = form.querySelector('input, select, textarea');
        if (firstInput && !firstInput.hasAttribute('readonly') && !firstInput.disabled) {
            firstInput.focus();
        }
    });
    
    // Real-time validation for forms
    const inputs = document.querySelectorAll('input[required], input[type="email"], input[type="tel"]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateInput(this);
        });
        
        input.addEventListener('input', function() {
            clearInputError(this);
        });
    });
    
    // Enhanced form submission
    const submitButtons = document.querySelectorAll('button[type="submit"]');
    submitButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            const form = this.closest('form');
            if (form && !validateForm(form)) {
                event.preventDefault();
                return false;
            }
        });
    });
}

// Validate individual input
function validateInput(input) {
    const value = input.value.trim();
    const isRequired = input.hasAttribute('required');
    const type = input.type;
    
    // Clear previous errors
    clearInputError(input);
    
    // Required field validation
    if (isRequired && !value) {
        showInputError(input, 'Este campo é obrigatório');
        return false;
    }
    
    // Email validation
    if (type === 'email' && value && !isValidEmail(value)) {
        showInputError(input, 'Digite um email válido');
        return false;
    }
    
    // Phone validation
    if (type === 'tel' && value && !isValidPhone(value)) {
        showInputError(input, 'Digite um telefone válido');
        return false;
    }
    
    return true;
}

// Validate entire form
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], input[type="email"], input[type="tel"]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateInput(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Show input error
function showInputError(input, message) {
    input.classList.add('border-red-500');
    
    // Remove existing error message
    const existingError = input.parentNode.querySelector('.input-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'input-error text-red-500 text-sm mt-1';
    errorDiv.textContent = message;
    input.parentNode.appendChild(errorDiv);
}

// Clear input error
function clearInputError(input) {
    input.classList.remove('border-red-500');
    const errorDiv = input.parentNode.querySelector('.input-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Simple email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Simple phone validation
function isValidPhone(phone) {
    const phoneRegex = /^[\d\s\-\(\)\+]{10,}$/;
    return phoneRegex.test(phone);
}

// Export the main functions to global scope
window.FinanceiroInteligente = Object.assign(window.FinanceiroInteligente || {}, {
    // Core functions
    showNotification,
    hideNotification,
    formatCurrency: window.formatCurrency,
    formatDate: window.formatDate,
    formatDateTime: window.formatDateTime,
    
    // Validation functions
    validateEmail: window.validateEmail,
    validateCPF: window.validateCPF,
    validateCNPJ: window.validateCNPJ,
    
    // Storage functions
    setStorage: window.setStorage,
    getStorage: window.getStorage,
    removeStorage: window.removeStorage,
    
    // UI functions
    openModal,
    closeModal,
    closeAllModals,
    showTooltip,
    hideTooltip,
    showLoadingState,
    restoreLoadingState,
    
    // Utility functions
    debounce,
    throttle,
    
    // Application info
    config: APP_CONFIG
});

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApplication);
} else {
    initializeApplication();
}

// Log successful initialization
console.log(`${APP_CONFIG.name} v${APP_CONFIG.version} - Desenvolvido por ${APP_CONFIG.author}`);
