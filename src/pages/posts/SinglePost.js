import React from 'react';
import styles from "../../styles/SinglePost.module.css";
import appStyles from "../../App.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Card, Media, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Avatar from "../../components/Avatar";
import { axiosRes } from "../../api/axiosDefaults";
import { DropdownMenu } from "../../components/DropdownMenu";

const SinglePost = (props) => {
  const {
    id,
    owner,
    profile_id,
    profile_image,
    updated_at,
    title,
    category,
    tags,
    exif,
    body,
    image,
    like_id,
    comments_count,
    likes_count,
    postPage,
    setPosts,
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const history = useHistory();

  const handleEdit = () => {
    history.push(`/posts/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/posts/${id}/`);
      history.goBack();
    } catch (error) {
      console.log(error)
    }
  }

  const handleLike = async () => {
    try {
      const { data } = await axiosRes.post(`/likes/`, { post: id });
      setPosts((prevPosts) => ({
        ...prevPosts,
        results: prevPosts.results.map((post) => {
          return post.id === id
            ? { ...post, likes_count: post.likes_count + 1, like_id: data.id }
            : post;
        })
      }));
    } catch (error) {
      console.log(error);
    }
  }

  const handleUnlike = async () => {
    try {
      await axiosRes.delete(`/likes/${like_id}`);
      setPosts((prevPosts) => ({
        ...prevPosts,
        results: prevPosts.results.map((post) => {
          return post.id === id
            ? { ...post, likes_count: post.likes_count - 1, like_id: null }
            : post;
        })
      }));
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={appStyles.Wrapper}>
      <Card className={styles.Post}>
        {/* POST HEADER WITH USER NAME AND AVATAR */}
        <Card.Body>
          <Media className="align-items-center justify-content-between">
            <Link to={`/profile/${profile_id}`}>
              <Avatar src={profile_image} height={55} />
              {owner}
            </Link>
            <div className="d-flex align-items-center">
              <span>{updated_at}</span>
              {is_owner && postPage && (<DropdownMenu handleEdit={handleEdit} handleDelete={handleDelete} />)}
            </div>
          </Media>
        </Card.Body>
        <Link to={`/posts/${id}`}>
          {/* POST IMAGE */}
          <Card.Img src={image} alt={title} />
        </Link>
        {/* POST BODY */}
        <Card.Body>
          {title && <Card.Title className="text-center">{title}</Card.Title>}
          {body && <Card.Text>{body}</Card.Text>}
          {/* LIKES AND COMMENTS */}
          <div className={styles.PostBar}>
            <p>Category: {category}</p>
            <p>Tags: {tags}</p>
            <p>EXIF: {exif}</p>
            {is_owner ? (
              <OverlayTrigger placement="top" overlay={<Tooltip>You can't like your own posts!</Tooltip>}>
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
              <OverlayTrigger placement="top" overlay={<Tooltip>Log in to like posts!</Tooltip>}>
                <i className="fas fa-heart" />
              </OverlayTrigger>
            )}
            {likes_count}
            <Link to={`/posts/${id}`}>
              <i class="far fa-comments" />
            </Link>
            {comments_count}
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}

export default SinglePost