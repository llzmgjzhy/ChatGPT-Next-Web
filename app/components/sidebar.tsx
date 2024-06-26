"use client";

import { useEffect, useRef, useMemo, useState } from "react";

import styles from "@/app/components/home.module.scss";

import { IconButton } from "@/app/components/button";
import SettingsIcon from "@/app/icons/settings.svg";
import GithubIcon from "@/app/icons/github.svg";
import ChatGptIcon from "@/app/icons/chatgpt.svg";
import MedImindIcon from "@/app/icons/medimind.svg";
import { MedImindLogo } from "@/lib/assets/MedImindLogo";
import AddIcon from "@/app/icons/add.svg";
import CloseIcon from "@/app/icons/close.svg";
import DeleteIcon from "@/app/icons/delete.svg";
import MaskIcon from "@/app/icons/chat.svg";
import PluginIcon from "@/app/icons/edit.svg";
import DragIcon from "@/app/icons/drag.svg";
import { useSupabase } from "@/lib/context/SupabaseProvider";

import Locale from "@/app/locales";

import { useAppConfig, useChatStore } from "@/app/store";
import { useHomeworkStore } from "@/app/store/homework";

import {
  DEFAULT_SIDEBAR_WIDTH,
  MAX_SIDEBAR_WIDTH,
  MIN_SIDEBAR_WIDTH,
  NARROW_SIDEBAR_WIDTH,
  Path,
  REPO_URL,
} from "@/app/constant";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

import { Link, useNavigate } from "react-router-dom";
import { isIOS, useMobileScreen } from "@/app/utils";
import dynamic from "next/dynamic";
import { showConfirm, showToast } from "@/app/components/ui-lib";

const ChatList = dynamic(
  async () => (await import("@/app/components/chat-list")).ChatList,
  {
    loading: () => null,
  },
);

const HomeworkList = dynamic(
  async () => (await import("@/app/components/homework-list")).ChatList,
  {
    loading: () => null,
  },
);

function useHotKey() {
  const chatStore = useChatStore();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey) {
        if (e.key === "ArrowUp") {
          chatStore.nextSession(-1);
        } else if (e.key === "ArrowDown") {
          chatStore.nextSession(1);
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });
}

function useDragSideBar() {
  const limit = (x: number) => Math.min(MAX_SIDEBAR_WIDTH, x);

  const config = useAppConfig();
  const startX = useRef(0);
  const startDragWidth = useRef(config.sidebarWidth ?? DEFAULT_SIDEBAR_WIDTH);
  const lastUpdateTime = useRef(Date.now());

  const toggleSideBar = () => {
    config.update((config) => {
      if (config.sidebarWidth < MIN_SIDEBAR_WIDTH) {
        config.sidebarWidth = DEFAULT_SIDEBAR_WIDTH;
      } else {
        config.sidebarWidth = NARROW_SIDEBAR_WIDTH;
      }
    });
  };

  const onDragStart = (e: MouseEvent) => {
    // Remembers the initial width each time the mouse is pressed
    startX.current = e.clientX;
    startDragWidth.current = config.sidebarWidth;
    const dragStartTime = Date.now();

    const handleDragMove = (e: MouseEvent) => {
      if (Date.now() < lastUpdateTime.current + 20) {
        return;
      }
      lastUpdateTime.current = Date.now();
      const d = e.clientX - startX.current;
      const nextWidth = limit(startDragWidth.current + d);
      config.update((config) => {
        if (nextWidth < MIN_SIDEBAR_WIDTH) {
          config.sidebarWidth = NARROW_SIDEBAR_WIDTH;
        } else {
          config.sidebarWidth = nextWidth;
        }
      });
    };

    const handleDragEnd = () => {
      // In useRef the data is non-responsive, so `config.sidebarWidth` can't get the dynamic sidebarWidth
      window.removeEventListener("pointermove", handleDragMove);
      window.removeEventListener("pointerup", handleDragEnd);

      // if user click the drag icon, should toggle the sidebar
      const shouldFireClick = Date.now() - dragStartTime < 300;
      if (shouldFireClick) {
        toggleSideBar();
      }
    };

    window.addEventListener("pointermove", handleDragMove);
    window.addEventListener("pointerup", handleDragEnd);
  };

  const isMobileScreen = useMobileScreen();
  const shouldNarrow =
    !isMobileScreen && config.sidebarWidth < MIN_SIDEBAR_WIDTH;

  useEffect(() => {
    const barWidth = shouldNarrow
      ? NARROW_SIDEBAR_WIDTH
      : limit(config.sidebarWidth ?? DEFAULT_SIDEBAR_WIDTH);
    const sideBarWidth = isMobileScreen ? "100vw" : `${barWidth}px`;
    document.documentElement.style.setProperty("--sidebar-width", sideBarWidth);
  }, [config.sidebarWidth, isMobileScreen, shouldNarrow]);

  return {
    onDragStart,
    shouldNarrow,
  };
}

export function SideBar(props: { className?: string }) {
  const chatStore = useChatStore();
  const homeworkStore = useHomeworkStore();
  const [isChat, setIsChat] = useState<boolean>(false);
  const [isHomework, setIsHomework] = useState<boolean>(false);

  const router = useRouter();
  const pathname = usePathname();

  // drag side bar
  const { onDragStart, shouldNarrow } = useDragSideBar();
  const navigate = useNavigate();
  const config = useAppConfig();
  const isMobileScreen = useMobileScreen();
  const isIOSMobile = useMemo(
    () => isIOS() && isMobileScreen,
    [isMobileScreen],
  );
  const { session } = useSupabase();

  useEffect(() => {
    setIsChat(pathname.includes("chat"));
    setIsHomework(pathname.includes("homework"));
  }, [pathname]);

  useHotKey();

  return (
    <div
      className={`${styles.sidebar} ${props.className} ${
        shouldNarrow && styles["narrow-sidebar"]
      }`}
      style={{
        // #3016 disable transition on ios mobile screen
        transition: isMobileScreen && isIOSMobile ? "none" : undefined,
      }}
    >
      <div className={styles["sidebar-header"]} data-tauri-drag-region>
        <div className={styles["sidebar-title"]} data-tauri-drag-region>
          MedImind
        </div>
        <div className={styles["sidebar-sub-title"]}>
          chat with a medical AI
        </div>
        <div className={styles["sidebar-logo"] + " no-dark"}>
          <MedImindLogo size={50} />
        </div>
      </div>

      <div className={styles["sidebar-header-bar"]}>
        <IconButton
          icon={<MaskIcon />}
          text={shouldNarrow ? undefined : Locale.ChatBot.Name}
          className={`${styles["sidebar-bar-button"]} ${
            isChat ? styles["sidebar-bar-button-selected"] : ""
          }`}
          onClick={() => {
            router.push("/chat");
            homeworkStore.selectSession(0);
          }}
          shadow
        />
        <IconButton
          icon={<PluginIcon />}
          text={shouldNarrow ? undefined : Locale.HomeWork.Name}
          className={`${styles["sidebar-bar-button"]} ${
            isHomework ? styles["sidebar-bar-button-selected"] : ""
          }`}
          onClick={() => {
            router.push("/homework");
            chatStore.selectSession(0);
          }}
          shadow
        />
      </div>

      <div
        className={styles["sidebar-body"]}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            navigate(Path.Home);
          }
        }}
      >
        {isChat && <ChatList narrow={shouldNarrow} />}
        {isHomework && <HomeworkList narrow={shouldNarrow} />}
      </div>

      <div className={styles["sidebar-tail"]}>
        <div className={styles["sidebar-actions"]}>
          <div className={styles["sidebar-action"] + " " + styles.mobile}>
            <IconButton
              icon={<DeleteIcon />}
              onClick={async () => {
                if (await showConfirm(Locale.Home.DeleteChat)) {
                  chatStore.deleteSession(chatStore.currentSessionIndex);
                }
              }}
            />
          </div>
          <div className={styles["sidebar-action"]}>
            {/* <Link to={Path.Settings}> */}
            <IconButton
              icon={<SettingsIcon />}
              text={shouldNarrow ? undefined : Locale.Home.Settings}
              onClick={() => {
                router.push("/settings");
              }}
              shadow
            />
            {/* </Link> */}
          </div>
          {/* <div className={styles["sidebar-action"]}>
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
              <IconButton icon={<GithubIcon />} shadow />
            </a>
          </div> */}
        </div>
        {!isHomework && (
          <div className={styles["sidebar-tail-bar"]}>
            <IconButton
              icon={<AddIcon />}
              text={shouldNarrow ? undefined : Locale.Home.NewChat}
              className={styles["sidebar-tail-bar-button"]}
              onClick={() => {
                if (chatStore.sessions[0].chat_id !== "") {
                  chatStore.newSession();
                  router.push("/chat");
                }
              }}
              shadow
            />
          </div>
        )}
        {isHomework && session?.user.user_metadata.role === "admin" && (
          <div className={styles["sidebar-tail-bar"]}>
            <IconButton
              icon={<AddIcon />}
              text={shouldNarrow ? undefined : Locale.Home.NewHomework}
              className={styles["sidebar-tail-bar-button"]}
              onClick={() => {
                if (homeworkStore.sessions[0].chat_id !== "") {
                  homeworkStore.newSession();
                  router.push("/homework");
                }
              }}
              shadow
            />
          </div>
        )}
      </div>

      <div
        className={styles["sidebar-drag"]}
        onPointerDown={(e) => onDragStart(e as any)}
      >
        <DragIcon />
      </div>
    </div>
  );
}
