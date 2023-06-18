import React, { useState, useEffect } from "react";
import appStyles from "../App.module.css";
import btnStyles from "../styles/Button.module.css";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import axios from 'axios';
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import Spinner from "../components/Spinner";

const CategoriesPanel = ({ mobile }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/categories/');
        setCategories(response.data['Category list']);
      } catch (error) {
        // console.log(error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <Container className={`${appStyles.Container} ${mobile && 'd-lg-none text-center mb-3'}`}>
      {categories.length ? (
        <>
          {mobile ? (
            // IF ON MOBILE
            <div className="d-flex justify-content-around">
              Categories panel MOBILE
            </div>
          ) : (
            // IF ON DESKTOP
            <div className="d-flex py-0">
              <p className="text-center py-0 m-0">
                {categories.map((category, index) => (
                  <Button
                    key={index}
                    className={`${btnStyles.Button} ${btnStyles.Category}`}
                    onClick={() => {}}
                  >
                    <Link to={`/posts/?category=${category}`}>{category}</Link>
                  </Button>
                ))}
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center">
          <Spinner />
        </div>
      )}
    </Container>
  );
  
};

export default CategoriesPanel;