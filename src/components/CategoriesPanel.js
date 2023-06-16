import React, { useState, useEffect } from "react";
import appStyles from "../App.module.css";
import btnStyles from "../styles/Button.module.css";
import { Button, Container } from "react-bootstrap";
import axios from 'axios';
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const CategoriesPanel = ({ mobile }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/categories/');
        console.log(response);
        setCategories(response.data['Category list']);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <Container className={`${appStyles.Container} ${mobile && 'd-lg-none text-center mb-3'}`}>
      <>
        {mobile ? (
          // IF ON MOBILE
          <div className="d-flex justify-content-around">
            Categories panel MOBILE
          </div>
        ) : (
          // IF ON DESKTOP
          
            // <h5 className="text-center pb-3">Categories</h5>
            <div className="d-flex py-0">
            <p className="text-center py-0 m-0">
              {categories.map((category, index) => (
                <Button
                  key={index}
                  className={`${btnStyles.Button} ${btnStyles.Category}`}
                  onClick={() => {}}
                >
                  <Link>{category}</Link>
                </Button>
              ))}
            </p>
          </div>
          
        )}
      </>
    </Container>
  );
};

export default CategoriesPanel;