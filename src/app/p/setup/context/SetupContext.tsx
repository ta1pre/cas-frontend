// ✅ SetupContext.tsx - ContextとProvider
'use client';
import React, { createContext, useContext, useReducer } from 'react';
import { setupReducer } from './SetupReducer';
import { initialState, SetupState } from './SetupState';
import { setSetupStatus, setGender, setUserType, resetProfileData, updateProfileData } from './SetupActions';

interface SetupContextType {
    state: SetupState;
    setSetupStatus: (status: string) => void;
    setGender: (gender: string) => void;
    setUserType: (userType: string) => void;  // ⭐️ 追加
    resetProfileData: () => void;
    updateProfileData: (data: Record<string, any>) => void;
}

const SetupContext = createContext<SetupContextType | undefined>(undefined);

export const SetupProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(setupReducer, initialState);

    return (
        <SetupContext.Provider
            value={{
                state,
                setSetupStatus: (status) => setSetupStatus(dispatch, status),
                setGender: (gender) => setGender(dispatch, gender),
                setUserType: (userType) => setUserType(dispatch, userType),  
                resetProfileData: () => resetProfileData(dispatch),
                updateProfileData: (data) => updateProfileData(dispatch, data),
            }}
        >
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
