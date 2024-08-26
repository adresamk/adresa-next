import React from "react";

import { useWindowSize } from "usehooks-ts";
import ControllableDrawer from "./ControllableDrawer";
import { Modal } from "./Modal";

interface SmartOverlayProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  description: string;
  footerJSX?: React.ReactNode;
  innerScroll?: boolean;
}

export default function SmartOverlay({
  isOpen,
  children,
  onClose,
  onConfirm,
  title,
  description,
  footerJSX,
  innerScroll,
}: SmartOverlayProps) {
  const { width } = useWindowSize();
  const isMobile = width < 768;

  return (
    <>
      {isMobile ? (
        <ControllableDrawer
          title={title}
          description={description}
          isOpen={isOpen}
          onConfirm={onConfirm}
          onClose={onClose}
          footerJSX={footerJSX}
        >
          {children}
        </ControllableDrawer>
      ) : (
        <Modal
          title={title}
          description={description}
          isOpen={isOpen}
          onClose={onClose}
          onConfirm={onConfirm}
          footerJSX={footerJSX}
          innerScroll={innerScroll}
          className="p-5"
        >
          {children}
        </Modal>
      )}
    </>
  );
}
