import React, { useState, useEffect } from "react";
import appStyles from "../App.module.css";
import styles from "../styles/CategoriesPanel.module.css";
import Container from "react-bootstrap/Container";
import axios from "axios";
import Spinner from "../components/Spinner";

const CategoriesPanel = ({ handleCategoryFilter }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch list of categories
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/categories/");
        setCategories(response.data["Category list"]);
      } catch (error) {
        // console.log(error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <Container className={appStyles.Container}>
      {categories.length ? (
        <>
            <div className="d-flex p-1 m-1">
              <div className={`${styles.Tags} text-center`}>
                {/* Iterate through fetched categories to display
                each one in a clickable span */}
                {categories.map((category, index) => (
                  <span
                    key={index}
                    /* Function with selected category parameter 
                    is passed to display filtered view in PostsPage.js */
                    onClick={() => handleCategoryFilter(category)}
                  >
                    {category}
                  </span>
                  
                ))}
              </div>
            </div>
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