import { useAxios } from "@/lib/hooks";

import {
  addQuestionAndAnswer,
  QuestionAndAnwser,
} from "./addQuestionAndAnswer";
import {
  addQuestion,
  AddQuestionParams,
  ChatMessageUpdatableProperties,
  ChatUpdatableProperties,
  createChat,
  deleteChat,
  getChatItems,
  getChats,
  updateChat,
  updateChatMessage,
  deleteChatMessage,
} from "./chat";

// TODO: split './chat.ts' into multiple files, per function for example
export const useChatApi = () => {
  const { axiosInstance } = useAxios();

  return {
    createChat: async (chatName: string) => createChat(chatName, axiosInstance),
    getChats: async () => getChats(axiosInstance),
    deleteChat: async (chatId: string) => deleteChat(chatId, axiosInstance),
    addQuestion: async (props: AddQuestionParams) =>
      addQuestion(props, axiosInstance),
    getChatItems: async (chatId: string) => getChatItems(chatId, axiosInstance),
    updateChat: async (chatId: string, props: ChatUpdatableProperties) =>
      updateChat(chatId, props, axiosInstance),
    addQuestionAndAnswer: async (
      chatId: string,
      questionAndAnswer: QuestionAndAnwser,
    ) => addQuestionAndAnswer(chatId, questionAndAnswer, axiosInstance),
    updateChatMessage: async (
      chatId: string,
      messageId: string,
      props: ChatMessageUpdatableProperties,
    ) => updateChatMessage(chatId, messageId, props, axiosInstance),
    deleteChatMessage: async (chatId: string, messageId: string) =>
      deleteChatMessage(chatId, messageId, axiosInstance),
  };
};
