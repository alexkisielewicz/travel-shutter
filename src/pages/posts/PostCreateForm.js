import React, { useRef, useState } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import Asset from "../../components/Asset";
import Upload from "../../assets/upload.png";

import styles from "../../styles/PostCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import { toast } from "react-toastify";

import { useHistory } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import { useRedirect } from "../../hooks/useRedirect";
import InputError from "../../components/InputError";

function PostCreateForm() {
  useRedirect("loggedOut");

  const [errors, setErrors] = useState({});

  const [postData, setPostData] = useState({
    title: "",
    category: "",
    tags: "",
    exif: "",
    body: "",
    image: "",
  });
  const { title, category, tags, exif, body, image } = postData;

  const imageInput = useRef(null);
  const history = useHistory();

  const showToast = (message) => {
    toast.success(message);
  };

  const handleChange = (event) => {
    setPostData({
      ...postData,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeImage = (event) => {
    if (event.target.files.length) {
      URL.revokeObjectURL(image);
      setPostData({
        ...postData,
        image: URL.createObjectURL(event.target.files[0]),
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    const titleRegex = /^[a-zA-Z',. ]{3,100}$/;
    const tagsRegex = /^[a-zA-Z, ]{3,100}$/;
    const exifRegex = /^[a-zA-Z0-9\s,.@/-]{3,100}$/;
    const contentRegex = /^[a-zA-Z0-9\s.,\-!?#'"_]{3,300}$/;

    if (!titleRegex.test(title)) {
      setErrors({
        ...errors,
        title: [
          "Title can contain letters, spaces and some special characters (,.'), allowed length 3-100 characters.",
        ],
      });
      return;
    }

    if (!tagsRegex.test(tags)) {
      setErrors({
        ...errors,
        tags: [
          "Tags can contain letters, commas, spaces, allowed length 3-100 characters.",
        ],
      });
      return;
    }

    if (!exifRegex.test(exif)) {
      setErrors({
        ...errors,
        exif: [
          "EXIF can contain letters, digits, spaces, commas, dots, slashes, @, hyphens, allowed length 3-100 characters.",
        ],
      });
      return;
    }

    if (!contentRegex.test(body)) {
      setErrors({
        ...errors,
        body: [
          "Content can contain letters, digits, and special characters, allowed length 3-300 characters.",
        ],
      });
      return;
    }

    formData.append("title", title);
    formData.append("category", category);
    formData.append("tags", tags);
    formData.append("exif", exif);
    formData.append("body", body);
    /* append image only if user selected image
    otherwise image field is not included in formData
    API accepts post without image and utilizes placeholder */
    if (imageInput.current.files.length > 0) {
      formData.append("image", imageInput.current.files[0]);
    }

    try {
      const { data } = await axiosReq.post("/posts/", formData);
      history.push(`/posts/${data.id}`);
      showToast("Post created successfully!")
    } catch (err) {
      // console.log(err.response?.data);
      if (err.response?.status !== 401) {
        setErrors(err.response?.data);
        console.log(err.response?.data)
      }
    }
  };

  const textFields = (
    <div className="text-center">
      <Form.Group>
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          placeholder="Type post title"
          value={title}
          onChange={handleChange}
        />
      </Form.Group>
      {errors.title && errors.title.map((message, idx) => (
        <InputError key={idx} message={message} />
      ))}
      <Form.Group>
        <Form.Label>Category</Form.Label>
        <Form.Control
          as="select"
          name="category"
          className={appStyles.Input}
          value={category}
          onChange={handleChange}
          aria-label="category"
        >
          <option>Select category</option>
          <option value="adventure">Adventure</option>
          <option value="travel">Travel</option>
          <option value="nature">Nature</option>
          <option value="landscape">Landscape</option>
          <option value="aerial">Aerial</option>
          <option value="wildlife">Wildlife</option>
          <option value="street">Street</option>
          <option value="architecture">Architecture</option>
        </Form.Control>
        {errors.category && errors.category.map((message, idx) => (
          <InputError key={idx} message={message} />
        ))}
      </Form.Group>

      <Form.Group>
        <Form.Label>Tags</Form.Label>
        <Form.Control
          type="text"
          name="tags"
          placeholder='e.g. "summer, holidays, greece"'
          value={tags}
          onChange={handleChange}
        />
      </Form.Group>
      {errors.tags && errors.tags.map((message, idx) => (
        <InputError key={idx} message={message} />
      ))}

      <Form.Group>
        <Form.Label>EXIF</Form.Label>
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip>
              EXIF data provides valuable information about how a photo was taken. You can provide your equipment, image parameters or camera settings.
            </Tooltip>}
        >
          <i className={`fa fa-question-circle ${styles.ExifIcon}`}></i>
        </OverlayTrigger>
        <Form.Control
          type="text"
          name="exif"
          placeholder="Nikon D750, Nikkor 24-70 f./2.8 @ 24mm 1/60 sec."
          value={exif}
          onChange={handleChange}
        />
      </Form.Group>
      {errors.exif && errors.exif.map((message, idx) => (
        <InputError key={idx} message={message} />
      ))}

      <Form.Group>
        <Form.Label>Content</Form.Label>
        <Form.Control
          as="textarea"
          rows={6}
          name="body"
          value={body}
          onChange={handleChange}
        />
      </Form.Group>
      {errors.body && errors.body.map((message, idx) => (
        <InputError key={idx} message={message} />
      ))}
      <Button className={`${btnStyles.Button} ${btnStyles.Orange}`} type="submit">
        create
      </Button>
      <Button
        className={`${btnStyles.Button} ${btnStyles.OrangeOutline}`}
        onClick={() => history.goBack()}
      >
        cancel
      </Button>
      {errors.non_field_errors?.map((message, idx) => (
        <InputError key={idx} message={message} />
      ))}
    </div>
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Row className="no-gutters">
        <Col className="py-2 p-0 p-md-1" md={7} lg={8}>
          <Container
            className={`${styles.Container} d-flex flex-column justify-content-center`}
          >
            <Form.Group className="text-center">
              {image ? (
                <>
                  <figure>
                    <Image className={appStyles.Image} src={image} rounded />
                  </figure>
                  <div>
                    <Form.Label
                      className={`${btnStyles.Button} ${btnStyles.OrangeOutline} btn`}
                      htmlFor="image-upload"
                    >
                      Change the image
                    </Form.Label>
                  </div>
                </>
              ) : (
                <Form.Label
                  className="d-flex justify-content-center"
                  htmlFor="image-upload"
                >
                  <Asset
                    src={Upload}
                    message="Click or tap to upload an image"
                  />
                </Form.Label>
              )}

              <Form.File
                className={styles.FileInput}
                id="image-upload"
                accept="image/*"
                onChange={handleChangeImage}
                ref={imageInput}
              />

            </Form.Group>
            {errors?.image?.map((message, idx) => (
              <InputError key={idx} message={message} />
            ))}

            <div className="d-md-none">{textFields}</div>
          </Container>
        </Col>
        <Col md={5} lg={4} className="d-none d-md-block p-0 p-md-2">
          <Container className={styles.Container}>{textFields}</Container>
        </Col>
      </Row>
    </Form>
  );
}

export default PostCreateForm;