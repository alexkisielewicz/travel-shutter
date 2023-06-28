import React from "react"
import appStyles from "../App.module.css";

const InputError = ({ message }) => {
  /* Reusable component that displays message according
  to passed prop, used for displaying errors across the app */
  return (
    <p className={appStyles.ErrorMessage}>{message}</p>
  )
}

export default InputError