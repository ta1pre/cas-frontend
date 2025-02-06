'use client';

import React, { createContext, useContext, useReducer } from 'react';

interface SetupState {
    setupStatus: string;
}

interface SetupContextType {
    state: SetupState;
    setSetupStatus: (status: string) => void;
}

const initialState: SetupState = {
    setupStatus: 'empty',
};

const SetupContext = createContext<SetupContextType | undefined>(undefined);

const setupReducer = (state: SetupState, action: { type: string; payload: string }) => {
    switch (action.type) {
        case 'SET_STATUS':
            return { ...state, setupStatus: action.payload };
        default:
            throw new Error(`Unknown action type: ${action.type}`);
    }
};

export const SetupProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(setupReducer, initialState);

    const setSetupStatus = (status: string) => {
        dispatch({ type: 'SET_STATUS', payload: status });
    };

    return (
        <SetupContext.Provider value={{ state, setSetupStatus }}>
            {children}
        </SetupContext.Provider>
    );
};

export const useSetup = () => {
    const context = useContext(SetupContext);
    if (!context) {
        throw new Error('useSetup must be used within a SetupProvider');
    }
    return context;
};
