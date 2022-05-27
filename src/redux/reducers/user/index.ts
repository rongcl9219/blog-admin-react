import { SET_AVATAR, SET_USERNAME, RESET_USER_STATE, USER_LOGIN } from './types';

const UserReducer = (
    prevState: UserState = {
        username: '',
        avatar: ''
    },
    action: IAction = { type: '' }
) => {
    const { type, payload } = action;
    const newState = { ...prevState };

    switch (type) {
    case USER_LOGIN:

        return newState;
    case SET_USERNAME:
        newState.username = payload;
        return newState;
    case SET_AVATAR:
        newState.avatar = payload;
        return newState;
    case RESET_USER_STATE:
        newState.username = '';
        newState.avatar = '';
        return newState;
    default:
        return prevState;
    }
};

export default UserReducer;
