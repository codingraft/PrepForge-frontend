import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { toast } from "sonner";
import {
  Code2,
  Users,
  Map,
  AlertTriangle,
  Gauge,
  MessageSquare,
  CalendarDays,
  CheckSquare,
  RefreshCw,
  AlertCircle,
  FileDown,
  FilePenLine,
  X,
} from "lucide-react";
import QuestionCard from "../../../components/QuestionCard";
import { generateResumePdf, getInterviewReport } from "../services/interview.api";

// ── Static mock report (replace with API report later) ──

const TABS = [
  { id: "technical", label: "Technical", fullLabel: "Technical Questions", icon: Code2 },
  { id: "behavioral", label: "Behavioral", fullLabel: "Behavioral Questions", icon: Users },
  { id: "roadmap", label: "Roadmap", fullLabel: "Preparation Roadmap", icon: Map },
];

export const InterviewReport = () => {
  const [activeTab, setActiveTab] = useState("technical");
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [resumeForm, setResumeForm] = useState({
    fullName: "",
    headline: "",
    location: "",
    contactCsv: "",
    summary: "",
    skillsCsv: "",
    achievementsText: "",
  });

  useEffect(() => {
    let cancelled = false;

    getInterviewReport(id)
      .then((res) => {
        if (!cancelled) {
          if (res?.report) setReport(res.report);
          else setError("Report not found");
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load report");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [id]);

  const retry = () => {
    setLoading(true);
    setError(null);
    setReport(null);
    getInterviewReport(id)
      .then((res) => {
        if (res?.report) setReport(res.report);
        else setError("Report not found");
      })
      .catch((err) => setError(err.message || "Failed to load report"))
      .finally(() => setLoading(false));
  };

  const extractDefaultName = (resumeText) => {
    if (!resumeText) return "";
    const firstLine = resumeText
      .split("\n")
      .map((line) => line.trim())
      .find(Boolean);
    return firstLine || "";
  };

  const openResumeEditor = () => {
    setResumeForm({
      fullName: extractDefaultName(report?.resume),
      headline: report?.title || "",
      location: "",
      contactCsv: "",
      summary: report?.selfDescription || "",
      skillsCsv: "",
      achievementsText: "",
    });
    setResumeModalOpen(true);
  };

  const handleDownloadResume = async () => {
    try {
      setDownloading(true);
      const resumeData = {
        fullName: resumeForm.fullName,
        headline: resumeForm.headline,
        location: resumeForm.location,
        summary: resumeForm.summary,
        contact: resumeForm.contactCsv
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean),
      };

      const customSkills = resumeForm.skillsCsv
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
      if (customSkills.length > 0) {
        resumeData.skills = [
          {
            category: "Core Skills",
            items: customSkills,
          },
        ];
      }

      const customBullets = resumeForm.achievementsText
        .split("\n")
        .map((v) => v.trim())
        .filter(Boolean);
      if (customBullets.length > 0) {
        resumeData.experience = [
          {
            role: resumeForm.headline || "Professional Experience",
            company: "",
            location: resumeForm.location || "",
            startDate: "",
            endDate: "Present",
            bullets: customBullets,
          },
        ];
      }

      const blob = await generateResumePdf(id, resumeData);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `resume_${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setResumeModalOpen(false);
      toast.success("Resume PDF downloaded");
    } catch (err) {
      setError(err.message || "Failed to generate resume PDF");
      toast.error(err.message || "Failed to generate resume PDF");
    } finally {
      setDownloading(false);
    }
  };

  const severityColor = (s) => {
    if (s === "high") return "severity--high";
    if (s === "medium") return "severity--med";
    return "severity--low";
  };

  const renderQuestionList = (questions, headerIcon, headerTitle, headerDesc) => (
    <div className="tab-content">
      <div className="tab-content__header">
        {headerIcon}
        <div>
          <h2>{headerTitle}</h2>
          <p>{headerDesc}</p>
        </div>
      </div>
      <div className="qa-grid">
        {questions.map((q, i) => (
          <QuestionCard
            key={i}
            index={i}
            question={q.question}
            intention={q.intention}
            answer={q.answer}
          />
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="page page--wide page--centered">
        <div className="page-loader">
          <span className="spinner spinner--lg spinner--brand" />
          <p>Loading your report…</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="page page--wide page--centered">
        <div className="empty-state">
          <div className="empty-state__icon">
            <AlertCircle size={24} />
          </div>
          <h3 className="empty-state__title">{error || "Report not found"}</h3>
          <p className="empty-state__desc">Something went wrong loading this report.</p>
          <button className="btn btn--secondary mt-4" onClick={retry}>
            <RefreshCw size={16} /> Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page page--wide">
      {/* ── Top Summary Banner ── */}
      <section className="report-summary">
        {/* Match Score */}
        <div className="score-card">
          <Gauge size={20} className="score-card__icon" />
          <div className="score-card__body">
            <span className="score-card__label">Match Score</span>
            <span className="score-card__value">{report.matchScore}%</span>
          </div>
          <div className="score-card__ring">
            <svg viewBox="0 0 36 36">
              <path
                className="score-card__track"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="score-card__progress"
                strokeDasharray={`${report.matchScore}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="report-summary__divider"></div>

        {/* Skill Gaps */}
        <div className="gaps-summary">
          <div className="gaps-summary__header">
            <h3><AlertTriangle size={16} /> Key Skill Gaps to Address</h3>
            <div className="severity-legend">
              <span><span className="legend-dot legend-dot--high" /> High</span>
              <span><span className="legend-dot legend-dot--med" /> Med</span>
              <span><span className="legend-dot legend-dot--low" /> Low</span>
            </div>
          </div>
          <div className="skill-chips">
            {report.skillGaps.map((g, i) => (
              <span key={i} className={`skill-chip ${severityColor(g.severity)}`}>
                {g.skill}
                <span className="skill-chip__dot" />
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="report-actions">
        <button className="btn btn--outline" onClick={openResumeEditor}>
          <FilePenLine size={16} /> Edit Resume
        </button>
        <button className="btn btn--accent" onClick={openResumeEditor}>
          <FileDown size={16} /> Edit & Download Resume PDF
        </button>
      </section>

      {/* ── Horizontal Navigation ── */}
      <nav className="horizontal-tabs">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`horizontal-tabs__btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={18} />
              <span>{tab.fullLabel}</span>
            </button>
          );
        })}
      </nav>

      {/* ── Main Content Area ── */}
      <main className="report-main">
        {activeTab === "technical" &&
          renderQuestionList(
            report.interviewQuestions,
            <Code2 size={24} />,
            "Technical Questions",
            `${report.interviewQuestions.length} questions based on your resume and the job description`
          )
        }

        {activeTab === "behavioral" &&
          renderQuestionList(
            report.behavioralQuestions,
            <MessageSquare size={24} />,
            "Behavioral Questions",
            `${report.behavioralQuestions.length} leadership and situational questions to prepare for`
          )
        }

        {activeTab === "roadmap" && (
          <div className="tab-content">
            <div className="tab-content__header">
              <CalendarDays size={24} />
              <div>
                <h2>Preparation Roadmap</h2>
                <p>{report.preparationPlans.length}-day sprint tailored to your specific skill gaps</p>
              </div>
            </div>

            <div className="roadmap-grid">
              {report.preparationPlans.map((day, i) => (
                <div key={i} className="roadmap-grid__card">
                  <div className="roadmap-grid__header">
                    <span className="roadmap-grid__label">Day {day.day}</span>
                    <h3>{day.focus}</h3>
                  </div>
                  <ul>
                    {day.tasks.map((t, j) => (
                      <li key={j}>
                        <CheckSquare size={16} className="icon-check" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {resumeModalOpen && (
        <div className="resume-modal__backdrop" onClick={() => setResumeModalOpen(false)}>
          <div className="resume-modal" onClick={(e) => e.stopPropagation()}>
            <div className="resume-modal__header">
              <h3>Edit Resume Details</h3>
              <button className="btn btn--ghost" onClick={() => setResumeModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <div className="resume-modal__body">
              <p className="resume-modal__hint">
                PDF files are regenerated, not edited directly. Update fields here and click "Generate & Download PDF".
              </p>

              <label>
                Full Name
                <input
                  value={resumeForm.fullName}
                  onChange={(e) =>
                    setResumeForm((prev) => ({ ...prev, fullName: e.target.value }))
                  }
                />
              </label>

              <label>
                Headline
                <input
                  value={resumeForm.headline}
                  onChange={(e) =>
                    setResumeForm((prev) => ({ ...prev, headline: e.target.value }))
                  }
                />
              </label>

              <label>
                Location
                <input
                  value={resumeForm.location}
                  onChange={(e) =>
                    setResumeForm((prev) => ({ ...prev, location: e.target.value }))
                  }
                />
              </label>

              <label>
                Contact (comma separated)
                <input
                  value={resumeForm.contactCsv}
                  onChange={(e) =>
                    setResumeForm((prev) => ({ ...prev, contactCsv: e.target.value }))
                  }
                  placeholder="email, phone, linkedin, github"
                />
              </label>

              <label>
                Summary
                <textarea
                  rows={5}
                  value={resumeForm.summary}
                  onChange={(e) =>
                    setResumeForm((prev) => ({ ...prev, summary: e.target.value }))
                  }
                />
              </label>

              <label>
                Skills (comma separated)
                <input
                  value={resumeForm.skillsCsv}
                  onChange={(e) =>
                    setResumeForm((prev) => ({ ...prev, skillsCsv: e.target.value }))
                  }
                  placeholder="React, Node.js, TypeScript, AWS"
                />
              </label>

              <label>
                Key Achievements (one per line)
                <textarea
                  rows={4}
                  value={resumeForm.achievementsText}
                  onChange={(e) =>
                    setResumeForm((prev) => ({ ...prev, achievementsText: e.target.value }))
                  }
                  placeholder="Improved API latency by 40%\nBuilt CI/CD pipeline for production releases"
                />
              </label>
            </div>

            <div className="resume-modal__footer">
              <button className="btn btn--outline" onClick={() => setResumeModalOpen(false)}>
                Cancel
              </button>
              <button
                className="btn btn--accent"
                onClick={handleDownloadResume}
                disabled={downloading}
              >
                {downloading ? "Generating..." : "Generate & Download PDF"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewReport;