import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { useChatApi } from "@/lib/api/chat/useChatApi";
import { useChatsContext } from "@/lib/context/ChatsProvider/hooks/useChatsContext";
import { useSupabase } from "@/lib/context/SupabaseProvider";
import { useToast } from "@/components/ui/use-toast";
import { useRouter, useParams } from "next/navigation";

import { useChatStore } from "@/app/store/chat";

export const useChatsList = () => {
  const { allChats, setAllChats, setIsLoading } = useChatsContext();
  const { toast } = useToast();
  const { getChats } = useChatApi();
  const { session } = useSupabase();
  const params = useParams();
  const chatId = params?.chatId as string | undefined;
  const chatStore = useChatStore();

  const fetchAllChats = async () => {
    if (session) {
      try {
        const response = await getChats();

        return response.reverse();
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          description: "errorFetching during getChats",
        });
      }
    }
  };

  const { data: chats, isLoading } = useQuery({
    queryKey: ["getChatsList"],
    queryFn: fetchAllChats,
  });

  useEffect(() => {
    if (chats) {
      setAllChats(chats);
    }
    if (chats !== allChats && !chatId) {
      for (const chat of chats ?? []) {
        chatStore.addSupabaseSessions(chat);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chats]);

  useEffect(() => {
    setIsLoading(isLoading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);
};
