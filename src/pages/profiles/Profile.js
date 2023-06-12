import React from 'react';
import styles from "../../styles/Profile.module.css";
import btnStyles from "../../styles/Button.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import Avatar from "../../components/Avatar";


const Profile = (props) => {
  const {
    mobile,
    profile,
    imageSize
  } = props;

  const { id, following_id, image, owner } = profile 

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner; // bool

  return (
    <div className={`my-3 d-flex align-items-center ${mobile && "flex-column"}`}>
      <Link
        to={`/profile/${id}`} 
        className="align-self-center">
          <Avatar src={image} height={imageSize} />
      </Link>
      <div className={`mx-2 ${styles.WordBreak}`}><strong>{owner}</strong></div>
    </div>
  )
}

export default Profile