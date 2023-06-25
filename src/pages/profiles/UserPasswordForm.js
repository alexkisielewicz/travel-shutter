import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { axiosRes } from "../../api/axiosDefaults";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";
import { toast } from "react-toastify";
import InputError from "../../components/InputError";

const UserPasswordForm = () => {
  const history = useHistory();
  const { id } = useParams();
  const currentUser = useCurrentUser();

  const [userData, setUserData] = useState({
    new_password1: "",
    new_password2: "",
  });
  const { new_password1, new_password2 } = userData;

  const [errors, setErrors] = useState({});

  const showToast = (message) => {
    toast.success(message);
  };

  const handleChange = (event) => {
    setUserData({
      ...userData,
      [event.target.name]: event.target.value,
    });
  };

  useEffect(() => {
    if (currentUser?.profile_id?.toString() !== id) {
      // redirect user if they are not the owner of this profile
      history.push("/");
    }
  }, [currentUser, history, id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!/^[A-Za-z0-9_]{8,16}$/.test(new_password1)) {
        setErrors({
          new_password1: [
            "Password should be 8-16 characters long and may contain letters, digits, and underscore. It shouldn't be too common or similar to your username.",
          ],
        });
        return;
      }
      await axiosRes.post("/dj-rest-auth/password/change/", userData);
      history.goBack();
      showToast("Password changed!");
    } catch (error) {
      setErrors(error.response?.data);
      // console.log(error.response?.data);
    }
  };

  return (
    <Row>
      <Col className="py-2 mx-auto text-center" md={6}>
        <Container className={appStyles.Container}>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>New password</Form.Label>
              <Form.Control
                placeholder="new password"
                type="password"
                value={new_password1}
                onChange={handleChange}
                name="new_password1"
              />
              {errors.new_password1 && errors.new_password1.map((message, idx) => (
                <InputError key={idx} message={message} />
              ))}
            </Form.Group>
            <Form.Group>
              <Form.Label>Confirm password</Form.Label>
              <Form.Control
                placeholder="confirm new password"
                type="password"
                value={new_password2}
                onChange={handleChange}
                name="new_password2"
              />
              {errors.new_password2 && errors.new_password2.map((message, idx) => (
                <InputError key={idx} message={message} />
              ))}
            </Form.Group>
            <Button
              className={`${btnStyles.Button} ${btnStyles.Orange}`}
              onClick={() => history.goBack()}
            >
              cancel
            </Button>
            <Button
              type="submit"
              className={`${btnStyles.Button} ${btnStyles.Orange}`}
            >
              save
            </Button>
            {errors.non_field_errors?.map((message, idx) => (
              <InputError key={idx} message={message} />
            ))}
          </Form>
        </Container>
      </Col>
    </Row>
  );
};

export default UserPasswordForm;
