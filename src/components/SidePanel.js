import React from "react";
import appStyles from "../App.module.css";
import styles from "../styles/SidePanel.module.css";
import { Container } from "react-bootstrap";
import { useCurrentUser } from "../contexts/CurrentUserContext";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";


const SidePanel = ({ mobile }) => {

  const currentUser = useCurrentUser();

  const addPostIcon = (
    <NavLink
      className={styles.NavLink}
      activeClassName={styles.Active}
      to="/posts/create"
    >
      <i className="far fa-plus-square"></i>Add post
    </NavLink>
  )

  const loggedInIcons = (
    <>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/feed"
      >
        <i className="fas fa-stream"></i>Feed
      </NavLink>

      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/liked"
      >
        <i className="fas fa-heart"></i>Liked
      </NavLink>
    </>
  );


  return (
    <Container className={`${appStyles.Container} ${mobile && 'd-lg-none text-center mb-3'}`}>
      <>
        <h5 className="text-center pb-3">{mobile ? (<></>) : (`Menu`) }</h5>
        {mobile ? (
          // IF ON MOBILE
          <div className="d-flex justify-content-around">
            {currentUser && addPostIcon}
            {currentUser ? loggedInIcons : <></>}
          </div>
        ) : (
          // IF ON DESKTOP
          <>
            {currentUser && addPostIcon}
            {currentUser ? loggedInIcons : <></>}
          </>

        )}
      </>
    </Container>

  );
};

export default SidePanel;