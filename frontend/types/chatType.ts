// One message in the chat, as the screen keeps it
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  isError?: boolean; // an assistant message that is really an error notice
}

// What the backend receives and returns.
// TODO: match these to your backend's chat endpoint.
export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  reply: string;
}