interface IAction {
    type: string;
    payload?: any;
}

interface CommonState {
    menuOpen: boolean;
}

interface UserState {
    username?: string;
    avatar?: string;
}

interface IGlobalState {
    CommonReducer: CommonState,
    UserReducer: UserState
}
