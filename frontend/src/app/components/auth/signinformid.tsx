import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignInFormId() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [nik, setNik] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState({
    username: "",
    nik: "",
    password: "",
    general: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let newErrors = {
      username: "",
      nik: "",
      password: "",
      general: "",
    };

    if (!username) newErrors.username = "Username is required";
    if (!nik) newErrors.nik = "Employee ID (NIK) is required";
    if (!password) newErrors.password = "Password is required";

    // Validate NIK format (16 digits)
    if (nik && nik.length !== 16) {
      newErrors.nik = "Employee ID (NIK) must be exactly 16 digits";
    }

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          login: nik, // Using NIK as login identifier
          password: password,
          remember: rememberMe,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Store token
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('auth_token', result.data.token);
        storage.setItem('user_data', JSON.stringify(result.data.user));
        
        // Redirect based on user role
        if (result.data.user.role === 'super_admin' || result.data.user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/user');
        }
      } else {
        setErrors({
          username: "",
          nik: "",
          password: "",
          general: result.message || "Login failed. Please check your credentials.",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({
        username: "",
        nik: "",
        password: "",
        general: "Connection error. Please check your internet connection and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-black">
      {errors.general && (
        <div className="p-3 rounded bg-red-100 border border-red-400 text-red-700 text-sm">
          {errors.general}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Company Username</label>
        <input
          type="text"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your Company Username"
          disabled={isLoading}
          className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.username ? "border-red-500" : ""} ${isLoading ? "opacity-50" : ""}`}
        />
        {errors.username && <p className="text-sm text-red-700">{errors.username}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">ID Employee (NIK)</label>
        <input
          type="text"
          name="nik"
          value={nik}
          onChange={(e) => setNik(e.target.value)}
          placeholder="Enter your ID Employee (16 digits)"
          disabled={isLoading}
          maxLength={16}
          className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.nik ? "border-red-500" : ""} ${isLoading ? "opacity-50" : ""}`}
        />
        {errors.nik && <p className="text-sm text-red-700">{errors.nik}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          disabled={isLoading}
          className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.password ? "border-red-500" : ""} ${isLoading ? "opacity-50" : ""}`}
        />
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
