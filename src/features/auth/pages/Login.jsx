import { useState } from "react";
import { useNavigate } from "react-router";
import AuthLayout from "../components/AuthLayout";
import FormInput from "../components/FormInput";
import SubmitButton from "../components/SubmitButton";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ identifier: "", password: "" });

  const { loading, error, handleLogin } = useAuth()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await handleLogin({ identifier: form.identifier, password: form.password });
    if (success) navigate("/dashboard");
  };



  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue building your resume"
      footerText="Don't have an account?"
      footerLink="/signup"
      footerLinkText="Sign up"
    >

      {error && <p className="auth-error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <FormInput
          label="Email or Username"
          name="identifier"
          value={form.identifier}
          onChange={handleChange}
          placeholder="you@example.com"
          required={true}
        />
        <FormInput
          label="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="••••••••"
        />
        <SubmitButton label="Sign in" loading={loading} />
      </form>
    </AuthLayout>
  );
};

export default Login;