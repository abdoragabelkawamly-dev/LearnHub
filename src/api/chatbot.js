import api from "./axios";

const normalizeChatResponse = (payload) => {
  if (typeof payload === "string") {
    try {
      return normalizeChatResponse(JSON.parse(payload));
    } catch {
      return payload;
    }
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return payload;
  }

  if (payload.data !== undefined && payload.data !== null) {
    const { data: nestedData, ...rest } = payload;
    return normalizeChatResponse({
      ...rest,
      ...nestedData,
    });
  }

  return payload;
};

const chatbotService = {
  // POST /api/Chatbot
  ask: async (question) => {
    const response = await api.post("/api/Chatbot", {
      question: question,
    });
    return normalizeChatResponse(response.data);
  },
};

export default chatbotService;
