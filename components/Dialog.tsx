import { Fragment, ReactNode, useRef } from "react";
import { createRoot } from "react-dom/client";

export const showDialog = (
  dialog: ({ closeFn }: { closeFn: VoidFunction }) => ReactNode,
  useWidth = true,
  id?: string,
  onClose?: () => void,
) => {
  const container = document.createElement("div");
  if (id) {
    document.getElementById(id)?.remove();
    container.id = id;
  }

  const root = createRoot(container);
  root.render(
    <Dialog
      closeFn={(el) => {
        el.remove();
        onClose && onClose();
      }}
      useWidth={useWidth}
    >
      {dialog}
    </Dialog>,
  );

  document.body.append(container);
};

export const showAlertDialog = ({
  title,
  message,
  onCancel,
  onCancelText,
  onContinueText,
  onContinue,
}: {
  title: ReactNode;
  message: ReactNode;
  onContinue: VoidFunction;
  onContinueText?: string;
  onCancel?: VoidFunction;
  onCancelText?: string;
}) => {
  const container = document.createElement("div");
  const closeFn = (el: HTMLDivElement) => el.remove();

  const root = createRoot(container);
  root.render(
    <Dialog closeFn={closeFn}>
      {({ closeFn }) => (
        <Fragment>
          <div className={"px-4 py-2 font-semibold"}>{title}</div>
          <div
            className={"px-4 py-2 text-sm overflow-y-scroll h-full max-h-[80vh]"}
          >
            {message}
          </div>
          <div className={"grid grid-cols-2 text-sm"}>
            <button
              className={"text-center py-1 bg-red-500 text-white w-full rounded-bl-lg"}
              onClick={() => {
                onCancel && onCancel();
                closeFn();
              }}
            >
              {onCancelText ?? "Cancel"}
            </button>
            <button
              className={"text-center py-1 bg-green-500 text-white w-full rounded-br-lg"}
              onClick={async () => {
                try {
                  await onContinue();
                  closeFn();
                } catch (_) {
                  console.debug("Dialog", _);
                }
              }}
            >
              {onContinueText ?? "Continue"}
            </button>
          </div>
        </Fragment>
      )}
    </Dialog>,
  );
  document.body.append(container);
};

type CloseFn = (ev: HTMLDivElement) => void;
export default function Dialog({
  children,
  closeFn,
  useWidth = true,
}: {
  useWidth?: boolean;
  closeFn: CloseFn;
  children?:
    | (({ closeFn }: { closeFn: VoidFunction }) => ReactNode)
    | ReactNode;
}) {
  const __container_ref = useRef<HTMLDivElement>(null);
  const __ref = useRef<HTMLDivElement>(null);

  children = typeof children == "function"
    ? children({
      closeFn: () => {
        __container_ref.current?.parentElement?.remove();
      },
    })
    : children;

  return (
    <div
      ref={__container_ref}
      className={"fixed z-[99] inset-0 w-[100vw] h-[100vh] bg-gray-200 bg-opacity-10 backdrop-blur-[1px] flex flex-col justify-center items-center"}
      onClick={(ev) => {
        ev.stopPropagation();
        closeFn(ev.currentTarget.parentElement! as HTMLDivElement);
      }}
    >
      <div
        className={`${
          useWidth ? "w-full max-w-sm min-w-64" : "w-fit"
        }  mx-auto`}
        onClick={(ev) => ev.stopPropagation()}
      >
        <div
          ref={__ref}
          className={"rounded-lg shadow-md bg-[#1E1E1E] text-zinc-100 bg-opacity-100 w-full"}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
