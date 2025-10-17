import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../lib/api";
import { Rocket, AlertCircle } from "lucide-react";

interface SignupProps {
  onSignup: () => void;
}
export default function Signup({ onSignup }: SignupProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Passwords must be atleast 8 characters");
      return;
    }
    setLoading(true);
    try {
      await api.signup(email, password, name);
      onSignup();
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-teal-900/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-teal-700">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-800 rounded-full mb-4">
              <Rocket className="w-8 h-8 text-teal-300" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Join Sentinel
            </h1>
            <p className="text-gray-400">Create your mission control account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-600 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-teal-800/50 border border-teal-600 rounded-lg text-white placeholder-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-teal-800/50 border border-teal-600 rounded-lg text-white placeholder-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
                placeholder="astronaut@sentinel.space"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-teal-800/50 border border-teal-600 rounded-lg text-white placeholder-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
                placeholder="••••••••"
                required
                minLength={8}
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-teal-800/50 border border-teal-600 rounded-lg text-white placeholder-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
                placeholder="••••••••"
                required
                minLength={8}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-800 text-white font-medium rounded-lg transition duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-teal-400 hover:text-teal-300 font-medium transition"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-xs">
            Team SignShell • Astra 2025 • Gaganyaan Mission Support
          </p>
        </div>
      </div>
    </div>
  );
}
