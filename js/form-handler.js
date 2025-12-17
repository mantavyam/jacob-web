// Form Handler for WomenRise Complaint Submission
(function() {
    'use strict';

    const API_BASE_URL = 'http://localhost:3000/api';
    
    // Initialize form handler when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        const complaintForm = document.getElementById('complaintForm');
        
        if (!complaintForm) {
            console.warn('Complaint form not found on this page');
            return;
        }

        // Add submit event listener
        complaintForm.addEventListener('submit', handleFormSubmit);
        
        // Add real-time validation
        addFieldValidation(complaintForm);

        // Initialize status check form
        const statusCheckForm = document.getElementById('statusCheckForm');
        if (statusCheckForm) {
            statusCheckForm.addEventListener('submit', handleStatusCheck);
        }
    });

    async function handleFormSubmit(event) {
        event.preventDefault();
        
        const form = event.target;
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        
        // Disable submit button and show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Submitting...';
        
        // Clear previous messages
        clearMessages();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Client-side validation
        const validationErrors = validateFormData(data);
        if (validationErrors.length > 0) {
            showErrorMessage(validationErrors.join('<br>'));
            resetSubmitButton(submitButton, originalButtonText);
            return;
        }
        
        try {
            // Submit to API
            const response = await fetch(`${API_BASE_URL}/complaints`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (response.ok && result.success) {
                showSuccessMessage(
                    `✓ Your complaint has been submitted successfully!<br>` +
                    `Reference ID: #${result.complaintId}<br>` +
                    (result.emailSent ? 'A confirmation email has been sent to your email address.' : 'Note: Email confirmation could not be sent.')
                );
                
                // Reset form after successful submission
                form.reset();
                
                // Scroll to success message
                setTimeout(() => {
                    document.getElementById('messageContainer')?.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                }, 100);
                
            } else {
                // Handle validation errors from server
                if (result.errors && Array.isArray(result.errors)) {
                    const errorMessages = result.errors.map(err => err.msg).join('<br>');
                    showErrorMessage(errorMessages);
                } else {
                    showErrorMessage(result.message || 'Failed to submit complaint. Please try again.');
                }
            }
            
        } catch (error) {
            console.error('Submission error:', error);
            showErrorMessage(
                'Unable to connect to the server. Please check your internet connection and try again.<br>' +
                'If the problem persists, please call our helpline at <strong>14490</strong>'
            );
        } finally {
            resetSubmitButton(submitButton, originalButtonText);
        }
    }

    function validateFormData(data) {
        const errors = [];
        
        // Name validation
        if (!data.username || data.username.trim().length < 2) {
            errors.push('Please enter your full name');
        }
        
        // Date validation
        if (!data.date) {
            errors.push('Please enter your date of birth');
        }
        
        // Address validation
        if (!data.address || data.address.trim().length < 10) {
            errors.push('Please enter a complete address');
        }
        
        // State validation
        if (!data.state || data.state === '') {
            errors.push('Please select your state');
        }
        
        // District validation
        if (!data.district || data.district.trim().length < 2) {
            errors.push('Please enter your district');
        }
        
        // PIN code validation
        const pinRegex = /^\d{6}$/;
        if (!data.pin || !pinRegex.test(data.pin)) {
            errors.push('Please enter a valid 6-digit PIN code');
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email || !emailRegex.test(data.email)) {
            errors.push('Please enter a valid email address');
        }
        
        // Mobile validation
        const mobileRegex = /^\d{10}$/;
        if (!data.mob || !mobileRegex.test(data.mob)) {
            errors.push('Please enter a valid 10-digit mobile number');
        }
        
        // Gender validation
        if (!data.gender) {
            errors.push('Please select your gender');
        }
        
        // Complaint validation
        if (!data.complaint || data.complaint.trim().length < 20) {
            errors.push('Please provide detailed complaint information (minimum 20 characters)');
        }
        
        return errors;
    }

    function addFieldValidation(form) {
        // PIN code validation
        const pinInput = form.querySelector('[name="pin"]');
        if (pinInput) {
            pinInput.addEventListener('input', function() {
                this.value = this.value.replace(/\D/g, '').slice(0, 6);
            });
        }
        
        // Mobile number validation
        const mobInput = form.querySelector('[name="mob"]');
        if (mobInput) {
            mobInput.addEventListener('input', function() {
                this.value = this.value.replace(/\D/g, '').slice(0, 10);
            });
        }
        
        // Email validation feedback
        const emailInput = form.querySelector('[name="email"]');
        if (emailInput) {
            emailInput.addEventListener('blur', function() {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (this.value && !emailRegex.test(this.value)) {
                    this.classList.add('is-invalid');
                } else {
                    this.classList.remove('is-invalid');
                }
            });
        }
    }

    function showSuccessMessage(message) {
        const container = getOrCreateMessageContainer();
        container.className = 'alert alert-success alert-dismissible fade show';
        container.innerHTML = `
            <strong>Success!</strong> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
    }

    function showErrorMessage(message) {
        const container = getOrCreateMessageContainer();
        container.className = 'alert alert-danger alert-dismissible fade show';
        container.innerHTML = `
            <strong>Error!</strong> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
    }

    function clearMessages() {
        const container = document.getElementById('messageContainer');
        if (container) {
            container.innerHTML = '';
            container.className = '';
        }
    }

    function getOrCreateMessageContainer() {
        let container = document.getElementById('messageContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'messageContainer';
            const form = document.getElementById('complaintForm');
            form.parentNode.insertBefore(container, form);
        }
        return container;
    }

    function resetSubmitButton(button, originalText) {
        button.disabled = false;
        button.innerHTML = originalText;
    }

    async function handleStatusCheck(event) {
        event.preventDefault();
        
        const form = event.target;
        const refId = document.getElementById('statusRefId').value.trim();
        const email = document.getElementById('statusEmail').value.trim();
        const mobile = document.getElementById('statusMobile').value.trim();
        
        const resultDiv = document.getElementById('statusResult');
        
        if (!refId && !email && !mobile) {
            resultDiv.innerHTML = '<div class="alert alert-warning">Please enter at least one search criteria</div>';
            return;
        }
        
        resultDiv.innerHTML = '<div class="text-center"><div class="spinner-border text-primary"></div><p class="mt-2">Searching...</p></div>';
        
        try {
            const params = new URLSearchParams();
            if (refId) params.append('refId', refId);
            if (email) params.append('email', email);
            if (mobile) params.append('mobile', mobile);
            
            const response = await fetch(`${API_BASE_URL}/complaints/check?${params}`);
            const result = await response.json();
            
            if (response.ok && result.success) {
                let html = '<div class="alert alert-success mb-3">Found ' + result.complaints.length + ' complaint(s)</div>';
                
                result.complaints.forEach(complaint => {
                    const statusClass = {
                        'Pending': 'warning',
                        'In Progress': 'info',
                        'Resolved': 'success',
                        'Closed': 'secondary'
                    }[complaint.status] || 'secondary';
                    
                    html += `
                        <div class="card mb-3">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-6">
                                        <h5 class="card-title">Complaint #${complaint.id}</h5>
                                        <p class="mb-1"><strong>Name:</strong> ${complaint.username}</p>
                                        <p class="mb-1"><strong>Submitted:</strong> ${new Date(complaint.submission_date).toLocaleString('en-IN')}</p>
                                        <p class="mb-1"><strong>Location:</strong> ${complaint.state}</p>
                                    </div>
                                    <div class="col-md-6 text-md-end">
                                        <span class="badge bg-${statusClass} fs-6">${complaint.status}</span>
                                        <p class="mt-2 small text-muted">${complaint.complaint.substring(0, 100)}...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                });
                
                resultDiv.innerHTML = html;
            } else {
                resultDiv.innerHTML = `<div class="alert alert-info">${result.message || 'No complaints found'}</div>`;
            }
        } catch (error) {
            console.error('Status check error:', error);
            resultDiv.innerHTML = '<div class="alert alert-danger">Failed to check status. Please try again.</div>';
        }
    }

})();
