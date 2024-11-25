(function() {
    console.log("Script loaded and running...");
    
    // Function to handle route changes
    function handleRouteChange() {
        console.log("Route change detected");
        // Remove existing injected elements to avoid duplicates
        const existingContainer = document.getElementById('custom-input-container');
        if (existingContainer) {
            existingContainer.remove();
        }
        // Re-run the injection process
        injectFields();
    }

    // Set up route observer using different methods to ensure we catch the change
    
    // 1. Watch for URL changes
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            console.log("URL changed to:", url);
            handleRouteChange();
        }
    }).observe(document, { subtree: true, childList: true });

    // 2. Watch for specific container changes
    const appContainer = document.querySelector('#app');
    if (appContainer) {
        new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && 
                    mutation.target.classList.contains('api-references-layout')) {
                    console.log("API reference layout changed");
                    handleRouteChange();
                }
            }
        }).observe(appContainer, { 
            childList: true, 
            subtree: true 
        });
    }

    // Test DOM query first
    const testQuery = document.querySelector('#app');
    console.log("Can find #app:", !!testQuery);
    
    // Hide the specified element immediately
    const elementToHide = document.querySelector('#app > div.api-references-layout > div.scalar-app.scalar-api-reference.references-layout.references-sidebar.references-sidebar-mobile-open > section > div.narrow-references-container > div:nth-child(2) > section > div > div > div:nth-child(2) > div > div > div:nth-child(2)');
    console.log("Found element to hide:", !!elementToHide);
    if (elementToHide) {
        elementToHide.style.display = 'none';
    }

    // Function to inject the input fields
    function injectFields() {
        try {
            console.log("Attempting to inject fields...");
            const mainContainer = document.querySelector('#app > div.api-references-layout > div.scalar-app.scalar-api-reference.references-layout.references-sidebar.references-sidebar-mobile-open > section > div.narrow-references-container > div:nth-child(2) > section > div > div > div:nth-child(2) > div > div');
            console.log("Found main container:", !!mainContainer);

            if (!mainContainer) {
                console.log("Main container not found, will retry in 2 seconds");
                setTimeout(injectFields, 2000);
                return;
            }

            console.log("Creating input container...");
            // Create input container
            const inputContainer = document.createElement('div');
            inputContainer.id = 'custom-input-container';
            inputContainer.style.padding = '1rem';
            inputContainer.style.position = 'relative';
            
            // Create notification
            const notification = document.createElement('div');
            notification.id = 'api-notification';
            notification.style.backgroundColor = 'transparent';
            notification.style.color = '#6c757d';
            notification.style.padding = '10px';
            notification.style.borderRadius = '4px';
            notification.style.marginBottom = '1rem';
            notification.style.display = 'none';
            notification.innerHTML = "You can test the API using the API Reference page only in Sandbox workspaces. <br>Ensure that the SERVER URL value above is set to the Sandbox base URL.";

            // Create input fields container
            const fieldsContainer = document.createElement('div');
            fieldsContainer.id = 'fields-container';
            fieldsContainer.style.display = 'none'; // Hidden by default

            // Create API Key label and input
            const apiKeyLabel = document.createElement('label');
            apiKeyLabel.textContent = 'API Key:';
            apiKeyLabel.style.display = 'block';
            apiKeyLabel.style.marginBottom = '5px';
            apiKeyLabel.style.fontWeight = '500';
            apiKeyLabel.style.color = '#6c757d';

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
            apiSecretLabel.style.color = '#6c757d';

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
            saveButton.style.display = 'block';
            saveButton.style.margin = '0 auto';
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
                validateInputs();
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

            // Update validation function
            function validateInputs() {
                if (saveButton.textContent === 'Edit Credentials') {
                    return;
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
                        localStorage.setItem('apiSecret', e.target.result);
                        validateInputs();
                    };
                    reader.readAsText(file);
                }
            });

            console.log("Adding elements to containers...");
            // Add elements to the fields container
            fieldsContainer.appendChild(apiKeyLabel);
            fieldsContainer.appendChild(apiKeyInput);
            fieldsContainer.appendChild(apiSecretLabel);
            fieldsContainer.appendChild(apiSecretInput);
            fieldsContainer.appendChild(saveButton);

            // Add all elements to the main container
            inputContainer.appendChild(notification);
            inputContainer.appendChild(fieldsContainer);

            console.log("Attempting to append to main container...");
            // Add the input container to the main container
            mainContainer.appendChild(inputContainer);
            console.log("Elements appended successfully");

            // Update the visibility function
            function updateOverlayVisibility() {
                const urlElement = mainContainer.querySelector('.base-url');
                if (!urlElement) {
                    console.warn('URL element not found');
                    return;
                }

                const currentUrl = urlElement.textContent;
                console.log('Current URL:', currentUrl); // Debug log
                
                const notification = document.getElementById('api-notification');
                const fieldsContainer = document.getElementById('fields-container');
                
                if (!notification || !fieldsContainer) {
                    console.warn('Required elements not found');
                    return;
                }
                
                // Show notification and hide fields for any non-sandbox URL
                if (!currentUrl.includes('sandbox-api.fireblocks.io')) {
                    console.log('Non-sandbox URL detected, showing notification'); // Debug log
                    notification.style.display = 'block';
                    fieldsContainer.style.display = 'none';
                } else {
                    console.log('Sandbox URL detected, showing fields'); // Debug log
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

            // Call this after creating all elements and adding them to the container
            updateInitialState();

        } catch (error) {
            console.error('Error in injectFields:', error);
            console.log("Will retry in 2 seconds");
            setTimeout(injectFields, 2000);
        }
    }

    // Function to dynamically load the jsrsasign library
    function loadJsrsasign(callback) {
        var script = document.createElement('script');
        script.src = "https://kjur.github.io/jsrsasign/jsrsasign-all-min.js";
        script.onload = callback;
        document.head.appendChild(script);
    }

    // Function to generate JWT using jsrsasign with detailed logging
    async function generateJWT(apiKey, apiSecret, uri, body, method) {
        await new Promise((resolve) => loadJsrsasign(resolve));

        const header = {
            alg: "RS256",
            typ: "JWT"
        };

        const nonce = Date.now().toString();
        const iat = Math.floor(Date.now() / 1000);
        const exp = iat + 30;

        let bodyToHash = '';
        
        console.log(`Non-GET request (${method}), hashing the request body as an object:`, body);
        if (body) {
            try {
                if (typeof body === 'string') {
                    bodyToHash = JSON.stringify(JSON.parse(body), null, 2); 
                } else {
                    bodyToHash = JSON.stringify(body, null, 2);
                }
            } catch (e) {
                console.error('Error parsing body JSON for hashing:', e);
            }    
        }

        const bodyHash = KJUR.crypto.Util.sha256(bodyToHash);

        const payload = {
            uri,
            nonce,
            iat,
            exp,
            sub: apiKey,
            bodyHash
        };

        const sHeader = JSON.stringify(header);
        const sPayload = JSON.stringify(payload);
        const jwt = KJUR.jws.JWS.sign("RS256", sHeader, sPayload, apiSecret);

        console.log('Generated JWT:', jwt);
        return jwt;
    }

    // Intercepting fetch requests
    const originalFetch = window.fetch;
    window.fetch = async function(input, init) {
        const proxyURL = 'https://proxy.scalar.com/?scalar_url=';
        const directURL = 'https://sandbox-api.fireblocks.io/v1';

        let url = input;
        let method = 'GET';
        if (typeof input === 'object') {
            url = input.url;
            method = input.method || 'GET';
        } else if (init && init.method) {
            method = init.method;
        }

        // First check if this is an API request we want to intercept
        const isApiRequest = url && (
            url.includes(directURL) || 
            (url.includes(proxyURL) && url.includes('sandbox-api.fireblocks.io'))
        );

        if (!isApiRequest) {
            return originalFetch(input, init);
        }

        // Handle API requests
        try {
            if (url.includes(directURL)) {
                url = `${proxyURL}${encodeURIComponent(url)}`;
                if (typeof input === 'object') {
                    input.url = url;
                } else {
                    input = url;
                }
            }

            let uri;
            if (url.includes(proxyURL)) {
                const urlParams = new URLSearchParams(url.split('?')[1]);
                const fullUri = decodeURIComponent(urlParams.get('scalar_url'));
                const match = fullUri.match(/\/v1\/.*/);
                if (!match) {
                    console.log('Not an API request, passing through:', url);
                    return originalFetch(input, init);
                }
                uri = match[0];
            } else {
                uri = url.replace(directURL, '');
            }

            const apiKey = localStorage.getItem('apiKey') || 'No API Key Found';
            const apiSecret = localStorage.getItem('apiSecret') || 'No API Secret Found';
            const body = init?.body ? init.body : '';
            const jwt = await generateJWT(apiKey, apiSecret, uri, body, method);

            init = init || {};
            init.headers = init.headers || {};
            init.headers['X-API-Key'] = apiKey;
            init.headers['Authorization'] = `Bearer ${jwt}`;

            return originalFetch(input, init);
        } catch (error) {
            console.log('Error processing API request, passing through:', error);
            return originalFetch(input, init);
        }
    };

    // Start the injection process with a slight delay
    console.log("Setting up initial injection...");
    setTimeout(injectFields, 1000);
})();
