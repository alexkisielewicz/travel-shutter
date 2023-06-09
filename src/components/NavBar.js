import React from "react";
import { NavLink } from "react-router-dom";
import { useCurrentUser, useSetCurrentUser } from "../contexts/CurrentUserContext";
import useClickOutsideToggle from "../hooks/useClickOutsideToggle";
import { removeTokenTimestamp } from "../utils/utils";

import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import { ToastContainer, toast } from "react-toastify";

import logo from "../assets/logo.png";
import styles from "../styles/NavBar.module.css";
import "react-toastify/dist/ReactToastify.css";

import Avatar from "../components/Avatar";
import axios from "axios";

const NavBar = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();

  const showToast = (message) => {
    /* All feedback messages in toasts are shown using this function, 
    Navbar holds this function as the component common for all pages */
    toast.success(message);
  };

  const { expanded, setExpanded, ref } = useClickOutsideToggle();

  const handleSignOut = async (event) => {
    /* Make request to allauth endpoint, clear current 
    user variable and show sign out confirmation */
    try {
      await axios.post("dj-rest-auth/logout/");
      setCurrentUser(null);
      showToast("Signed out successfully!")
      removeTokenTimestamp();
    } catch (error) {
      // console.log(error);
    }
  }

  const loggedInIcons = (
    // Icons fore logged in user
    <>
      <NavLink
        className={styles.NavLink}
        to="/"
        onClick={handleSignOut}
      >
        <i className="fas fa-sign-out-alt"></i>Sign out
      </NavLink>

      <NavLink
        className={styles.NavLink}
        to={`/profiles/${currentUser?.profile_id}`}
      >
        <Avatar 
          src={currentUser?.profile_image} 
          text={`${currentUser?.username}`} 
          height={35} />
      </NavLink>
    </>
  );

  const loggedOutIcons = (
    // Icons for anonymous user
    <>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/signin"
      >
        <i className="fas fa-sign-in-alt"></i>Sign in
      </NavLink>
      <NavLink
        to="/signup"
        className={styles.NavLink}
        activeClassName={styles.Active}
      >
        <i className="fas fa-user-plus"></i>Sign up
      </NavLink>
    </>
  );

  return (
    <Navbar expanded={expanded} className={styles.NavBar} expand="md" fixed="top">
      {/* Toast component to display feedback messages across application 
      Toast's style and behaviour is configured using parameters below */}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Container>
        <NavLink className={styles.Logo} to="/">
          <Navbar.Brand>
            <img className={styles.Logo} src={logo} alt="Travel Shutter logo" height="70" />
          </Navbar.Brand>
        </NavLink>
        {/* Mobile collapsible menu in the NavBar */}
        <Navbar.Toggle
          ref={ref}
          onClick={() => setExpanded(!expanded)}
          aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto text-center">
            <NavLink
              exact
              className={styles.NavLink}
              activeClassName={styles.Active}
              to="/"
            >
              <i className="fas fa-home"></i>Home
            </NavLink>
            {currentUser ? loggedInIcons : loggedOutIcons}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;