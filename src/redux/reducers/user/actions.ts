import { UserApi } from '@/api';
import { USER_LOGIN } from './types';

const login = (username: string, password: string): Promise<IAction> => new Promise((resolve) => {
    UserApi.login(username, password).then((res) => {
        resolve({type: USER_LOGIN, payload: res});
    });
});

export default {
    login
};
