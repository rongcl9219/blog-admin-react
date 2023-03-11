interface IAction<T> {
    type: string;
    payload?: T;
}

interface CommonState {
    menuOpen?: boolean;
    globalLoading?: boolean;
    loadingTips?: string;
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
