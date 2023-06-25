import React, { useState } from "react";
import axios from "axios";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";

import { Link, useHistory } from "react-router-dom";

import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";
import { useSetCurrentUser } from "../../contexts/CurrentUserContext";
import { useRedirect } from "../../hooks/useRedirect";
import { setTokenTimestamp } from "../../utils/utils";

import { toast } from "react-toastify";
import InputError from "../../components/InputError";

function SignInForm() {
  // redirect user if already logged in
  useRedirect("loggedIn");
  const setCurrentUser = useSetCurrentUser();

  const [signInData, setSignInData] = useState({
    username: "",
    password: "",
  });

  const { username, password } = signInData;

  const [errors, setErrors] = useState({});

  const history = useHistory();

  const showToast = (message) => {
    toast.success(message);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post("/dj-rest-auth/login/", signInData)
      setCurrentUser(data.user)
      // keep refresh token timestamp in local storage
      setTokenTimestamp(data);
      showToast("Signed in succesfully!");
      history.goBack();
    } catch (err) {
      setErrors(err.response?.data);
    }
  }

  const handleChange = (event) => {
    setSignInData({
      ...signInData,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div className={`${styles.Container} mt-3`}>
      <Row className={`${styles.Row} no-gutters`}>
        <Col
          md={12}
          className={`my-0 d-none d-md-block p-0 ${styles.SignUpCol}`}
        >
          <Image
            className={`${styles.SignUpImage}`}
            src={"https://res.cloudinary.com/ddvsgi5xw/image/upload/v1686921714/signin_cover_nbepl2.jpg"}
          />
        </Col>
      </Row>
      <Row className={styles.Row}>
        <Col className="mx-auto my-0 py-0 p-md-2" lg={6}>
          <Container className={`${appStyles.Content} p-4 `}>
            <h1 className={styles.Header}>sign in</h1>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="username">
                <Form.Label className="d-none">Username</Form.Label>
                <Form.Control
                  type="text"
                  maxLength={12}
                  placeholder="Username"
                  name="username"
                  className={styles.Input}
                  value={username}
                  onChange={handleChange}
                />
              </Form.Group>
              {errors.username && errors.username.map((message, idx) => (
                <InputError key={idx} message={message} />
              ))}
              <Form.Group controlId="password">
                <Form.Label className="d-none">Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                  className={styles.Input}
                  value={password}
                  onChange={handleChange}
                />
              </Form.Group>
              {errors.password && errors.password.map((message, idx) => (
                <InputError key={idx} message={message} />
              ))}
              <Button
                className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Orange}`}
                type="submit"
              >
                Sign in
              </Button>
              {errors.non_field_errors?.map((message, idx) => (
                <InputError key={idx} message={message} />
              ))}
            </Form>
          </Container>
          <Container className={`mt-3 ${appStyles.Content}`}>
            <Link className={styles.Link} to="/signup">
              Don&apos;t have an account? <span>Sign up now!</span>
            </Link>
          </Container>
        </Col>
      </Row>
    </div>
  );
}

export default SignInForm;