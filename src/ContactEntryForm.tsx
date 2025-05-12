import React, {useState, useMemo, type ChangeEvent, useEffect} from "react";

export interface Category {
  id: string;
  name: string;
  children?: Category[];
}

interface ContactEntryFormProps {
  categories: Category[];
  onCancel?: () => void;
  onSave?: (data: { level1: string; level2: string; level3: string; comment: string }) => void;
  initialContact?: { level1: string; level2: string; level3: string; comment: string };
}

export const ContactEntryForm: React.FC<ContactEntryFormProps> = ({
                                                                    categories,
                                                                    onCancel,
                                                                    onSave,
                                                                    initialContact,
                                                                  }) => {
  const [selectedLevel1, setSelectedLevel1] = useState(initialContact?.level1 || "");
  const [selectedLevel2, setSelectedLevel2] = useState(initialContact?.level2 || "");
  const [selectedLevel3, setSelectedLevel3] = useState(initialContact?.level3 || "");
  const [comment, setComment] = useState(initialContact?.comment || "");

  useEffect(() => {
    setSelectedLevel1(initialContact?.level1 || "");
    setSelectedLevel2(initialContact?.level2 || "");
    setSelectedLevel3(initialContact?.level3 || "");
    setComment(initialContact?.comment || "");
  }, [initialContact]);


  const level2Categories = useMemo(() => {
    return categories.find(cat => cat.id === selectedLevel1)?.children || [];
  }, [categories, selectedLevel1]);

  const level3Categories = useMemo(() => {
    return level2Categories.find(cat => cat.id === selectedLevel2)?.children || [];
  }, [level2Categories, selectedLevel2]);

  const resetForm = () => {
    setSelectedLevel1("");
    setSelectedLevel2("");
    setSelectedLevel3("");
    setComment("");
  };

  const handleLevel1Change = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedLevel1(e.target.value);
    setSelectedLevel2("");
    setSelectedLevel3("");
  };

  const handleLevel2Change = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedLevel2(e.target.value);
    setSelectedLevel3("");
  };

  const handleLevel3Change = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedLevel3(e.target.value);
  };

  const handleCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleCancel = () => {
    onCancel?.();
    resetForm();
  };

  const handleSave = () => {
    onSave?.({
      level1: selectedLevel1,
      level2: selectedLevel2,
      level3: selectedLevel3,
      comment,
    });
    resetForm();
  };

  return (
      <div className="form-container">
        <div className="row">
          <div className="field">
            <label htmlFor="level1">Level 1 Category</label>
            <select id="level1" value={selectedLevel1} onChange={handleLevel1Change}>
              <option value="">Select Category</option>
              {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="level2">Level 2 Category</label>
            <select
                id="level2"
                value={selectedLevel2}
                onChange={handleLevel2Change}
                disabled={!selectedLevel1 || level2Categories.length === 0}
            >
              <option value="">Select Category</option>
              {level2Categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="level3">Level 3 Category</label>
            <select
                id="level3"
                value={selectedLevel3}
                onChange={handleLevel3Change}
                disabled={!selectedLevel2 || level3Categories.length === 0}
            >
              <option value="">Select Category</option>
              {level3Categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="row">
          <div className="field">
            <label htmlFor="comment">Comment</label>
            <textarea
                id="comment"
                value={comment}
                onChange={handleCommentChange}
            />
          </div>
        </div>
        <div className="buttons">
          <button type="button" className="cancel" onClick={handleCancel}>Cancel</button>
          <button type="button" className="save" onClick={handleSave}>Save</button>
        </div>

        {/* Inline style for demonstration, but you should put this in a .css file */}
        <style>
          {`
          .form-container {
            border: 1px solid #ccc;
            border-radius: 4px;
            padding: 20px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            font-family: Arial, sans-serif;
            color: #333;
            display: block;
          }
          .row {
            display: flex;
            margin-bottom: 16px;
            gap: 16px;
          }
          .field {
            flex: 1;
          }
          label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
          }
          select {
            padding: 8px;
            width: 100%;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
          }
          textarea {
            width: 99%;
            min-height: 100px;
            resize: vertical;
            padding: 8px 0 8px 8px;
            font-family: Arial, sans-serif;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
          }
          .buttons {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
          }
          button {
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
          }
          .save, .cancel {
            font-size: 14px;
          }
          .cancel {
            background-color: #f5f5f5;
            border: 1px solid #ddd;
          }
          .save {
            background-color: #4CAF50;
            color: white;
            border: none;
          }
        `}
        </style>
      </div>
  );
};