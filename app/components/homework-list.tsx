import DeleteIcon from "../icons/delete.svg";
import BotIcon from "../icons/bot.svg";

import styles from "./home.module.scss";
import {
  DragDropContext,
  Droppable,
  Draggable,
  OnDragEndResponder,
} from "@hello-pangea/dnd";

import { useHomeworkStore } from "@/app/store/homework";

import Locale from "../locales";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Path } from "../constant";
import { MaskAvatar } from "./mask";
import { Mask } from "../store/mask";
import { useRef, useEffect } from "react";
import { showConfirm } from "./ui-lib";
import { useMobileScreen } from "../utils";
import { useChat } from "@/app/homework/[homeworkId]/hooks/useChat";
import { useRouter, useParams } from "next/navigation";
import { useChatsList } from "@/app/homework/[homeworkId]/hooks/useHomeworkList";
import { useChatNotificationsSync } from "@/app/homework/[homeworkId]/hooks/useChatNotificationsSync";
import { useScrollToBottom } from "@/app/components/chat";

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
    useHomeworkStore((state) => [
      state.sessions,
      state.currentSessionIndex,
      state.selectSession,
      state.moveSession,
      state.deleteSession,
    ]);
  useChatsList();
  const { deChat } = useChat();
  const router = useRouter();
  const isMobileScreen = useMobileScreen();
  const params = useParams();
  const chatId = params?.homeworkId as string | undefined;
  const chatStore = useHomeworkStore();
  const { fetchHistory } = useChatNotificationsSync();
  const scrollRef = useRef<HTMLDivElement>(null);
  const isScrolledToBottom = scrollRef?.current
    ? Math.abs(
        scrollRef.current.scrollHeight -
          (scrollRef.current.scrollTop + scrollRef.current.clientHeight),
      ) <= 1
    : false;
  const { setAutoScroll, scrollDomToBottom } = useScrollToBottom(
    scrollRef,
    isScrolledToBottom,
  );

  useEffect(() => {
    if (
      chatId &&
      chatStore.currentSession().chat_id !== chatId &&
      chatStore.sessions.length > 1
    ) {
      chatStore.sessions.map((item, i) => {
        if (item.chat_id === chatId) {
          selectSession(i);
          fetchHistory();
          scrollDomToBottom();
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatStore.sessions.length]);

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
                  router.push(`/homework/${item.chat_id || ""}`);
                  selectSession(i);
                }}
                onDelete={async () => {
                  if (
                    (!props.narrow && !isMobileScreen) ||
                    (await showConfirm(Locale.Home.DeleteChat))
                  ) {
                    if (item.chat_id) {
                      deChat(item.chat_id);
                    }
                    const chat_id = deleteSession(i);
                    router.push(`/homework/${chat_id || ""}`);
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
