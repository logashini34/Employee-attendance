const API_BASE_URL = "https://employee-attendance-vqj7.vercel.app/api";

export async function apiFetch(path: string, options: RequestInit = {}) {
    const token = localStorage.getItem("accessToken");

    const response = await fetch(`${API_BASE_URL}${path}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            ...(options.headers || {}),
        },
        ...options,
    });

    return response;
}
