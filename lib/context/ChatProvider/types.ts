import { ChatMessage, Notification } from "@/app/chat/[chatId]/types";
import {
    DEFAULT_MODELS,
  } from "@/app/constant";

// import { Model } from "../../types/BrainConfig";
type Model = (typeof DEFAULT_MODELS)[number]["name"];

export type ChatConfig = {
  model: Model;
  temperature: number;
  maxTokens: number;
};

export type ChatContextProps = {
  messages: ChatMessage[];
  setMessages: (history: ChatMessage[]) => void;
  updateStreamingHistory: (streamedChat: ChatMessage) => void;
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  removeMessage: (id: string) => void;
  sourcesMessageIndex: number | undefined;
  setSourcesMessageIndex: (index: number | undefined) => void;
};
