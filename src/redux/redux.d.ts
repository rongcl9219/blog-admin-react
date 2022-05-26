interface IAction {
    type: string;
    payload?: any;
}

interface CommonState {
    menuOpen: boolean;
}

interface IGlobalState {
    CommonReducer: CommonState
}
