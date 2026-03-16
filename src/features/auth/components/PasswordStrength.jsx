import { useMemo } from "react";

const getStrength = (password) => {
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { level: "weak", label: "Weak" };
    if (score <= 2) return { level: "fair", label: "Fair" };
    if (score <= 3) return { level: "good", label: "Good" };
    return { level: "strong", label: "Strong" };
};

const PasswordStrength = ({ password }) => {
    const { level, label } = useMemo(() => getStrength(password), [password]);

    if (!password) return null;

    const bars = 4;
    const filledBars = { weak: 1, fair: 2, good: 3, strong: 4 }[level];

    return (
        <div>
            <div className="password-strength">
                {Array.from({ length: bars }, (_, i) => (
                    <div
                        key={i}
                        className={`password-strength__bar ${i < filledBars ? `active ${level}` : ""}`}
                    />
                ))}
            </div>
            <div className={`password-strength__label ${level}`}>{label}</div>
        </div>
    );
};

export default PasswordStrength;
