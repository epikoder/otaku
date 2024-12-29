import { Fragment, ReactNode, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

// Utility function to show a dialog
export const showDialog = (
  dialog: ({ closeFn }: { closeFn: VoidFunction }) => ReactNode,
  useWidth = true,
  id?: string,
  onClose?: () => void
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
        el.remove();    // Remove the container element
        onClose && onClose();
      }}
      useWidth={useWidth}
    >
      {dialog}
    </Dialog>
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
type JournalIntent = {
  intent: "journal";
  token: string;
  price?: number;
  amount: number;
  profit?: number;
};

type JournalDialogProps = {
  closeFn: VoidFunction;
  onSubmit: (data: Partial<JournalIntent>) => void;
  onDelete?: VoidFunction;
  initialData?: Partial<JournalIntent>;
};

export const JournalDialog: React.FC<JournalDialogProps> = ({
  closeFn,
  onSubmit,
  onDelete,
  initialData,
}) => {
  const [formData, setFormData] = useState<Partial<JournalIntent>>({

    intent: "journal", 
    token: initialData?.token ?? "",
    price: initialData?.price, 
    amount: initialData?.amount ?? 0, 
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
      {["intent", "token", "price", "amount", "profit"].map((field) => (
        <div key={field} className="mb-2">
          <label className="block text-sm font-semibold mb-1" htmlFor={field}>
            {field.toUpperCase()}
          </label>
          <input
            type="text"
            id={field}
            name={field}
            value={formData[field as keyof JournalIntent] || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
      ))}

      <div className="flex justify-between mt-4">
        <button
        className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => {
        if (!formData.token || !formData.amount) {
        alert("Token and Amount are required!"); 
    }
        onSubmit(formData); closeFn();
       }}>
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
  initialData?: Partial<JournalIntent>,
  onSubmit?: (data: Partial<JournalIntent>) => void,
  onDelete?: VoidFunction
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
