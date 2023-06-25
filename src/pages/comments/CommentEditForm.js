import React, { useState } from "react";

import Form from "react-bootstrap/Form";
import { axiosRes } from "../../api/axiosDefaults";

import btnStyles from "../../styles/Button.module.css"
import styles from "../../styles/CommentCreateEditForm.module.css";
import { toast } from "react-toastify";
import InputError from "../../components/InputError";

function CommentEditForm(props) {
  const { id, content, setShowEditForm, setComments } = props;
  const [formContent, setFormContent] = useState(content);
  const [errors, setErrors] = useState({});
  const maxCharacterCount = 300;
  const [characterCount, setCharacterCount] = useState("");
  const [isLimit, setIsLimit] = useState(false);

  const showToast = (message) => {
    toast.success(message);
  };

  const handleChange = (event) => {
    setFormContent(event.target.value);
  };

  const handleInput = (event) => {
    const input = event.target.value;
    const remainingCharacters = maxCharacterCount - input.length;

    if (remainingCharacters >= 0 && remainingCharacters <= maxCharacterCount) {
      setFormContent(input.slice(0, maxCharacterCount));
      setCharacterCount(`${remainingCharacters}/${maxCharacterCount}`);
      setIsLimit(false);
    } else {
      setCharacterCount("Comment is too long!");
      setIsLimit(true);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosRes.put(`/comments/${id}/`, {
        content: formContent.trim(),
      });
      showToast("Changes saved!");
      setComments((prevComments) => ({
        ...prevComments,
        results: prevComments.results.map((comment) => {
          return comment.id === id
            ? {
              ...comment,
              content: formContent.trim(),
              updated_at: "now",
            }
            : comment;
        }),
      }));
      setShowEditForm(false);
    } catch (error) {
      setErrors(error.response?.data);
      // console.log(error.response?.data);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="pr-1">
        <Form.Control
          className={styles.Form}
          as="textarea"
          value={formContent}
          onChange={handleChange}
          onInput={handleInput}
          rows={2}
        />
      </Form.Group>
      {errors.formContent && errors.content.map((message, idx) => (
        <InputError key={idx} message={message} />
      ))}
      <div className="d-flex align-items-center">
        <span className={`${styles.Counter} px-5`}>
          {characterCount}
        </span>
        <button
          className={`${btnStyles.Button} ${btnStyles.Orange} btn ml-auto`}
          disabled={!content.trim() || isLimit}
          type="submit"
        >
          save
        </button>
        <button
          className={`${btnStyles.Button} ${btnStyles.OrangeOutline} btn`}
          onClick={() => setShowEditForm(false)}
          type="button"
        >
          cancel
        </button>
      </div>
    </Form>
  );
}

export default CommentEditForm;