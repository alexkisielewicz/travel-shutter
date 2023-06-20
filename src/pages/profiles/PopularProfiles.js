import React from 'react';
import appStyles from "../../App.module.css";
import { Container } from "react-bootstrap";
import Spinner from "../../components/Spinner";
import { useProfileData } from "../../contexts/ProfileDataContext";
import Profile from "./Profile";

const PopularProfiles = ({ mobile }) => {
  const { popularProfiles } = useProfileData();

  return (
    <Container className={`${appStyles.Container} ${mobile && 'd-lg-none text-center mb-3'}`}>
      {/* POPULAR PROFILES */}
      {popularProfiles.results.length ? (
        <>
          <h4 className="text-center pb-3">Profiles to follow</h4>
          {mobile ? (
            // IF ON MOBILE
            <div className="d-flex justify-content-around">
              {popularProfiles.results.slice(0, 4).map((profile) => (
                <Profile key={profile.id} profile={profile} mobile />
              ))}
            </div>
          ) : (
            // IF ON DESKTOP
            popularProfiles.results.map((profile) => (
              <Profile key={profile.id} profile={profile} />
            ))
          )}
        </>
      ) : (
        <div className="text-center">
          <Spinner />
        </div>
      )}
    </Container>
  )
}

export default PopularProfiles