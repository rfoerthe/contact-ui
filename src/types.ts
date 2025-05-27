export interface Category {
    id: string;
    name: string;
    children?: Category[];
}

export interface ContactEntry {
    level1: string;
    level2: string;
    level3: string;
    comment: string;
    id?: string;
    timestamp?: number;
}