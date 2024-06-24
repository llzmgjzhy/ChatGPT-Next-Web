import { AxiosInstance } from "axios";

import {
  ChatEntity,
  ChatItem,
  ChatMessage,
  ChatQuestion,
} from "@/app/homework/[homeworkId]/types";

export type ChatUpdatableProperties = {
  chat_name?: string;
};

export type ChatMessageUpdatableProperties = {
  thumbs?: boolean | null;
};

export const createChat = async (
  name: string,
  axiosInstance: AxiosInstance
): Promise<ChatEntity> => {
  const createdChat = (
    await axiosInstance.post<ChatEntity>("/homework", { name: name })
  ).data;

  return createdChat;
};

export const getChats = async (
  axiosInstance: AxiosInstance
): Promise<ChatEntity[]> => {
  const response = await axiosInstance.get<{
    chats: ChatEntity[];
  }>(`/homework`);

  return response.data.chats;
};

export const deleteChat = async (
  chatId: string,
  axiosInstance: AxiosInstance
): Promise<void> => {
  await axiosInstance.delete(`/homework/${chatId}`);
};

export type AddQuestionParams = {
  chatId: string;
  chatQuestion: ChatQuestion;
  brainId: string;
};

export const addQuestion = async (
  { chatId, chatQuestion, brainId }: AddQuestionParams,
  axiosInstance: AxiosInstance
): Promise<ChatMessage> => {
  const response = await axiosInstance.post<ChatMessage>(
    `/homework/${chatId}/question?brain_id=${brainId}`,
    chatQuestion
  );

  return response.data;
};

export const getChatItems = async (
  chatId: string,
  axiosInstance: AxiosInstance
): Promise<ChatItem[]> =>
  (await axiosInstance.get<ChatItem[]>(`/homework/${chatId}/history`)).data;

export const updateChat = async (
  chatId: string,
  chat: ChatUpdatableProperties,
  axiosInstance: AxiosInstance
): Promise<ChatEntity> => {
  return (await axiosInstance.put<ChatEntity>(`/homework/${chatId}/metadata`, chat))
    .data;
};

export const updateChatMessage = async (
  chatId: string,
  messageId: string,
  chatMessageUpdatableProperties: ChatMessageUpdatableProperties,
  axiosInstance: AxiosInstance
): Promise<ChatItem> => {
  return (
    await axiosInstance.put<ChatItem>(
      `/homework/${chatId}/${messageId}`,
      chatMessageUpdatableProperties
    )
  ).data;
};
