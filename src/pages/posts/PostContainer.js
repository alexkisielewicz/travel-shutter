import React, { useState } from "react";
import styles from "../../styles/PostContainer.module.css";
import btnStyles from "../../styles/Button.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Card from "react-bootstrap/Card";
import Media from "react-bootstrap/Media";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Link, useHistory } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { axiosRes } from "../../api/axiosDefaults";
import { DropdownMenu } from "../../components/DropdownMenu";
import { toast } from 'react-toastify';

const PostContainer = (props) => {
  const {
    id,
    owner,
    profile_id,
    profile_image,
    comments_count,
    likes_count,
    like_id,
    category,
    tags,
    exif,
    title,
    body,
    image,
    updated_at,
    postPage,
    setPosts,
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const history = useHistory();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleEdit = () => {
    history.push(`/posts/${id}/edit`);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const showToast = (message) => {
    toast.success(message);
  };

  const confirmDelete = async () => {
    try {
      await axiosRes.delete(`/posts/${id}/`);
      history.goBack();
      showToast("Post deleted succesfully");
    } catch (err) {
      // console.log(err);
    }
  };

  const handleLike = async () => {
    try {
      const { data } = await axiosRes.post("/likes/", { post: id });
      setPosts((prevPosts) => ({
        ...prevPosts,
        results: prevPosts.results.map((post) => {
          return post.id === id
            ? { ...post, likes_count: post.likes_count + 1, like_id: data.id }
            : post;
        }),
      }));
    } catch (err) {
      // console.log(err);
    }
  };

  const handleUnlike = async () => {
    try {
      await axiosRes.delete(`/likes/${like_id}/`);
      setPosts((prevPosts) => ({
        ...prevPosts,
        results: prevPosts.results.map((post) => {
          return post.id === id
            ? { ...post, likes_count: post.likes_count - 1, like_id: null }
            : post;
        }),
      }));
    } catch (err) {
      // console.log(err);
    }
  };

  return (
    <Card className={styles.Post}>
      <Card.Body className={styles.CardBody}>
        <Media className="align-items-center justify-content-between">
          <Link to={`/profiles/${profile_id}`}>
            <Avatar src={profile_image} height={45} />
            {owner}
          </Link>
          <div className="d-flex align-items-center">
            <span className={styles.PostDetails}><i className="fa-solid fa-calendar"></i> {updated_at}</span>
            {is_owner && postPage && (
              <DropdownMenu
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            )}
          </div>
        </Media>
      </Card.Body>
      <Link to={`/posts/${id}`}>
        <Card.Img className={styles.PostImage} src={image} alt={title} />
      </Link>
      <Card.Body>
        {title && <Card.Title>
          <h1 className={`text-center ${styles.PostHeader}`}>{title}</h1>
          </Card.Title>}
        {body && <><hr /><Card.Text className="text-justify">{body}</Card.Text></>}
        <hr />
        <div className={styles.PostDetails}>
          <p><i className="fa-solid fa-folder"></i> {category}</p>
          <p><i className="fa-solid fa-hashtag"></i>{tags}</p>
          <p><i className="fa-solid fa-camera"></i>{exif}</p>
        </div>
        <hr />
        <div className={styles.Likes}>
          {is_owner ? (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>You can't like your own post!</Tooltip>}
            >
              <i className="far fa-heart" />
            </OverlayTrigger>
          ) : like_id ? (
            <span onClick={handleUnlike}>
              <i className={`fas fa-heart ${styles.Heart}`} />
            </span>
          ) : currentUser ? (
            <span onClick={handleLike}>
              <i className={`far fa-heart ${styles.HeartOutline}`} />
            </span>
          ) : (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Log in to like posts!</Tooltip>}
            >
              <i className="far fa-heart" />
            </OverlayTrigger>
          )}
          {likes_count}
          <Link to={`/posts/${id}`}>
            <i className="far fa-comments" />
          </Link>
          {comments_count}
        </div>
        {/* DELETE CONFIRMATION MODAL */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete this post?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className={`${btnStyles.Button} ${btnStyles.Delete}`} 
              onClick={confirmDelete}>
              Delete
            </Button>
            <Button
              className={`${btnStyles.Button} ${btnStyles.Orange}`} 
              onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </Card.Body>
    </Card>
  );
};

export default PostContainer;