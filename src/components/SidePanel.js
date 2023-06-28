import React from "react";

import appStyles from "../App.module.css";
import styles from "../styles/SidePanel.module.css";
import Container from "react-bootstrap/Container";

import { useCurrentUser } from "../contexts/CurrentUserContext";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";

/* Component renders menu for logged in users, contains 
links to Add post page, Feed page and Liked page */
const SidePanel = ({ mobile }) => {

  const currentUser = useCurrentUser();

  // Add Post link
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
      {/* Link to user's Feed */}
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/feed"
      >
        <i className="fas fa-stream"></i>Feed
      </NavLink>

      {/* Link to user's Liked page */}
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
    <Container className={`${appStyles.Container} ${mobile && "d-lg-none text-center mb-3"}`}>
      <>
      {mobile ? null : (<h4 className="text-center pb-3">Menu</h4>)}
        {mobile ? (
          // If on mobile
          <div className="d-flex justify-content-around">
            {currentUser && addPostIcon}
            {currentUser ? loggedInIcons : <></>}
          </div>
        ) : (
          // If on desktop
          <div className="d-flex justify-content-around">
            {currentUser && addPostIcon}
            {currentUser ? loggedInIcons : <></>}
          </div>

        )}
      </>
    </Container>

  );
};

export default SidePanel;