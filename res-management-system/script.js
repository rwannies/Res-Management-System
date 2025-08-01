/**
 * Resource Management System
 * Manages resources with CRUD operations, search, pagination, and theme switching.
 */

let resources = [];
let editIndex = -1;
let sortField = 'name';
let sortDirection = 'asc';
let currentPage = 1;
const resourcesPerPage = 10;
let searchQuery = '';

/**
 * Initializes the application.
 */
function initializeApp() {
    try {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
        loadResources();
        loadTheme();
        displayResources();
        setupEventListeners();
    } catch (error) {
        console.error('Initialization failed:', error);
        showToast('Failed to initialize the application. Please refresh the page.', 'error');
    }
}

/**
 * Loads resources from localStorage.
 */
function loadResources() {
    try {
        const storedResources = localStorage.getItem('resources');
        if (storedResources) {
            resources = JSON.parse(storedResources);
        }
    } catch (error) {
        console.error('Failed to load resources:', error);
        showToast('Failed to load resources. Starting with empty list.', 'error');
    }
}

/**
 * Saves resources to localStorage.
 */
function saveResources() {
    try {
        localStorage.setItem('resources', JSON.stringify(resources));
    } catch (error) {
        console.error('Failed to save resources:', error);
        showToast('Failed to save resources.', 'error');
    }
}

/**
 * Sanitizes input to prevent XSS.
 * @param {string} input - The input string to sanitize.
 * @returns {string} Sanitized string.
 */
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

/**
 * Validates form inputs.
 * @param {string} name - Resource name.
 * @param {string} type - Resource type.
 * @param {string} status - Resource status.
 * @returns {string|null} Error message or null if valid.
 */
function validateInput(name, type, status) {
    if (!name || name.length < 2) {
        return 'Name must be at least 2 characters long';
    }
    if (type === '' || type === 'Select Type') {
        return 'Please select a valid resource type';
    }
    if (status === '') {
        return 'Please select a valid status';
    }
    return null;
}

/**
 * Adds or updates a resource.
 * @param {Event} event - Form submit event.
 */
function addResource(event) {
    event.preventDefault();
    
    const name = sanitizeInput(document.getElementById('resourceName').value.trim());
    const type = document.getElementById('resourceType').value;
    const status = document.getElementById('resourceStatus').value;
    const description = sanitizeInput(document.getElementById('resourceDescription').value.trim());

    const validationError = validateInput(name, type, status);
    if (validationError) {
        showToast(validationError, 'error');
        return;
    }

    try {
        const resource = {
            id: editIndex === -1 ? Date.now() : resources[editIndex].id,
            name,
            type,
            status,
            description
        };

        if (editIndex === -1) {
            resources.push(resource);
            showToast('Resource added successfully.', 'success');
        } else {
            resources[editIndex] = resource;
            showToast('Resource updated successfully.', 'success');
            editIndex = -1;
        }

        saveResources();
        displayResources();
        closeModal();
    } catch (error) {
        console.error('Failed to add resource:', error);
        showToast('Failed to add resource. Please try again.', 'error');
    }
}

/**
 * Sorts resources by a field.
 * @param {string} field - Field to sort by.
 */
function sortResources(field) {
    if (sortField === field) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortField = field;
        sortDirection = 'asc';
    }
    currentPage = 1;
    displayResources();
}

/**
 * Displays resources with filtering, sorting, and pagination.
 * @param {string} [filterType='All Types'] - Type to filter by.
 */
function displayResources(filterType = 'All Types') {
    try {
        const resourceList = document.getElementById('resourceList').querySelector('tbody');
        const noResources = document.getElementById('no-resources');
        const prevPageBtn = document.getElementById('prevPage');
        const nextPageBtn = document.getElementById('nextPage');
        const pageInfo = document.getElementById('pageInfo');

        let filteredResources = resources;

        // Apply type filter
        if (filterType !== 'All Types') {
            filteredResources = filteredResources.filter(resource => resource.type === filterType);
        }

        // Apply search filter
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            filteredResources = filteredResources.filter(resource =>
                resource.name.toLowerCase().includes(lowerQuery) ||
                (resource.description && resource.description.toLowerCase().includes(lowerQuery))
            );
        }

        // Sort resources
        filteredResources.sort((a, b) => {
            const valueA = (a[sortField] || '').toLowerCase();
            const valueB = (b[sortField] || '').toLowerCase();
            if (sortDirection === 'asc') {
                return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
            } else {
                return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
            }
        });

        // Pagination
        const totalPages = Math.ceil(filteredResources.length / resourcesPerPage);
        const startIndex = (currentPage - 1) * resourcesPerPage;
        const paginatedResources = filteredResources.slice(startIndex, startIndex + resourcesPerPage);

        // Update pagination controls
        pageInfo.textContent = `Page ${currentPage} of ${totalPages || 1}`;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;

        if (paginatedResources.length === 0) {
            resourceList.innerHTML = '';
            noResources.style.display = 'block';
            return;
        }

        noResources.style.display = 'none';
        let html = '';

        paginatedResources.forEach((resource, index) => {
            html += `
                <tr>
                    <td>${resource.name}</td>
                    <td>${resource.type}</td>
                    <td>${resource.status}</td>
                    <td>${resource.description || '-'}</td>
                    <td class="action-buttons">
                        <button class="btn btn-primary" onclick="editResource(${startIndex + index})" aria-label="Edit ${resource.name}">Edit</button>
                        <button class="btn btn-danger" onclick="deleteResource(${resource.id})" aria-label="Delete ${resource.name}">Delete</button>
                    </td>
                </tr>
            `;
        });

        resourceList.innerHTML = html;
    } catch (error) {
        console.error('Failed to display resources:', error);
        showToast('Failed to display resources. Please refresh the page.', 'error');
    }
}

/**
 * Filters resources by type.
 */
function filterResources() {
    try {
        const filterType = document.getElementById('filterType').value;
        currentPage = 1;
        displayResources(filterType);
    } catch (error) {
        console.error('Failed to filter resources:', error);
        showToast('Failed to filter resources.', 'error');
    }
}

/**
 * Handles search input with debouncing.
 */
function handleSearch() {
    try {
        searchQuery = document.getElementById('searchInput').value.trim();
        currentPage = 1;
        displayResources();
    } catch (error) {
        console.error('Failed to search resources:', error);
        showToast('Failed to search resources.', 'error');
    }
}

/**
 * Debounces a function.
 * @param {Function} func - Function to debounce.
 * @param {number} wait - Wait time in milliseconds.
 * @returns {Function} Debounced function.
 */
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

/**
 * Edits a resource.
 * @param {number} index - Index of resource to edit.
 */
function editResource(index) {
    try {
        editIndex = index;
        const resource = resources[index];
        document.getElementById('resourceName').value = resource.name;
        document.getElementById('resourceType').value = resource.type;
        document.getElementById('resourceStatus').value = resource.status;
        document.getElementById('resourceDescription').value = resource.description || '';
        document.getElementById('addResourceModal').style.display = 'flex';
        document.getElementById('resourceName').focus();
    } catch (error) {
        console.error('Failed to edit resource:', error);
        showToast('Failed to edit resource.', 'error');
    }
}

/**
 * Deletes a resource.
 * @param {number} id - ID of resource to delete.
 */
function deleteResource(id) {
    try {
        if (confirm('Are you sure you want to delete this resource?')) {
            resources = resources.filter(resource => resource.id !== id);
            saveResources();
            displayResources();
            showToast('Resource deleted successfully.', 'success');
        }
    } catch (error) {
        console.error('Failed to delete resource:', error);
        showToast('Failed to delete resource.', 'error');
    }
}

/**
 * Opens the add/edit modal.
 */
function openModal() {
    try {
        document.getElementById('addResourceForm').reset();
        editIndex = -1;
        document.getElementById('addResourceModal').style.display = 'flex';
        document.getElementById('resourceName').focus();
    } catch (error) {
        console.error('Failed to open modal:', error);
        showToast('Failed to open modal.', 'error');
    }
}

/**
 * Closes the modal.
 */
function closeModal() {
    try {
        document.getElementById('addResourceModal').style.display = 'none';
        document.getElementById('addResourceForm').reset();
    } catch (error) {
        console.error('Failed to close modal:', error);
        showToast('Failed to close modal.', 'error');
    }
}

/**
 * Shows a toast notification.
 * @param {string} message - Message to display.
 * @param {string} type - Type of toast ('success' or 'error').
 */
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

/**
 * Exports resources as JSON.
 */
function exportResources() {
    try {
        const dataStr = JSON.stringify(resources, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'resources.json';
        a.click();
        URL.revokeObjectURL(url);
        showToast('Resources exported successfully.', 'success');
    } catch (error) {
        console.error('Failed to export resources:', error);
        showToast('Failed to export resources.', 'error');
    }
}

/**
 * Imports resources from a JSON file.
 * @param {Event} event - File input change event.
 */
function importResources(event) {
    try {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedResources = JSON.parse(e.target.result);
                if (!Array.isArray(importedResources)) {
                    throw new Error('Invalid JSON format');
                }
                resources = importedResources.map(resource => ({
                    id: resource.id || Date.now(),
                    name: sanitizeInput(resource.name || ''),
                    type: resource.type || 'Equipment',
                    status: resource.status || 'Available',
                    description: sanitizeInput(resource.description || '')
                }));
                saveResources();
                displayResources();
                showToast('Resources imported successfully.', 'success');
            } catch (error) {
                console.error('Failed to import resources:', error);
                showToast('Failed to import resources. Invalid file format.', 'error');
            }
        };
        reader.readAsText(file);
        event.target.value = ''; // Reset file input
    } catch (error) {
        console.error('Failed to process import:', error);
        showToast('Failed to import resources.', 'error');
    }
}

/**
 * Loads theme from localStorage or system preference.
 */
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
    document.getElementById('themeSwitch').checked = theme === 'dark';
}

/**
 * Toggles between light and dark themes.
 */
function toggleTheme() {
    const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    document.getElementById('themeSwitch').checked = theme === 'dark';
}

/**
 * Handles pagination navigation.
 * @param {string} direction - 'prev' or 'next'.
 */
function navigatePage(direction) {
    if (direction === 'prev' && currentPage > 1) {
        currentPage--;
    } else if (direction === 'next') {
        currentPage++;
    }
    displayResources();
}

/**
 * Sets up event listeners.
 */
function setupEventListeners() {
    document.getElementById('addResourceBtn').addEventListener('click', openModal);
    document.getElementById('addResourceForm').addEventListener('submit', addResource);
    document.getElementById('cancelBtn').addEventListener('click', closeModal);
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('filterType').addEventListener('change', filterResources);
    document.getElementById('searchInput').addEventListener('input', debounce(handleSearch, 300));
    document.getElementById('exportBtn').addEventListener('click', exportResources);
    document.getElementById('importBtn').addEventListener('click', () => document.getElementById('importFile').click());
    document.getElementById('importFile').addEventListener('change', importResources);
    document.getElementById('themeSwitch').addEventListener('change', toggleTheme);
    document.getElementById('prevPage').addEventListener('click', () => navigatePage('prev'));
    document.getElementById('nextPage').addEventListener('click', () => navigatePage('next'));

    // Keyboard navigation for modal
    document.getElementById('addResourceModal').addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

window.onload = initializeApp;