import React from "react"
import appStyles from "../App.module.css";

const InputError = ({ message }) => {
  return (
    <p className={appStyles.ErrorMessage}>{message}</p>
  )
}

export default InputError