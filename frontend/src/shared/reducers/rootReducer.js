const initState = {
    isLoggedIn: false,
    userProfile: null,
    userId: null,
    token: null,
    errorStatusCode: null
}

const rootReducer = (state=initState, action) => {
    switch(action.type){
        case 'LOGIN':
            // const tokenExpirationDate = new Date(new Date().getTime() + 1000 * 60 * 60);
            return{
                ...state,
                isLoggedIn: !!action.payload.token,
                userProfile: action.payload.user,
                userId: action.payload.userId,
                token: action.payload.token
            }
        case 'LOGOUT':
            return{
                ...state,
                isLoggedIn: false,
                userProfile: null,
                userId: null,
                token: null
            }
        case 'ERR_STATUS_CODE':
            return{
                ...state,
                errorStatusCode: action.payload
            }

        default:
            return state;
    }
}

export default rootReducer;