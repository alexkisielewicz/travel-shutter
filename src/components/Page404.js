import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import appStyles from "../App.module.css";
import { Link } from "react-router-dom";

/*
  Displays a 404 page customised graphic
  and a link to return to the main page
*/
const PageNotFound = () => {
  return (
    <Row>
      <Col className="py-2 mx-auto text-center" md={12}>
        <Container className={appStyles.Content}>
          <h1 className="my-3">Error 404. Page not found!</h1>

          <Link to="/">
            <Button className={`${appStyles.button} my-3`}>
              Return to Home Page
            </Button>
          </Link>
        </Container>
      </Col>
    </Row>
  );
};

export default PageNotFound;