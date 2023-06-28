import jwtDecode from "jwt-decode";
import { axiosReq } from "../api/axiosDefaults";

/* Fetches data from endpoints that uses pagination,
makes request including next page and appends data to the array, 
then filters out duplicated resources */
export const fetchMoreData = async (resource, setResource) => {
  try {
    const { data } = await axiosReq.get(resource.next);
    setResource((prevResource) => ({
      ...prevResource,
      next: data.next,
      results: data.results.reduce((acc, cur) => {
        return acc.some((accResult) => accResult.id === cur.id)
          ? acc
          : [...acc, cur];
      }, prevResource.results),
    }));
  } catch (error) {
    // console.log(error)
  }
};

export const followHelper = (profile, clickedProfile, following_id) => {
  return profile.id === clickedProfile.id
    ? // This is the profile user clicked on,
    // it updates its followers count and set its following id
    {
      ...profile,
      followers_count: profile.followers_count + 1,
      following_id,
    }
    : profile.is_owner
      ? // This is the profile of the logged in user
      // it updates its following count
      { ...profile, following_count: profile.following_count + 1 }
      : // this is NOT the profile the user clicked on or the profile
      // the user owns, so just return it unchanged without count change
      profile;
};

export const unfollowHelper = (profile, clickedProfile) => {
  return profile.id === clickedProfile.id
    ? {
      ...profile,
      followers_count: profile.followers_count - 1,
      following_id: null,
    }
    : profile.is_owner
      ? { ...profile, following_count: profile.following_count - 1 }
      : profile;
};

/* Keep refresh tokens in local storage to avoid making API requests
by unauthorized users */
export const setTokenTimestamp = (data) => {
  const refreshTokenTimestamp = jwtDecode(data?.refresh_token).exp;
  localStorage.setItem("refreshTokenTimestamp", refreshTokenTimestamp);
};

export const shouldRefreshToken = () => {
  return !!localStorage.getItem("refreshTokenTimestamp");
};

export const removeTokenTimestamp = () => {
  localStorage.removeItem("refreshTokenTimestamp");
};