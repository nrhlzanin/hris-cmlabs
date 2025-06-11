import { useState, ChangeEvent, FormEvent } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface PasswordInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  disabled: boolean;
  error?: string;
  showPasswordState: boolean;
  toggleShowPassword: () => void;
  helpText?: string;
}

function PasswordInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  disabled,
  error,
  showPasswordState,
  toggleShowPassword,
  helpText
}: PasswordInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="relative">
        <input
          type={showPasswordState ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? "border-red-500" : "border-gray-300"} ${disabled ? "opacity-50" : ""}`}
        />
        <button
          type="button"
          onClick={toggleShowPassword}
          disabled={disabled}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          aria-label={showPasswordState ? "Hide password" : "Show password"}
        >
          {showPasswordState ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
        </button>
      </div>
      {helpText && !error && <p className="text-xs text-gray-600 mt-1">{helpText}</p>}
      {error && <p className="text-sm text-red-700 mt-1">{error}</p>}
    </div>
  );
}

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = { firstName: "", lastName: "", email: "", password: "", confirmPassword: "", terms: "", general: "" };
    if (!firstName) newErrors.firstName = "First name is required";
    if (!lastName) newErrors.lastName = "Last name is required";
    if (!email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Please enter a valid email address";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 8) newErrors.password = "Password must be at least 8 characters";
    else if (!/[A-Z]/.test(password)) newErrors.password = "Password must contain an uppercase letter";
    else if (!/[a-z]/.test(password)) newErrors.password = "Password must contain a lowercase letter";
    else if (!/\d/.test(password)) newErrors.password = "Password must contain a number";
    else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) newErrors.password = "Password must contain a symbol";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!termsAccepted) newErrors.terms = "You must agree to the terms";
    setErrors(newErrors);
    if (Object.values(newErrors).some((error) => error)) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
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
        localStorage.setItem('auth_token', result.data.token);
        localStorage.setItem('user_data', JSON.stringify(result.data.user));
        if (result.data.user.role === 'super_admin' || result.data.user.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/user');
        }
      } else {
        if (result.errors) {
          const backendErrors = {
            firstName: result.errors.first_name?.[0] || "",
            lastName: result.errors.last_name?.[0] || "",
            email: result.errors.email?.[0] || "",
            password: result.errors.password?.[0] || "",
            confirmPassword: "",
            terms: result.errors.terms_accepted?.[0] || "",
            general: result.message || "",
          };
          setErrors(backendErrors);
        } else {
          setErrors((prev) => ({ ...prev, general: result.message || "Registration failed. Please try again." }));
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors((prev) => ({ ...prev, general: "Connection error. Please check your internet and try again." }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-gray-800">
      {errors.general && (
        <div className="p-3 rounded-lg bg-red-100 border border-red-400 text-red-700 text-sm">
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
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter your first name"
            disabled={isLoading}
            className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.firstName ? "border-red-500" : "border-gray-300"} ${isLoading ? "opacity-50" : ""}`}
          />
          {errors.firstName && <p className="text-sm text-red-700 mt-1">{errors.firstName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <input
            type="text"
            name="last_name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter your last name"
            disabled={isLoading}
            className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.lastName ? "border-red-500" : "border-gray-300"} ${isLoading ? "opacity-50" : ""}`}
          />
          {errors.lastName && <p className="text-sm text-red-700 mt-1">{errors.lastName}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          disabled={isLoading}
          className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? "border-red-500" : "border-gray-300"} ${isLoading ? "opacity-50" : ""}`}
        />
        {errors.email && <p className="text-sm text-red-700 mt-1">{errors.email}</p>}
      </div>
      
      <PasswordInput
        label="Password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        disabled={isLoading}
        error={errors.password}
        showPasswordState={showPassword}
        toggleShowPassword={() => setShowPassword(!showPassword)}
        helpText="At least 8 characters with uppercase, lowercase, number, and symbol."
      />

      <PasswordInput
        label="Confirm Password"
        name="password_confirmation"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm your password"
        disabled={isLoading}
        error={errors.confirmPassword}
        showPasswordState={showConfirmPassword}
        toggleShowPassword={() => setShowConfirmPassword(!showConfirmPassword)}
      />

      <div className="flex items-center text-sm">
        <input
          type="checkbox"
          id="terms"
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
          checked={termsAccepted}
          onChange={() => setTermsAccepted(!termsAccepted)}
          disabled={isLoading}
        />
        <label htmlFor="terms">
          I agree with the{' '}
          <a href="#" className="font-medium text-blue-600 hover:underline">
            terms of use
          </a>
        </label>
      </div>
        {errors.terms && <p className="text-sm text-red-700 -mt-3">{errors.terms}</p>}


      <button
        type="submit"
        disabled={isLoading}
        className={`w-full bg-gradient-to-r from-blue-700 to-blue-500 text-white font-bold py-2.5 rounded-lg shadow-md transition-all duration-300 flex items-center justify-center ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:from-blue-600 hover:to-blue-400 hover:shadow-lg'}`}
      >
        {isLoading ? (
            <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                CREATING ACCOUNT...
            </>
        ) : "CREATE ACCOUNT"}
      </button>
    </form>
  );
}