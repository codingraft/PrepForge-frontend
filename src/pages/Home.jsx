import { Link } from "react-router";
import { useAuth } from "../features/auth/hooks/useAuth";
import { FileText, Brain, Target, Upload, Sparkles, ClipboardCheck } from "lucide-react";

const FEATURES = [
  {
    icon: Upload,
    title: "Upload & Analyze",
    description: "Drop your resume and job description — our AI parses both instantly to find matches and gaps.",
  },
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description: "Get tailored interview questions, model answers, and a personalized preparation roadmap.",
  },
  {
    icon: Target,
    title: "Targeted Prep",
    description: "Focus on what matters. Identify skill gaps and practice the exact questions interviewers will ask.",
  },
];

const STEPS = [
  {
    title: "Paste the job description",
    description: "Copy the full job listing so the AI understands exactly what the employer is looking for.",
  },
  {
    title: "Upload your resume",
    description: "Drop your PDF resume or write a quick summary of your experience and skills.",
  },
  {
    title: "Get your strategy",
    description: "Receive a tailored report with interview questions, answers, skill gap analysis, and a study plan.",
  },
];

const STATS = [
  { value: "10K+", label: "Reports Generated" },
  { value: "94%", label: "Success Rate" },
  { value: "2.5K+", label: "Happy Users" },
];

const Home = () => {
  const { user, handleLogout, loading } = useAuth();

  return (
    <main className="home">
      {/* ── Navbar ── */}
      <nav className="home-nav">
        <span className="home-nav__logo">PrepForge</span>
        <div className="home-nav__actions">
          {user ? (
            <button className="btn btn--ghost" onClick={handleLogout} disabled={loading}>
              Sign out
            </button>
          ) : (
            <>
              <Link to="/login" className="btn btn--ghost">Sign in</Link>
              <Link to="/signup" className="btn btn--primary">Get started</Link>
            </>
          )}
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="home-hero">
        <div className="home-hero__badge">✨ Powered by advanced AI models</div>
        <h1 className="home-hero__title">
          Ace your next interview<br />
          <span className="home-hero__accent">with AI precision</span>
        </h1>
        <p className="home-hero__subtitle">
          Upload your resume, paste a job description, and get a tailored,
          data-driven interview prep report in seconds.
        </p>
        <div className="home-hero__cta">
          {user ? (
            <Link to="/dashboard" className="btn btn--primary btn--lg">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/signup" className="btn btn--primary btn--lg">
                Get started — it's free
              </Link>
              <Link to="/login" className="btn btn--outline btn--lg">
                Sign in
              </Link>
            </>
          )}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="home-features">
        <div className="home-features__header">
          <h2>Everything you need to prepare</h2>
          <p>From resume analysis to mock interview questions — we've got you covered.</p>
        </div>
        <div className="home-features__grid">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="feature-card">
              <div className="feature-card__icon">
                <Icon size={22} />
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="home-steps">
        <div className="home-steps__header">
          <h2>How it works</h2>
          <p>Three simple steps to your personalized interview strategy.</p>
        </div>
        <div className="home-steps__list">
          {STEPS.map(({ title, description }, i) => (
            <div key={title} className="step-item">
              <div className="step-item__marker">
                <div className="step-item__number">{i + 1}</div>
                {i < STEPS.length - 1 && <div className="step-item__line" />}
              </div>
              <div className="step-item__content">
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="home-stats">
        <div className="home-stats__grid">
          {STATS.map(({ value, label }) => (
            <div key={label} className="stat-item">
              <div className="stat-item__value">{value}</div>
              <div className="stat-item__label">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="home-footer">
        <p>&copy; {new Date().getFullYear()} PrepForge. All rights reserved.</p>
      </footer>
    </main>
  );
};

export default Home;
