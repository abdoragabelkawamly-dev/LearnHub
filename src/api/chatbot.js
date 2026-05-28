import api from "./axios";

const chatbotService = {
  // POST /api/Chatbot
  ask: async (question) => {
    const response = await api.post("/api/Chatbot", { 
      question: question 
    });
    return response.data;
  },
};

export default chatbotService;
