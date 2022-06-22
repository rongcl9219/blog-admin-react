import { TOGGLE_MENU, TOGGLE_LOADING } from './types';

export const toggleMenu = (): Promise<IAction<null>> => new Promise((resolve) => {
    resolve({type: TOGGLE_MENU});
});

export const toggleGlobalLoading = (globalLoading: GIGlobalLoading): IAction<GIGlobalLoading> => ({
    type: TOGGLE_LOADING,
    payload: globalLoading
});
