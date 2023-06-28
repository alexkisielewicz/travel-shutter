import React from "react";
import styles from "../styles/Spinner.module.css";

/* Reusable component that renders a spinner, it's used 
across application when data is being loaded or API requests are being made */
function Spinner() {
  return (
    <div>
      {/* Spinner style sourced from https://loading.io/css/ 
      dibs create three bars that are animated with css */}
      <div className={styles.Spinner}><div></div><div></div><div></div></div>
    </div>
  )
}

export default Spinner