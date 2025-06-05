import {css} from 'lit';

export const contactEntryFormStyles = css`
    :host {
        display: block;
        font-family: Arial, sans-serif;
        color: #333;
    }

    .form-container {
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 20px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
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
    }

    textarea {
        width: 99%;
        min-height: 100px;
        resize: vertical;
        padding: 8px 0 8px 8px;
        font-family: Arial, sans-serif;
    }

    select, textarea {
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
        font-size: 14px;
        cursor: pointer;
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
`;