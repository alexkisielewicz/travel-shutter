import React, { useState, useEffect } from "react";
import appStyles from "../App.module.css";
import { Container } from "react-bootstrap";
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
        <h5 className="text-center">Categories</h5>
        {mobile ? (
          // IF ON MOBILE
          <div className="d-flex justify-content-around">
            Categories panel MOBILE
          </div>
        ) : (
          // IF ON DESKTOP
          <>
            <ul>
              {categories.map((category, index) => (
                <li key={index}><Link to={`/posts/?category=${category}`}>{category}</Link></li>
              ))}
            </ul>
          </>
        )}
      </>
    </Container>
  );
};

export default CategoriesPanel;