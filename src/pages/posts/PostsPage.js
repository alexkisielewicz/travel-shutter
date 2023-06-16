import React, { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import PostContainer from "./PostContainer";
import Asset from "../../components/Asset";

import appStyles from "../../App.module.css";
import styles from "../../styles/PostsPage.module.css";
import { useLocation } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";

import NoResults from "../../assets/no-results.png";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import PopularProfiles from "../profiles/PopularProfiles";
import SidePanel from "../../components/SidePanel";
import CategoriesPanel from "../../components/CategoriesPanel";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Dropdown, DropdownButton } from "react-bootstrap";
import DropdownItem from "react-bootstrap/esm/DropdownItem";

function PostsPage({ message, filter = "" }) {
  const currentUser = useCurrentUser();
  const [posts, setPosts] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const { pathname } = useLocation();

  const [query, setQuery] = useState("");

  const [category, setCategory] = useState("");

  const adventure = "adventure";
  const travel = "travel";
  const nature = "nature";
  const landscape = "landscape";
  const aerial = "aerial";
  const wildlife = "wildlife";
  const street = "street";
  const architecture = "architecture";

  const handleCategorySelect = (event) => {
    setCategory(`category=${event}`);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axiosReq.get(`/posts/?${filter}search=${query}&${category}`);
        setPosts(data);
        setHasLoaded(true);
      } catch (err) {
        console.log(err);
      }
    };

    setHasLoaded(false);
    const timer = setTimeout(() => {
      fetchPosts();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [filter, query, pathname, category]);

  return (
    <Row className="h-100">
      <Col className="py-0 px-1 p-lg-2" lg={8}>
        {/* SIDE PANELS FOR MOBILE */}
        <SidePanel mobile />
        <CategoriesPanel mobile />
        <PopularProfiles mobile />
        <i className={`fas fa-search ${styles.SearchIcon}`} />
        <Row>
          <Col xs={12} md={4}>
            <DropdownButton
              className={`${styles.CategoriesDropdown}`}
              title="Category"
              onSelect={handleCategorySelect}>
              <DropdownItem eventKey="">Display all</DropdownItem>
              <Dropdown.Divider />
              <DropdownItem eventKey={adventure}>Adventure</DropdownItem>
              <DropdownItem eventKey={travel}>Travel</DropdownItem>
              <DropdownItem eventKey={nature}>Nature</DropdownItem>
              <DropdownItem eventKey={landscape}>Landscape</DropdownItem>
              <DropdownItem eventKey={aerial}>Aerial</DropdownItem>
              <DropdownItem eventKey={wildlife}>Wildlife</DropdownItem>
              <DropdownItem eventKey={street}>Street</DropdownItem>
              <DropdownItem eventKey={architecture}>Architecture</DropdownItem>
            </DropdownButton>
          </Col>
          <Col xs={12} md={8}>
            <Form
              className={styles.SearchBar}
              onSubmit={(event) => event.preventDefault()}
            >
              <Form.Control
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                type="text"
                className="mr-sm-2"
                placeholder="Search user, post title or category..."
              />
            </Form>
          </Col>
        </Row>

        {hasLoaded ? (
          <>
            {posts.results.length ? (
              <InfiniteScroll
                children={posts.results.map((post) => (
                  <PostContainer key={post.id} {...post} setPosts={setPosts} />
                ))}
                dataLength={posts.results.length}
                loader={<Asset spinner />}
                hasMore={!!posts.next}
                next={() => fetchMoreData(posts, setPosts)}
              />
            ) : (
              <Container className={appStyles.Container}>
                <Asset src={NoResults} message={message || "No results found. Refine your search."} />
              </Container>
            )}
          </>
        ) : (
          <Container className={appStyles.Container}>
            <Asset spinner />
          </Container>
        )}
      </Col>
      <Col md={4} className="d-none d-lg-block py-0">
        {/* SIDE PANELS */}
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

export default PostsPage;