import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

export default function SignInForm() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({
        email: "",
        password: "",
        general: "",
    });
    const [showPassword, setShowPassword] = useState(false);    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newErrors = {
            email: "",
            password: "",
            general: "",
        };

        if (!email) newErrors.email = "Email is required";
        if (!password) newErrors.password = "Password is required";

        setErrors(newErrors);

        if (Object.values(newErrors).some((error) => error)) {
            return;
        }

        setIsLoading(true);

        try {
            const success = await login(email, password, rememberMe);

            if (success) {
                // Redirect will be handled by the auth system
                router.push('/user');
            } else {
                setErrors({
                    email: "",
                    password: "",
                    general: "Invalid credentials. Please check your email and password.",
                });
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrors({
                email: "",
                password: "",
                general: "Login failed. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };return (
        <form onSubmit={handleSubmit} className="space-y-5 text-black">
            {errors.general && (
                <div className="p-3 rounded bg-red-100 border border-red-400 text-red-700 text-sm">
                    {errors.general}
                </div>
            )}
            
            <div>
                <label className="block text-sm font-medium mb-1" htmlFor="email">
                    Email or Phone Number
                </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    disabled={isLoading}
                    className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? "border-red-500" : ""} ${isLoading ? "opacity-50" : ""}`}
                />
                {errors.email && <p className="text-sm text-red-700">{errors.email}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1" htmlFor="password">
                    Password
                </label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        disabled={isLoading}
                        className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? "border-red-500" : ""} ${isLoading ? "opacity-50" : ""}`}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                        className="absolute top-1/2 right-4 transform -translate-y-1/2"
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
                {errors.password && <p className="text-sm text-red-700">{errors.password}</p>}
            </div>

            <div className="flex items-center text-sm justify-between">
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                        disabled={isLoading}
                        className="mr-2"
                    />
                    Remember Me
                </label>
                <Link href="../auth/forgot-password" className="text-dodgerblue font-semibold hover:underline">
                    Forgot Password?
                </Link>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-gradient-to-r from-blue-800 to-blue-500 hover:from-blue-500 hover:to-blue-300 text-white font-bold py-2 rounded-lg shadow-md hover:shadow-lg border-2 border-transparent hover:border-blue-300 transition-all duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {isLoading ? "SIGNING IN..." : "SIGN IN"}
            </button>
        </form>
    );
}
