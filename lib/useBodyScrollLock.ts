"use client";

import { useEffect } from "react";

/**
 * Locks background scroll while `isLocked` is true.
 * Plain `overflow: hidden` on <body> is ignored by iOS Safari, so the page
 * behind a modal/drawer keeps rubber-banding; pinning position + scroll
 * offset is what actually stops it there.
 */
export function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) {
      return;
    }

    const scrollY = window.scrollY;
    const { body, documentElement } = document;
    const previousBodyPosition = body.style.position;
    const previousBodyTop = body.style.top;
    const previousBodyWidth = body.style.width;
    const previousBodyOverflow = body.style.overflow;
    const previousHtmlOverflow = documentElement.style.overflow;

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";
    documentElement.style.overflow = "hidden";

    return () => {
      body.style.position = previousBodyPosition;
      body.style.top = previousBodyTop;
      body.style.width = previousBodyWidth;
      body.style.overflow = previousBodyOverflow;
      documentElement.style.overflow = previousHtmlOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [isLocked]);
}
