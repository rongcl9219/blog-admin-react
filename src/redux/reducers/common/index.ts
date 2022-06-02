import { TOGGLE_MENU } from './types';

const CommonReducer = (
    prevState: CommonState = {
        menuOpen: false
    },
    action: IAction<any> = { type: '' }
) => {
    const { type } = action;
    const newState = { ...prevState };

    switch (type) {
    case TOGGLE_MENU:
        newState.menuOpen = !newState.menuOpen;
        return newState;
    default:
        return prevState;
    }
};

export default CommonReducer;
