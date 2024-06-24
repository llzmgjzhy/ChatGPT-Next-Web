import { useParams } from "next/navigation";
import { useEffect } from "react";

import { useChatApi } from "@/lib/api/homework/useHomeworkApi";

import { useChatContext } from "@/lib/context";

import { getMessagesFromChatItems } from "@/app/homework/[homeworkId]/utils/getMessagesFromChatItems";
import { useHomeworkStore as useChatStore } from "@/app/store/homework";
import { useSupabase } from "@/lib/context/SupabaseProvider";

export const useChatNotificationsSync = () => {
  const { setMessages, setNotifications } = useChatContext();
  const { getChatItems } = useChatApi();
  const params = useParams();
  const chatId = params?.homeworkId as string | undefined;
  const chatStore = useChatStore();
  const { session } = useSupabase();

  const fetchHistory = async () => {
    if (chatId === undefined || chatId !== chatStore.currentSession().chat_id) {
      setMessages([]);
      setNotifications([]);

      return;
    }
    const chatItems = await getChatItems(chatId);
    const messagesFromChatItems = getMessagesFromChatItems(chatItems);
    if (
      messagesFromChatItems.length > 1 ||
      (messagesFromChatItems[0] && messagesFromChatItems[0].assistant !== "")
    ) {
      setMessages(messagesFromChatItems);
      chatStore.resetSession();
      for (const message of messagesFromChatItems) {
        if (
          message.user_id === session?.user.id &&
          session?.user.user_metadata.role !== "admin"
        ) {
          chatStore.addUserMessagesFromSupabase(message);
        } else {
          chatStore.addAssistantMessagesFromSupabase(message);
        }
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchHistory();
    };
    void fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  return { fetchHistory };
};
