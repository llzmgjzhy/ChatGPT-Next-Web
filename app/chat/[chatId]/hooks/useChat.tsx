/* eslint-disable max-lines */
import { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

import { useChatApi } from "@/lib/api/chat/useChatApi";
import { useChatContext } from "@/lib/context";
// import { useBrainContext } from "@/lib/context/BrainProvider/hooks/useBrainContext";
// import { useSearchModalContext } from "@/lib/context/SearchModalProvider/hooks/useSearchModalContext";
import { getChatNameFromQuestion } from "@/lib/helpers/getChatNameFromQuestion";
// import { useOnboarding } from "@/lib/hooks/useOnboarding";
// import { useOnboardingTracker } from "@/lib/hooks/useOnboardingTracker";
// import { useEventTracking } from "@/services/analytics/june/useEventTracking";

import { useAccessStore, useAppConfig, useChatStore } from "@/app/store";
// import { useLocalStorageChatConfig } from "./useLocalStorageChatConfig";
import { useQuestion } from "./useQuestion";

import { ChatQuestion } from "../types";

export const useChat = () => {
  // const { track } = useEventTracking();

  const params = useParams();
  const [chatId, setChatId] = useState<string | undefined>(
    params?.chatId as string | undefined,
  );
  // const { isOnboarding } = useOnboarding();
  // const { trackOnboardingEvent } = useOnboardingTracker();
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const router = useRouter();
  const { messages } = useChatContext();
  // const { currentBrain, currentPromptId, currentBrainId } = useBrainContext();
  const { toast } = useToast();
  const { createChat } = useChatApi();

  const modelConfig = {
    ...useAppConfig.getState().modelConfig,
    ...useChatStore.getState().currentSession().mask.modelConfig,
    // ...{
    //   model: options.config.model,
    // },
  };
  // const {
  //   chatConfig: { model, maxTokens, temperature },
  // } = useLocalStorageChatConfig();
  // const { isVisible } = useSearchModalContext();

  const { addStreamQuestion } = useQuestion();

  const addQuestion = async (question: string, callback?: () => void) => {
    if (question === "") {
      toast({
        variant: "destructive",
        description: "ask",
      });

      return;
    }

    try {
      setGeneratingAnswer(true);

      let currentChatId = chatId;

      //if chatId is not set, create a new chat. Chat name is from the first question
      if (currentChatId === undefined) {
        const chat = await createChat(getChatNameFromQuestion(question));
        currentChatId = chat.chat_id;
        setChatId(currentChatId);
        router.push(`/chat/${currentChatId}`);
      }

      // if (isOnboarding) {
      //   void trackOnboardingEvent("QUESTION_ASKED", {
      //     brainId: currentBrainId,
      //     promptId: currentPromptId,
      //   });
      // } else {
      //   void track("QUESTION_ASKED", {
      //     brainId: currentBrainId,
      //     promptId: currentPromptId,
      //   });
      // }

      const chatQuestion: ChatQuestion = {
        model: modelConfig.model,
        question,
        temperature: modelConfig.temperature,
        max_tokens: modelConfig.max_tokens,
        // brain_id: currentBrain?.id,
        // prompt_id: currentPromptId ?? undefined,
      };

      callback?.();
      await addStreamQuestion(currentChatId, chatQuestion);
    } catch (error) {
      console.error({ error });

      if ((error as AxiosError).response?.status === 429) {
        toast({
          variant: "destructive",
          description: "limit_reached",
        });

        return;
      }

      toast({
        variant: "destructive",
        description: "error_occurred",
      });
    } finally {
      setGeneratingAnswer(false);
    }
  };

  return {
    messages,
    addQuestion,
    generatingAnswer,
    chatId,
  };
};
