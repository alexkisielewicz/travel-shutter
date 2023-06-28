import React, { useState } from "react";
import { Link } from "react-router-dom";

import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import styles from "../../styles/CommentCreateEditForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import { toast } from "react-toastify";
import Avatar from "../../components/Avatar";
import { axiosRes } from "../../api/axiosDefaults";
import InputError from "../../components/InputError";

function CommentCreateForm(props) {
  const { post, setPost, setComments, profileImage, profile_id } = props;
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState({});

  // Declare maximum length of a comments
  const maxCharacterCount = 300;
  const [characterCount, setCharacterCount] = useState("");
  const [isLimit, setIsLimit] = useState(false);

  // Shows confirmation in toast with passed message
  const showToast = (message) => {
    toast.success(message);
  };

  // Handles change in form inputs
  const handleChange = (event) => {
    setContent(event.target.value);
  };

  /* Function handles user input in comment field, it checks 
  user input against allowed comment length and calculates remaining characters */
  const handleInput = (event) => {
    const input = event.target.value;
    const remainingCharacters = maxCharacterCount - input.length;

    // Shows remaining characters to input or appropriate message when no characters are left
    if (remainingCharacters >= 0 && remainingCharacters <= maxCharacterCount) {
      setContent(input.slice(0, maxCharacterCount));
      setCharacterCount(`${remainingCharacters}/${maxCharacterCount}`);
      setIsLimit(false);
    } else {
      // Shows message if comment exceeds maximum allowed length
      setCharacterCount("Comment is too long!");
      setIsLimit(true);
    }
  };

  /* Handles form submission, passes comment content 
  and id in post request to /comments endpoint */
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axiosRes.post("/comments/", {
        content,
        post,
      });
      setComments((prevComments) => ({
        ...prevComments,
        results: [data, ...prevComments.results],
      }));
      // Show success message
      showToast("Comment saved!");
      // Update comments count
      setPost((prevPost) => ({
        results: [
          {
            ...prevPost.results[0],
            comments_count: prevPost.results[0].comments_count + 1,
          },
        ],
      }));
      setContent("");
    } catch (error) {
      setErrors(error.response?.data);
      // console.log(error.response?.data);
    }
  };

  return (
    <Form className="mt-2" onSubmit={handleSubmit}>
      <Form.Group>
        <InputGroup>
          <Link to={`/profiles/${profile_id}`}>
            <Avatar src={profileImage} />
          </Link>
          <Form.Control
            className={styles.Form}
            placeholder="Write your comment here"
            as="textarea"
            value={content}
            onChange={handleChange}
            onInput={handleInput}
            rows={2}
          />
        </InputGroup>
      </Form.Group>
      {errors.content && errors.content.map((message, idx) => (
        <InputError key={idx} message={message} />
      ))}
      <p className="d-flex align-items-center">
        <span className={`${styles.Counter} px-5`}>
          {characterCount}
        </span>
        <button
          className={`${btnStyles.Button} ${btnStyles.Orange} btn ml-auto`}
          disabled={!content.trim() || isLimit}
          type="submit"
        >
          post
        </button>
      </p>
    </Form>
  );
}

export default CommentCreateForm;