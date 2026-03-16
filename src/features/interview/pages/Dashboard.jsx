import { useState, useRef, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Briefcase,
  UploadCloud,
  FileText,
  PenLine,
  Sparkles,
  X,
  CheckCircle2,
  ChevronRight,
  Clock,
  Loader2,
} from "lucide-react";
import EmptyState from "../../../components/EmptyState";
import { useInterview } from "../hooks/userInterview";

const Dashboard = () => {
  const { loading, error, reports, generateReport, fetchAllReports } = useInterview();
  const [reportsPage, setReportsPage] = useState(1);
  const [reportsMeta, setReportsMeta] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const loadReports = async (page = 1) => {
    const res = await fetchAllReports({ page, limit: 8, silent: true });
    if (res?.pagination) {
      setReportsPage(res.pagination.page);
      setReportsMeta(res.pagination);
    }
  };

  useEffect(() => {
    loadReports(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") setResumeFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") setResumeFile(file);
  };

  const handleRemoveFile = () => {
    setResumeFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleGenerate = async () => {
    const data = await generateReport({
      jobDescription,
      resume: resumeFile,
      selfDescription,
    });
    if (data) {
      setJobDescription("");
      setSelfDescription("");
      handleRemoveFile();
      loadReports(1);
      navigate(`/interview/${data.report._id}`);
    }
  };

  const steps = useMemo(
    () => ({
      job: jobDescription.trim().length > 0,
      profile: !!resumeFile || selfDescription.trim().length > 0,
    }),
    [jobDescription, resumeFile, selfDescription],
  );

  const completedCount = Object.values(steps).filter(Boolean).length;
  const isReady = steps.job && steps.profile;

  return (
    <main className="page page--wide">
      <div className="page__header text-center">
        <span className="pill mx-auto">New Report</span>
        <h1 className="mt-4">Interview Prep Wizard</h1>
        <p>
          Complete the steps below to generate your personalised interview
          strategy.
        </p>
        {error && (
          <div className="alert alert--error mt-4">
            <span className="icon">
              <X size={16} />
            </span>
            {error}
          </div>
        )}
      </div>

      {/* ── Unified Wizard Panel ── */}
      <div className={`wizard ${loading ? "wizard--loading" : ""}`}>
        {loading && (
          <div className="wizard__overlay">
            <Loader2 size={32} className="spinner--icon" />
            <p>Generating your interview strategy…</p>
            <span>This usually takes 20–40 seconds</span>
          </div>
        )}
        {/* Top Progress */}
        <div className="wizard__progress">
          <div className="wizard__progress-bar">
            <div
              className="wizard__progress-fill"
              style={{ width: `${(completedCount / 2) * 100}%` }}
            />
          </div>
          <span>{completedCount}/2 steps completed</span>
        </div>

        {/* Wizard Body (Split Panes) */}
        <div className="wizard__body">
          {/* Step 1: Target Role */}
          <div
            className={`wizard-pane ${steps.job ? "wizard-pane--done" : ""}`}
          >
            <div className="wizard-pane__header">
              <div className="wizard-pane__badge">
                {steps.job ? <CheckCircle2 size={16} /> : <span>1</span>}
              </div>
              <div className="wizard-pane__title">
                <h2>Target Role</h2>
                <p>Paste the full job listing description.</p>
              </div>
            </div>

            <div className="wizard-pane__content">
              <textarea
                className="field field--grow"
                placeholder="e.g. We are looking for a Senior Frontend Engineer with deep React expertise..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                disabled={loading}
              />
              {steps.job && (
                <span className="wizard-pane__status">
                  <CheckCircle2 size={14} /> Completed
                </span>
              )}
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="wizard__divider" />

          {/* Step 2: Background */}
          <div
            className={`wizard-pane ${steps.profile ? "wizard-pane--done" : ""}`}
          >
            <div className="wizard-pane__header">
              <div className="wizard-pane__badge">
                {steps.profile ? <CheckCircle2 size={16} /> : <span>2</span>}
              </div>
              <div className="wizard-pane__title">
                <h2>Your Background</h2>
                <p>Upload your resume or write a short summary.</p>
              </div>
            </div>

            <div className="wizard-pane__content">
              {/* Upload zone */}
              <div
                className={`dropzone ${isDragging ? "dropzone--drag" : ""} ${resumeFile ? "dropzone--file" : ""}`}
                onClick={() => !resumeFile && fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                {resumeFile ? (
                  <div className="dropzone__uploaded">
                    <FileText size={28} className="icon--accent" />
                    <div className="dropzone__file-meta">
                      <strong>{resumeFile.name}</strong>
                      <span>{(resumeFile.size / 1024).toFixed(0)} KB</span>
                    </div>
                    <button
                      type="button"
                      className="dropzone__remove"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile();
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="dropzone__empty">
                    <UploadCloud size={24} className="icon--accent" />
                    <div>
                      <strong>Upload resume PDF</strong>
                      <span>Drag & drop or click</span>
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  hidden
                />
              </div>

              <div className="or-divider">
                <span>or</span>
              </div>

              <div className="field-wrap">
                <div className="field-wrap__icon">
                  <PenLine size={16} />
                </div>
                <textarea
                  className="field field--short"
                  rows={4}
                  placeholder="3 yrs React/Node, built design systems at scale..."
                  value={selfDescription}
                  onChange={(e) => setSelfDescription(e.target.value)}
                  disabled={loading}
                />
              </div>
              {steps.profile && (
                <span className="wizard-pane__status">
                  <CheckCircle2 size={14} /> Completed
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Wizard Footer / CTA */}
        <div className="wizard__footer">
          <div className="wizard__footer-info">
            <Sparkles size={18} className="icon--accent" />
            <div>
              <strong>Ready to generate?</strong>
              <span>AI analysis takes ~30 seconds</span>
            </div>
          </div>
          <button
            className="btn btn--cta"
            disabled={!isReady || loading}
            onClick={handleGenerate}
          >
            {loading ? (
              <>
                <span className="spinner" /> Generating…
              </>
            ) : (
              <>
                Generate Report
                <ChevronRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── History ── */}
      <section className="history-section mt-12">
        <div className="history-section__header">
          <h2>
            <Clock size={18} /> Past Reports
          </h2>
        </div>
        {reports.length === 0 ? (
         <EmptyState
          icon={FileText}
          title="No reports yet"
          description="Generate your first interview strategy above and it will appear here."
        />
        ) : (
          <>
            <div className="history-list">
              {reports.map((report) => (
                <div
                  key={report._id}
                  className="history-card"
                  onClick={() => navigate(`/interview/${report._id}`)}
                >
                  <div className="history-card__header">
                    <FileText size={16} />
                    <h3>{report.title || "Untitled Report"}</h3>
                  </div>
                  <div className="history-card__footer">
                    <span className="history-card__date">
                      {new Date(report.createdAt).toLocaleString()}
                    </span>
                    {report.matchScore != null && (
                      <span className="history-card__score">
                        {report.matchScore}% match
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="history-pagination">
              <button
                className="btn btn--outline"
                onClick={() => loadReports(reportsPage - 1)}
                disabled={!reportsMeta.hasPrevPage}
              >
                Previous
              </button>
              <span>
                Page {reportsMeta.page} of {reportsMeta.totalPages} ({reportsMeta.total} total)
              </span>
              <button
                className="btn btn--outline"
                onClick={() => loadReports(reportsPage + 1)}
                disabled={!reportsMeta.hasNextPage}
              >
                Next
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default Dashboard;
