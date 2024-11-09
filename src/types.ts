export interface Position {
    x: number;
    y: number;
}

export interface Connection {
    from: string;
    to: string; 
}

export interface ConnectionPoint {
    id: string;
    cardId: string;
    type: 'input' | 'output';
}