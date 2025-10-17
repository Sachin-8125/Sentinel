import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../lib/api";

interface LoginProps {
  onLogin: () => void;
}
export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
    } catch {}
  };
}
