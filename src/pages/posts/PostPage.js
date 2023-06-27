import React, { useEffect, useState } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import appStyles from "../../App.module.css";
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import PostContainer from "./PostContainer";
import Comment from "../comments/Comment";
import PopularProfiles from "../profiles/PopularProfiles";

import CommentCreateForm from "../comments/CommentCreateForm";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "../../components/Spinner";
import { fetchMoreData } from "../../utils/utils";
import SidePanel from "../../components/SidePanel";
import TopPosts from "../../components/TopPosts";

function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState({ results: [] });
  const [refreshLikes, setRefreshLikes] = useState(false);

  const currentUser = useCurrentUser();
  const profile_image = currentUser?.profile_image;
  const [comments, setComments] = useState({ results: [] });

  const refreshTopPosts = () => {
    // toggle refresh when liked/unliked
    setRefreshLikes(!refreshLikes);
  }

  useEffect(() => {
    const handleMount = async () => {
      try {
        const [{ data: post }, { data: comments }] = await Promise.all([
          axiosReq.get(`/posts/${id}`),
          axiosReq.get(`/comments/?post=${id}`),
        ]);
        setPost({ results: [post] });
        setComments(comments);
      } catch (err) {
        // console.log(err);
      }
    };

    handleMount();
  }, [id]);

  return (
    <Row className="h-100 no-gutters">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        {currentUser && <SidePanel mobile />}
        <PopularProfiles mobile />
        <PostContainer {...post.results[0]} 
          setPosts={setPost} 
          postPage 
          refreshLikes={refreshTopPosts} 
          />
        <Container className={appStyles.Container}>
          {currentUser ? (
            <CommentCreateForm
              profile_id={currentUser.profile_id}
              profileImage={profile_image}
              post={id}
              setPost={setPost}
              setComments={setComments}
            />
          ) : comments.results.length ? (
            "Comments"
          ) : null}
          {/* ALL COMMENTS WITH INFINITE SCROLL */}
          {comments.results.length ? (
            <InfiniteScroll
              children={comments.results.map((comment) => (
                <Comment
                  key={comment.id}
                  {...comment}
                  setPost={setPost}
                  setComments={setComments}
                />
              ))}
              dataLength={comments.results.length}
              loader={<Spinner />}
              hasMore={!!comments.next}
              next={() => fetchMoreData(comments, setComments)}
            />
          ) : currentUser ? (
            <span className="text-muted p-3">No comments yet, be the first to comment!</span>
          ) : (
            <span className="text-muted p-3">No comments... yet</span>
          )}
        </Container>
      </Col>
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        {/* SIDE PANELS */}
        <div className="mb-2">
          {currentUser && <SidePanel />}
        </div>
        <div className="mb-2">
          <PopularProfiles />
        </div>
        <div className="mb-2">
          <TopPosts refreshLikes={refreshLikes} />
        </div>
      </Col>
    </Row>
  );
}

export default PostPage;