import { useEffect, useState } from "react";
import app_icons from "../../core/ui/app_icons";
import IconButton from "../../core/ui/components/Iconbutton";
import InputField from "../../core/ui/components/Inputfield";
import useAuthApi from "../../core/api/authentication_api";
import { motion } from "framer-motion";

export default function Signin() {
    // data variables
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const defaultErrorValues = {
        email: false,
        password: false,
    };

    const [errors, setErrors] = useState(defaultErrorValues);
    const [isLoading, setIsLoading] = useState(false);

    // api functions
    const { login } = useAuthApi();

    // handlers
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isLoading) return;

        const newErrors = { ...defaultErrorValues };

        const email = formData.email.trim();
        if (email.length < 4 || !email.includes("@") || !email.includes(".")) {
            newErrors.email = true;
        }

        const password = formData.password.trim();
        if (password.length < 8) {
            newErrors.password = true;
        }

        setErrors(newErrors);

        // If any field has error, stop here
        if (Object.values(newErrors).some((err) => err)) return;

        setIsLoading(true);
        try {
            const result = await login(formData.email, formData.password);

            if (result.success) {
                // You can replace this with toast/snackbar
                alert(result.message || "Login successful");
                window.location.href = result.manager ? "/manager/dashboard" : "/employee/dashboard"; // redirect to home/dashboard
            } else {
                alert(result.message || "Login failed");
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // effect catchers
    useEffect(() => {
        console.log(formData);
    }, [formData]);

    useEffect(() => {
        document.title = "StaffSync - Sign in";
    }, []);

    return (
        <motion.main className="min-h-screen w-screen flex flex-col items-center relative overflow-x-hidden" initial={{ x: -120 }} animate={{ x: 0 }} transition={{ duration: 0.1, ease: "easeIn" }}>
            <p className="fixed top-4 left-4 text-2xl font-medium"> StaffSync </p>

            <div className="relative h-[440px] w-[450px] pt-24">
                {/* email & password section */}
                <form onSubmit={handleForm}>
                    <span className="text-center">
                        <p className="text-3xl font-medium"> Login or sign in </p>
                        <p className="text-gray-500 w-[450px] mt-3">
                            You will craft smarter scripts and can receive media, document responses, and more.
                        </p>
                    </span>

                    <span className="mt-12 w-full flex flex-col gap-6">
                        <InputField
                            name="email"
                            value={formData.email}
                            onChange={handleFormChange}
                            disabled={isLoading}
                            label="Email"
                            error={errors.email}
                            errorMessage="Email is invalid"
                            type="email"
                        />
                        <InputField
                            name="password"
                            value={formData.password}
                            onChange={handleFormChange}
                            disabled={isLoading}
                            label="Password"
                            error={errors.password}
                            errorMessage="Password must be at least 8 characters long"
                            type="password"
                        />
                    </span>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`${isLoading && "opacity-70"} px-6 py-5 bg-[#131313] cursor-pointer active:opacity-80 transition-base rounded-full text-sm text-white mt-6 w-full font-medium`}
                    >
                        {isLoading ? "Signing in..." : "Continue"}
                    </button>
                </form>
            </div>

            {/* login via providers */}
            <div className="flex gap-3 w-[450px] items-center my-12">
                <span className="flex-1 h-px bg-gray-300"></span>
                <p> or </p>
                <span className="flex-1 h-px bg-gray-300"></span>
            </div>

            <div className="flex flex-col w-[450px] gap-4 pb-24 items-center">
                <IconButton label="Sign in with Phone" icon={app_icons.phone} />
                <IconButton label="Sign in with Google" icon={app_icons.google} />
                <IconButton label="Sign in with Microsoft" icon={app_icons.microsoft} />
                <IconButton label="Sign in with Apple" icon={app_icons.apple} />

                <span className="flex gap-2 mt-8 text-sm">
                    <p> Don't have an account? </p>
                    <p
                        className="text-blue-400 underline underline-offset-2 cursor-pointer"
                        onClick={() => (window.location.href = "/auth/sign-up")}
                    >
                        Sign up
                    </p>
                </span>
            </div>
        </motion.main>
    );
}
