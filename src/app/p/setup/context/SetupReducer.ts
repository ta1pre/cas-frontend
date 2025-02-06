// ✅ SetupReducer.ts - 状態更新ロジック
import { SetupState } from './SetupState';

export const setupReducer = (state: SetupState, action: { type: string; payload?: any }) => {
    switch (action.type) {
        case 'SET_STATUS':
            return { ...state, setupStatus: action.payload };
        case 'SET_GENDER':
            return { ...state, gender: action.payload };
        case 'SET_USER_TYPE':
            return { ...state, user_type: action.payload };  
        case 'RESET_PROFILE':
            return { ...state, profileData: {}, setupStatus: 'sex_selection' };
        case 'UPDATE_PROFILE':
            return { ...state, profileData: { ...state.profileData, ...action.payload } };
        default:
            throw new Error(`Unknown action type: ${action.type}`);
    }
};