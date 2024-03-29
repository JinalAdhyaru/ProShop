import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Row, Col, ListGroup, Image, Button, Card } from "react-bootstrap";
import Message from "../Components/Message";
import Loader from "../Components/Loader";
import { useGetOrderDetailsQuery, usePayOrderMutation, useGetPayPalClientIdQuery } from "../slices/ordersApiSlice";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

function OrderScreen() {

    const { id: orderId } = useParams();
    const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);
    const [payOrder, { isLoading: loadingPay } ] = usePayOrderMutation();
    const [{ isPending }, paypalDispatch ] = usePayPalScriptReducer();
    const { userInfo } = useSelector((state) => state.auth);
    const { data: paypal, isLoading: loadingPayPal, error: errorPayPal } = useGetPayPalClientIdQuery();
    
    useEffect(() => {
        if(!errorPayPal && !loadingPayPal && paypal.clientId) {
            const loadPayPalScript = async () => {
                paypalDispatch({
                    type: "resetOptions",
                    value: {
                        "clientId": paypal.clientId,
                        currency: "USD",
                    }
                });
                paypalDispatch({ type: 'setLoadingStatus', value: 'pending'})
            }
            if(order && !order.isPaid) {
                if(!window.paypal) {
                    loadPayPalScript();
                }
            }
        }
    }, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal]);

    function onApprove(data, actions) {
        return actions.order.capture().then(async function (details) {
            try {
                await payOrder({orderId, details});
                refetch();
                toast.success("Payment Successful");
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        });
    }

    //Just for testing purpose
    // async function onApproveTest() {
    //     await payOrder({orderId, details: { payer: {} }});
    //     refetch();
    //     toast.success("Payment Successful");
    // }

    function onError(err) {
        toast.error(err.message);
    }

    function createOrder(data, actions) {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: order.totalPrice,
                    },
                },
            ],
        }).then((orderId) => { return orderId});
    }

    return (
        isLoading ? (
            <Loader />
        ) : error ? (
            <Message variant='danger'>{error.data.message}</Message>
        ) : (
            <>
                <h1>Order {order._id} </h1>
                <Row>
                    
                    <Col md={8}>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h2>Shipping</h2>
                                <p>
                                    <strong>Name: </strong> {order.user.name}
                                </p>
                                <p>
                                    <strong>Email: </strong> {order.user.email}
                                </p>
                                <p>
                                    <strong>Address: </strong> {order.shippingAddress.address},{' '} 
                                    {order.shippingAddress.city}{', '}{order.shippingAddress.postalCode},
                                    {' '}{order.shippingAddress.country}
                                </p>
                                { order.isDelivered ? (
                                    <Message variant="success">
                                        Delivered on {order.deliveredAt}
                                    </Message>
                                ) : (
                                    <Message variant="danger">
                                        Not Delivered
                                    </Message>
                                )}
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <h2>Payment Method</h2>
                                <p>
                                    <strong>Method: </strong> {order.paymentMethod}
                                </p>
                                { order.isPaid ? (
                                    <Message variant="success">
                                        Paid on {order.paidAt}
                                    </Message>
                                ) : (
                                    <Message variant="danger">
                                        Not Paid
                                    </Message>
                                )}
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <h2>Order Items</h2>

                                {order.orderItems.length === 0 ? (
                                <Message>Order is empty</Message>
                                ) : (
                                <ListGroup variant='flush'>
                                {order.orderItems.map((item, index) => (
                                    <ListGroup.Item key={index}>
                                        <Row>
                                            <Col md={1}>
                                                <Image src={item.image} alt={item.name} fluid rounded />
                                            </Col>
                                            <Col>
                                                <Link to={`/product/${item.product}`}> 
                                                    {item.name}
                                                </Link>
                                            </Col>
                                            <Col md={4}>
                                                ${item.price} x {item.qty} = ${(item.qty * (item.price * 100)) / 100}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>    
                                ))}
                                </ListGroup>)}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                    
                    <Col md={4}>
                        <Card>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <h2>Order Summary</h2>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row>
                                        <Col>Items: </Col>
                                        <Col>${order.itemsPrice}</Col>
                                    </Row>

                                    <Row>
                                        <Col>Shipping: </Col>
                                        <Col>${order.shippingPrice}</Col>
                                    </Row>

                                    <Row>
                                        <Col>Tax: </Col>
                                        <Col>${order.taxPrice}</Col>
                                    </Row>

                                    <Row>
                                        <Col>Total: </Col>
                                        <Col>${order.totalPrice}</Col>
                                    </Row>

                                </ListGroup.Item>

                                {/* PAY ORDER PLACEHOLDER */}
                                { !order.isPaid && (
                                    <ListGroup.Item>

                                        {loadingPay && <Loader />}

                                        {isPending ? <Loader /> : (
                                            <div>
                                                {/* For testing */}
                                                {/* <Button onClick={onApproveTest} style={{marginBottom: "10px"}}>
                                                    Test Pay Order
                                                </Button> */}

                                                <div>
                                                    <PayPalButtons createOrder={createOrder} onApprove={onApprove} onError={onError}></PayPalButtons>
                                                </div>
                                            </div>
                                        )}

                                    </ListGroup.Item>
                                )}

                                {/* MARK AS DELIVERED PLACEHOLDER */}
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            </>
        )                
    )
}

export default OrderScreen;