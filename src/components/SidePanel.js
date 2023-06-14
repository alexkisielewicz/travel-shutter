import React from "react";
import appStyles from "../App.module.css";
import { Container } from "react-bootstrap";


const SidePanel = ({ mobile }) => {


  return (
    <Container className={`${appStyles.Container} ${mobile && 'd-lg-none text-center mb-3'}`}>
        <>
          <h5 className="text-center">Menu</h5>
          {mobile ? (
            // IF ON MOBILE
            <div className="d-flex justify-content-around">
              Side panel test MOBILE
            </div>
          ) : (
            // IF ON DESKTOP
            <p>Side panel test DESKTOP</p>
          )}
        </>
    </Container>
   
  );
};

export default SidePanel;