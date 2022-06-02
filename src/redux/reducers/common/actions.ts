import { TOGGLE_MENU } from './types';

export const toggleMenu = (): Promise<IAction<null>> => new Promise((resolve) => {
    resolve({type: TOGGLE_MENU});
});

export default {
    toggleMenu
};
