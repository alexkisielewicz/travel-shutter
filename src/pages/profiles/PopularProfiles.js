import React from 'react';
import appStyles from "../../App.module.css";
import { Container } from "react-bootstrap";
import Asset from "../../components/Asset";
import { useProfileData } from "../../contexts/ProfileDataContext";
import Profile from "./Profile";

const PopularProfiles = ({ mobile }) => {
  const { popularProfiles } = useProfileData();

  return (
    <Container className={`${appStyles.Container} ${mobile && 'd-lg-none text-center mb-3'}`}>
      {/* POPULAR PROFILES */}
      {popularProfiles.results.length ? (
        <>
          <h5 className="text-center pb-3">Popular profiles</h5>
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
        <Asset spinner />
      )}
    </Container>
  )
}

export default PopularProfiles