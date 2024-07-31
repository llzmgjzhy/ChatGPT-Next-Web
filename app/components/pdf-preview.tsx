"use client";

import { use, useCallback, useEffect, useState } from "react";
import { useResizeObserver } from "@wojtekmaj/react-hooks";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

import styles from "./pdf-preview.module.scss";
import type { PDFDocumentProxy } from "pdfjs-dist";
import LeftIcon from "../icons/pdf-left.svg";
import RightIcon from "../icons/pdf-right.svg";
import PlusIcon from "../icons/plus.svg";
import MinusIcon from "../icons/minus.svg";
import { IconButton } from "@/app/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useSupabase } from "@/lib/context/SupabaseProvider";
import { useAskDirectContext } from "@/lib/context/AskDirectProvider";
import Locale from "../locales";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
  disableAutoFetch: true,
  disableStream: true,
};

const resizeObserverOptions = {};

const maxWidth = 1500;

type PDFFile = string | File | null;
interface Pdf {
  fileName: string;
  showName: string;
}

interface PdfCategory {
  [key: string]: Pdf;
}

interface PdfList {
  [key: string]: PdfCategory;
}

export function PdfBook() {
  let { session } = useSupabase();
  const access_token = session?.access_token || "";
  const [pdfFile, setPdfFile] = useState<PDFFile>("major1");
  function setFileName(fileName: string = "major1") {
    const urlPath = `/api/pdf/${fileName}/${access_token}`;
    return urlPath;
  }
  const [file, setFile] = useState<PDFFile>(setFileName());
  // get the askDirect context
  const { askDirect } = useAskDirectContext();
  const [pdfList, setPdfList] = useState<PdfList>({});
  const [numPages, setNumPages] = useState<number>();
  const [PageNumber, setPageNumber] = useState<number>(1);
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [isFirstChange, setIsFirstChange] = useState<boolean>(true);
  const [pageWidth, setPageWidth] = useState<number>(600);
  // get Local querySelect but not need to claim Local type
  const labelName: { [key: string]: string } = Locale.querySelect;
  const [pageScale, setPageScale] = useState<number>(1);
  useEffect(() => {
    fetch("/pdfCorres.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setPdfList(data);
      });
  }, []);
  // monitor askDirect change,if does,show the corresponding pdf
  useEffect(() => {
    if (askDirect !== "") {
      const pdfName: string = `${askDirect}1`;
      setPageNumber(1);
      setPdfFile(pdfName);
      setFile(setFileName(pdfName));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [askDirect]);

  const onResize = useCallback<ResizeObserverCallback>((entries) => {
    const [entry] = entries;

    if (entry) {
      setContainerWidth(entry.contentRect.width);
    }
  }, []);

  useEffect(() => {
    console.log(containerWidth);
    if (isFirstChange && containerWidth) {
      setPageWidth(containerWidth);
      setIsFirstChange(false);
    }
  }, [containerWidth, isFirstChange]);

  useResizeObserver(containerRef, resizeObserverOptions, onResize);

  const changePage = useCallback(
    (offset: number) =>
      setPageNumber((prevPageNumber) => (prevPageNumber || 1) + offset),
    [],
  );

  const previousPage = useCallback(() => changePage(-1), [changePage]);

  const nextPage = useCallback(() => changePage(1), [changePage]);

  function onDocumentLoadSuccess({
    numPages: nextNumPages,
  }: PDFDocumentProxy): void {
    setNumPages(nextNumPages);
  }

  function onPageNumberChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ): void {
    const { value } = event.target;
    if (Number(value) <= 0) {
      setPageNumber(1);
      return;
    }
    if (Number(value) >= (numPages || 0)) {
      setPageNumber(Number(numPages));
      return;
    }
    setPageNumber(Number(value));
  }

  function onSelectChange(event: string) {
    if (event) {
      setPageNumber(1);
      setPdfFile(event);
      setFile(setFileName(event));
    }
  }

  function pageZoomIn() {
    if (pageWidth * 1.1 < maxWidth) {
      setPageWidth(pageWidth * 1.1);
    }
  }

  function pageZoomOut() {
    if (pageWidth * 0.9 > 100) {
      setPageWidth(pageWidth * 0.9);
    }
  }

  return (
    <div className={styles["FilePreview"]}>
      <div className={styles["FilePreview-container"]}>
        <div
          className={`${isFirstChange ? styles["FilePreview-container-document-start"] : styles["FilePreview-container-document"]}`}
          ref={setContainerRef}
        >
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            options={options}
          >
            <Page
              pageNumber={PageNumber}
              width={pageWidth}
              renderTextLayer={true}
            />
          </Document>
        </div>
      </div>
      <div className={styles["container-content-controls"]}>
        <DropdownMenu>
          <DropdownMenuTrigger className={styles["DropdownMenuButton"]}>
            {Locale.pdfSelect.title}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>{Locale.pdfSelect.title}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {Object.keys(pdfList).map((category) => (
              <DropdownMenuSub key={category}>
                <DropdownMenuSubTrigger className={styles["DropdownMenuItem"]}>
                  <span>{labelName[category]}</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {" "}
                    <DropdownMenuRadioGroup
                      value={String(pdfFile)}
                      onValueChange={onSelectChange}
                    >
                      {Object.keys(pdfList[category]).map((pdf: string) => (
                        <DropdownMenuRadioItem
                          value={pdf}
                          key={pdf}
                          className={styles["DropdownMenuItem"]}
                        >
                          {pdfList[category][pdf].showName}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <TooltipProvider delayDuration={250}>
          <Tooltip>
            <TooltipTrigger>
              {" "}
              <IconButton
                icon={<PlusIcon />}
                onClick={pageZoomIn}
                shadow
                className={styles["container-content-controls-button"]}
              />
            </TooltipTrigger>
            <TooltipContent className={styles["tooltipContent"]}>
              {Locale.pdfSelect.zoomIn}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={250}>
          <Tooltip>
            <TooltipTrigger>
              {" "}
              <IconButton
                icon={<MinusIcon />}
                onClick={pageZoomOut}
                shadow
                className={styles["container-content-controls-button"]}
              />
            </TooltipTrigger>
            <TooltipContent className={styles["tooltipContent"]}>
              {Locale.pdfSelect.zoomOut}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={250}>
          <Tooltip>
            <TooltipTrigger>
              {" "}
              <IconButton
                icon={<LeftIcon />}
                disabled={(PageNumber || 0) <= 1}
                onClick={previousPage}
                shadow
                className={styles["container-content-controls-button"]}
              />
            </TooltipTrigger>
            <TooltipContent className={styles["tooltipContent"]}>
              {(PageNumber || 0) <= 1
                ? Locale.pdfSelect.previousPageEnd
                : Locale.pdfSelect.previousPage}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="flex items-center justify-center">
          {"  "}
          <input
            onChange={onPageNumberChange}
            value={PageNumber}
            type="number"
          />
          / {numPages || "--"}
        </div>
        <TooltipProvider delayDuration={250}>
          <Tooltip>
            <TooltipTrigger>
              {" "}
              <IconButton
                icon={<RightIcon />}
                disabled={(PageNumber || 0) >= (numPages || 0)}
                onClick={nextPage}
                className={styles["container-content-controls-button"]}
                shadow
              />
            </TooltipTrigger>
            <TooltipContent className={styles["tooltipContent"]}>
              {(PageNumber || 0) >= (numPages || 0)
                ? Locale.pdfSelect.nextPageEnd
                : Locale.pdfSelect.nextPage}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
