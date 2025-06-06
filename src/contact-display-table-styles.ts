import {css} from 'lit';

export const contactDisplayTableStyles = css`
    :host {
        display: block;
        font-family: Arial, sans-serif;
        color: #333;
    }

    .table-container {
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 20px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        margin-top: 20px;
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

    th.actions-head {
        width: 110px;
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

    .edit {
        background-color: #f6e0b6;
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
`;