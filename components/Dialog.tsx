import { Fragment, ReactNode, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

// Utility function to show a dialog
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
        root.unmount(); // Ensure React unmounts the dialog
        el.remove(); // Remove the container element
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

// Dialog wrapper component
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

  children = typeof children === "function"
    ? children({
      closeFn: () => {
        const parent = __container_ref.current?.parentElement;
        if (parent) parent.remove();
      },
    })
    : children;

  return (
    <div
      ref={__container_ref}
      className="fixed z-[99] inset-0 w-[100vw] h-[100vh] bg-gray-900 bg-opacity-10 backdrop-blur-[1px] flex justify-center items-center"
      onClick={(ev) => {
        ev.stopPropagation();
        closeFn(ev.currentTarget.parentElement! as HTMLDivElement);
      }}
    >
      <div
        className={`${useWidth ? "w-full max-w-md" : "w-fit"} mx-auto`}
        onClick={(ev) => ev.stopPropagation()}
      >
        <div className="rounded-lg shadow-lg bg-[#1E1E1E] text-zinc-100 p-4">
          {children}
        </div>
      </div>
    </div>
  );
}

// JournalDialog component for managing logs
type JournalDialogProps = {
  closeFn: VoidFunction;
  onSubmit: (data: Partial<Journal>) => void;
  onDelete?: VoidFunction;
  initialData?: Partial<Journal>;
};

export const JournalDialog: React.FC<JournalDialogProps> = ({
  closeFn,
  onSubmit,
  onDelete,
  initialData,
}) => {
  const [formData, setFormData] = useState<Partial<Journal>>({
    token: initialData?.token ?? "",
    price: initialData?.price,
    amount: initialData?.amount,
    profit: initialData?.profit,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        {initialData ? "Edit Journal Entry" : "Add Journal Entry"}
      </h2>
      <Fragment>
        <div key={"intent"} className="mb-2">
          <label
            className="block text-sm font-semibold mb-1"
            htmlFor={"token"}
          >
            Coin
          </label>
          <input
            type="text"
            id={"token"}
            name={"token"}
            value={formData["token"]}
            onChange={handleChange}
            placeholder="Solana"
            className="w-full px-3 py-2 border rounded-xl bg-transparent"
          />
        </div>
        <div key={"intent"} className="mb-2">
          <label
            className="block text-sm font-semibold mb-1"
            htmlFor={"token"}
          >
            Amount
          </label>
          <input
            type="text"
            id={"amount"}
            name={"amount"}
            value={formData["amount"]}
            onChange={handleChange}
            placeholder="amount in USD"
            className="w-full px-3 py-2 border rounded-xl bg-transparent"
          />
        </div>
        <div key={"intent"} className="mb-2">
          <label
            className="block text-sm font-semibold mb-1"
            htmlFor={"price"}
          >
            Price
          </label>
          <input
            type="text"
            id={"price"}
            name={"price"}
            value={formData["price"]}
            onChange={handleChange}
            placeholder="100"
            className="w-full px-3 py-2 border rounded-xl bg-transparent"
          />
        </div>
        <div key={"intent"} className="mb-2">
          <label
            className="block text-sm font-semibold mb-1"
            htmlFor={"profit"}
          >
            Profit / Loss
          </label>
          <input
            type="text"
            id={"profit"}
            name={"profit"}
            value={formData["profit"]}
            onChange={handleChange}
            placeholder="20"
            className="w-full px-3 py-2 border rounded-xl bg-transparent"
          />
        </div>
      </Fragment>

      <div className="flex justify-between mt-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => {
            if (!formData.token || !formData.amount) {
              alert("Token and Amount are required!");
            }
            onSubmit(formData);
            closeFn();
          }}
        >
          {initialData ? "Save Changes" : "Add Entry"}
        </button>

        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={closeFn}
        >
          Cancel
        </button>
        {onDelete && (
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={() => {
              onDelete();
              closeFn();
            }}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

// Example usage
export const openJournalDialog = (
  initialData?: Partial<Journal>,
  onSubmit?: (data: Partial<Journal>) => void,
  onDelete?: VoidFunction,
) => {
  showDialog(({ closeFn }) => (
    <JournalDialog
      closeFn={closeFn}
      onSubmit={onSubmit || (() => {})}
      onDelete={onDelete}
      initialData={initialData}
    />
  ));
};
