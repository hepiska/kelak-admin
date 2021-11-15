import React, { useEffect } from "react"
import { Switch, Route, RouteComponentProps } from 'react-router-dom'
import { useDispatch, } from 'react-redux'
import AdminPages from "./admin"
import GenerateWeblink from "./generate-deeplink"
import { LOGIN, LOGOUT } from '@src/modules/auth'
import LoginPage from "./login"



const Main: React.FC<RouteComponentProps> = ({ history }) => {
  history.replace("/admin")
  return null
}


const App: React.FC = () => {
  const dispatch = useDispatch()
  const setUserAuth = async (user: any) => {
    if (user && user.email) {


    }
  }
  useEffect(() => {

    return () => {
    }
  }, [])

  return (
    <Switch>
      <Route
        path="/admin"
        component={AdminPages}
      />
      <Route
        exact
        path="/login"
        component={LoginPage}
      />
      <Route
        exact
        path="/generate"
        component={GenerateWeblink}
      />
      <Route path="/" component={Main} />
    </Switch>

  )
}

export default App