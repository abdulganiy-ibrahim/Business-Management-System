"use client";

import { getNetworkErrorMessage } from "@/lib/network/networkMessages";
import { useState } from "react";
import { sendChatMessageAction } from "@/lib/actions/chatActions";
import type { ChatMessage } from "@/types/chatType";

const ERROR_TEXT = "Something went wrong while getting the answer. Please try again.";
const EMPTY_REPLY_TEXT = "I could not find an answer to that. Try asking in a different way.";

let messageCounter = 0;

function createMessage(
  role: ChatMessage["role"],
  content: string,
  isError = false,
): ChatMessage {
  messageCounter += 1;
  return { id: `message-${messageCounter}`, role, content, isError };
}

/** All the chat logic: the messages, the loading state, sending and retrying. */
export function useChat(businessId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false); // true while waiting for the AI

  // Ask the backend, then add the reply (or an error notice) to the chat
  const requestReply = async (content: string) => {
    setIsLoading(true);

    try {
      const result = await sendChatMessageAction(businessId, content);

      const reply = result.success
        ? createMessage("assistant", result.data.reply || EMPTY_REPLY_TEXT)
        : createMessage("assistant", result.message, true);

      setMessages((previous) => [...previous, reply]);
    } catch (error) {
      setMessages((previous) => [
        ...previous,
        createMessage("assistant", getNetworkErrorMessage(error) ?? ERROR_TEXT, true),
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = (text: string) => {
    const content = text.trim();
    if (!content || isLoading) return; // one question at a time

    setMessages((previous) => [...previous, createMessage("user", content)]);
    void requestReply(content);
  };

  // Ask the last question again after an error
  const retry = () => {
    if (isLoading) return;

    const lastUserMessage = [...messages]
      .reverse()
      .find((message) => message.role === "user");
    if (!lastUserMessage) return;

    setMessages((previous) => previous.filter((message) => !message.isError));
    void requestReply(lastUserMessage.content);
  };

  return { messages, isLoading, sendMessage, retry };
}