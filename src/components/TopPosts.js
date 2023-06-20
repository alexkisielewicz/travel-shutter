import React, { useEffect, useState } from 'react';
import appStyles from "../App.module.css";
import styles from "../styles/TopPosts.module.css";

import axios from 'axios';

import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import { Col, Container, Row } from 'react-bootstrap';

function TopPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPostsByLikes = async () => {
      try {
        const response = await axios.get("/posts/");
        const postsData = response.data.results;
        // sort array of objects with Array.prototype.sort() method
        const orderedPosts = postsData.sort((a, b) => b.likes_count - a.likes_count);
        setPosts(orderedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPostsByLikes();
  }, []);

  // filter posts to show only top5 posts from liked posts
  const likedPosts = posts.filter((post) => post.likes_count > 0).slice(0, 5);
  const hasLikedPosts = likedPosts.length > 0; // bool

  return (
    <>
      {hasLikedPosts && (
        <Container className={`${appStyles.Container}`}>
          <h4 className="text-center pb-3">Trending posts</h4>
          <Row>
            <Col className="mx-auto">
              {likedPosts.map((post) => (
                <div key={post.id}>
                  <Link to={`/posts/${post.id}`}>
                    <span className={styles.TopHeart}>
                      {post.likes_count} <i className={`far fa-heart`} />
                    </span>
                    <span>{post.title}</span>
                  </Link>
                </div>
              ))}
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
}

export default TopPosts;