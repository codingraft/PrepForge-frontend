import { useState } from "react";
import { useNavigate } from "react-router";
import AuthLayout from "../components/AuthLayout";
import FormInput from "../components/FormInput";
import PasswordStrength from "../components/PasswordStrength";
import SubmitButton from "../components/SubmitButton";
import { useAuth } from "../hooks/useAuth";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const { loading, error, handleSignup } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await handleSignup({
      username: form.username,
      email: form.email,
      password: form.password,
    });
    if (success) navigate("/dashboard");
  };

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Start building AI-powered resumes"
      footerText="Already have an account?"
      footerLink="/login"
      footerLinkText="Sign in"
    >
      {error && <p className="auth-error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Username"
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="johndoe"
        />
        <FormInput
          label="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
        />
        <FormInput
          label="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="••••••••"
        />
        <PasswordStrength password={form.password} />
        <SubmitButton label="Create account" loading={loading} />
      </form>
    </AuthLayout>
  );
};

export default Signup;
