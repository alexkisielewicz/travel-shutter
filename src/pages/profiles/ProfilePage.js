import React, { useEffect, useState } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import Asset from "../../components/Asset";

import styles from "../../styles/ProfilePage.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";

import PopularProfiles from "./PopularProfiles";
import SidePanel from "../../components/SidePanel";
import CategoriesPanel from "../../components/CategoriesPanel";

import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import {
  useProfileData,
  useSetProfileData,
} from "../../contexts/ProfileDataContext";
import { Button, Image } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import PostContainer from "../posts/PostContainer";
import { fetchMoreData } from "../../utils/utils";
import { ProfileEditDropdown } from "../../components/DropdownMenu";

function ProfilePage() {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [profilePosts, setProfilePosts] = useState({ results: [] });

  const currentUser = useCurrentUser();
  const { id } = useParams();

  const { setProfileData, handleFollow, handleUnfollow } = useSetProfileData();
  const { pageProfile } = useProfileData();

  const [profile] = pageProfile.results;
  const is_owner = currentUser?.username === profile?.owner;

  const instagram = "http://www.instagram.com/"

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: pageProfile }, { data: profilePosts }] =
          await Promise.all([
            axiosReq.get(`/profiles/${id}`),
            axiosReq.get(`/posts/?owner__profile=${id}`),
          ]);
        setProfileData((prevState) => ({
          ...prevState,
          pageProfile: { results: [pageProfile] },
        }));
        setProfilePosts(profilePosts);
        setHasLoaded(true);
      } catch (error) {
        // console.log(error);
      }
    };
    fetchData();
  }, [id, setProfileData]);

  const mainProfile = (
    <>
      <Container className={appStyles.Container}>
        {profile?.is_owner && <ProfileEditDropdown id={profile?.id} />}
        <Row noGutters className="px-3 text-center">
          <Col lg={3} className="text-lg-left">
            <Image
              className={styles.ProfileImage}
              roundedCircle
              src={profile?.image}
            />
          </Col>
          <Col lg={6}>
            <h2 className="m-2">{profile?.owner}</h2>
            <Row className="justify-content-center no-gutters">
              <Col xs={3} className="my-2">
                <div>{profile?.posts_count}</div>
                <div>posts</div>
              </Col>
              <Col xs={3} className="my-2">
                <div>{profile?.followers_count}</div>
                <div>followers</div>
              </Col>
              <Col xs={3} className="my-2">
                <div>{profile?.following_count}</div>
                <div>following</div>
              </Col>
            </Row>
          </Col>
          <Col lg={3} className="text-lg-right">
            {currentUser &&
              !is_owner &&
              (profile?.following_id ? (
                <Button
                  className={`${btnStyles.Button} ${btnStyles.Orange}`}
                  onClick={() => handleUnfollow(profile)}
                >
                  unfollow
                </Button>
              ) : (
                <Button
                  className={`${btnStyles.Button} ${btnStyles.OrangeOutline}`}
                  onClick={() => handleFollow(profile)}
                >
                  follow
                </Button>
              ))}
          </Col>
          {profile?.bio && <Col className="py-4">
            <strong>{profile.bio}</strong>
            </Col>}
        </Row>

        <Row>
          <Col lg={6}>
            <p className={`text-center ${styles.ProfileDetails}`}>
              {profile?.instagram && (
                <>
                  <i className="fa-brands fa-square-instagram" />
                  <a
                    href={`${instagram}${profile.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {profile.instagram}
                  </a>
                </>
              )}
            </p>
          </Col>
          <Col lg={6}>
            <p className={`text-center ${styles.ProfileDetails}`}>
              {profile?.equipment && (
                <>
                  <i className="fas fa-camera" /> {profile.equipment}
                </>
              )}
            </p>
          </Col>
        </Row>

        <hr />
        {profilePosts.results.length ? (
          <>
            <div className="text-center py-1">
              {currentUser && is_owner ? <h5>My posts:</h5> : <h5>{profile?.owner}'s posts:</h5>}
            </div>
            <hr />
          </>
        ) : (
          <div className="text-center">
            {profile?.owner} hasn't posted anything yet.
          </div>
        )}

      </Container>
    </>
  );

  const mainProfilePosts = (
    <>
      {profilePosts.results.length ? (
        <InfiniteScroll
          children={profilePosts.results.map((post) => (
            <PostContainer key={post.id} {...post} setPosts={setProfilePosts} />
          ))}
          dataLength={profilePosts.results.length}
          loader={<Asset spinner />}
          hasMore={!!profilePosts.next}
          next={() => fetchMoreData(profilePosts, setProfilePosts)}
        />
      ) : (
        <></>
      )}
    </>
  );

  return (
    <Row>
      <Col className="py-0 px-1 p-lg-2" lg={8}>
        {/* SIDE PANELS FOR MOBILE */}
        {currentUser && <SidePanel mobile />}
        <CategoriesPanel mobile />
        <PopularProfiles mobile />

        {hasLoaded ? (
          <>
            {mainProfile}<br />
            {mainProfilePosts}
          </>
        ) : (
          <Asset spinner />
        )}

      </Col>
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        {/* SIDE PANELS FOR DESKTOP */}
        <div className="mb-2">
          {currentUser && <SidePanel />}
        </div>
        <div className="mb-2">
          <CategoriesPanel />
        </div>
        <div className="mb-2">
          <PopularProfiles />
        </div>
      </Col>
    </Row>
  );
}

export default ProfilePage;