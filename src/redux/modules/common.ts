interface IAction {
    type: string;
    payload?: any;
}

interface IState {
    show: boolean;
}

const CommonReducer = (
    prevState: IState = {
        show: true
    },
    action: IAction = { type: '' }
) => {
    const { type } = action;
    const newState = { ...prevState };

    switch (type) {
    case 'show':
        newState.show = true;
        return newState;
    case 'hide':
        newState.show = true;
        return newState;
    default:
        return prevState;
    }
};

export default CommonReducer;
