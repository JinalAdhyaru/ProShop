import React from 'react';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Row, Col, Image, ListGroup, Card, Button, ListGroupItem, Form } from 'react-bootstrap';
import Ratings from '../Components/Ratings';
import { useGetProductDetailsQuery } from '../slice/productsApiSlice';
import Loader from '../Components/Loader';
import Message from '../Components/Message';
import { addToCart } from '../slice/cartSlice';

function ProductScreen() {

    const { id: productId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { data: product, isLoading, error } = useGetProductDetailsQuery(productId);

    const [qty, setQty] = useState(1);

    const addToCartHandler = () => {
        dispatch(addToCart({ ...product, qty }));
        navigate('/cart');
    }

    return (
        <>
            <Link className='btn btn-light my-3' to="/">
                Go Back
            </Link>

            { isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">
                    { error?.data?.message || error.error }
                </Message>
            ) : (
                <>
                    <Row>
                        <Col md={5}>
                            <Image src={product.image} alt={product.name} fluid />
                        </Col>

                        <Col md={4}>
                            <ListGroup variant="flust">
                                <ListGroupItem>
                                    <h3>{product.name}</h3>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <Ratings value={product.rating} text={`${product.numReviews} reviews`} />
                                </ListGroupItem>
                                <ListGroupItem>
                                    Price: ${product.price}
                                </ListGroupItem>
                                <ListGroupItem>
                                    Description: ${product.description}
                                </ListGroupItem>
                            </ListGroup>
                        </Col>

                        <Col md={3}>
                            <Card>
                                <ListGroup>
                                    <ListGroupItem>
                                        <Row>
                                            <Col> Price: </Col>
                                            <Col>
                                                <strong>${product.price}</strong>
                                            </Col>
                                        </Row>
                                    </ListGroupItem> 
                                    <ListGroupItem>   
                                        <Row>    
                                            <Col> Status: </Col>
                                            <Col>
                                                <strong>{product.countInStock > 0 ? "In Stock" : "Out Of Stock"}</strong>
                                            </Col>
                                        </Row>
                                    </ListGroupItem>

                                    { product.countInStock > 0 && (
                                        <ListGroupItem>
                                            <Row>
                                                <Col> Qty </Col>
                                                <Col>
                                                    <Form.Control
                                                        as='select'
                                                        value={qty}
                                                        onChange={(e) => setQty(Number(e.target.value))}>
                                                            { [...Array(product.countInStock).keys()].map((x) => (
                                                                <option key={ x+1 } value={ x+1 }>
                                                                    { x+1}
                                                                </option>
                                                            )) }
                                                    </Form.Control>
                                                </Col>
                                            </Row>
                                        </ListGroupItem>    
                                    )}
                                    <ListGroupItem>
                                        <Button
                                            className="btn-block"
                                            type="button"
                                            disabled={product.countInStock === 0}
                                            onClick={addToCartHandler}
                                        > Add To Cart </Button>
                                    </ListGroupItem>
                                </ListGroup>
                            </Card>
                        </Col>
                    </Row>
                </>
            ) }
        </>
    )
}

export default ProductScreen;