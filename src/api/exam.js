import api from "./axios";

export const examService = {
  // --- Exam Controller Endpoints ---

  getAll: async () => {
    const response = await api.get("/api/Exam");
    return response.data?.data || response.data || [];
  },

  create: async (examData) => {
    const response = await api.post("/api/Exam", examData);
    return response.data?.data || response.data;
  },

  getByCourse: async (courseId) => {
    const response = await api.get(`/api/Exam/ByCourse/${courseId}`);
    return response.data?.data || response.data || [];
  },

  delete: async (examId) => {
    const response = await api.delete(`/api/Exam/${examId}`);
    return response.data;
  },

  update: async (examId, examData) => {
    const response = await api.patch(`/api/Exam/${examId}`, examData);
    return response.data?.data || response.data;
  },

  getDetails: async (examId) => {
    const response = await api.get(`/api/Exam/Details/${examId}`);
    return response.data?.data || response.data;
  },

  startExam: async (examId) => {
    const response = await api.post(`/api/Exam/StartExam/${examId}`);
    return response.data?.data || response.data;
  },

  generateAIExam: async (courseId, examDate, duration, requestData) => {
    const response = await api.post(
      `/api/courses/${courseId}/generate-ai-exam`,
      requestData,
      { params: { examDate, duration } },
    );

    return response.data;
  },

  // --- ExamResult Controller Endpoints ---

  submitResult: async (resultData) => {
    const response = await api.post("/api/ExamResult/Submit", resultData);
    return response.data;
  },

  getResultById: async (id) => {
    if (!id || id === "undefined" || id === "null") {
      console.warn("getResultById called with invalid ID:", id);
      return null;
    }
    const response = await api.get(`/api/ExamResult/${id}`);
    // نتحقق من وجود Wrapper أو نعيد البيانات مباشرة
    return response.data?.data || response.data;
  },

  getResultsByExam: async (examId) => {
    if (!examId || examId === "undefined" || examId === "null") {
      console.warn("getResultsByExam called with invalid examId:", examId);
      return [];
    }
    const response = await api.get(`/api/ExamResult/ByExam/${examId}`);
    return response.data?.data || response.data || [];
  },

  getStudentResults: async (courseId, studentId = null) => {
    if (!courseId || courseId === "undefined" || courseId === "null") {
      console.warn("getStudentResults called with invalid courseId:", courseId);
      return { data: [], message: "Invalid Course ID" };
    }

    const params = {};
    if (studentId && studentId !== "null" && studentId !== "undefined") {
      params.studentId = studentId;
    }

    const response = await api.get(
      `/api/ExamResult/StudentResults/${courseId}`,
      { params },
    );
    return response.data;
  },
};

export default examService;
