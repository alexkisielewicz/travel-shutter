import React from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";

import btnStyles from "../styles/Button.module.css";
import styles from "../styles/Page404.module.css";
import { Link } from "react-router-dom";

/* Component used for displaying a 404 Error page, contains 
a link that allows users to return to the main page without 
using back button in the browser */
const PageNotFound = () => {
  return (
    <div className={`${styles.Container} mt-3`}>
      <Row className={`${styles.Row} no-gutters`}>
        <Col
          md={12}
          className={`my-0 d-none d-md-block p-0 ${styles.Col}`}
        >
          <Image
            className={`${styles.ErrorImage}`}
            src={"https://res.cloudinary.com/ddvsgi5xw/image/upload/v1686923609/error_amtlrl.jpg"}
          />
        </Col>
      </Row>
      <Row className={styles.Row}>
        <Col className="mx-auto my-0 py-0 p-md-2" lg={6}>
          <Container className="text-center">
            <h2 className="py-3">Page not found</h2>
            <Link to="/">
              <Button className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.OrangeOutline} my-3`}>
                Return to Home Page
              </Button>
            </Link>
          </Container>
        </Col>
      </Row>
    </div>
  );
};

export default PageNotFound;