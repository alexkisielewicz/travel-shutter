import React, { useEffect, useState } from "react";
import appStyles from "../App.module.css";
import styles from "../styles/TopPosts.module.css";

import axios from "axios";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "./Spinner";

/* Component renders a list of 5 most liked posts, 
each list element is a link to specific post */
function TopPosts({ refreshLikes }) {
  const [posts, setPosts] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const fetchPostsByLikes = async () => {
      try {
        const allPosts = [];
        let nextPage = "/posts/";
        /* Because of API pagination looping throught all pages is required
        each page's results are added to allPosts array and then sorted */
        while (nextPage) {
          const response = await axios.get(nextPage);
          const { results, next } = response.data;
          allPosts.push(...results);
          nextPage = next;
        }
        // Sort the posts in descending order based on likes_count
        const orderedPosts = allPosts.sort((a, b) => b.likes_count - a.likes_count);
        // Filter out posts with zero likes
        const likedOrderedPosts = orderedPosts.filter((post) => post.likes_count >= 1);
        setPosts(likedOrderedPosts.slice(0, 5)); // Slice array to show first 5 results
        setHasLoaded(true);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPostsByLikes();
  }, [refreshLikes]);

  return (
    <>
      {/* Render list if  API response is received, otherwise render a spinner */}
      {hasLoaded ? (
        <>
          {/* Render list only if response contains elements */}
          {posts.length ? (
            <Container className={`${appStyles.Container}`}>
              <h4 className="text-center pb-3">Trending posts</h4>
              <Row>
                <Col className="mx-auto">
                  {/* Iterate throug post list to render span with 
                  link to post with specific ID */}
                  {posts.map((post) => (
                    <div key={post.id}>
                      <Link to={`/posts/${post.id}`}>
                        <span className={styles.TopHeart}>
                          {post.likes_count} <i className="far fa-heart" />
                        </span>
                        <span>{post.title}</span>
                      </Link>
                    </div>
                  ))}
                </Col>
              </Row>
            </Container>
          ) : null}
        </>
      ) : (
        <Container className={`${appStyles.Container} text-center`}>
          <Spinner />
        </Container>
      )}
    </>
  );
  
}

export default TopPosts;

