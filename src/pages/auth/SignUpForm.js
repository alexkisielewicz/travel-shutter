import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";
import { toast } from "react-toastify";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import axios from "axios";
import { useRedirect } from "../../hooks/useRedirect";
import InputError from "../../components/InputError";

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

  const showToast = (message) => {
    toast.success(message);
  };

  // handles inputs change in the form
  const handleChange = (event) => {
    setSignUpData({
      ...signUpData,
      // key value pair: input name:value of input
      [event.target.name]: event.target.value
    })
  }

  /* Handles form submission, makes request to allauth endpoint with form 
  data including username, password and confirmed password inputs.
  Username and password is validated against individual regexes. 
  Error messages are set individually for each input field */
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const usernameRegex = /^[A-Za-z0-9_]{4,12}$/;
    if (!usernameRegex.test(username)) {
      setErrors({
        username: [
          "Username can contain uppercase and lowercase letters, digits, or underscores. The length should be between 4 and 12 characters.",
        ],
      });
      return;
    }
    const passwordRegex = /^[A-Za-z0-9_]{8,16}$/;
    if (!passwordRegex.test(password1)) {
      setErrors({
        password1: [
          "Password should be 8-16 characters long and may contain letters, digits, and underscores. It shouldn't be too common or similar to your username.",
        ],
      });
      return;
    }
      await axios.post("/dj-rest-auth/registration/", signUpData)
      history.push("/signin")
      showToast("Account created!")
    } catch (error) {
      setErrors(error.response?.data);
      // console.log(error.response?.data);
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
            alt="Sign up cover page photo"
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
                  maxLength={12}
                  placeholder="Username"
                  name="username"
                  value={username}
                  onChange={handleChange}
                />
              </Form.Group>
              {errors.username && errors.username.map((message, idx) => (
                <InputError key={idx} message={message} />
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
              {errors.password1 && errors.password1.map((message, idx) => (
                <InputError key={idx} message={message} />
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
              {errors.password2 && errors.password2.map((message, idx) => (
                <InputError key={idx} message={message} />
              ))}
              <Button
                className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Orange}`}
                type="submit"
              >
                Sign up
              </Button>
              {errors.non_field_errors?.map((message, idx) => (
                <InputError key={idx} message={message} />
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