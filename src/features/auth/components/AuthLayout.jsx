import { Link } from "react-router";

const AuthLayout = ({ title, subtitle, children, footerText, footerLink, footerLinkText }) => {
  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-logo">PrepForge</Link>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        {children}
        <p className="auth-footer">
          {footerText} <Link to={footerLink}>{footerLinkText}</Link>
        </p>
      </div>
    </main>
  );
};

export default AuthLayout;
