// import { useTranslation } from "react-i18next";

import { useChatContext } from "@/lib/context";
// import { useBrainContext } from "@/lib/context/BrainProvider/hooks/useBrainContext";
import { useFetch } from "@/lib/hooks";
import { useToast } from "@/components/ui/use-toast";

import { useHandleStream } from "./useHandleStream";

import { ChatQuestion } from "../types";
import { generatePlaceHolderMessage } from "../utils/generatePlaceHolderMessage";

interface UseChatService {
  addStreamQuestion: (
    chatId: string,
    chatQuestion: ChatQuestion,
  ) => Promise<void>;
}

export const useQuestion = (): UseChatService => {
  const { fetchInstance } = useFetch();
  //   const { currentBrain } = useBrainContext();

  //   const { t } = useTranslation(["chat"]);
  const { toast } = useToast();
  const { handleStream } = useHandleStream();
  const { removeMessage, updateStreamingHistory } = useChatContext();

  const handleFetchError = async (response: Response) => {
    if (response.status === 429) {
      toast({
        variant: "destructive",
        description: "tooManyRequests",
      });

      return;
    }

    const errorMessage = (await response.json()) as { detail: string };
    toast({
      variant: "destructive",
      description: errorMessage.detail,
    });
  };

  const addStreamQuestion = async (
    chatId: string,
    chatQuestion: ChatQuestion,
  ): Promise<void> => {
    const headers = {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    };

    const placeHolderMessage = generatePlaceHolderMessage({
      user_message: chatQuestion.question ?? "",
      chat_id: chatId,
    });
    updateStreamingHistory(placeHolderMessage);

    const body = JSON.stringify(chatQuestion);

    try {
      let url = `/chat/${chatId}/question/stream`;
      //   if (currentBrain?.id) {
      //     url += `?brain_id=${currentBrain.id}`;
      //   }
      const response = await fetchInstance.post(url, body, headers);
      if (!response.ok) {
        void handleFetchError(response);

        return;
      }

      if (response.body === null) {
        throw new Error("resposeBodyNull");
      }

      await handleStream(response.body.getReader(), () =>
        removeMessage(placeHolderMessage.message_id),
      );
    } catch (error) {
      toast({
        variant: "destructive",
        description: String(error),
      });
    }
  };

  return {
    addStreamQuestion,
  };
};
