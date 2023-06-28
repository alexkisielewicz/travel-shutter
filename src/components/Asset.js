import React from "react";
import styles from "../styles/Asset.module.css";

const Asset = ({ src, message }) => {
  /* Reusable component used for displaying images
  and messages depends on passed properties*/
  return (
    <div className={`${styles.Asset} p-4`}>
      {src && <img src={src} alt={message} />}
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default Asset;