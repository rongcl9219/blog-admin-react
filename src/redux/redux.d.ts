interface IAction<T> {
    type: string;
    payload?: T;
}

interface CommonState {
    menuOpen: boolean;
}

interface UserState {
    token?: string;
    refreshToken?: string;
    tokenExp?: number;
    username?: string;
    avatar?: string
}

interface IGlobalState {
    CommonReducer: CommonState,
    UserReducer: UserState
}
