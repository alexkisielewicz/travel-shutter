import axios from "axios";
import { useEffect } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"

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
