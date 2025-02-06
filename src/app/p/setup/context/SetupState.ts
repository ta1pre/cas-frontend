// ✅ SetupState.ts - 状態定義と初期状態
export interface SetupState {
    setupStatus: string;
    gender: string | null;
    user_type: string | null;  
    profileData: Record<string, any>;
}

export const initialState: SetupState = {
    setupStatus: 'empty',
    gender: null,
    user_type: null,  
    profileData: {},
};