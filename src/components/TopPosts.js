import React, { useEffect, useState } from 'react';
import appStyles from "../App.module.css";
import styles from "../styles/TopPosts.module.css";

import axios from 'axios';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from './Spinner';

function TopPosts({ refreshLikes }) {
  const [posts, setPosts] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const fetchPostsByLikes = async () => {
      try {
        const allPosts = [];
        let nextPage = "/posts/";

        // because of api pagination loop throught all pages is required
        // each page's results are added to allPosts array 
        while (nextPage) {
          const response = await axios.get(nextPage);
          const { results, next } = response.data;
          allPosts.push(...results);
          nextPage = next;
        }

        // sort the posts in descending order based on likes_count
        const orderedPosts = allPosts.sort((a, b) => b.likes_count - a.likes_count);
        // filter out posts with zero likes
        const likedOrderedPosts = orderedPosts.filter((post) => post.likes_count >= 1);
        setPosts(likedOrderedPosts.slice(0, 5)); // slice array to show first 5 results
        setHasLoaded(true);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPostsByLikes();
  }, [refreshLikes]);

  return (
    <>
      {hasLoaded ? (
        <>
          {posts.length ? (
            <Container className={`${appStyles.Container}`}>
              <h4 className="text-center pb-3">Trending posts</h4>
              <Row>
                <Col className="mx-auto">
                  {posts.map((post) => (
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

