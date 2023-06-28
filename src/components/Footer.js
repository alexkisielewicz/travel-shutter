import React from "react";
import styles from "../styles/Footer.module.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Footer = () => {
  /* Footer component renders page's footer at fixed 
  bottom position in the viewport. 
  It contains copyright info and social media links */
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`${styles.Footer} mt-4 py-1`}>
      <Container className="text-center">
        <Row>
          {/* Left column with copyrights info */}
          <Col xs={12} md={6} className="d-flex align-items-center justify-content-center justify-content-md-start">
            <div className="text-muted">
              &copy; {currentYear} TravelShutter
            </div>
          </Col>
          {/* Right column with social media links, all links open in a new window */}
          <Col xs={12} md={6} className="d-flex align-items-center justify-content-center justify-content-md-end">
            <ul className={`list-inline ${styles.SocialLinks}`}>
              <li className="list-inline-item">
                <a href="https://www.facebook.com" target="_blank" rel="noreferrer" title="Follow us on Facebook">
                  <i className="fa-brands fa-facebook"></i>
                </a>
              </li>
              <li className="list-inline-item">
                <a href="https://www.instagram.com" target="_blank" rel="noreferrer" title="Follow us on Instagram">
                  <i className="fa-brands fa-square-instagram"></i>
                </a>
              </li>
              <li className="list-inline-item">
                <a href="http://www.twitter.com" target="_blank" rel="noreferrer" title="Follow us on Twitter">
                  <i className="fa-brands fa-twitter"></i>
                </a>
              </li>
              <li className="list-inline-item">
                <a href="https://telegram.org/" target="_blank" rel="noreferrer" title="Join us on Telegram">
                  <i className="fa-brands fa-telegram"></i>
                </a>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;