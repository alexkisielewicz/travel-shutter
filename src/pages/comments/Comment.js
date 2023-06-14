import React, { useState } from "react";
import { Button, Media } from "react-bootstrap";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { DropdownMenu } from "../../components/DropdownMenu";
import CommentEditForm from "./CommentEditForm";

import styles from "../../styles/Comment.module.css";
import btnStyles from "../../styles/Button.module.css";

import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { axiosRes } from "../../api/axiosDefaults";

const Comment = (props) => {
  const {
    profile_id,
    profile_image,
    owner,
    updated_at,
    content,
    id,
    setPost,
    setComments,
  } = props;

  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/comments/${id}/`);
      setPost((prevPost) => ({
        results: [
          {
            ...prevPost.results[0],
            comments_count: prevPost.results[0].comments_count - 1,
          },
        ],
      }));

      setComments((prevComments) => ({
        ...prevComments,
        results: prevComments.results.filter((comment) => comment.id !== id),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmDelete = () => {
    handleDelete();
    setShowDeleteConfirmation(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  return (
    <>
      <hr />
      <Media>
        <Link to={`/profiles/${profile_id}`}>
          <Avatar src={profile_image} />
        </Link>
        <Media.Body className="align-self-center ml-2">
          <span className={styles.Owner}>{owner}</span>
          <span className={styles.Date}>{updated_at}</span>
          {showEditForm ? (
            <CommentEditForm
              id={id}
              profile_id={profile_id}
              content={content}
              profileImage={profile_image}
              setComments={setComments}
              setShowEditForm={setShowEditForm}
            />
          ) : (
            <p>{content}</p>
          )}
        </Media.Body>
        {is_owner && !showEditForm && (
          <DropdownMenu
            handleEdit={() => setShowEditForm(true)}
            handleDelete={() => setShowDeleteConfirmation(true)}
          />
        )}
      </Media>
      {showDeleteConfirmation && (
        <>
          <div className={styles.Confirmation}>
          <span className="mx-2">Are you sure?</span>
          <Button
            className={`${btnStyles.Button} ${styles.ButtonCancel}`}
            onClick={handleCancelDelete}
          >
            Cancel
          </Button>
          <Button
            className={`${btnStyles.Button} ${styles.ButtonDelete} mr-2`}
            onClick={handleConfirmDelete}
          >
            Delete
          </Button>
          </div>
        </>
      )}
    </>
  );
};

export default Comment;