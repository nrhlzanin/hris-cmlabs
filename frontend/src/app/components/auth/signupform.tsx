import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: "",
    general: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let newErrors = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: "",
      general: "",
    };

    if (!firstName) newErrors.firstName = "First name is required";
    if (!lastName) newErrors.lastName = "Last name is required";
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!termsAccepted) newErrors.terms = "You must agree to the terms";    // Password validation - match backend requirements
    if (password && password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (password) {
      // Check for uppercase letter
      if (!/[A-Z]/.test(password)) {
        newErrors.password = "Password must contain at least one uppercase letter";
      }
      // Check for lowercase letter
      else if (!/[a-z]/.test(password)) {
        newErrors.password = "Password must contain at least one lowercase letter";
      }
      // Check for number
      else if (!/\d/.test(password)) {
        newErrors.password = "Password must contain at least one number";
      }
      // Check for symbol
      else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        newErrors.password = "Password must contain at least one symbol";
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: password,
          password_confirmation: confirmPassword,
          terms_accepted: termsAccepted ? "1" : "0",
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Store token and user data
        localStorage.setItem('auth_token', result.data.token);
        localStorage.setItem('user_data', JSON.stringify(result.data.user));
          // Redirect to appropriate dashboard
        if (result.data.user.role === 'super_admin' || result.data.user.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/user');
        }
      } else {        if (result.errors) {
          // Handle validation errors from backend
          const backendErrors = {
            firstName: result.errors.first_name?.[0] || "",
            lastName: result.errors.last_name?.[0] || "",
            email: result.errors.email?.[0] || "",
            password: result.errors.password?.[0] || "",
            confirmPassword: result.errors.password_confirmation?.[0] || "",
            terms: result.errors.terms_accepted?.[0] || "",
            general: "",
          };
          setErrors(backendErrors);
        } else {
          setErrors({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            terms: "",
            general: result.message || "Registration failed. Please try again.",
          });
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        terms: "",
        general: "Connection error. Please check your internet connection and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-gray-800">
      {errors.general && (
        <div className="p-3 rounded bg-red-100 border border-red-400 text-red-700 text-sm">
          {errors.general}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">First Name</label>
          <input
            type="text"
            name="first_name"
            value={firstName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
            placeholder="Enter your first name"
            disabled={isLoading}
            className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.firstName ? "border-red-500" : ""} ${isLoading ? "opacity-50" : ""}`}
          />
          {errors.firstName && <p className="text-sm text-red-700">{errors.firstName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <input
            type="text"
            name="last_name"
            value={lastName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
            placeholder="Enter your last name"
            disabled={isLoading}
            className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.lastName ? "border-red-500" : ""} ${isLoading ? "opacity-50" : ""}`}
          />
          {errors.lastName && <p className="text-sm text-red-700">{errors.lastName}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          placeholder="Enter your email"
          disabled={isLoading}
          className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? "border-red-500" : ""} ${isLoading ? "opacity-50" : ""}`}
        />
        {errors.email && <p className="text-sm text-red-700">{errors.email}</p>}
      </div>      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
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
        <p className="text-xs text-gray-600 mt-1">
          Password must be at least 8 characters with uppercase, lowercase, number, and symbol
        </p>
        {errors.password && <p className="text-sm text-red-700">{errors.password}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Confirm Password</label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="password_confirmation"
            value={confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
            placeholder="Enter your confirm password"
            disabled={isLoading}
            className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.confirmPassword ? "border-red-500" : ""} ${isLoading ? "opacity-50" : ""}`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={isLoading}
            className="absolute top-1/2 right-4 transform -translate-y-1/2"
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-sm text-red-700">{errors.confirmPassword}</p>}
      </div>

      <div className="flex items-center text-sm">
        <input
          type="checkbox"
          id="terms"
          className="mr-2"
          checked={termsAccepted}
          onChange={() => setTermsAccepted(!termsAccepted)}
          disabled={isLoading}
        />
        <label htmlFor="terms">
          I agree with the{' '}
          <a href="#" className="hover:underline">
            terms
          </a>{' '}
          of use of HRIS
        </label>
        {errors.terms && <p className="text-sm text-red-700">{errors.terms}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full bg-gradient-to-r from-blue-800 to-blue-500 hover:from-blue-600 hover:to-blue-400 text-white font-bold py-2 rounded-lg shadow-md hover:shadow-lg border-2 border-transparent hover:border-blue-300 transition-all duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isLoading ? "CREATING ACCOUNT..." : "SIGN UP"}
      </button>
    </form>
  );
}
