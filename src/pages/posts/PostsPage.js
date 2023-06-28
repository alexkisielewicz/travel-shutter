import React, { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import DropdownItem from "react-bootstrap/esm/DropdownItem";

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

import Spinner from "../../components/Spinner";
import TopPosts from "../../components/TopPosts";

function PostsPage({ message, filter = "" }) {
  const currentUser = useCurrentUser();
  const [posts, setPosts] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const { pathname } = useLocation();

  const [query, setQuery] = useState("");

  const [category, setCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [refreshLikes, setRefreshLikes] = useState(false);

  /* Handles category filter change. Category fiter can be applied by user
  in both PostsPage and CategoriesPanel components */
  const handleCategoryFilter = (selectedCategory) => {
    // convert category to lowercase to match api filters
    selectedCategory = selectedCategory.toLowerCase();
    setCategory(`category=${selectedCategory}`);
    handleCategorySelect(selectedCategory);
  };

  // declare available categories
  const categories = {
    adventure: "Adventure",
    travel: "Travel",
    nature: "Nature",
    landscape: "Landscape",
    aerial: "Aerial",
    wildlife: "Wildlife",
    street: "Street",
    architecture: "Architecture",
  };

  // handle category change for dropdown menu
  const handleCategorySelect = (event) => {
    setCategory(`category=${event}`);
    setSelectedCategory(event);
  };

  const refreshTopPosts = () => {
    // toggle refresh when liked/unliked
    setRefreshLikes(!refreshLikes);
  }

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Makes get request to fetch all posts with applied filters
        const { data } = await axiosReq.get(`/posts/?${filter}search=${query}&${category}`);
        setPosts(data);
        setHasLoaded(true);
      } catch (err) {
        // console.log(err);
      }
    };

    // Add delay before making api request to fetch posts, used in search bar after each keystroke
    setHasLoaded(false);
    const timer = setTimeout(() => {
      fetchPosts();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [filter, query, pathname, category, currentUser]);

  return (
    <Row className="h-100 no-gutters">
      <Col className="py-0 px-0 p-lg-2" lg={8}>
        {/* SIDE PANELS FOR MOBILE */}
        {currentUser && <SidePanel mobile />}
        <PopularProfiles mobile />
        
        <Row className="no-gutters">
          <Col xs={12} md={4}>
            <DropdownButton
              className={`${styles.CategoriesDropdown}`}
              title={selectedCategory ? categories[selectedCategory] : "Display all"}
              onSelect={handleCategorySelect}
            >
              <DropdownItem eventKey="">
                Display all
              </DropdownItem>
              <Dropdown.Divider />
              {/* iterate over values of categories and add label and eventKey
              to each dropdown item  */}
              {Object.entries(categories).map(([value, label]) => (
                <DropdownItem key={value} eventKey={value}>
                  {label}
                </DropdownItem>
              ))}
            </DropdownButton>
          </Col>
          <Col xs={12} md={8}>
            <Form
              className={styles.SearchBar}
              onSubmit={(event) => event.preventDefault()}
            >
              <Form.Label htmlFor="query" className="d-none">Search</Form.Label>
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
                  <PostContainer
                    key={post.id} {...post}
                    setPosts={setPosts}
                    refreshLikes={refreshTopPosts}
                  />
                ))}
                dataLength={posts.results.length}
                loader={<Spinner />}
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
          <Container className={`${appStyles.Container} text-center`}>
            <Spinner />
          </Container>
        )}
      </Col>
      <Col md={4} className="d-none d-lg-block py-0">
        {/* SIDE PANELS */}
        <div className="mb-2">
          {currentUser && <SidePanel />}
        </div>
        <div className="mb-2"> 
          {/* Pass parameter to apply category filter clicked by user */}
          <CategoriesPanel handleCategoryFilter={handleCategoryFilter} />
        </div>
        <div className="mb-2">
          <PopularProfiles />
        </div>
        <div className="mb-2">
          {/* Pass parameter to refresh likes count in TopPosts component */}
          <TopPosts refreshLikes={refreshLikes} />
        </div>
      </Col>
    </Row>
  );
}

export default PostsPage;