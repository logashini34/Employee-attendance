import { apiFetch } from "./api_configs";

export interface RegistrationData {
    name: string;
    email: string;
    password: string;
    role: "EMPLOYEE";
    employeeId: string;
    department?: string;
}

export default function useAuthApi() {
    async function register(data: RegistrationData): Promise<{ success: boolean; message: string }> {
        try {
            const response = await apiFetch(`/auth/register/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
                credentials: "include"
            });

            const result = await response.json();

            if (response.ok) {
                return { success: true, message: result.success || "Registration successful" };
            } else {
                return { success: false, message: result.error || "Registration failed" };
            }
        } catch (error) {
            console.error("Error registering user:", error);
            return { success: false, message: "Something went wrong. Please try again." };
        }
    }

    async function login(
        email: string,
        password: string
    ): Promise<{ success: boolean; message: string, manager?: boolean }> {
        try {
            const response = await apiFetch(`/auth/login/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
                credentials: "include"
            });

            const result = await response.json();

            if (response.ok) {
                if (result.accessToken) {
                    localStorage.setItem("accessToken", result.accessToken);
                }

                return {
                    success: true,
                    message: result.message || "Login successful",
                    manager: result.manager
                };
            } else {
                return {
                    success: false,
                    message: result.message || "Invalid email or password",
                };
            }
        } catch (error) {
            console.error("Error logging in:", error);
            return {
                success: false,
                message: "Something went wrong. Please try again.",
            };
        }
    }


    async function getCurrentUser(tries = 3) {

        if (tries == 0) {
            window.location.href = "/authenticate";
            return;
        }

        let accessToken = localStorage.getItem("accessToken"); // memory/localStorage

        if (!accessToken) {
            return;
        }

        let res = await apiFetch("/auth/me/", {
            headers: {
                "Authorization": "Bearer " + accessToken,
            },
        });

        if (res.status === 401) {
            let refreshRes = await apiFetch("/auth/refresh_token/", {
                method: "POST",
                credentials: "include"
            });

            if (refreshRes.ok) {
                let data = await refreshRes.json();
                accessToken = data.accessToken;
                localStorage.setItem("accessToken", accessToken!);

                // Retry original request
                res = await apiFetch("/auth/me/", {
                    headers: {
                        "Authorization": "Bearer " + accessToken,
                    },
                });
            } else {
                console.log("Refresh failed, user must log in again");
                getCurrentUser(tries - 1)
            }
        }

        const result = await res.json()

        return result;
    }

    return {
        register,
        login,
        getCurrentUser
    }
}