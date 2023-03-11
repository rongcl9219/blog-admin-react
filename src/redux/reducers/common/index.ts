import { TOGGLE_MENU, TOGGLE_LOADING } from './types'

const CommonReducer = (
    prevState: CommonState = {
        menuOpen: false,
        globalLoading: false,
        loadingTips: ''
    },
    action: IAction<any> = { type: '' }
) => {
    const { type, payload } = action
    const newState = { ...prevState }

    switch (type) {
    case TOGGLE_MENU:
        newState.menuOpen = !newState.menuOpen
        return newState
    case TOGGLE_LOADING:
        newState.globalLoading = !!payload.isLoading
        newState.loadingTips = payload.loadingTips || '加载中...'
        return newState
    default:
        return prevState
    }
}

export default CommonReducer
