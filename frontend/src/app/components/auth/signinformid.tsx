import { useState } from "react";
import Link from "next/link";

export default function SignInFormId() {
  const [username, setUsername] = useState("");
  const [nik, setNik] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [errors, setErrors] = useState({
    username: "",
    nik: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let newErrors = {
      username: "",
      nik: "",
      password: "",
    };

    if (!username) newErrors.username = "Username is required";
    if (!nik) newErrors.nik = "Employee ID (NIK) is required";
    if (!password) newErrors.password = "Password is required";

    setErrors(newErrors);

    if (!Object.values(newErrors).some((error) => error)) {
      console.log("Form submitted");
      // Handle form submission here
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-black">
      <div>
        <label className="block text-sm font-medium mb-1">Company Username</label>
        <input
          type="text"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your Company Username"
          className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.username ? "border-red-500" : ""}`}
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
          placeholder="Enter your ID Employee"
          className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.nik ? "border-red-500" : ""}`}
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
          className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.password ? "border-red-500" : ""}`}
        />
        {errors.password && <p className="text-sm text-red-700">{errors.password}</p>}
      </div>

      <div className="flex items-center text-sm justify-between">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
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
        className="w-full bg-gradient-to-r from-blue-800 to-blue-500 hover:from-blue-500 hover:to-blue-300 text-white font-bold py-2 rounded-lg shadow-md hover:shadow-lg border-2 border-transparent hover:border-blue-300 transition-all duration-300"
      >
        SIGN IN
      </button>
    </form>
  );
}
