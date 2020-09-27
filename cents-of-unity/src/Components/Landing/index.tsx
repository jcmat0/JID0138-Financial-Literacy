import React, { useEffect, useState } from 'react'
import { firebase } from '../../firebase'
import * as routes from '../../constants/routes'

export const Landing = () => {
  const [loggedIn, setLoggedIn] = useState(false)
  useEffect(() => {
    firebase.auth.onAuthStateChanged(function (user: any) {
      if (user) {
        window.location.href = routes.LANDING
        setLoggedIn(true)
      } else {
        window.location.href = routes.SIGN_IN
        setLoggedIn(false)
      }
    })
  }, [loggedIn])

  return (
    <div>
      <h2>Landing Page</h2>
    </div>
  )
}
