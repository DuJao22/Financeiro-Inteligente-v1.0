// Financial Management JavaScript - Financeiro Inteligente

// Initialize financial features when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeFinancialFeatures();
    setupFormValidation();
    setupCalculators();
    setupAutoSave();
});

// Initialize all financial features
function initializeFinancialFeatures() {
    console.log('Initializing Financial Features');
    
    // Setup transaction management
    setupTransactionManagement();
    
    // Setup account management
    setupAccountManagement();
    
    // Setup financial calculations
    setupFinancialCalculations();
    
    // Setup data export
    setupDataExport();
    
    // Setup keyboard shortcuts
    setupKeyboardShortcuts();
}

// Setup transaction management
function setupTransactionManagement() {
    // Transaction form handling
    const transactionForm = document.getElementById('transactionForm');
    if (transactionForm) {
        setupTransactionForm(transactionForm);
    }
    
    // Transaction filters
    setupTransactionFilters();
    
    // Bulk operations
    setupBulkOperations();
    
    // Quick add transaction
    setupQuickAddTransaction();
}

// Setup transaction form with enhanced features
function setupTransactionForm(form) {
    const typeSelect = form.querySelector('select[name="transaction_type"]');
    const categorySelect = form.querySelector('select[name="category"]');
    const amountInput = form.querySelector('input[name="amount"]');
    const dateInput = form.querySelector('input[name="date"]');
    
    // Dynamic category options based on transaction type
    if (typeSelect && categorySelect) {
        typeSelect.addEventListener('change', function() {
            updateCategoryOptions(this.value, categorySelect);
        });
    }
    
    // Auto-format amount input
    if (amountInput) {
        amountInput.addEventListener('input', function() {
            formatAmountInput(this);
        });
        
        amountInput.addEventListener('blur', function() {
            validateAmount(this);
        });
    }
    
    // Set default date to today if empty
    if (dateInput && !dateInput.value) {
        const today = new Date();
        dateInput.value = today.toISOString().split('T')[0];
    }
    
    // Form submission handling
    form.addEventListener('submit', function(event) {
        if (!validateTransactionForm(form)) {
            event.preventDefault();
            showNotification('Por favor, corrija os erros no formulário', 'error');
        }
    });
}

// Update category options based on transaction type
function updateCategoryOptions(transactionType, categorySelect) {
    const incomeCategories = [
        { value: 'vendas', text: 'Vendas' },
        { value: 'servicos', text: 'Serviços' },
        { value: 'investimentos', text: 'Investimentos' },
        { value: 'outros_receitas', text: 'Outras Receitas' }
    ];
    
    const expenseCategories = [
        { value: 'marketing', text: 'Marketing' },
        { value: 'fornecedores', text: 'Fornecedores' },
        { value: 'impostos', text: 'Impostos' },
        { value: 'despesas_gerais', text: 'Despesas Gerais' },
        { value: 'salarios', text: 'Salários' },
        { value: 'aluguel', text: 'Aluguel' },
        { value: 'outros_despesas', text: 'Outras Despesas' }
    ];
    
    const categories = transactionType === 'income' ? incomeCategories : expenseCategories;
    
    // Clear existing options
    categorySelect.innerHTML = '';
    
    // Add new options
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.value;
        option.textContent = category.text;
        categorySelect.appendChild(option);
    });
}

// Format amount input with currency formatting
function formatAmountInput(input) {
    let value = input.value.replace(/\D/g, ''); // Remove non-digits
    if (value === '') return;
    
    // Convert to number and format
    const numericValue = parseInt(value) / 100;
    input.value = numericValue.toFixed(2);
}

// Validate amount input
function validateAmount(input) {
    const value = parseFloat(input.value);
    const errorElement = input.parentElement.querySelector('.error-message');
    
    if (isNaN(value) || value <= 0) {
        showFieldError(input, 'Por favor, insira um valor válido maior que zero');
        return false;
    } else {
        hideFieldError(input);
        return true;
    }
}

// Setup transaction filters
function setupTransactionFilters() {
    const filterForm = document.getElementById('transactionFilters');
    if (!filterForm) return;
    
    const typeFilter = filterForm.querySelector('select[name="type"]');
    const categoryFilter = filterForm.querySelector('select[name="category"]');
    const dateFromFilter = filterForm.querySelector('input[name="date_from"]');
    const dateToFilter = filterForm.querySelector('input[name="date_to"]');
    const searchFilter = filterForm.querySelector('input[name="search"]');
    
    // Apply filters on change
    [typeFilter, categoryFilter, dateFromFilter, dateToFilter].forEach(element => {
        if (element) {
            element.addEventListener('change', applyTransactionFilters);
        }
    });
    
    // Apply search filter with debounce
    if (searchFilter) {
        searchFilter.addEventListener('input', debounce(applyTransactionFilters, 300));
    }
    
    // Clear filters button
    const clearFiltersBtn = filterForm.querySelector('.clear-filters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearTransactionFilters);
    }
}

// Apply transaction filters
function applyTransactionFilters() {
    const filterForm = document.getElementById('transactionFilters');
    if (!filterForm) return;
    
    const formData = new FormData(filterForm);
    const filters = Object.fromEntries(formData);
    
    // Filter transactions in the table
    filterTransactionTable(filters);
    
    // Update summary based on filtered results
    updateFilteredSummary();
}

// Filter transaction table based on criteria
function filterTransactionTable(filters) {
    const tableBody = document.querySelector('#transactionsTable tbody');
    if (!tableBody) return;
    
    const rows = tableBody.querySelectorAll('tr');
    let visibleCount = 0;
    
    rows.forEach(row => {
        let visible = true;
        
        // Type filter
        if (filters.type && filters.type !== '') {
            const typeCell = row.querySelector('.transaction-type');
            if (typeCell && !typeCell.textContent.toLowerCase().includes(filters.type.toLowerCase())) {
                visible = false;
            }
        }
        
        // Category filter
        if (filters.category && filters.category !== '') {
            const categoryCell = row.querySelector('.transaction-category');
            if (categoryCell && categoryCell.textContent.trim() !== filters.category) {
                visible = false;
            }
        }
        
        // Date range filter
        if (filters.date_from || filters.date_to) {
            const dateCell = row.querySelector('.transaction-date');
            if (dateCell) {
                const transactionDate = new Date(dateCell.getAttribute('data-date'));
                if (filters.date_from && transactionDate < new Date(filters.date_from)) {
                    visible = false;
                }
                if (filters.date_to && transactionDate > new Date(filters.date_to)) {
                    visible = false;
                }
            }
        }
        
        // Search filter
        if (filters.search && filters.search !== '') {
            const searchText = filters.search.toLowerCase();
            const rowText = row.textContent.toLowerCase();
            if (!rowText.includes(searchText)) {
                visible = false;
            }
        }
        
        // Show/hide row
        row.style.display = visible ? '' : 'none';
        if (visible) visibleCount++;
    });
    
    // Update results count
    updateFilterResultsCount(visibleCount);
}

// Clear transaction filters
function clearTransactionFilters() {
    const filterForm = document.getElementById('transactionFilters');
    if (!filterForm) return;
    
    filterForm.reset();
    applyTransactionFilters();
    showNotification('Filtros limpos com sucesso', 'info');
}

// Setup account management
function setupAccountManagement() {
    // Mark as paid functionality
    const markPaidButtons = document.querySelectorAll('.mark-paid-btn');
    markPaidButtons.forEach(button => {
        button.addEventListener('click', handleMarkAsPaid);
    });
    
    // Due date alerts
    checkDueDates();
    
    // Account status updates
    setupAccountStatusUpdates();
}

// Handle mark as paid functionality
function handleMarkAsPaid(event) {
    event.preventDefault();
    
    const button = event.target;
    const accountId = button.getAttribute('data-account-id');
    const accountName = button.getAttribute('data-account-name');
    
    if (confirm(`Confirma o pagamento de "${accountName}"?`)) {
        // Show loading state
        button.disabled = true;
        button.innerHTML = '<i class="bi bi-spinner-border animate-spin"></i> Processando...';
        
        // Simulate API call (in real implementation, make actual API call)
        setTimeout(() => {
            window.location.href = `/financial/mark-paid/${accountId}`;
        }, 1000);
    }
}

// Check for due dates and show alerts
function checkDueDates() {
    const today = new Date();
    const accounts = document.querySelectorAll('.account-item');
    
    accounts.forEach(account => {
        const dueDateElement = account.querySelector('.due-date');
        if (!dueDateElement) return;
        
        const dueDate = new Date(dueDateElement.getAttribute('data-date'));
        const daysDiff = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        
        // Add warning classes based on due date
        if (daysDiff < 0) {
            account.classList.add('overdue');
            dueDateElement.classList.add('text-red-600', 'font-bold');
        } else if (daysDiff <= 3) {
            account.classList.add('due-soon');
            dueDateElement.classList.add('text-yellow-600', 'font-bold');
        }
    });
}

// Setup financial calculations
function setupFinancialCalculations() {
    // Real-time balance calculation
    calculateRealTimeBalance();
    
    // Profit margin calculator
    setupProfitMarginCalculator();
    
    // Tax calculator
    setupTaxCalculator();
    
    // ROI calculator
    setupROICalculator();
}

// Calculate real-time balance
function calculateRealTimeBalance() {
    const incomeElements = document.querySelectorAll('.income-amount');
    const expenseElements = document.querySelectorAll('.expense-amount');
    const balanceElement = document.querySelector('.current-balance');
    
    if (!balanceElement) return;
    
    let totalIncome = 0;
    let totalExpenses = 0;
    
    incomeElements.forEach(element => {
        const value = parseFloat(element.textContent.replace(/[^\d.-]/g, ''));
        if (!isNaN(value)) totalIncome += value;
    });
    
    expenseElements.forEach(element => {
        const value = parseFloat(element.textContent.replace(/[^\d.-]/g, ''));
        if (!isNaN(value)) totalExpenses += value;
    });
    
    const balance = totalIncome - totalExpenses;
    balanceElement.textContent = formatCurrency(balance);
    
    // Update balance color based on value
    balanceElement.className = balance >= 0 ? 'text-green-600' : 'text-red-600';
}

// Setup form validation
function setupFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');
    forms.forEach(form => {
        setupFormValidationForForm(form);
    });
}

// Setup validation for a specific form
function setupFormValidationForForm(form) {
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
    
    form.addEventListener('submit', function(event) {
        if (!validateForm(form)) {
            event.preventDefault();
        }
    });
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const required = field.hasAttribute('required');
    
    // Clear previous errors
    clearFieldError(field);
    
    // Required field validation
    if (required && value === '') {
        showFieldError(field, 'Este campo é obrigatório');
        return false;
    }
    
    // Email validation
    if (type === 'email' && value !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Por favor, insira um email válido');
            return false;
        }
    }
    
    // Number validation
    if (type === 'number' && value !== '') {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
            showFieldError(field, 'Por favor, insira um número válido');
            return false;
        }
        
        const min = field.getAttribute('min');
        const max = field.getAttribute('max');
        
        if (min && numValue < parseFloat(min)) {
            showFieldError(field, `Valor deve ser maior que ${min}`);
            return false;
        }
        
        if (max && numValue > parseFloat(max)) {
            showFieldError(field, `Valor deve ser menor que ${max}`);
            return false;
        }
    }
    
    return true;
}

// Show field error
function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('border-red-500');
    
    const errorElement = document.createElement('p');
    errorElement.className = 'error-message text-red-600 text-sm mt-1';
    errorElement.textContent = message;
    
    field.parentElement.appendChild(errorElement);
}

// Clear field error
function clearFieldError(field) {
    field.classList.remove('border-red-500');
    
    const errorElement = field.parentElement.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

// Hide field error (alias for clearFieldError)
function hideFieldError(field) {
    clearFieldError(field);
}

// Validate entire form
function validateForm(form) {
    const fields = form.querySelectorAll('input, select, textarea');
    let isValid = true;
    
    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Validate transaction form specifically
function validateTransactionForm(form) {
    return validateForm(form);
}

// Setup calculators
function setupCalculators() {
    setupLoanCalculator();
    setupInvestmentCalculator();
    setupBreakEvenCalculator();
}

// Setup loan calculator
function setupLoanCalculator() {
    const calculator = document.getElementById('loanCalculator');
    if (!calculator) return;
    
    const calculateBtn = calculator.querySelector('.calculate-loan');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateLoan);
    }
}

// Calculate loan payments
function calculateLoan() {
    const principal = parseFloat(document.getElementById('loanPrincipal').value);
    const rate = parseFloat(document.getElementById('loanRate').value) / 100 / 12;
    const payments = parseFloat(document.getElementById('loanPayments').value);
    
    if (isNaN(principal) || isNaN(rate) || isNaN(payments)) {
        showNotification('Por favor, preencha todos os campos corretamente', 'error');
        return;
    }
    
    const monthlyPayment = principal * (rate * Math.pow(1 + rate, payments)) / (Math.pow(1 + rate, payments) - 1);
    const totalPayment = monthlyPayment * payments;
    const totalInterest = totalPayment - principal;
    
    document.getElementById('monthlyPayment').textContent = formatCurrency(monthlyPayment);
    document.getElementById('totalPayment').textContent = formatCurrency(totalPayment);
    document.getElementById('totalInterest').textContent = formatCurrency(totalInterest);
}

// Setup auto-save functionality
function setupAutoSave() {
    const autoSaveForms = document.querySelectorAll('form[data-auto-save]');
    
    autoSaveForms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('input', debounce(() => {
                autoSaveForm(form);
            }, 2000));
        });
    });
}

// Auto-save form data
function autoSaveForm(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Save to localStorage
    const formId = form.id || 'auto-save-form';
    localStorage.setItem(`auto-save-${formId}`, JSON.stringify(data));
    
    // Show auto-save indicator
    showAutoSaveIndicator();
}

// Show auto-save indicator
function showAutoSaveIndicator() {
    const indicator = document.getElementById('auto-save-indicator');
    if (indicator) {
        indicator.textContent = 'Salvo automaticamente';
        indicator.classList.remove('hidden');
        
        setTimeout(() => {
            indicator.classList.add('hidden');
        }, 2000);
    }
}

// Setup keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(event) {
        // Ctrl + N: New transaction
        if (event.ctrlKey && event.key === 'n') {
            event.preventDefault();
            const addTransactionBtn = document.querySelector('.add-transaction-btn');
            if (addTransactionBtn) addTransactionBtn.click();
        }
        
        // Ctrl + S: Save form
        if (event.ctrlKey && event.key === 's') {
            event.preventDefault();
            const activeForm = document.querySelector('form:focus-within');
            if (activeForm) {
                const submitBtn = activeForm.querySelector('button[type="submit"]');
                if (submitBtn) submitBtn.click();
            }
        }
        
        // Escape: Close modals/forms
        if (event.key === 'Escape') {
            const activeModal = document.querySelector('.modal.show');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });
}

// Setup data export functionality
function setupDataExport() {
    const exportButtons = document.querySelectorAll('.export-btn');
    
    exportButtons.forEach(button => {
        button.addEventListener('click', function() {
            const format = this.getAttribute('data-format');
            const type = this.getAttribute('data-type');
            exportData(format, type);
        });
    });
}

// Export data in specified format
function exportData(format, type) {
    // Show loading state
    showNotification('Preparando exportação...', 'info');
    
    // In a real implementation, this would make an API call
    setTimeout(() => {
        showNotification(`Dados exportados em ${format.toUpperCase()} com sucesso!`, 'success');
    }, 2000);
}

// Utility function to close modal
function closeModal(modal) {
    modal.classList.remove('show');
    modal.style.display = 'none';
}

// Update filter results count
function updateFilterResultsCount(count) {
    const countElement = document.getElementById('filter-results-count');
    if (countElement) {
        countElement.textContent = `${count} resultado(s) encontrado(s)`;
    }
}

// Update filtered summary
function updateFilteredSummary() {
    // This would recalculate totals based on visible transactions
    calculateRealTimeBalance();
}

// Setup bulk operations
function setupBulkOperations() {
    const selectAllCheckbox = document.getElementById('select-all-transactions');
    const bulkActionSelect = document.getElementById('bulk-action-select');
    const applyBulkBtn = document.getElementById('apply-bulk-action');
    
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.transaction-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
            updateBulkActionVisibility();
        });
    }
    
    if (applyBulkBtn) {
        applyBulkBtn.addEventListener('click', applyBulkAction);
    }
    
    // Update bulk action visibility when individual checkboxes change
    const transactionCheckboxes = document.querySelectorAll('.transaction-checkbox');
    transactionCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateBulkActionVisibility);
    });
}

// Update bulk action visibility
function updateBulkActionVisibility() {
    const checkedBoxes = document.querySelectorAll('.transaction-checkbox:checked');
    const bulkActions = document.getElementById('bulk-actions');
    
    if (bulkActions) {
        bulkActions.style.display = checkedBoxes.length > 0 ? 'block' : 'none';
    }
}

// Apply bulk action
function applyBulkAction() {
    const checkedBoxes = document.querySelectorAll('.transaction-checkbox:checked');
    const action = document.getElementById('bulk-action-select').value;
    
    if (checkedBoxes.length === 0) {
        showNotification('Selecione pelo menos uma transação', 'warning');
        return;
    }
    
    if (!action) {
        showNotification('Selecione uma ação', 'warning');
        return;
    }
    
    if (confirm(`Aplicar ação "${action}" a ${checkedBoxes.length} transação(ões)?`)) {
        // Process bulk action
        processBulkAction(action, checkedBoxes);
    }
}

// Process bulk action
function processBulkAction(action, checkboxes) {
    // Show loading
    showNotification('Processando ação em lote...', 'info');
    
    // Simulate processing
    setTimeout(() => {
        showNotification(`Ação "${action}" aplicada com sucesso!`, 'success');
        
        // Refresh page or update UI
        if (action === 'delete') {
            checkboxes.forEach(checkbox => {
                const row = checkbox.closest('tr');
                if (row) row.remove();
            });
        }
        
        updateBulkActionVisibility();
    }, 2000);
}

// Setup quick add transaction
function setupQuickAddTransaction() {
    const quickAddBtn = document.getElementById('quick-add-transaction');
    if (!quickAddBtn) return;
    
    quickAddBtn.addEventListener('click', function() {
        const modal = createQuickAddModal();
        document.body.appendChild(modal);
        modal.style.display = 'block';
        setTimeout(() => modal.classList.add('show'), 10);
    });
}

// Create quick add transaction modal
function createQuickAddModal() {
    const modal = document.createElement('div');
    modal.className = 'modal fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';
    modal.innerHTML = `
        <div class="modal-content bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold">Adicionar Transação Rápida</h3>
                <button class="close-modal text-gray-500 hover:text-gray-700">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
            <form class="quick-add-form">
                <div class="mb-4">
                    <label class="block text-sm font-medium mb-1">Descrição</label>
                    <input type="text" name="description" class="w-full px-3 py-2 border rounded-md" required>
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium mb-1">Valor</label>
                    <input type="number" name="amount" step="0.01" class="w-full px-3 py-2 border rounded-md" required>
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium mb-1">Tipo</label>
                    <select name="type" class="w-full px-3 py-2 border rounded-md" required>
                        <option value="income">Receita</option>
                        <option value="expense">Despesa</option>
                    </select>
                </div>
                <div class="flex justify-end space-x-3">
                    <button type="button" class="close-modal px-4 py-2 border rounded-md">Cancelar</button>
                    <button type="submit" class="px-4 py-2 bg-primary text-white rounded-md">Adicionar</button>
                </div>
            </form>
        </div>
    `;
    
    // Setup modal close functionality
    const closeButtons = modal.querySelectorAll('.close-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => closeModal(modal));
    });
    
    // Setup form submission
    const form = modal.querySelector('.quick-add-form');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        processQuickAdd(form);
        closeModal(modal);
    });
    
    return modal;
}

// Process quick add transaction
function processQuickAdd(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Show success message
    showNotification(`Transação "${data.description}" adicionada com sucesso!`, 'success');
    
    // In a real implementation, this would submit to the server
    // For now, we'll just refresh the page
    setTimeout(() => {
        window.location.reload();
    }, 1500);
}

// Profit margin calculator setup
function setupProfitMarginCalculator() {
    const calculator = document.getElementById('profitMarginCalculator');
    if (!calculator) return;
    
    const inputs = calculator.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', calculateProfitMargin);
    });
}

// Calculate profit margin
function calculateProfitMargin() {
    const revenue = parseFloat(document.getElementById('revenue').value) || 0;
    const costs = parseFloat(document.getElementById('costs').value) || 0;
    
    const profit = revenue - costs;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
    
    document.getElementById('profit').textContent = formatCurrency(profit);
    document.getElementById('margin').textContent = margin.toFixed(2) + '%';
}

// Tax calculator setup
function setupTaxCalculator() {
    const calculator = document.getElementById('taxCalculator');
    if (!calculator) return;
    
    const calculateBtn = calculator.querySelector('.calculate-tax');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateTax);
    }
}

// Calculate tax
function calculateTax() {
    const income = parseFloat(document.getElementById('taxIncome').value);
    const regime = document.getElementById('taxRegime').value;
    
    if (isNaN(income)) {
        showNotification('Por favor, insira um valor de receita válido', 'error');
        return;
    }
    
    let tax = 0;
    
    // Simplified tax calculation
    switch (regime) {
        case 'mei':
            tax = income * 0.06; // 6% for MEI
            break;
        case 'simples':
            tax = income * 0.12; // 12% for Simples Nacional (simplified)
            break;
        case 'lucro_real':
            tax = income * 0.25; // 25% for Lucro Real (simplified)
            break;
    }
    
    document.getElementById('calculatedTax').textContent = formatCurrency(tax);
    document.getElementById('netIncome').textContent = formatCurrency(income - tax);
}

// ROI calculator setup
function setupROICalculator() {
    const calculator = document.getElementById('roiCalculator');
    if (!calculator) return;
    
    const inputs = calculator.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', calculateROI);
    });
}

// Calculate ROI
function calculateROI() {
    const investment = parseFloat(document.getElementById('investment').value) || 0;
    const returns = parseFloat(document.getElementById('returns').value) || 0;
    
    const roi = investment > 0 ? ((returns - investment) / investment) * 100 : 0;
    
    document.getElementById('roi').textContent = roi.toFixed(2) + '%';
    
    // Update ROI color based on value
    const roiElement = document.getElementById('roi');
    roiElement.className = roi >= 0 ? 'text-green-600' : 'text-red-600';
}

// Export window object for global access
window.FinanceiroInteligenteFinancial = {
    showNotification: window.FinanceiroInteligente?.showNotification || function() {},
    formatCurrency: window.FinanceiroInteligente?.formatCurrency || function() {},
    validateField,
    validateForm,
    calculateLoan,
    calculateProfitMargin,
    calculateTax,
    calculateROI
};
