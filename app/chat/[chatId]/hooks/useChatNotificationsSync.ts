import { useParams } from "next/navigation";
import { useEffect } from "react";

import { useChatApi } from "@/lib/api/chat/useChatApi";

import { useChatContext } from "@/lib/context";

import { getMessagesFromChatItems } from "../utils/getMessagesFromChatItems";
import { useChatStore } from "@/app/store";

export const useChatNotificationsSync = () => {
  const { setMessages, setNotifications, setMessageLoading } = useChatContext();
  const { getChatItems } = useChatApi();
  const params = useParams();
  const chatId = params?.chatId as string | undefined;
  const chatStore = useChatStore();
  const session = chatStore.currentSession();

  const fetchHistory = async () => {
    if (chatId === undefined || chatId !== chatStore.currentSession().chat_id) {
      setMessages([]);
      setNotifications([]);

      return;
    }
    if (session.messages.length === 0) {
      setMessageLoading(true);
    }
    const chatItems = await getChatItems(chatId);
    const messagesFromChatItems = getMessagesFromChatItems(chatItems);
    if (
      messagesFromChatItems.length > 1 ||
      (messagesFromChatItems[0] && messagesFromChatItems[0].assistant !== "")
    ) {
      setMessages(messagesFromChatItems);
      if (session.messages.length / 2 < messagesFromChatItems.length) {
        const startIndex = Math.floor(session.messages.length / 2);
        const filterMessages = messagesFromChatItems.slice(startIndex);
        filterMessages.forEach((message) => {
          chatStore.addMessagesFromSupabase(message, chatId);
        });
      }
      setMessageLoading(false);
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
