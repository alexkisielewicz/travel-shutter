import axios from "axios";
import { useEffect } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"

/* Custom hook is used for refreshing user's access tokens.
Refreshes user acces token for logged in user and redirects to home page,
if tokens can't be refreshed logged out user is redirected to home page  */
export const useRedirect =(userAuthStatus) => {
  const history = useHistory();
  
  useEffect(() => {
    const handleMount = async () => {
      try {
        await axios.post("/dj-rest-auth/token/refresh/")
        // run if used is logged in
        if (userAuthStatus === "loggedIn") {
          history.push("/")
        }
      } catch (error) {
        // run if user is not logged in
        if (userAuthStatus === "loggedOut") {
          history.push("/")
        } 
      }
    }

    handleMount();
  }, [history, userAuthStatus])
}
