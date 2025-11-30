import { useState, useEffect } from "react";
import useAuthApi, { type RegistrationData } from "../../core/api/authentication_api";
import app_icons from "../../core/ui/app_icons";
import InputField from "../../core/ui/components/Inputfield";
import IconButton from "../../core/ui/components/Iconbutton";
import { motion } from "framer-motion";

export default function Signup() {
    // data variables
    const [formData, setFormData] = useState<RegistrationData>({
        name: "",
        email: "",
        password: "",
        employeeId: "",
        department: "",
        role: "EMPLOYEE",
    });

    const defaultErrorValues = {
        name: false,
        email: false,
        password: false,
        employeeId: false,
        department: false,
    };

    const [errors, setErrors] = useState(defaultErrorValues);
    const [isLoading, setIsLoading] = useState(false);

    // api functions
    const { register } = useAuthApi();

    // handlers
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // form handler
    const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isLoading) return;

        // local validation state
        const newErrors = { ...defaultErrorValues };

        const email = formData.email.trim();
        if (email.length < 4 || !email.includes("@") || !email.includes(".")) {
            newErrors.email = true;
        }

        const username = formData.name.trim();
        if (username.length < 2) {
            newErrors.name = true;
        }

        const password = formData.password.trim();
        if (password.length < 8) {
            newErrors.password = true;
        }

        if (!formData.employeeId.trim()) {
            newErrors.employeeId = true;
        }

        if (!formData.department?.trim()) {
            newErrors.department = true;
        }

        setErrors(newErrors);

        if (Object.values(newErrors).some((err) => err)) return;

        setIsLoading(true);
        try {
            const response = await register(formData);
            if (response.success) {
                alert("Registration successful");
                window.location.href = "/employee/dashboard";
            } else {
                alert(response.message);
            }
        } catch (error) {
            console.error("Error registering user:", error);
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
        document.title = "StaffSync - Sign up";
    }, []);

    return (
        <motion.main className="h-screen w-screen flex flex-col items-center relative overflow-x-hidden" initial={{ x: 120 }} animate={{ x: 0 }} transition={{ duration: 0.1, ease: "easeIn" }}>
            <p className="fixed top-4 left-4 text-2xl font-medium"> StaffSync </p>

            {/* signup section */}
            <form
                className="text-center flex flex-col items-center pt-24"
                onSubmit={handleForm}
            >
                <p className="text-3xl font-medium"> Register or sign up </p>
                <p className="text-gray-500 w-[450px] mt-3">
                    You will craft smarter scripts and can receive media, document responses, and more.
                </p>

                <span className="mt-12 w-full flex flex-col gap-6">
                    <InputField
                        disabled={isLoading}
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        label="Email"
                        error={errors.email}
                        errorMessage="Email is invalid"
                        type="email"
                    />
                    <InputField
                        disabled={isLoading}
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        label="Name"
                        error={errors.name}
                        errorMessage="Name must be at least 2 characters"
                    />
                    <div className="flex gap-2 w-full justify-stretch">
                        <span className="flex-1">
                            <InputField
                                disabled={isLoading}
                                name="password"
                                value={formData.password}
                                onChange={handleFormChange}
                                label="Password"
                                error={errors.password}
                                errorMessage="Password must be at least 8 characters long"
                                type="password"
                            />
                        </span>
                        <span className="flex-1">
                            <InputField
                                disabled={isLoading}
                                name="employeeId"
                                value={formData.employeeId}
                                onChange={handleFormChange}
                                label="Employee Id"
                                type="text"
                                error={errors.employeeId}
                                errorMessage="Please enter a valid employee id"
                            />
                        </span>
                    </div>
                    <InputField
                        disabled={isLoading}
                        name="department"
                        value={formData.department}
                        onChange={handleFormChange}
                        label="Department"
                        error={errors.department}
                        errorMessage="Department must not be empty"
                    />
                </span>

                <button
                    disabled={isLoading}
                    className={`${isLoading && "opacity-70"} px-6 py-5 bg-[#131313] cursor-pointer active:opacity-80 transition-base rounded-full text-sm text-white mt-6 w-full font-medium`}
                >
                    {isLoading ? "Registering..." : "Continue"}
                </button>
            </form>

            {/* signup via providers */}
            <div className="flex gap-3 w-[450px] items-center my-12">
                <span className="flex-1 h-px bg-gray-300"></span>
                <p> or </p>
                <span className="flex-1 h-px bg-gray-300"></span>
            </div>

            <div className="flex flex-col w-[450px] gap-4 pb-24 items-center">
                <IconButton label="Sign up with Phone" icon={app_icons.phone} />
                <IconButton label="Sign up with Google" icon={app_icons.google} />
                <IconButton label="Sign up with Microsoft" icon={app_icons.microsoft} />
                <IconButton label="Sign up with Apple" icon={app_icons.apple} />

                <span className="flex gap-2 mt-8 text-sm">
                    <p> Have an account? </p>
                    <p
                        className="text-blue-400 underline underline-offset-2 cursor-pointer"
                        onClick={() => (window.location.href = "/auth/sign-in")}
                    >
                        Sign in
                    </p>
                </span>
            </div>
        </motion.main>
    );
}
