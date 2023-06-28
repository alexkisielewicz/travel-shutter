import React from "react";
import styles from "../styles/Avatar.module.css";

const Avatar = ({ src, height = 45, text }) => {
  /* Reusable component to display users Avatar
  with defined height and alt text */
  return (
    <span>
      <img
        className={styles.Avatar}
        src={src}
        height={height}
        width={height}
        alt="avatar"
      />
      {text}
    </span>
  );
};

export default Avatar;