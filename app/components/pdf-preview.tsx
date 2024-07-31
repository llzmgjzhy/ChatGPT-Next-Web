"use client";

import { use, useCallback, useEffect, useState } from "react";
import { useResizeObserver } from "@wojtekmaj/react-hooks";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

import "./pdf-preview.scss";
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

import { useSupabase } from "@/lib/context/SupabaseProvider";
import { useAskDirectContext } from "@/lib/context/AskDirectProvider";
import Locale from "../locales";
import { set } from "react-hook-form";

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
  // const [file, setFile] = useState<PDFFile>("http://localhost:5050/pdf");
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
  const [containerWidth, setContainerWidth] = useState<number>(400);
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
    if (pageScale <= 1.4) {
      setPageScale(pageScale + 0.1);
    }
  }

  function pageZoomOut() {
    if (pageScale >= 0.6) {
      setPageScale(pageScale - 0.1);
    }
  }

  return (
    <div className="FilePreview">
      <div className="FilePreview-container">
        <div className="FilePreview-container-document" ref={setContainerRef}>
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            options={options}
          >
            <div>
              <Page
                pageNumber={PageNumber}
                width={
                  containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth
                }
                renderTextLayer={true}
                scale={pageScale}
                className={"FilePreview-container-Page"}
              />
            </div>
          </Document>
        </div>
      </div>
      <div className="container-content-controls">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <IconButton text={Locale.pdfSelect.title} shadow />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>{Locale.pdfSelect.title}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {Object.keys(pdfList).map((category) => (
              <DropdownMenuSub key={category}>
                <DropdownMenuSubTrigger className="DropdownMenuItem">
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
                          className="DropdownMenuItem"
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
        <IconButton
          icon={<PlusIcon />}
          onClick={pageZoomIn}
          shadow
          className="container-content-controls-button"
        />
        <IconButton
          icon={<MinusIcon />}
          onClick={pageZoomOut}
          shadow
          className="container-content-controls-button"
        />
        <IconButton
          icon={<LeftIcon />}
          disabled={(PageNumber || 0) <= 1}
          onClick={previousPage}
          shadow
          className="container-content-controls-button"
        />
        <p>
          {"  "}
          <input
            onChange={onPageNumberChange}
            value={PageNumber}
            type="number"
          />
          / {numPages || "--"}
        </p>
        <IconButton
          icon={<RightIcon />}
          disabled={(PageNumber || 0) >= (numPages || 0)}
          onClick={nextPage}
          className="container-content-controls-button"
          shadow
        />
      </div>
    </div>
  );
}
