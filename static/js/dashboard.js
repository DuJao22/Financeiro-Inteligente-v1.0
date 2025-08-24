// Dashboard JavaScript - Financeiro Inteligente

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupRealtimeUpdates();
    initializeCharts();
    setupGamification();
});

// Dashboard initialization
function initializeDashboard() {
    console.log('Initializing Financeiro Inteligente Dashboard');
    
    // Setup tooltips
    setupTooltips();
    
    // Setup responsive handlers
    handleResponsiveElements();
    
    // Setup quick actions
    setupQuickActions();
    
    // Initialize notifications
    initializeNotifications();
}

// Setup tooltips for better UX
function setupTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(event) {
    const text = event.target.getAttribute('data-tooltip');
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip absolute bg-gray-800 text-white px-2 py-1 rounded text-sm z-50';
    tooltip.textContent = text;
    tooltip.id = 'tooltip';
    
    document.body.appendChild(tooltip);
    
    const rect = event.target.getBoundingClientRect();
    tooltip.style.left = rect.left + 'px';
    tooltip.style.top = (rect.top - 30) + 'px';
}

function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// Initialize charts
function initializeCharts() {
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not loaded, skipping chart initialization');
        return;
    }
    
    // Load chart data and create financial chart
    loadChartData();
}

// Load chart data via AJAX
function loadChartData() {
    fetch('/dashboard/chart-data')
        .then(response => response.json())
        .then(data => {
            createFinancialChart(data);
        })
        .catch(error => {
            console.error('Error loading chart data:', error);
            showNotification('Erro ao carregar gráficos', 'error');
        });
}

// Create the main financial chart
function createFinancialChart(data) {
    const ctx = document.getElementById('financialChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.months,
            datasets: [{
                label: 'Receitas',
                data: data.income,
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Despesas',
                data: data.expenses,
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        maxTicksLimit: 6,
                        font: {
                            size: 11
                        },
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 11
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 12,
                        boxWidth: 12,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + formatCurrency(context.parsed.y);
                        }
                    }
                }
            }
        }
    });
}

// Format currency values
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Setup gamification elements
function setupGamification() {
    animateProgressBars();
    setupLevelSystem();
    initializeBadges();
}

// Animate progress bars
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => {
        const width = bar.style.width || bar.getAttribute('data-width');
        if (width) {
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
                bar.style.transition = 'width 1s ease-in-out';
            }, 500);
        }
    });
}

// Setup level system
function setupLevelSystem() {
    const levelProgress = document.querySelector('.level-progress .level-progress-bar');
    if (levelProgress) {
        const progress = levelProgress.getAttribute('data-progress') || '0';
        levelProgress.style.width = '0%';
        setTimeout(() => {
            levelProgress.style.width = progress + '%';
        }, 1000);
    }
}

// Initialize badges system
function initializeBadges() {
    const badges = document.querySelectorAll('.badge');
    badges.forEach((badge, index) => {
        setTimeout(() => {
            badge.classList.add('animate-pulse');
            setTimeout(() => {
                badge.classList.remove('animate-pulse');
            }, 2000);
        }, index * 200);
    });
}

// Setup realtime updates
function setupRealtimeUpdates() {
    // Update time display
    updateTimeDisplay();
    setInterval(updateTimeDisplay, 60000); // Update every minute
    
    // Check for new notifications
    checkNotifications();
    setInterval(checkNotifications, 300000); // Check every 5 minutes
}

// Update time display
function updateTimeDisplay() {
    const timeElements = document.querySelectorAll('.time-display');
    const now = new Date();
    const timeString = now.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    timeElements.forEach(element => {
        element.textContent = timeString;
    });
}

// Check for notifications
function checkNotifications() {
    // This would typically make an API call to check for new notifications
    // For now, we'll simulate with random notifications
    if (Math.random() < 0.1) { // 10% chance
        const messages = [
            'Nova transação adicionada com sucesso!',
            'Lembrete: Você tem contas vencendo em 3 dias',
            'Seu relatório mensal está disponível',
            'Parabéns! Você atingiu sua meta de economia'
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        showNotification(randomMessage, 'info');
    }
}

// Handle responsive elements
function handleResponsiveElements() {
    window.addEventListener('resize', () => {
        adjustMobileLayout();
        resizeCharts();
    });
    
    // Initial adjustment
    adjustMobileLayout();
}

// Adjust layout for mobile devices
function adjustMobileLayout() {
    const isMobile = window.innerWidth < 768;
    const dashboardCards = document.querySelectorAll('.dashboard-card');
    
    dashboardCards.forEach(card => {
        if (isMobile) {
            card.classList.add('mobile-padding');
            card.classList.add('mobile-text-sm');
        } else {
            card.classList.remove('mobile-padding');
            card.classList.remove('mobile-text-sm');
        }
    });
}

// Resize charts on window resize
function resizeCharts() {
    if (typeof Chart !== 'undefined') {
        Chart.helpers.each(Chart.instances, function(instance) {
            instance.resize();
        });
    }
}

// Setup quick actions
function setupQuickActions() {
    const quickActionButtons = document.querySelectorAll('.quick-action');
    quickActionButtons.forEach(button => {
        button.addEventListener('click', handleQuickAction);
    });
}

// Handle quick action clicks
function handleQuickAction(event) {
    const action = event.target.getAttribute('data-action');
    
    switch (action) {
        case 'add-transaction':
            window.location.href = '/financial/add-transaction';
            break;
        case 'add-account':
            window.location.href = '/financial/add-account';
            break;
        case 'view-reports':
            window.location.href = '/reports';
            break;
        default:
            console.log('Unknown quick action:', action);
    }
}

// Initialize notifications system
function initializeNotifications() {
    // Create notification container if it doesn't exist
    if (!document.getElementById('notification-container')) {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'fixed top-4 right-4 z-50 space-y-2';
        document.body.appendChild(container);
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const container = document.getElementById('notification-container');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `notification max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg p-4 ${getNotificationClasses(type)}`;
    
    const icon = getNotificationIcon(type);
    notification.innerHTML = `
        <div class="flex items-center">
            <div class="flex-shrink-0">
                <i class="bi ${icon} text-lg"></i>
            </div>
            <div class="ml-3">
                <p class="text-sm font-medium">${message}</p>
            </div>
            <div class="ml-auto">
                <button class="text-gray-400 hover:text-gray-600" onclick="hideNotification(this)">
                    <i class="bi bi-x"></i>
                </button>
            </div>
        </div>
    `;
    
    container.appendChild(notification);
    
    // Show notification with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        hideNotification(notification.querySelector('button'));
    }, 5000);
}

// Get notification classes based on type
function getNotificationClasses(type) {
    const classes = {
        'success': 'border-green-200 text-green-800',
        'error': 'border-red-200 text-red-800',
        'warning': 'border-yellow-200 text-yellow-800',
        'info': 'border-blue-200 text-blue-800'
    };
    return classes[type] || classes['info'];
}

// Get notification icon based on type
function getNotificationIcon(type) {
    const icons = {
        'success': 'bi-check-circle',
        'error': 'bi-exclamation-circle',
        'warning': 'bi-exclamation-triangle',
        'info': 'bi-info-circle'
    };
    return icons[type] || icons['info'];
}

// Hide notification
function hideNotification(button) {
    const notification = button.closest('.notification');
    if (notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }
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

// Export functions for use in other scripts
window.FinanceiroInteligente = {
    showNotification,
    hideNotification,
    formatCurrency,
    initializeCharts,
    setupGamification
};
