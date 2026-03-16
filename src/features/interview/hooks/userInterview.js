import { useContext } from "react";
import { toast } from "sonner";
import {
  getAllInterviewReports,
  generateInterviewReport,
  getInterviewReport,
} from "../services/interview.api";
import { InterviewContext } from "../interview.context";

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }

  const { loading, setLoading, error, setError, reports, setReports } = context;

  const generateReport = async ({
    jobDescription,
    resume,
    selfDescription,
  }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await generateInterviewReport({
        jobDescription,
        resume,
        selfDescription,
      });
      if (res?.report) {
        setReports((prev) => [res.report, ...prev]);
      }
      toast.success("Interview report generated");
      return res;
    } catch (error) {
      setError(error.message);
      toast.error(error.message || "Failed to generate interview report");
    } finally {
      setLoading(false);
    }
  };

  const getReportById = async (reportId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getInterviewReport(reportId);
      return res;
    } catch (error) {
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchAllReports = async ({ page = 1, limit = 8, silent = false } = {}) => {
    if (!silent) {
      setLoading(true);
      setError(null);
    }
    try {
      const res = await getAllInterviewReports({ page, limit });
      setReports(res.reports ?? []);
      return res;
    } catch (error) {
      setError(error.message);
      if (!silent) {
        toast.error(error.message || "Failed to fetch reports");
      }
      return null;
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  return {
    loading,
    error,
    reports,
    generateReport,
    getReportById,
    fetchAllReports,
  };
};
