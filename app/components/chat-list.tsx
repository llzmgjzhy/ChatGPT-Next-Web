import DeleteIcon from "../icons/delete.svg";
import BotIcon from "../icons/bot.svg";

import styles from "./home.module.scss";
import {
  DragDropContext,
  Droppable,
  Draggable,
  OnDragEndResponder,
} from "@hello-pangea/dnd";

import { useChatStore } from "../store";

import Locale from "../locales";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Path } from "../constant";
import { MaskAvatar } from "./mask";
import { Mask } from "../store/mask";
import { useRef, useEffect } from "react";
import { showConfirm } from "./ui-lib";
import { useMobileScreen } from "../utils";
import { useChat } from "@/app/chat/[chatId]/hooks/useChat";
import { useRouter, useParams } from "next/navigation";
import { useChatsList } from "@/app/chat/[chatId]/hooks/useChatsList";
import { useChatNotificationsSync } from "@/app/chat/[chatId]/hooks/useChatNotificationsSync";
import { useChatsContext } from "@/lib/context/ChatsProvider/hooks/useChatsContext";
import { useMobileSidebarContext } from "@/lib/context/MobileSidebarProvider";

export function ChatItem(props: {
  onClick?: () => void;
  onDelete?: () => void;
  title: string;
  count: number;
  time: string;
  selected: boolean;
  id: string;
  index: number;
  narrow?: boolean;
  mask: Mask;
}) {
  const draggableRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (props.selected && draggableRef.current) {
      draggableRef.current?.scrollIntoView({
        block: "center",
      });
    }
  }, [props.selected]);

  const { pathname: currentPath } = useLocation();
  return (
    <Draggable draggableId={`${props.id}`} index={props.index}>
      {(provided) => (
        <div
          className={`${styles["chat-item"]} ${
            props.selected &&
            (currentPath === Path.Chat || currentPath === Path.Home) &&
            styles["chat-item-selected"]
          }`}
          onClick={props.onClick}
          ref={(ele) => {
            draggableRef.current = ele;
            provided.innerRef(ele);
          }}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          title={`${props.title}\n${Locale.ChatItem.ChatItemCount(
            props.count,
          )}`}
        >
          {props.narrow ? (
            <div className={styles["chat-item-narrow"]}>
              <div className={styles["chat-item-avatar"] + " no-dark"}>
                <MaskAvatar
                  avatar={props.mask.avatar}
                  model={props.mask.modelConfig.model}
                />
              </div>
              <div className={styles["chat-item-narrow-count"]}>
                {props.count}
              </div>
            </div>
          ) : (
            <>
              <div className={styles["chat-item-title"]}>{props.title}</div>
              <div className={styles["chat-item-info"]}>
                <div className={styles["chat-item-count"]}>
                  {Locale.ChatItem.ChatItemCount(props.count)}
                </div>
                <div className={styles["chat-item-date"]}>{props.time}</div>
              </div>
            </>
          )}

          <div
            className={styles["chat-item-delete"]}
            onClickCapture={(e) => {
              props.onDelete?.();
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <DeleteIcon />
          </div>
        </div>
      )}
    </Draggable>
  );
}

export function ChatList(props: { narrow?: boolean }) {
  const [sessions, selectedIndex, selectSession, moveSession, deleteSession] =
    useChatStore((state) => [
      state.sessions,
      state.currentSessionIndex,
      state.selectSession,
      state.moveSession,
      state.deleteSession,
    ]);
  const { allChats } = useChatsContext();
  useChatsList();
  const { deChat } = useChat();
  const router = useRouter();
  const isMobileScreen = useMobileScreen();
  const params = useParams();
  const chatId = params?.chatId as string | undefined;
  const chatStore = useChatStore();
  const { fetchHistory } = useChatNotificationsSync();
  const { setShowMobileSidebar } = useMobileSidebarContext();

  useEffect(() => {
    if (
      chatId &&
      chatStore.currentSession().chat_id !== chatId &&
      chatStore.sessions.length > 1
    ) {
      chatStore.sessions.forEach((item, i) => {
        if (item.chat_id === chatId) {
          selectSession(i);
          fetchHistory();
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allChats]);

  const onDragEnd: OnDragEndResponder = (result) => {
    const { destination, source } = result;
    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    moveSession(source.index, destination.index);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chat-list">
        {(provided) => (
          <div
            className={styles["chat-list"]}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {sessions.map((item, i) => (
              <ChatItem
                title={item.topic}
                time={new Date(item.lastUpdate).toLocaleString()}
                count={item.messages.length}
                key={item.id}
                id={item.id}
                index={i}
                selected={i === selectedIndex}
                onClick={() => {
                  // navigate(Path.Chat);
                  selectSession(i);
                  router.push(`/chat/${item.chat_id || ""}`);
                  setShowMobileSidebar(false);
                }}
                onDelete={async () => {
                  if (
                    !props.narrow &&
                    !isMobileScreen &&
                    (await showConfirm(Locale.Home.DeleteChat))
                  ) {
                    if (item.chat_id) {
                      deChat(item.chat_id);
                    }
                    const chat_id = deleteSession(i);
                    router.push(`/chat/${chat_id || ""}`);
                  }
                }}
                narrow={props.narrow}
                mask={item.mask}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
