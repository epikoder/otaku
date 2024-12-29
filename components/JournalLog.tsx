import React, { useContext, useEffect, useState } from "react";
import { JournalDialog, showDialog } from "./Dialog";
import { v4 as uuidv4 } from "uuid";
import { __DataStoreContext__ } from "../providers/datastore.provider.client";

const JournalLog = () => {
  const context = useContext(__DataStoreContext__).journal;
  const [logEntries, setLogEntries] = useState<Journal[]>([]);

  useEffect(() => {
    context.entries().then((entries) => setLogEntries(entries));
  }, []);

  const openJournalDialog = (entryToEdit?: Journal) => {
    // Open the dialog using `showDialog`
    showDialog(({ closeFn }) => (
      <JournalDialog
        closeFn={closeFn}
        onSubmit={(data) => {
          if (entryToEdit) {
            // Edit log
            setLogEntries((prev) =>
              prev.map((entry) =>
                entry.id === entryToEdit.id ? { ...entry, ...data } : entry
              )
            );
          } else {
            setLogEntries((prev) => [
              ...prev,
              { id: uuidv4(), ...data } as Journal,
            ]);
          }
        }}
        onDelete={() => {
          if (entryToEdit) {
            setLogEntries((prev) =>
              prev.filter((entry) => entry.id !== entryToEdit.id)
            );
          }
        }}
        initialData={entryToEdit}
      />
    ));
  };

  return (
    <div className="py-4">
      <div className="flex items-center gap-3">
        <input
          className="border border-zinc-300 outline-none px-3 py-2 flex-1 rounded-3xl bg-inherit text-zinc-200 text-sm"
          placeholder="Search.. e.g SOL"
        />
        <button
          className="bg-[#F11313] text-white px-3 text-sm py-2 rounded-full"
          onClick={() => openJournalDialog()}
        >
          S
        </button>
      </div>

      <div className="mt-6 space-y-4 h-full overflow-y-scroll">
        {logEntries.length === 0
          ? <p className="text-gray-500 text-center">No journal entries yet.</p>
          : (
            logEntries.map((entry) => (
              <div
                key={entry.id} // Use entry.id for the key
                className="bg-[#1E1E1E] p-4 rounded shadow flex justify-between items-center"
              >
                <div>
                  {Object.entries(entry)
                    .filter(([key]) => key !== "id")
                    .map(([key, value]) => (
                      <p key={key}>
                        <strong>{key.toUpperCase()}:</strong> {value || "N/A"}
                      </p>
                    ))}
                </div>
                <div className="flex space-x-2">
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                    onClick={() => openJournalDialog(entry)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() =>
                      setLogEntries((prev) =>
                        prev.filter((log) => log.id !== entry.id)
                      )}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
      </div>
    </div>
  );
};

export default JournalLog;
