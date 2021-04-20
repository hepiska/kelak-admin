import React, { useEffect } from "react"
import { Switch, Route, } from 'react-router-dom'
import { useDispatch, } from 'react-redux'
import AdminPages from "./admin"
import { LOGIN, LOGOUT } from '@src/modules/auth'
import { auth, db } from '@src/utils/firebase'
import LoginPage from "./login"



const userDb = db.collection("users")

const App: React.FC = () => {
  const dispatch = useDispatch()
  const setUserAuth = async (user: any) => {
    if (user && user.email) {
      const userData = await userDb.doc(user.email).get().then((doc: any) => {
        if (doc.exists) {
          return doc.data()
        }
        return null
      })
      if (userData) {
        dispatch(LOGIN(userData))
      }
    }
  }
  useEffect(() => {
    const unSubcription = auth.onAuthStateChanged((res: any) => {
      if (res) {
        const user = auth.currentUser
        setUserAuth(user)
      } else {
        dispatch(LOGOUT())
      }
    })
    return () => {
      unSubcription()
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
    </Switch>

  )
}

export default App