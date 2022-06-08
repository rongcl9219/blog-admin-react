import { TOGGLE_MENU, TOGGLE_LOADING } from './types';

interface ILoading {
    isLoading: boolean;
    loadingTips: string;
}

export const toggleMenu = (): Promise<IAction<null>> => new Promise((resolve) => {
    resolve({type: TOGGLE_MENU});
});

export const toggleGlobalLoading = (globalLoading: ILoading): IAction<ILoading> => ({
    type: TOGGLE_LOADING,
    payload: globalLoading
});
