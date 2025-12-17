// Admin Dashboard Script for WomenRise
(function() {
    'use strict';

    const API_BASE_URL = 'http://localhost:3000/api';
    let adminPassword = '';
    let currentOffset = 0;
    let currentFilters = {};
    let allComplaints = [];

    // Initialize dashboard
    document.addEventListener('DOMContentLoaded', function() {
        // Check if user is already logged in
        const savedPassword = localStorage.getItem('adminAuth');
        if (savedPassword) {
            adminPassword = savedPassword;
            testAuthAndShowDashboard();
        } else {
            initializeLoginForm();
        }
    });

    function initializeLoginForm() {
        const loginForm = document.getElementById('loginForm');
        loginForm.addEventListener('submit', handleLogin);
    }

    async function testAuthAndShowDashboard() {
        try {
            const response = await fetch(`${API_BASE_URL}/complaints/stats`, {
                headers: {
                    'X-Admin-Password': adminPassword
                }
            });
            
            if (response.ok) {
                showDashboard();
                loadDashboardData();
            } else {
                // Invalid saved password, clear it
                localStorage.removeItem('adminAuth');
                initializeLoginForm();
            }
        } catch (error) {
            localStorage.removeItem('adminAuth');
            initializeLoginForm();
        }localStorage.setItem('adminAuth', password);
                
    }

    async function handleLogin(event) {
        event.preventDefault();
        
        const passwordInput = document.getElementById('password');
        const password = passwordInput.value;
        const errorDiv = document.getElementById('loginError');
        
        errorDiv.classList.add('d-none');
        
        try {
            // Test authentication by fetching stats
            const response = await fetch(`${API_BASE_URL}/complaints/stats`, {
                headers: {
                    'X-Admin-Password': password
                }
            });
            
            if (response.ok) {
                adminPassword = password;
                showDashboard();
                loadDashboardData();
            } else {
                errorDiv.textContent = 'Invalid password. Please try again.';
                errorDiv.classList.remove('d-none');
                passwordInput.value = '';
            }
        } catch (error) {
            errorDiv.textContent = 'Unable to connect to server. Please ensure the backend is running.';
            errorDiv.classList.remove('d-none');
        }
    }

    function showDashboard() {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('dashboardScreen').style.display = 'block';
        
        // Initialize dashboard event listeners
        document.getElementById('logoutBtn').addEventListener('click', handleLogout);
        document.getElementById('refreshBtn').addEventListener('click', () => loadDashboardData());
        document.getElementById('filterStatus').addEventListener('change', applyFilters);
        document.getElementById('filterState').addEventListener('change', applyFilters);
        document.getElementById('recordsLimit').addEventListener('change', applyFilters);
        document.getElementById('loadMoreBtn').addEventListener('click', loadMoreComplaints);
    }

    function handleLogout() {
        adminPassword = '';
        currentOffset = 0;
        localStorage.removeItem('adminAuth');
        allComplaints = [];
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('dashboardScreen').style.display = 'none';
        document.getElementById('password').value = '';
    }

    async function loadDashboardData() {
        await Promise.all([
            loadStatistics(),
            loadComplaints()
        ]);
        populateStateFilter();
    }

    async function loadStatistics() {
        try {
            const response = await fetch(`${API_BASE_URL}/complaints/stats`, {
                headers: {
                    'X-Admin-Password': adminPassword
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                updateStatistics(data.stats);
            }
        } catch (error) {
            console.error('Failed to load statistics:', error);
        }
    }

    function updateStatistics(stats) {
        document.getElementById('statTotal').textContent = stats.total || 0;
        document.getElementById('statPending').textContent = stats.pending || 0;
        document.getElementById('statResolved').textContent = stats.resolved || 0;
        document.getElementById('statRecent').textContent = stats.recent24h || 0;
    }

    async function loadComplaints(reset = true) {
        if (reset) {
            currentOffset = 0;
            allComplaints = [];
        }

        const limit = parseInt(document.getElementById('recordsLimit').value);
        const status = document.getElementById('filterStatus').value;
        const state = document.getElementById('filterState').value;

        let url = `${API_BASE_URL}/complaints/recent?limit=${limit}&offset=${currentOffset}`;
        if (status) url += `&status=${encodeURIComponent(status)}`;
        if (state) url += `&state=${encodeURIComponent(state)}`;

        try {
            const response = await fetch(url, {
                headers: {
                    'X-Admin-Password': adminPassword
                }
            });

            if (response.ok) {
                const data = await response.json();
                
                if (reset) {
                    allComplaints = data.complaints;
                } else {
                    allComplaints = [...allComplaints, ...data.complaints];
                }
                
                renderComplaints();
                updatePagination(data.pagination);
            }
        } catch (error) {
            console.error('Failed to load complaints:', error);
            showErrorInTable('Failed to load complaints. Please refresh the page.');
        }
    }

    function renderComplaints() {
        const tbody = document.getElementById('complaintsTableBody');
        
        if (allComplaints.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="9" class="text-center py-5 text-muted">
                        <i class="fas fa-inbox fa-3x mb-3 d-block"></i>
                        No complaints found
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = allComplaints.map(complaint => `
            <tr>
                <td><strong>#${complaint.id}</strong></td>
                <td>${formatDate(complaint.submission_date)}</td>
                <td>${escapeHtml(complaint.username)}</td>
                <td>
                    <small>${escapeHtml(complaint.email)}<br>
                    ${escapeHtml(complaint.mobile)}</small>
                </td>
                <td>${escapeHtml(complaint.state)}</td>
                <td>${escapeHtml(complaint.district)}</td>
                <td>
                    <div class="complaint-detail">
                        ${escapeHtml(complaint.complaint.substring(0, 100))}${complaint.complaint.length > 100 ? '...' : ''}
                    </div>
                </td>
                <td>
                    <span class="badge status-badge ${getStatusClass(complaint.status)}">
                        ${complaint.status}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="window.dashboardApp.viewComplaint(${complaint.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    function updatePagination(pagination) {
        const infoDiv = document.getElementById('paginationInfo');
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        
        const showing = allComplaints.length;
        infoDiv.textContent = `Showing ${showing} of ${pagination.total} complaints`;
        
        loadMoreBtn.disabled = !pagination.hasMore;
        
        if (pagination.hasMore) {
            currentOffset = pagination.offset + pagination.limit;
        }
    }

    function loadMoreComplaints() {
        loadComplaints(false);
    }

    function applyFilters() {
        loadComplaints(true);
    }

    function populateStateFilter() {
        const stateFilter = document.getElementById('filterState');
        const states = [...new Set(allComplaints.map(c => c.state))].sort();
        
        const currentValue = stateFilter.value;
        stateFilter.innerHTML = '<option value="">All States</option>' +
            states.map(state => `<option value="${escapeHtml(state)}">${escapeHtml(state)}</option>`).join('');
        stateFilter.value = currentValue;
    }

    async function viewComplaint(id) {
        const complaint = allComplaints.find(c => c.id === id);
        if (!complaint) return;

        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div class="row g-3">
                <div class="col-md-6">
                    <strong>Reference ID:</strong> #${complaint.id}
                </div>
                <div class="col-md-6">
                    <strong>Submitted:</strong> ${formatDate(complaint.submission_date)}
                </div>
                <div class="col-md-6">
                    <strong>Full Name:</strong> ${escapeHtml(complaint.username)}
                </div>
                <div class="col-md-6">
                    <strong>Date of Birth:</strong> ${formatDate(complaint.date_of_birth)}
                </div>
                <div class="col-md-6">
                    <strong>Email:</strong> ${escapeHtml(complaint.email)}
                </div>
                <div class="col-md-6">
                    <strong>Mobile:</strong> ${escapeHtml(complaint.mobile)}
                </div>
                <div class="col-md-6">
                    <strong>Gender:</strong> ${escapeHtml(complaint.gender)}
                </div>
                <div class="col-md-6">
                    <strong>Religion:</strong> ${escapeHtml(complaint.religion || 'Not specified')}
                </div>
                <div class="col-md-6">
                    <strong>Caste:</strong> ${escapeHtml(complaint.caste || 'Not specified')}
                </div>
                <div class="col-md-6">
                    <strong>Current Status:</strong>
                    <span class="badge ${getStatusClass(complaint.status)}">${complaint.status}</span>
                </div>
                <div class="col-12">
                    <strong>Address:</strong><br>
                    ${escapeHtml(complaint.address)}<br>
                    ${escapeHtml(complaint.district)}, ${escapeHtml(complaint.state)} - ${escapeHtml(complaint.pin)}
                </div>
                <div class="col-12">
                    <strong>Complaint Details:</strong>
                    <div class="border p-3 mt-2 bg-light">
                        ${escapeHtml(complaint.complaint)}
                    </div>
                </div>
                <div class="col-12">
                    <strong>Update Status:</strong>
                    <div class="btn-group w-100 mt-2" role="group">
                        <button class="btn btn-outline-warning ${complaint.status === 'Pending' ? 'active' : ''}" 
                                onclick="window.dashboardApp.updateStatus(${complaint.id}, 'Pending')">
                            Pending
                        </button>
                        <button class="btn btn-outline-info ${complaint.status === 'In Progress' ? 'active' : ''}" 
                                onclick="window.dashboardApp.updateStatus(${complaint.id}, 'In Progress')">
                            In Progress
                        </button>
                        <button class="btn btn-outline-success ${complaint.status === 'Resolved' ? 'active' : ''}" 
                                onclick="window.dashboardApp.updateStatus(${complaint.id}, 'Resolved')">
                            Resolved
                        </button>
                        <button class="btn btn-outline-secondary ${complaint.status === 'Closed' ? 'active' : ''}" 
                                onclick="window.dashboardApp.updateStatus(${complaint.id}, 'Closed')">
                            Closed
                        </button>
                    </div>
                </div>
            </div>
        `;

        const modal = new bootstrap.Modal(document.getElementById('complaintModal'));
        modal.show();
    }

    async function updateStatus(id, status) {
        try {
            const response = await fetch(`${API_BASE_URL}/complaints/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Admin-Password': adminPassword
                },
                body: JSON.stringify({ status })
            });

            if (response.ok) {
                // Update local data
                const complaint = allComplaints.find(c => c.id === id);
                if (complaint) {
                    complaint.status = status;
                }
                
                // Refresh display
                renderComplaints();
                loadStatistics();
                
                // Update modal if open
                viewComplaint(id);
                
                // Show success message
                showToast('Status updated successfully', 'success');
            } else {
                showToast('Failed to update status', 'error');
            }
        } catch (error) {
            console.error('Failed to update status:', error);
            showToast('Failed to update status', 'error');
        }
    }

    // Utility functions
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function getStatusClass(status) {
        const classes = {
            'Pending': 'bg-warning text-dark',
            'In Progress': 'bg-info text-dark',
            'Resolved': 'bg-success',
            'Closed': 'bg-secondary'
        };
        return classes[status] || 'bg-secondary';
    }

    function showErrorInTable(message) {
        const tbody = document.getElementById('complaintsTableBody');
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center py-5 text-danger">
                    <i class="fas fa-exclamation-triangle fa-3x mb-3 d-block"></i>
                    ${message}
                </td>
            </tr>
        `;
    }

    function showToast(message, type = 'info') {
        // Simple toast notification (you can replace with Bootstrap toast)
        const toast = document.createElement('div');
        toast.className = `alert alert-${type === 'success' ? 'success' : 'danger'} position-fixed top-0 end-0 m-3`;
        toast.style.zIndex = '9999';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // Expose functions globally for onclick handlers
    window.dashboardApp = {
        viewComplaint,
        updateStatus
    };

})();
