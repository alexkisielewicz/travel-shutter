import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";

import { Alert, Form, Button, Image, Col, Row, Container } from "react-bootstrap";
import axios from "axios";
import { useRedirect } from "../../hooks/useRedirect";

const SignUpForm = () => {
  useRedirect("loggedIn");

  const [signUpData, setSignUpData] = useState({
    username: "",
    password1: "",
    password2: "",
  })
  const { username, password1, password2 } = signUpData;

  const [errors, setErrors] = useState({});

  const history = useHistory();

  const handleChange = (event) => {
    setSignUpData({
      ...signUpData,
      // key value pair: input name:value of input
      [event.target.name]: event.target.value
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("/dj-rest-auth/registration/", signUpData)
      history.push("/signin")
    } catch (error) {
      setErrors(error.response?.data);
    }
  }

  return (
    <div className={`${styles.Container} mt-3`}>
      <Row className={`${styles.Row} no-gutters`}>
        <Col
          md={12}
          className={`my-0 d-none d-md-block p-0 ${styles.SignUpCol}`}
        >
          <Image
            className={`${styles.SignUpImage}`}
            src={"https://res.cloudinary.com/ddvsgi5xw/image/upload/v1686921714/signup_cover_jb2b3g.jpg"}
          />
        </Col>
      </Row>
      <Row className={styles.Row}>
        <Col className="mx-auto my-0 py-0 p-md-2" lg={6}>
          <Container className={`${appStyles.Content} p-4 `}>
            <h1 className={styles.Header}>sign up</h1>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="username">
                <Form.Label className="d-none">username</Form.Label>
                <Form.Control
                  className={styles.Input}
                  type="text"
                  placeholder="Username"
                  name="username"
                  value={username}
                  onChange={handleChange}
                />
              </Form.Group>
              {errors.username?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                  {message}
                </Alert>
              ))}
              <Form.Group controlId="password1">
                <Form.Label className="d-none">Password</Form.Label>
                <Form.Control
                  className={styles.Input}
                  type="password"
                  placeholder="Password"
                  name="password1"
                  value={password1}
                  onChange={handleChange}
                />
              </Form.Group>
              {errors.password1?.map((message, idx) => (
                <Alert key={idx} variant="warning">
                  {message}
                </Alert>
              ))}
              <Form.Group controlId="password2">
                <Form.Label className="d-none">Confirm password</Form.Label>
                <Form.Control
                  className={styles.Input}
                  type="password"
                  placeholder="Confirm password"
                  name="password2"
                  value={password2}
                  onChange={handleChange}
                />
              </Form.Group>
              {errors.password2?.map((message, idx) => (
                <Alert key={idx} variant="warning">
                  {message}
                </Alert>
              ))}
              <Button
                className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Orange}`}
                type="submit"
              >
                Sign up
              </Button>
              {errors.non_field_errors?.map((message, idx) => (
                <Alert key={idx} variant="warning" className="mt-3">
                  {message}
                </Alert>
              ))}
            </Form>
          </Container>
          <Container className={`mt-3 ${appStyles.Content}`}>
            <Link className={styles.Link} to="/signin">
              Already have an account? <span>Sign in</span>
            </Link>
          </Container>
        </Col>
      </Row>
    </div>
  );
};

export default SignUpForm;