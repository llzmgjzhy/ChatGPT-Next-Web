import { AxiosInstance } from "axios";

import { ChatMessage } from "@/app/chat/[chatId]/types";
import { MultimodalContent } from "@/app/client/api";

export type QuestionAndAnwser = {
  question: string | MultimodalContent[];
  answer: string | MultimodalContent[];
};

export const addQuestionAndAnswer = async (
  chatId: string,
  questionAndAnswer: QuestionAndAnwser,
  axiosInstance: AxiosInstance,
): Promise<ChatMessage> => {
  const response = (
    await axiosInstance.post<ChatMessage>(
      `/homework/${chatId}/question/answer`,
      questionAndAnswer,
    )
  ).data;

  return response;
};
