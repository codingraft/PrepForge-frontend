import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const FormInput = ({ label, type = "text", name, value, onChange, placeholder, required = true }) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className={`form-input ${focused || value ? "active" : ""} ${isPassword ? "form-input--password" : ""}`}>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        type={inputType}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        autoComplete={isPassword ? "current-password" : "off"}
      />
      {isPassword && (
        <button
          type="button"
          className="form-input__toggle"
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          tabIndex={-1}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
};

export default FormInput;
