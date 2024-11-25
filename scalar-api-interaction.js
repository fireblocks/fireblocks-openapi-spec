// At the start of your file, wrap the main functionality in a function
window.initializeApiInteractions = function() {
    console.log("Initializing API interactions...");
    
    // Hide the specified element immediately
    const elementToHide = document.querySelector('#app > div.api-references-layout > div.scalar-app.scalar-api-reference.references-layout.references-sidebar.references-sidebar-mobile-open > section > div.narrow-references-container > div:nth-child(2) > section > div > div > div:nth-child(2) > div > div > div:nth-child(2)');
    if (elementToHide) {
        elementToHide.style.display = 'none';
    }

    // Function to inject the input fields
    function injectFields() {
        try {
            console.log("Attempting to inject fields...");
            const mainContainer = document.querySelector('#app > div.api-references-layout > div.scalar-app.scalar-api-reference.references-layout.references-sidebar.references-sidebar-mobile-open > section > div.narrow-references-container > div:nth-child(2) > section > div > div > div:nth-child(2) > div > div');

            if (!mainContainer) {
                console.warn("Main container not found, retrying in 1 second...");
                setTimeout(injectFields, 1000);
                return;
            }

            // Create input container
            const inputContainer = document.createElement('div');
            inputContainer.id = 'custom-input-container';
            inputContainer.style.padding = '1rem';
            inputContainer.style.position = 'relative';

            // Create notification
            const notification = document.createElement('div');
            notification.id = 'api-notification';
            notification.style.backgroundColor = '#ff4d4f';
            notification.style.color = 'white';
            notification.style.padding = '10px';
            notification.style.borderRadius = '4px';
            notification.style.marginBottom = '1rem';
            notification.style.display = 'none';
            notification.textContent = 'Testing the Fireblocks API from the API Reference is allowed in Sandbox environments only. Please make sure to change the `BASE URL` value to the Sandbox base URL if you want to test the API from here.';

            // Create input fields container (new)
            const fieldsContainer = document.createElement('div');
            fieldsContainer.id = 'fields-container';
            fieldsContainer.style.display = 'none'; // Hidden by default

            // Create API Key label and input
            const apiKeyLabel = document.createElement('label');
            apiKeyLabel.textContent = 'API Key:';
            apiKeyLabel.style.display = 'block';
            apiKeyLabel.style.marginBottom = '5px';
            apiKeyLabel.style.fontWeight = '500';

            const apiKeyInput = document.createElement('input');
            apiKeyInput.type = 'text';
            apiKeyInput.id = 'apiKeyInput';
            apiKeyInput.style.width = '100%';
            apiKeyInput.style.marginBottom = '10px';
            apiKeyInput.style.padding = '8px';
            apiKeyInput.style.borderRadius = '4px';
            apiKeyInput.style.border = '1px solid #ddd';
            apiKeyInput.placeholder = 'Enter API Key';
            apiKeyInput.value = localStorage.getItem('apiKey') || '';

            // Create API Secret label and input
            const apiSecretLabel = document.createElement('label');
            apiSecretLabel.textContent = 'API Secret (.key file):';
            apiSecretLabel.style.display = 'block';
            apiSecretLabel.style.marginBottom = '5px';
            apiSecretLabel.style.marginTop = '10px';
            apiSecretLabel.style.fontWeight = '500';

            const apiSecretInput = document.createElement('input');
            apiSecretInput.type = 'file';
            apiSecretInput.id = 'apiSecretInput';
            apiSecretInput.accept = '.key';
            apiSecretInput.style.width = '100%';
            apiSecretInput.style.marginBottom = '15px';
            apiSecretInput.style.padding = '8px';
            apiSecretInput.style.borderRadius = '4px';
            apiSecretInput.style.border = '1px solid #ddd';

            // Create save button with updated styling
            const saveButton = document.createElement('button');
            saveButton.textContent = 'Save Credentials';
            saveButton.style.padding = '8px 16px';
            saveButton.style.backgroundColor = '#1677ff';
            saveButton.style.color = 'white';
            saveButton.style.border = 'none';
            saveButton.style.borderRadius = '4px';
            saveButton.style.cursor = 'pointer';
            saveButton.style.display = 'block';  // Changed from width: 100%
            saveButton.style.margin = '0 auto';  // Center the button
            saveButton.disabled = true;

            // Add hover effect
            saveButton.onmouseover = function() {
                if (!this.disabled) {
                    this.style.backgroundColor = '#4096ff';
                }
            };
            saveButton.onmouseout = function() {
                if (!this.disabled) {
                    this.style.backgroundColor = '#1677ff';
                }
            };

            // Function to disable inputs and switch to edit mode
            function setEditMode() {
                apiKeyInput.disabled = true;
                apiSecretInput.disabled = true;
                saveButton.textContent = 'Edit Credentials';
                saveButton.disabled = false;
                saveButton.style.backgroundColor = '#1677ff';
                saveButton.style.cursor = 'pointer';
            }

            // Function to enable inputs and switch to save mode
            function setSaveMode() {
                apiKeyInput.disabled = false;
                apiSecretInput.disabled = false;
                saveButton.textContent = 'Save Credentials';
                validateInputs(); // This will set the correct disabled state for the save button
            }

            // Update save button click handler
            saveButton.onclick = function() {
                if (saveButton.textContent === 'Save Credentials') {
                    if (apiKeyInput.value.trim() && localStorage.getItem('apiSecret')) {
                        localStorage.setItem('apiKey', apiKeyInput.value.trim());
                        alert('API credentials saved successfully!');
                        setEditMode();
                    }
                } else {
                    // Switch back to save mode
                    setSaveMode();
                }
            };

            // Update initial state based on existing credentials
            function updateInitialState() {
                const hasApiKey = localStorage.getItem('apiKey');
                const hasApiSecret = localStorage.getItem('apiSecret');
                
                if (hasApiKey && hasApiSecret) {
                    apiKeyInput.value = hasApiKey;
                    setEditMode();
                } else {
                    setSaveMode();
                }
            }

            // Call this after creating all elements and adding them to the container
            updateInitialState();

            // Update validation function
            function validateInputs() {
                if (saveButton.textContent === 'Edit Credentials') {
                    return; // Don't validate in edit mode
                }
                const hasApiKey = apiKeyInput.value.trim() !== '';
                const hasApiSecret = localStorage.getItem('apiSecret');
                saveButton.disabled = !(hasApiKey && hasApiSecret);
                saveButton.style.backgroundColor = saveButton.disabled ? '#d9d9d9' : '#1677ff';
                saveButton.style.cursor = saveButton.disabled ? 'not-allowed' : 'pointer';
            }

            // Add input event listeners
            apiKeyInput.addEventListener('input', validateInputs);
            apiSecretInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        // Store the file content
                        localStorage.setItem('apiSecret', e.target.result);
                        validateInputs();
                    };
                    reader.readAsText(file);
                }
            });

            // Add elements to the fields container
            fieldsContainer.appendChild(apiKeyLabel);
            fieldsContainer.appendChild(apiKeyInput);
            fieldsContainer.appendChild(apiSecretLabel);
            fieldsContainer.appendChild(apiSecretInput);
            fieldsContainer.appendChild(saveButton);

            // Add all elements to the main container
            inputContainer.appendChild(notification);
            inputContainer.appendChild(fieldsContainer);

            // Add the input container to the main container
            mainContainer.appendChild(inputContainer);

            // Update the visibility function
            function updateOverlayVisibility() {
                const urlElement = mainContainer.querySelector('.base-url');
                if (!urlElement) {
                    console.warn('URL element not found');
                    return;
                }

                const currentUrl = urlElement.textContent;
                
                const notification = document.getElementById('api-notification');
                const fieldsContainer = document.getElementById('fields-container');
                
                if (!notification || !fieldsContainer) {
                    console.warn('Required elements not found');
                    return;
                }
                
                if (currentUrl === 'https://api.fireblocks.io/v1') {
                    notification.style.display = 'block';
                    fieldsContainer.style.display = 'none';
                } else {
                    notification.style.display = 'none';
                    fieldsContainer.style.display = 'block';
                    validateInputs();
                }
            }

            // Initial check
            updateOverlayVisibility();
            validateInputs();

            // Set up the observer
            const observer = new MutationObserver((mutations) => {
                const urlElement = mainContainer.querySelector('.base-url');
                if (urlElement) {
                    updateOverlayVisibility();
                }
            });

            observer.observe(mainContainer, {
                childList: true,
                subtree: true,
                characterData: true
            });

        } catch (error) {
            console.error('Error injecting fields:', error);
        }
    }

    // Start the injection process
    injectFields();

    // Rest of your code (fetch interceptor, etc.)...
};

// Also auto-execute if the script is loaded directly
if (document.readyState === "complete") {
    window.initializeApiInteractions();
} else {
    window.addEventListener('load', window.initializeApiInteractions);
}
