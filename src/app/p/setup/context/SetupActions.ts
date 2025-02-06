// ✅ SetupActions.ts - アクション関数
import { Dispatch } from 'react';
import { SetupState } from './SetupState';

export const setSetupStatus = (dispatch: Dispatch<any>, status: string) => {
    dispatch({ type: 'SET_STATUS', payload: status });
};

export const setGender = (dispatch: Dispatch<any>, gender: string) => {
    dispatch({ type: 'SET_GENDER', payload: gender });
};

export const setUserType = (dispatch: Dispatch<any>, userType: string) => {  
    dispatch({ type: 'SET_USER_TYPE', payload: userType });
};

export const resetProfileData = (dispatch: Dispatch<any>) => {
    dispatch({ type: 'RESET_PROFILE' });
};

export const updateProfileData = (dispatch: Dispatch<any>, data: Record<string, any>) => {
    dispatch({ type: 'UPDATE_PROFILE', payload: data });
};
