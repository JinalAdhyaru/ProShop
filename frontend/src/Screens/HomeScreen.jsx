import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import {Row, Col} from 'react-bootstrap';
// import products from '../products';
import Product from '../Components/Product';

function HomeScreen() {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get("/api/products");
      console.log("Response", response);
      setProducts(response.data);
    };

    fetchProducts();
  }, []);

  return (
    <>
      <h1>Latest Products</h1>
      <Row>
        {products.map((product) => (
          <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
            <Product product={product} />
          </Col>
        ))}
      </Row>
    </>
  )
}

export default HomeScreen;