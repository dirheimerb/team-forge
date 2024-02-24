import React, { createContext, useContext, useReducer } from 'react';

export interface HistoryContext {
    type: string;
    name: string;
    key: string;
    code: string;
    shiftKey: boolean;
    ctrlKey: boolean;    
    point?: Delta;
    delta?: Delta;
    vector?: Vector;
    shape?: Shape;
    shapes?: Shape[];
}

export interface Delta {
    x: number;
    y: number;
    z: number;
}

export interface Vector {
    x: number;
    y: number;
    z: number;
}

export interface Shape {
    x: number;
    y: number;
    rotation: number;
    isLocked: boolean;
    opacity: number;
    meta: Meta;
    id: string;
    type: string;
    parentId: string;
    index: string;
    props: Props;
    typeName: string;
}

export interface Props {
    color: string;
    size: string;
    text: string;
    font: string;
    align: string;
    verticalAlign: string;
    growY: number;
    url: string;
}

export interface Meta {
    createdAt: number;
    updatedAt: number;
    createdBy: string;
    updatedBy: string;
}


export const HistoryContext = createContext<HistoryContext | undefined>(undefined);

const initialState: HistoryContext = {
    type: '',
    name: '',
    key: '',
    code: '',
    shiftKey: false,
    ctrlKey: false,
};

export const historyReducer = (state: HistoryContext, action: HistoryContext) => {
    switch (action.type) {
        case 'SET_HISTORY':
            return {
                ...state,
                type: action.type,
                name: action.name,
                key: action.key,
                code: action.code,
                shiftKey: action.shiftKey,
                ctrlKey: action.ctrlKey,
                point: action.point,
                delta: action.delta,
                vector: action.vector,
                shape: action.shape,
                shapes: action.shapes,
            };
        default:
            return state;
    }
}

export const useHistory = () => {
    const context = useContext(HistoryContext);
    if (context === undefined) {
        throw new Error('useHistory must be used within a HistoryProvider');
    }
    return context;
}

export interface HistoryProviderProps {
    children: React.ReactNode;
}

export default function HistoryProvider({ children }: HistoryProviderProps) {
    const [state, dispatch] = useReducer(historyReducer, initialState);

    const setHistory = (history: HistoryContext) => {
        dispatch({ ...history, type: 'SET_HISTORY' });
    }

    React.useEffect(() => {
        window.addEventListener('keydown', (e) => {
            setHistory({
                ...state,
                name: 'keydown',
                key: e.key,
                code: e.code,
                shiftKey: e.shiftKey,
                ctrlKey: e.ctrlKey,
            });
        });
    }, [state]);


    return (
        <HistoryContext.Provider value={{ ...state }}>
            {children}
        </HistoryContext.Provider>
    );
}