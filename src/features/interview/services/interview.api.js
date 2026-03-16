import axios from "axios";
import { parseApiError } from "../../../utils/api-error";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  withCredentials: true,
});

export const generateInterviewReport = async ({
  jobDescription,
  resume,
  selfDescription,
}) => {
  try {
    const formData = new FormData();
    formData.append("jobDescription", jobDescription);
    if (resume) formData.append("resume", resume);
    if (selfDescription) formData.append("selfDescription", selfDescription);

    const res = await api.post("/api/interview/generate", formData);
    return res.data;
  } catch (error) {
    throw new Error(await parseApiError(error, "Failed to generate report"));
  }
};

export const getInterviewReport = async (reportId) => {
  try {
    const res = await api.get(`/api/interview/report/${reportId}`);
    return res.data;
  } catch (error) {
    throw new Error(await parseApiError(error, "Failed to fetch report"));
  }
};

export const getAllInterviewReports = async ({ page = 1, limit = 8 } = {}) => {
  try {
    const res = await api.get("/api/interview/reports", {
      params: { page, limit },
    });
    return res.data;
  } catch (error) {
    throw new Error(await parseApiError(error, "Failed to fetch reports"));
  }
};

export const generateResumePdf = async (reportId, resumeData) => {
  try {
    const res = await api.post(
      `/api/interview/resume/pdf/${reportId}`,
      { resumeData },
      { responseType: "blob" },
    );
    return res.data;
  } catch (error) {
    throw new Error(await parseApiError(error, "Failed to generate resume PDF"));
  }
};
