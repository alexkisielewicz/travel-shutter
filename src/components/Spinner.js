import React from 'react';
import styles from "../styles/Spinner.module.css";

function Spinner() {
  return (
    <div>
      {/* spinner css sourced from https://loading.io/css/ */}
      <div class={styles.Spinner}><div></div><div></div><div></div></div>
    </div>
  )
}

export default Spinner