// DOM Elements
const dobInput = document.getElementById('dob');
const ageInput = document.getElementById('age');
const photoPickerBtn = document.getElementById('photo-picker-btn');
const photoModal = document.getElementById('photo-modal');
const closeModal = document.getElementById('close-modal');
const pictureUpload = document.querySelector('.picture-upload');
const profilePicture = document.getElementById('profile-picture');
const imagePreview = document.getElementById('image-preview');
const previewContainer = document.getElementById('preview-container');
const removePhotoBtn = document.getElementById('remove-photo');
const savePhotoBtn = document.getElementById('save-photo');
const submitBtn = document.getElementById('submit-btn');
const loadingOverlay = document.getElementById('loading-overlay');
const toastContainer = document.getElementById('toast-container');
const healthInsuranceCheckbox = document.getElementById('health-insurance');
const insuranceProviderSelect = document.getElementById('insurance-provider');
const navTabs = document.querySelectorAll('.nav-tab');
const resetBtn = document.querySelector('.btn-secondary');
const autosaveIndicator = document.querySelector('.autosave-indicator');
const allFormInputs = document.querySelectorAll('input, select');

// Calculate age from DOB
function calculateAge(birthDate) {
    const today = new Date();
    const dob = new Date(birthDate);
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    
    return age;
}

// Show toast notification
function showToast(type, title, message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let iconClass;
    switch(type) {
        case 'success':
            iconClass = 'fas fa-check-circle';
            break;
        case 'error':
            iconClass = 'fas fa-exclamation-circle';
            break;
        case 'warning':
            iconClass = 'fas fa-exclamation-triangle';
            break;
        default:
            iconClass = 'fas fa-info-circle';
    }
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="${iconClass}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close">&times;</button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Add click event for close button
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toastContainer.removeChild(toast);
            }
        }, 300);
    });
    
    // Show toast with animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Auto remove after duration
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toastContainer.removeChild(toast);
            }
        }, 300);
    }, duration);
}

// Enhanced Form Validation
function validateForm() {
    const requiredFields = document.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        const fieldWrapper = field.closest('.floating-label') || field.closest('.form-field');
        
        if (!field.value.trim()) {
            fieldWrapper.classList.add('error');
            field.style.borderColor = 'var(--danger-color)';
            field.style.backgroundColor = 'rgba(224, 49, 49, 0.05)';
            
            // Add error message if not exists
            if (!fieldWrapper.querySelector('.field-error')) {
                const errorMsg = document.createElement('div');
                errorMsg.className = 'field-error';
                errorMsg.textContent = 'This field is required';
                fieldWrapper.appendChild(errorMsg);
            }
            
            // Scroll to first invalid field
            if (isValid) {
                field.scrollIntoView({ behavior: 'smooth', block: 'center' });
                field.focus();
            }
            
            isValid = false;
        } else {
            fieldWrapper.classList.remove('error');
            field.style.borderColor = '';
            field.style.backgroundColor = '';
            
            // Remove error message if exists
            const errorMsg = fieldWrapper.querySelector('.field-error');
            if (errorMsg) {
                errorMsg.remove();
            }
        }
    });
    
    return isValid;
}

// Submit form
function submitForm() {
    if (!validateForm()) {
        showToast('error', 'Validation Error', 'Please fill in all required fields.');
        return;
    }
    
    // Show loading overlay
    loadingOverlay.style.display = 'flex';
    
    // Simulate API call
    setTimeout(() => {
        loadingOverlay.style.display = 'none';
        showToast('success', 'Success', 'Patient registered successfully!');
        
        // Optionally reset form after successful submission
        // resetForm();
    }, 1500);
}

// Reset form
function resetForm() {
    const allInputs = document.querySelectorAll('input:not([type="checkbox"]), select');
    const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    
    allInputs.forEach(input => {
        input.value = '';
        input.style.borderColor = '';
        input.style.backgroundColor = '';
        
        // Reset floating label state
        const parent = input.closest('.floating-label');
        if (parent) {
            parent.classList.remove('has-value');
            parent.classList.remove('error');
        }
    });
    
    allCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Remove error messages
    const errorMsgs = document.querySelectorAll('.field-error');
    errorMsgs.forEach(msg => msg.remove());
    
    // Reset insurance provider
    insuranceProviderSelect.disabled = true;
    
    // Clear local storage
    localStorage.removeItem('patientFormData');
    
    // Reset photo
    if (previewContainer.style.display !== 'none') {
        profilePicture.value = '';
        imagePreview.src = '';
        pictureUpload.style.display = 'block';
        previewContainer.style.display = 'none';
    }
    
    // Remove consent indicator if exists
    const consentIndicator = document.getElementById('consent-indicator');
    if (consentIndicator) {
        consentIndicator.remove();
    }
    
    showToast('info', 'Form Reset', 'All fields have been cleared.');
}

// Setup Photo Upload
function setupPhotoUpload() {
    if (!photoPickerBtn || !photoModal || !closeModal || !pictureUpload) return;
    
    // Open modal
    photoPickerBtn.addEventListener('click', () => {
        photoModal.style.display = 'flex';
    });
    
    // Close modal
    closeModal.addEventListener('click', () => {
        photoModal.style.display = 'none';
    });
    
    // Close when clicking outside
    photoModal.addEventListener('click', (e) => {
        if (e.target === photoModal) {
            photoModal.style.display = 'none';
        }
    });
    
    // Trigger input when clicking on upload area
    pictureUpload.addEventListener('click', () => {
        profilePicture.click();
    });
    
    // File input change
    profilePicture.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                pictureUpload.style.display = 'none';
                previewContainer.style.display = 'block';
            };
            
            reader.readAsDataURL(file);
        }
    });
    
    // Remove photo
    removePhotoBtn.addEventListener('click', () => {
        profilePicture.value = '';
        imagePreview.src = '';
        pictureUpload.style.display = 'block';
        previewContainer.style.display = 'none';
    });
    
    // Save photo and close modal
    savePhotoBtn.addEventListener('click', () => {
        photoModal.style.display = 'none';
        showToast('success', 'Photo Uploaded', 'Profile photo has been updated.');
    });
    
    // Drag and drop functionality
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        pictureUpload.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        pictureUpload.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        pictureUpload.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        pictureUpload.classList.add('highlight');
    }
    
    function unhighlight() {
        pictureUpload.classList.remove('highlight');
    }
    
    pictureUpload.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files && files[0]) {
            const file = files[0];
            
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                
                reader.onload = (e) => {
                    imagePreview.src = e.target.result;
                    pictureUpload.style.display = 'none';
                    previewContainer.style.display = 'block';
                };
                
                reader.readAsDataURL(file);
            } else {
                showToast('error', 'Invalid File', 'Please upload an image file.');
            }
        }
    }
}

// Create Consent Form Modal
function createConsentModal() {
    // Get the modal container
    const consentModal = document.getElementById('consent-modal');
    if (!consentModal) return;
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';
    modalHeader.innerHTML = `
        <h2>Patient Consent Form</h2>
        <button class="modal-close" id="close-consent-modal">&times;</button>
    `;
    
    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';
    modalBody.innerHTML = `
        <div class="consent-options">
            <div class="consent-option" id="upload-consent">
                <i class="fas fa-upload"></i>
                <h3>Upload Existing Form</h3>
                <p>Upload a scanned or digital consent form</p>
                <input type="file" id="consent-file" accept=".pdf,.doc,.docx,.jpg,.png" style="display: none;">
            </div>
            
            <div class="consent-option" id="create-consent">
                <i class="fas fa-file-signature"></i>
                <h3>Create New Form</h3>
                <p>Generate a new consent form for this patient</p>
            </div>
        </div>
        
        <div id="consent-form-preview" style="display: none;">
            <h3>Consent Form Preview</h3>
            <div class="consent-preview-content">
                <div class="consent-form-template">
                    <h4>PATIENT CONSENT FOR TREATMENT</h4>
                    <p>I, <span class="patient-name">[Patient Name]</span>, hereby authorize the medical staff at AuroiTech Hospital to perform the necessary medical treatment, diagnostic procedures, and/or surgical procedures as deemed necessary for my health and well-being.</p>
                    
                    <p>I understand that:</p>
                    <ul>
                        <li>The practice of medicine is not an exact science and no guarantees have been made to me about the results of treatments or examinations.</li>
                        <li>I have the right to make decisions regarding my healthcare and to discuss the proposed treatment and any alternatives.</li>
                        <li>I have the right to refuse any treatment.</li>
                    </ul>
                    
                    <div class="signature-area">
                        <div class="signature-line">
                            <p>Patient Signature: ________________________</p>
                        </div>
                        <div class="signature-line">
                            <p>Date: <span class="current-date">[Current Date]</span></p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="consent-actions">
                <button class="btn btn-secondary" id="back-to-options">
                    <i class="fas fa-arrow-left"></i> Back
                </button>
                <button class="btn btn-primary" id="save-consent">
                    <i class="fas fa-save"></i> Save & Attach
                </button>
            </div>
        </div>
    `;
    
    // Assemble modal
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    consentModal.appendChild(modalContent);
    
    // Add event listeners
    document.getElementById('close-consent-modal').addEventListener('click', () => {
        consentModal.style.display = 'none';
    });
    
    // Close when clicking outside
    consentModal.addEventListener('click', (e) => {
        if (e.target === consentModal) {
            consentModal.style.display = 'none';
        }
    });
    
    // Upload consent form
    const uploadConsentBtn = document.getElementById('upload-consent');
    const consentFileInput = document.getElementById('consent-file');
    
    uploadConsentBtn.addEventListener('click', () => {
        consentFileInput.click();
    });
    
    consentFileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            const fileName = e.target.files[0].name;
            showConsentPreview();
            showToast('success', 'File Selected', `"${fileName}" has been selected.`);
        }
    });
    
    // Create new consent form
    document.getElementById('create-consent').addEventListener('click', () => {
        showConsentPreview();
        
        // Update patient name in the template if available
        const firstName = document.getElementById('first-name').value || '[First Name]';
        const lastName = document.getElementById('last-name').value || '[Last Name]';
        const patientName = firstName + ' ' + lastName;
        
        document.querySelector('.patient-name').textContent = patientName;
        
        // Update current date
        const today = new Date();
        const formattedDate = today.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        document.querySelector('.current-date').textContent = formattedDate;
    });
    
    // Back button
    document.getElementById('back-to-options').addEventListener('click', () => {
        document.getElementById('consent-form-preview').style.display = 'none';
        document.querySelector('.consent-options').style.display = 'grid';
    });
    
    // Save consent
    document.getElementById('save-consent').addEventListener('click', () => {
        consentModal.style.display = 'none';
        showToast('success', 'Consent Form Saved', 'Patient consent form has been saved and attached to the record.');
        
        // Add a visual indicator that the consent form is attached
        addConsentAttachmentIndicator();
    });
}

// Enhanced Floating Labels
function enhanceFloatingLabels() {
    const floatingLabels = document.querySelectorAll('.floating-label');
    
    floatingLabels.forEach(wrapper => {
        const input = wrapper.querySelector('input, select');
        const label = wrapper.querySelector('label');
        
        if (!input || !label) return;
        
        // Set initial state
        if (input.value || 
            (input.tagName === 'SELECT' && input.value !== '' && input.value !== null) || 
            input.type === 'date') {
            wrapper.classList.add('has-value');
        }
        
        // Handle focus events
        input.addEventListener('focus', () => {
            wrapper.classList.add('focused');
            wrapper.classList.add('has-value');
        });
        
        input.addEventListener('blur', () => {
            wrapper.classList.remove('focused');
            
            // For all inputs except date
            if (input.type !== 'date') {
                if (!input.value || (input.tagName === 'SELECT' && (input.value === '' || input.selectedIndex === 0))) {
                    wrapper.classList.remove('has-value');
                }
            }
        });
        
        // For non-date inputs, monitor changes
        if (input.type !== 'date') {
            input.addEventListener('input', () => {
                if (input.value) {
                    wrapper.classList.add('has-value');
                } else {
                    wrapper.classList.remove('has-value');
                }
            });
        }
        
        // Special handling for select elements
        if (input.tagName === 'SELECT') {
            input.addEventListener('change', () => {
                if (input.value && input.value !== '') {
                    wrapper.classList.add('has-value');
                } else {
                    wrapper.classList.remove('has-value');
                }
            });
        }
        
        // Address autofill detection
        const observer = new MutationObserver((mutations) => {
            if (input.value || 
                (input.tagName === 'SELECT' && input.value !== '' && input.value !== null)) {
                wrapper.classList.add('has-value');
            }
        });
        
        observer.observe(input, {
            attributes: true,
            attributeFilter: ['value', 'style']
        });
    });
}

// Enhanced Form Field Validation
function enhanceFormValidation() {
    const requiredFields = document.querySelectorAll('input[required], select[required]');
    
    requiredFields.forEach(field => {
        const fieldWrapper = field.closest('.floating-label') || field.closest('.form-field');
        
        field.addEventListener('blur', () => {
            validateField(field);
        });
        
        field.addEventListener('input', () => {
            // If the field was previously marked as invalid, revalidate on input
            if (fieldWrapper && fieldWrapper.classList.contains('error')) {
                validateField(field);
            }
        });
    });
    
    function validateField(field) {
        const fieldWrapper = field.closest('.floating-label') || field.closest('.form-field');
        const errorMsg = fieldWrapper.querySelector('.field-error');
        
        if (!field.value.trim()) {
            fieldWrapper.classList.add('error');
            field.style.borderColor = 'var(--danger-color)';
            field.style.backgroundColor = 'rgba(229, 62, 62, 0.05)';
            
            if (!errorMsg) {
                const error = document.createElement('div');
                error.className = 'field-error';
                error.textContent = 'This field is required';
                fieldWrapper.appendChild(error);
            }
        } else {
            fieldWrapper.classList.remove('error');
            field.style.borderColor = '';
            field.style.backgroundColor = '';
            
            if (errorMsg) {
                errorMsg.remove();
            }
        }
    }
}

// Show consent preview, hide options
function showConsentPreview() {
    document.getElementById('consent-form-preview').style.display = 'block';
    document.querySelector('.consent-options').style.display = 'none';
}

// Add consent form attachment indicator
function addConsentAttachmentIndicator() {
    // Find visit information group content
    const visitGroupContent = document.querySelector('.visit-info .group-content');
    
    if (visitGroupContent) {
        // Remove existing indicator if present
        const existingIndicator = document.getElementById('consent-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }
        
        // Create indicator
        const indicator = document.createElement('div');
        indicator.id = 'consent-indicator';
        indicator.className = 'consent-indicator';
        indicator.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>Consent form attached</span>
            <button class="btn-icon" id="view-consent">
                <i class="fas fa-eye"></i>
            </button>
        `;
        
        // Add to group
        visitGroupContent.appendChild(indicator);
        
        // Add view event
        document.getElementById('view-consent').addEventListener('click', () => {
            const consentModal = document.getElementById('consent-modal');
            if (consentModal) {
                consentModal.style.display = 'flex';
                showConsentPreview();
            }
        });
    }
}

// Connect consent button
function connectConsentButton() {
    const consentBtn = document.querySelector('.consent-btn');
    
    if (consentBtn) {
        consentBtn.addEventListener('click', () => {
            const consentModal = document.getElementById('consent-modal');
            consentModal.style.display = 'flex';
            
            // Reset to options view when opening
            document.getElementById('consent-form-preview').style.display = 'none';
            document.querySelector('.consent-options').style.display = 'grid';
        });
    }
}

// Add Form Autosave Feature
function addFormAutosave() {
    const allInputs = document.querySelectorAll('input, select');
    
    let autosaveTimeout;
    
    // Add event listeners to all form fields
    allInputs.forEach(input => {
        input.addEventListener('change', triggerAutosave);
        if (input.type !== 'checkbox') {
            input.addEventListener('input', triggerAutosave);
        }
    });
    
    function triggerAutosave() {
        // Clear previous timeout
        clearTimeout(autosaveTimeout);
        
        // Show autosave indicator
        autosaveIndicator.style.opacity = '1';
        autosaveIndicator.innerHTML = `
            <i class="fas fa-save"></i>
            <span>Autosaving...</span>
        `;
        
        // Set new timeout
        autosaveTimeout = setTimeout(() => {
            // Save form data to localStorage
            saveFormData();
            
            // Indicate save complete
            autosaveIndicator.innerHTML = `
                <i class="fas fa-check"></i>
                <span>Saved</span>
            `;
            
            // Hide indicator after a delay
            setTimeout(() => {
                autosaveIndicator.style.opacity = '0';
            }, 1500);
        }, 1000);
    }
    
    function saveFormData() {
        const formData = {};
        
        allInputs.forEach(input => {
            if (input.type === 'checkbox') {
                formData[input.id] = input.checked;
            } else {
                formData[input.id] = input.value;
            }
        });
        
        localStorage.setItem('patientFormData', JSON.stringify(formData));
    }
    
    // Load saved data on page load
    function loadSavedFormData() {
        const savedData = localStorage.getItem('patientFormData');
        
        if (savedData) {
            const formData = JSON.parse(savedData);
            
            Object.keys(formData).forEach(key => {
                const input = document.getElementById(key);
                
                if (input) {
                    if (input.type === 'checkbox') {
                        input.checked = formData[key];
                    } else {
                        input.value = formData[key];
                    }
                    
                    // Update floating label state for inputs with values
                    if (input.value && input.closest('.floating-label')) {
                        input.closest('.floating-label').classList.add('has-value');
                    }
                }
            });
            
            // Calculate age if DOB is saved
            const dobInput = document.getElementById('dob');
            const ageInput = document.getElementById('age');
            
            if (dobInput.value && ageInput) {
                const age = calculateAge(dobInput.value);
                ageInput.value = age;
            }
            
            // Update insurance provider select based on checkbox
            const healthInsuranceCheckbox = document.getElementById('health-insurance');
            const insuranceProviderSelect = document.getElementById('insurance-provider');
            
            if (healthInsuranceCheckbox && insuranceProviderSelect) {
                insuranceProviderSelect.disabled = !healthInsuranceCheckbox.checked;
            }
            
            showToast('info', 'Form Restored', 'Your previously saved form data has been loaded.');
        }
    }
    
    // Load saved data on page load
    loadSavedFormData();
}

// Setup theme switcher
function setupThemeSwitcher() {
    const themeBoxes = document.querySelectorAll('.theme-box');
    const root = document.documentElement;
    
    // Default theme (blue)
    const blueTheme = {
        '--primary-color': '#2b6cb0',
        '--primary-light': '#4299e1',
        '--secondary-color': '#63b3ed',
        '--success-color': '#38a169',
        '--warning-color': '#ed8936',
        '--danger-color': '#e53e3e',
        '--light-color': '#f8fafc',
        '--dark-color': '#1a202c',
        '--gray-color': '#718096',
        'header-bg': 'linear-gradient(90deg, #e5e8ec 0%, #dfeaf4 100%)',
        'page-title-bg': 'linear-gradient(90deg, #4575a8 0%, #90b5d3 100%)',
        'footer-bg': 'linear-gradient(90deg, #203661 0%, #253d68 100%)',
        'body-bg': '#f0f4f8'
    };
    
    // Dark Green & Black theme
    const darkTheme = {
        '--primary-color': '#276749',
        '--primary-light': '#48bb78',
        '--secondary-color': '#38a169',
        '--success-color': '#68d391',
        '--warning-color': '#f6ad55',
        '--danger-color': '#fc8181',
        '--light-color': '#edf2f7',
        '--dark-color': '#1a202c',
        '--gray-color': '#718096',
        'header-bg': 'linear-gradient(90deg, #1a202c 0%, #2d3748 100%)',
        'page-title-bg': 'linear-gradient(90deg, #276749 0%, #38a169 100%)',
        'footer-bg': 'linear-gradient(90deg, #1a202c 0%, #2d3748 100%)',
        'body-bg': '#2d3748'
    };
    
    // Purple Gradient theme
    const purpleTheme = {
        '--primary-color': '#553c9a',
        '--primary-light': '#805ad5',
        '--secondary-color': '#9f7aea',
        '--success-color': '#38a169',
        '--warning-color': '#ed8936',
        '--danger-color': '#e53e3e',
        '--light-color': '#f8fafc',
        '--dark-color': '#44337a',
        '--gray-color': '#718096',
        'header-bg': 'linear-gradient(90deg, #e9d8fd 0%, #d6bcfa 100%)',
        'page-title-bg': 'linear-gradient(90deg, #6b46c1 0%, #805ad5 100%)',
        'footer-bg': 'linear-gradient(90deg, #553c9a 0%, #6b46c1 100%)',
        'body-bg': '#f3ebff'
    };
    
    // Apply theme function
    function applyTheme(theme) {
        for (const [key, value] of Object.entries(theme)) {
            if (key.startsWith('--')) {
                root.style.setProperty(key, value);
            } else if (key === 'header-bg') {
                document.querySelector('header').style.background = value;
            } else if (key === 'footer-bg') {
                document.querySelector('footer').style.background = value;
            } else if (key === 'body-bg') {
                document.body.style.background = value;
            }
        }
    }
    
    // Add event listeners to theme boxes if they exist
    if (themeBoxes.length > 0) {
        themeBoxes.forEach(box => {
            box.addEventListener('click', () => {
                // Remove active class from all
                themeBoxes.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked
                box.classList.add('active');
                
                // Apply theme based on class
                if (box.classList.contains('blue-theme')) {
                    applyTheme(blueTheme);
                    document.body.classList.remove('dark-mode');
                } else if (box.classList.contains('dark-theme')) {
                    applyTheme(darkTheme);
                    document.body.classList.add('dark-mode');
                } else if (box.classList.contains('purple-theme')) {
                    applyTheme(purpleTheme);
                    document.body.classList.remove('dark-mode');
                }
            });
        });
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    // Create consent modal
    createConsentModal();
    
    // Connect consent button
    connectConsentButton();
    
    // Setup photo upload
    setupPhotoUpload();
    
    // Enhanced floating labels
    enhanceFloatingLabels();
    
    // Enhanced form validation
    enhanceFormValidation();
    
    // Add form autosave
    addFormAutosave();
    
    // Theme switcher
    setupThemeSwitcher();
    
    // DOB and Age calculation
    if (dobInput) {
        dobInput.addEventListener('change', (e) => {
            if (e.target.value) {
                const age = calculateAge(e.target.value);
                ageInput.value = age;
                // Ensure the age input's floating label is activated
                if (ageInput.parentElement) {
                    ageInput.parentElement.classList.add('has-value');
                }
            } else {
                ageInput.value = '';
                if (ageInput.parentElement) {
                    ageInput.parentElement.classList.remove('has-value');
                }
            }
        });
    }
    
    // Health insurance toggle
    if (healthInsuranceCheckbox && insuranceProviderSelect) {
        healthInsuranceCheckbox.addEventListener('change', (e) => {
            insuranceProviderSelect.disabled = !e.target.checked;
            if (e.target.checked) {
                insuranceProviderSelect.focus();
            }
        });
    }
    
    // Submit button
    if (submitBtn) {
        submitBtn.addEventListener('click', submitForm);
    }
    
    // Reset button
    if (resetBtn) {
        resetBtn.addEventListener('click', resetForm);
    }
    
    // Tab navigation
    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelector('.nav-tab.active').classList.remove('active');
            tab.classList.add('active');
            
            // Show toast
            showToast('info', 'Navigation', `Navigating to ${tab.textContent.trim()} page`);
        });
    });
});