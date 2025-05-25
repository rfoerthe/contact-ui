import React, {useEffect, useState} from "react";
import type {Category, ContactEntry} from "./types.ts";
import './ContactEntryForm.css';

interface ContactEntryFormProps {
    categories: Category[],
    onSave: (entry: ContactEntry) => void,
    onCancel: () => void,
    editContact?: ContactEntry | null
}

export const ContactEntryForm: React.FC<ContactEntryFormProps> = ({categories, onSave, onCancel, editContact}) => {

    // form state
    const [level1, setLevel1] = useState<string>("");
    const [level2, setLevel2] = useState<string>("");
    const [level3, setLevel3] = useState<string>("");
    const [comment, setComment] = useState<string>("");

    const level2Categories =
        categories.find(c => c.id === level1)?.children || [];
    const level3Categories =
        level2Categories.find(c => c.id === level2)?.children || [];

    const saveContactEntry = () => {
        const contactEntry: ContactEntry = {
            level1,
            level2,
            level3,
            comment
        };
        onSave(contactEntry);
        clearContactEntryState()
    };

    const clearContactEntryState = (): void => {
        setLevel1("");
        setLevel2("");
        setLevel3("");
        setComment("");
    }

    useEffect(() => {
        if (editContact) {
            setLevel1(editContact.level1 || "");
            setLevel2(editContact.level2 || "");
            setLevel3(editContact.level3 || "");
            setComment(editContact.comment || "");
        } else {
            setLevel1("");
            setLevel2("");
            setLevel3("");
            setComment("");
        }
    }, [editContact]);


    return (
        <div className="form-container">
            <div className="row">
                <div className="field">
                    <label htmlFor="level1">Level 1 Category</label>
                    <select id="level1" value={level1} onChange={e => {
                        setLevel1(e.target.value);
                        setLevel2("");
                        setLevel3("");
                    }}>
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
                        value={level2}
                        onChange={e => {
                            setLevel2(e.target.value);
                            setLevel3("");
                        }}
                        disabled={!level1 || level2Categories.length === 0}
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
                        value={level3}
                        onChange={e => setLevel3(e.target.value)}
                        disabled={!level2 || level3Categories.length === 0}
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
                        onChange={e => setComment(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === "Enter" && e.ctrlKey) {
                                e.preventDefault();
                                saveContactEntry();
                            }
                        }}

                    />
                </div>
            </div>
            <div className="buttons">
                <button type="button" className="cancel" onClick={onCancel}>Cancel</button>
                <button type="button" className="save" onClick={saveContactEntry}>Save</button>
            </div>
        </div>
    );
};