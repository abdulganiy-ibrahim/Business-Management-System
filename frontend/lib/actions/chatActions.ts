"use server";

// The chat can't call sendChatMessage directly: it needs `api`, which comes from
// getServerApi (server only). This action runs on the server, builds `api`,
// calls the helper, and returns a simple result.

import { getServerApi } from "@/lib/api/serverApi";
import { sendChatMessage } from "../data/chatData";
import type { ChatResponse } from "@/types/chatType";
import { getErrorMessage, type ActionResult } from "./actionUtils";

export async function sendChatMessageAction(
  businessId: string,
  message: string,
): Promise<ActionResult<ChatResponse>> {
  try {
    const api = await getServerApi();
    const response = await sendChatMessage(api, businessId, { message });
    return { success: true, data: response };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}