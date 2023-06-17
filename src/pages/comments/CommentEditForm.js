import React, { useState } from "react";

import Form from "react-bootstrap/Form";
import { axiosRes } from "../../api/axiosDefaults";

import btnStyles from "../../styles/Button.module.css"
import styles from "../../styles/CommentCreateEditForm.module.css";
import { toast } from 'react-toastify';

function CommentEditForm(props) {
  const { id, content, setShowEditForm, setComments } = props;

  const [formContent, setFormContent] = useState(content);

  const showToast = (message) => {
    toast.success(message);
  };

  const handleChange = (event) => {
    setFormContent(event.target.value);
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
    } catch (err) {
      console.log(err);
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
          rows={2}
        />
      </Form.Group>
      <div className="text-right">
        <button
          className={`${btnStyles.Button} ${btnStyles.Orange}`}
          disabled={!content.trim()}
          type="submit"
        >
          save
        </button>
        <button
          className={`${btnStyles.Button} ${btnStyles.OrangeOutline}`}
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