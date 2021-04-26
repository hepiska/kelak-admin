const type = {
  LOGIN: 'auth/LOGIN_REQUEST',
  LOGOUT: 'auth/LOGOUT',
}

interface AuthType {
  token: any | null
  isAuth: boolean
}

const token = localStorage.getItem("token")

const initialState: AuthType = {
  token: token,
  isAuth: token ? true : false,
}


const AuthReducer = (state = initialState, action: any): AuthType => {
  switch (action.type) {
    case type.LOGIN:
      if (action.payload === null) {
        return initialState
      }
      localStorage.setItem("token", action.payload.token)

      return { token: action.payload.token, isAuth: true }
    case type.LOGOUT:
      return {
        token: null,
        isAuth: false,
      }
    default:
      return state
  }
}

export default AuthReducer


export const LOGIN = (authData: any) => ({
  type: type.LOGIN,
  payload: authData,
})

export const LOGOUT = () => ({
  type: type.LOGOUT,
  payload: ''
})
