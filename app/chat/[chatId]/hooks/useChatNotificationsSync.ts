import { useParams } from "next/navigation";
import { useEffect } from "react";

import { useChatApi } from "@/lib/api/chat/useChatApi";

import { useChatContext } from "@/lib/context";

import { getMessagesFromChatItems } from "../utils/getMessagesFromChatItems";
import { useChatStore } from "@/app/store";

export const useChatNotificationsSync = () => {
  const { setMessages, setNotifications } = useChatContext();
  const { getChatItems } = useChatApi();
  const params = useParams();
  const chatId = params?.chatId as string | undefined;
  const chatStore = useChatStore();

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
        chatStore.addMessagesFromSupabase(message);
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
