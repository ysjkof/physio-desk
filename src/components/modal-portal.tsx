import React from "react";
import { createPortal } from "react-dom";

interface IModalPortal {
  closeAction: React.Dispatch<React.SetStateAction<boolean>>;
  children?: React.ReactNode;
}

export const ModalPortal: React.FC<IModalPortal> = ({
  closeAction,
  children,
}) => {
  const container = document.getElementById("root") as HTMLElement;

  return createPortal(
    <div className="modal fixed top-0 left-0 z-40 h-full w-full">
      <div
        className="modal-background absolute h-full w-full bg-black opacity-50"
        onClick={() => closeAction(false)}
      />
      <div className="modal-content relative top-1/2 left-1/2 flex w-fit -translate-x-1/2 -translate-y-1/2 flex-col">
        {children}
      </div>
    </div>,
    container
  );
};
