import type { AxiosInstance } from "axios";
import type { ChatRequest, ChatResponse } from "@/types/chatType";

// Send a message to the AI assistant and get its reply
export async function sendChatMessage(
  api: AxiosInstance,
  businessId: string,
  request: ChatRequest
): Promise<ChatResponse> {
  // TODO: match this URL and body to your backend
  const res = await api.post<ChatResponse>(
    `/api/business/${businessId}/assistant/chat`,
    request
  );

  return res.data;
}