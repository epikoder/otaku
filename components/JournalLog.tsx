import React, { useState } from "react";
import { showDialog,JournalDialog } from "./Dialog";
import { v4 as uuidv4 } from 'uuid';

// Log entry type definition
type JournalIntent = {
  intent: "journal";
  token: string;
  price?: number;
  amount: number;
  profit?: number;
  id: string; // Added id property to the interface
};

const JournalLog = () => {
  const [logEntries, setLogEntries] = useState<JournalIntent[]>([]);

  const openJournalDialog = (entryToEdit?: JournalIntent) => {
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
              { id: uuidv4(), ...data } as JournalIntent,
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Journal Logs</h1>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => openJournalDialog()}
      >
        Add Journal Entry
      </button>

      <div className="mt-6 space-y-4">
        {logEntries.length === 0 ? (
          <p className="text-gray-500">No journal entries yet.</p>
        ) : (
          logEntries.map((entry) => (
            <div
              key={entry.id} // Use entry.id for the key
              className="bg-gray-100 p-4 rounded shadow flex justify-between items-center"
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
                    )
                  }
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