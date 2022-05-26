const CommonReducer = (
    prevState: CommonState = {
        menuOpen: false
    },
    action: IAction = { type: '' }
) => {
    const { type } = action;
    const newState = { ...prevState };

    switch (type) {
    case 'toggle-menu':
        newState.menuOpen = !newState.menuOpen;
        return newState;
    default:
        return prevState;
    }
};

export default CommonReducer;
