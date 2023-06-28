import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

import { axiosReq } from "../../api/axiosDefaults";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../../contexts/CurrentUserContext";
import InputError from "../../components/InputError";

import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";
import styles from "../../styles/ProfileEditForm.module.css";
import { toast } from "react-toastify";

const ProfileEditForm = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const { id } = useParams();
  const history = useHistory();
  const imageFile = useRef();

  const [profileData, setProfileData] = useState({
    name: "",
    bio: "",
    instagram: "",
    equipment: "",
    image: "",
  });
  const { name, bio, instagram, equipment, image } = profileData;

  const [errors, setErrors] = useState({});

  // Shows toast with message passed in param.
  const showToast = (message) => {
    toast.success(message);
  };
  
  // fetch user's profile on component mount (by user id)
  useEffect(() => {
    const handleMount = async () => {
      if (currentUser?.profile_id?.toString() === id) {
        try {
          // fetch data from existing fields
          const { data } = await axiosReq.get(`/profiles/${id}`);
          const { name, bio, instagram, equipment, image } = data;
          setProfileData({ name, bio, instagram, equipment, image });
        } catch (error) {
          // console.log(error);
          history.push("/");
        }
      } else {
        history.push("/");
      }
    };

    handleMount();
  }, [currentUser, history, id]);

  // Handles change in form's inputs
  const handleChange = (event) => {
    setProfileData({
      ...profileData,
      [event.target.name]: event.target.value,
    });
  };

  /* Function handles form submission, makes PUT request to api to update
  user's profile with data provided in the form. Each input is validated aganist
  specific regex, individual error messages are set for each input field. */
  const handleSubmit = async (event) => {
    event.preventDefault();
    const nameRegex = /^[A-Za-z\s]{1,40}$/;
    if (!nameRegex.test(name)) {
      setErrors({
        name: [
          "Name can contain letters and spaces, allowed length 1-40 characters.",
        ],
      });
      return;
    }
    // Validate bio
    const bioRegex = /^[A-Za-z0-9\s,.!]{0,150}$/;
    if (!bioRegex.test(bio)) {
      setErrors({
        bio: [
          "Bio can contain letters, digits, spaces, commas, dots, exclamation marks, up to 150 characters.",
        ],
      });
      return;
    }
    // Validate instagram
    const instagramRegex = /^[A-Za-z0-9_.]{0,70}$/;
    if (!instagramRegex.test(instagram) || instagram.includes("instagram.com")) {
      setErrors({
        instagram: [
          "Instagram can contain letters, digits, underscores, up to 70 characters. Enter your handle instead of profile URL",
        ],
      });
      return;
    }
    // Validate equipment
    const equipmentRegex = /^[A-Za-z0-9\s,.!_]{0,70}$/;
    if (!equipmentRegex.test(equipment)) {
      setErrors({
        equipment: [
          "Equipment can contain letters, digits, spaces, commas, dots, underscores, up to 70 characters.",
        ],
      });
      return;
    }

    // Declare form data and include all input fields values
    const formData = new FormData();
    formData.append("name", name);
    formData.append("bio", bio);
    formData.append("instagram", instagram);
    formData.append("equipment", equipment);
    // include image in form data
    if (imageFile?.current?.files[0]) {
      formData.append("image", imageFile?.current?.files[0]);
    }

    // Make a PUT api request to specific profile endpoint
    try {
      const { data } = await axiosReq.put(`/profiles/${id}`, formData);
      setCurrentUser((currentUser) => ({
        ...currentUser,
        profile_image: data.image,
      }));
      history.goBack();
      // Show success message
      showToast("Profile changes saved!")
    } catch (err) {
      // console.log(err);
      setErrors(err.response?.data);
    }
  };

  const textFields = (
    <>
      <Form.Group>
        <Form.Label>Name</Form.Label>
        <Form.Control
          as="textarea"
          value={name}
          onChange={handleChange}
          name="name"
          rows={1}
        />
      </Form.Group>
      {errors.name && errors.name.map((message, idx) => (
        <InputError key={idx} message={message} />
      ))}

      <Form.Group>
        <Form.Label>Bio</Form.Label>
        <Form.Control
          as="textarea"
          value={bio}
          onChange={handleChange}
          name="bio"
          rows={3}
        />
      </Form.Group>
      {errors.bio && errors.bio.map((message, idx) => (
        <InputError key={idx} message={message} />
      ))}

      <Form.Group>
        <Form.Label>Instagram @</Form.Label>
        <Form.Control
          as="textarea"
          value={instagram}
          onChange={handleChange}
          name="instagram"
          rows={1}
        />
      </Form.Group>
      {errors.instagram && errors.instagram.map((message, idx) => (
        <InputError key={idx} message={message} />
      ))}

      <Form.Group>
        <Form.Label>Equipment</Form.Label>
        <Form.Control
          as="textarea"
          value={equipment}
          onChange={handleChange}
          name="equipment"
          rows={4}
        />
      </Form.Group>
      {errors.equipment && errors.equipment.map((message, idx) => (
        <InputError key={idx} message={message} />
      ))}

      <Button
        className={`${btnStyles.Button} ${btnStyles.Orange}`}
        onClick={() => history.goBack()}
      >
        cancel
      </Button>
      <Button className={`${btnStyles.Button} ${btnStyles.Orange}`} type="submit">
        save
      </Button>
      {errors.non_field_errors?.map((message, idx) => (
        <InputError key={idx} message={message} />
      ))}
    </>
  );

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Row className="no-gutters"> 
          <Col className="py-2 p-0 p-md-2 text-center" md={7} lg={6}>
            <Container className={`${styles.Container} h-100`}>
              <Form.Group>
                {image && (
                  <figure>
                    <Image src={image} fluid />
                  </figure>
                )}
                {errors?.image?.map((message, idx) => (
                  <InputError key={idx} message={message} />
                ))}
                <div>
                  <Form.Label
                    className={`${btnStyles.Button} ${btnStyles.Orange} btn my-auto`}
                    htmlFor="image-upload"
                  >
                    Change the image
                  </Form.Label>
                </div>
                <Form.File
                  className={styles.FileInput}
                  id="image-upload"
                  ref={imageFile}
                  accept="image/*"
                  onChange={(event) => {
                    if (event.target.files.length) {
                      setProfileData({
                        ...profileData,
                        image: URL.createObjectURL(event.target.files[0]),
                      });
                    }
                  }}
                />
              </Form.Group>
              <div className="d-md-none">{textFields}</div>
            </Container>
          </Col>
          <Col md={5} lg={6} className="d-none d-md-block p-0 p-md-2 text-center">
            <Container className={`${appStyles.Container} h-100`}>{textFields}</Container>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default ProfileEditForm;
