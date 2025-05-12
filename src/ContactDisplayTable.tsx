import React from "react";
import type {ContactEntry} from "./ContactApp";
import type {Category} from "./ContactEntryForm";

interface ContactDisplayTableProps {
  contacts: ContactEntry[];
  categories: Category[];
  onDelete: (id: string) => void;
  onEdit: (contact: ContactEntry) => void;
}

export const ContactDisplayTable: React.FC<ContactDisplayTableProps> = ({
                                                                          contacts,
                                                                          categories,
                                                                          onDelete,
                                                                          onEdit,
                                                                        }) => {
  // Helper: recursively find a category's name by id
  const getCategoryName = (id: string): string => {
    const findCategory = (cats: Category[]): string => {
      for (const cat of cats) {
        if (cat.id === id) return cat.name;
        if (cat.children && cat.children.length > 0) {
          const found = findCategory(cat.children);
          if (found) return found;
        }
      }
      return "";
    };
    return findCategory(categories) || "Unknown";
  };

  // Aggregate category path
  const getCategoryPath = (contact: ContactEntry) => {
    const parts = [];
    if (contact.level1) parts.push(getCategoryName(contact.level1));
    if (contact.level2) parts.push(getCategoryName(contact.level2));
    if (contact.level3) parts.push(getCategoryName(contact.level3));
    return parts.join(" > ") || "Uncategorized";
  };

  return (
      <div className="table-container">
        <h2>Contact Entries</h2>
        {contacts.length === 0 ? (
            <div className="empty-state">
              No contact entries yet. Use the form to add some.
            </div>
        ) : (
            <table>
              <thead>
              <tr>
                <th>Category</th>
                <th>Comment</th>
                <th>Actions</th>
              </tr>
              </thead>
              <tbody>
              {contacts.map((contact) => (
                  <tr key={contact.id}>
                    <td className="category-path">{getCategoryPath(contact)}</td>
                    <td className="comment">{contact.comment}</td>
                    <td>
                      <div className="actions">
                        <button
                            className="edit-btn"
                            onClick={() => onEdit(contact)}
                        >
                          Edit
                        </button>
                        <button
                            className="delete-btn"
                            onClick={() => contact.id && onDelete(contact.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
        )}
        <style>
          {`
        .table-container {
          border: 1px solid #ccc;
          border-radius: 4px;
          padding: 20px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          margin-top: 20px;
          font-family: Arial, sans-serif;
          color: #333;
        }
        h2 {
          margin-top: 0;
          margin-bottom: 16px;
          color: #444;
          font-size: 18px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th {
          text-align: left;
          background-color: #f5f5f5;
          padding: 10px;
          font-weight: bold;
          border-bottom: 2px solid #ddd;
        }
        td {
          padding: 10px;
          border-bottom: 1px solid #ddd;
          vertical-align: top;
        }
        .category-path {
          font-weight: bold;
        }
        .comment {
          white-space: pre-wrap;
          color: #555;
        }
        .empty-state {
          text-align: center;
          padding: 40px;
          color: #888;
          font-style: italic;
        }
        .actions {
          display: flex;
          gap: 8px;
        }
        button {
          padding: 4px 8px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }
        .delete-btn {
          background-color: #f44336;
          color: white;
          border: none;
        }
        .edit-btn {
          background-color: #2196F3;
          color: white;
          border: none;
        }
        `}
        </style>
      </div>
  );
};