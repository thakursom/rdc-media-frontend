const BASE_URL = import.meta.env.VITE_API_URL;

let authToken = null;

// Call this after login
export const setToken = (token) => {
    authToken = token;
};

// Call this on logout
export const clearToken = () => {
    authToken = null;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
};

// Common API function supporting both JSON & FormData & Binary
export const apiRequest = async (endpoint, method = "GET", body = null, auth = false, isBinary = false) => {
    const headers = {};

    // Apply token if required
    if (auth && authToken) {
        headers["authorization"] = `Bearer ${authToken}`;
    }

    // Detect if body is FormData
    const isFormData = body instanceof FormData;

    const options = { method, headers };

    if (method !== "GET" && body) {
        // If it's FormData, don't set Content-Type manually (browser does it automatically)
        options.body = isFormData ? body : JSON.stringify(body);

        if (!isFormData) {
            headers["Content-Type"] = "application/json";
        }
    }

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, options);

        // Handle binary responses (Excel files)
        if (isBinary) {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Return blob for binary data
            const blob = await response.blob();

            // Check if it's actually an error (server might return JSON error)
            if (blob.type === 'application/json') {
                const text = await blob.text();
                const errorData = JSON.parse(text);
                throw new Error(errorData.message || 'Export failed');
            }

            return blob;
        }

        // Handle JSON responses
        const data = await response.json();

        // Auto logout if token expired
        if (data.message === "Token expired" || response.status === 401) {
            clearToken();
        }

        return { success: response.ok, data };
    } catch (error) {
        console.error("API Error:", error);

        // For binary requests, rethrow the error
        if (isBinary) {
            throw error;
        }

        return { success: false, data: { message: error.message || "Server Error" } };
    }
};