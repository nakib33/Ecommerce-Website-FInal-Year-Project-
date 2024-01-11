import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { Row, Col, Image, ListGroup, Button, Card, Form, Modal } from 'react-bootstrap'
import Rating from '../components/Rating'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { listProductDetails, createProductReview } from '../actions/productActions'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'
import ReactImageMagnify from 'react-image-magnify';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import Coupon from '../components/Coupon';
import axios from 'axios';
import ProductChart from '../components/ProductChart';

const baseURL = "http://127.0.0.1:8000/api/products/predict_history_price/";

function ProductScreen({ match, history }) {
    const [qty, setQty] = useState(1)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [show, setShow] = useState(false);
    const [date, setDate] = useState(null)
    const [predictPrice, setPredict_price] = useState(null);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
   

    const dispatch = useDispatch()

    const productDetails = useSelector(state => state.productDetails)
    const { loading, error, product, price_history } = productDetails

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const productReviewCreate = useSelector(state => state.productReviewCreate)
    const {
        loading: loadingProductReview,
        error: errorProductReview,
        success: successProductReview,
    } = productReviewCreate

    const product_id = product._id;
   

    useEffect(() => {
        if (successProductReview) {
            setRating(0)
            setComment('')
            dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
        }

        dispatch(listProductDetails(match.params.id))

    }, [dispatch, match, successProductReview])

    const addToCartHandler = () => {
        console.log("product Ids", match.params.id)
        history.push(`/cart/${match.params.id}?qty=${qty}`)
    }

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(createProductReview(
            match.params.id, {
            rating,
            comment
        }
        ))
    }
    console.log("price : ", price_history);
    const predict_future_price_submit = (e) =>{
        e.preventDefault()
        if(product._id && date)
        {   
            console.log("hello", product_id, date)
            axios.post(baseURL, {
                date,
                product_id

            }).then((response)=>{
                setPredict_price(response.data);
            })
        }
    

    }

    return (
        <div className="large-devices-margin">
            
          
        <Coupon />
               
            {loading ?
                <Loader />
                : error
                    ? <Message variant='danger'>{error}</Message>
                    : (
                        <div>
                            <Row>
                                <Col md={6}>
                                    
                                    <Carousel autoPlay="true" infiniteLoop="true" interval="1000" stopOnHover="true" >

                                            <div >
                                                <img src={product.image} />
                                            </div>
                                        <div >
                                            <img src={product.image2} />
                                        </div>
                                        <div >
                                            <img src={product.image3} />
                                            
                                        </div>

                                   

                                    </Carousel>
                                    <Card className="p-2 mt-4 border border-white">
                                        <div>Description: {ReactHtmlParser(product.description)}</div>
                                    </Card>
                                    <diV className="mt-5 mb-5">

                                    </diV>
                                    <ProductChart price_history={price_history}  product_id={product._id}/>
                                    <diV className="mt-5 mb-5">

                                    </diV>
                                </Col>


                                <Col md={4}>
                                   
                                    <ListGroup variant="primary">
                                    <ListGroup.Item>
                                            <h3>{product.name}</h3>
                                        </ListGroup.Item>

                                        <ListGroup.Item>
                                            <Rating value={product.rating} text={`${product.numReviews} reviews`} color={'#f8e825'} />
                                        </ListGroup.Item>

                                        <ListGroup.Item>
                                            <span className="h3">&#2547;{product.is_offer ? product.price - ((product.price * product.offer_percentage) / 100) : product.price}</span>
                                            <br></br><span class="text-tl">{product.is_offer ? '৳' + product.price : null}</span> <b>{product.is_offer ? '-' + product.offer_percentage + '%' : <br></br>}</b>
                                        <br></br>


                                            <Button variant="primary" size="sm" className="mt-2" onClick={handleShow}>
                                                predict future price
                                            </Button>

                                            <Modal show={show} onHide={handleClose}>
                                                <Modal.Header className="bg-dark" closeButton>
                                                    <Modal.Title className="text-white">Predict future price of {product.name}</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    <span >enter the date where you can predict the price of this laptop</span>
                                                    <Form onSubmit={predict_future_price_submit}>
                                                    <Form.Control type="date" size="sm" className="mb-2 mt-2" name="date" onChange={(e)=>{setDate(e.target.value)}}/>
                                                        <h3>{predictPrice ? 'Predict Price : ' + parseFloat(predictPrice).toFixed(2) : null}</h3>
                                                    <Button type="submit" size="sm" className="mt-3">Predict</Button>
                                                    </Form>
                                                </Modal.Body>
                                                <Modal.Footer>
                    
                                                </Modal.Footer>
                                            </Modal>
                                      






                                        </ListGroup.Item>

                                       
                                    

                                        <ListGroup.Item>
                                            <p>Model: {product.model}</p>
                                            <hr></hr>
                                            <p>Category: {product.category}</p>
                                            <hr></hr>
                                            <p>Processor: {product.processor}</p>
                                            <hr></hr>
                                            <p>Display: {product.display}</p>
                                            <hr></hr>
                                            <p>Graphics: {product.graphics_card}</p>
                                            <hr></hr>
                                            <p>Ram: {product.ram_memory}</p>
                                            <hr></hr>
                                            <p>OS: {product.operating_system}</p>
                                            <hr></hr>
                                            <p>Storage: {product.storage}</p>
                                            <hr></hr>
                                            <p>Web Cam: {product.web_cam}</p>
                                            <hr></hr>
                                            <p> Color: {product.color}</p>
                                            <hr></hr>
                                            <p>Battery: {product.battery}</p>
                                            <hr></hr>
                                            <p>Weight: {product.weight}</p>
                                            <hr></hr>
                                            <p>Warranty: {product.warranty}</p>
                                            <hr></hr>
                                        </ListGroup.Item>
                                    </ListGroup>
                                   
                                </Col>

                           


                                <Col md={2}>
                                    <Card>
                                        <ListGroup variant='flush'>
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col>Price:</Col>
                                                    <Col>
                                                        <strong>৳ {product.price}</strong>
                                
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col>Status:</Col>
                                                    <Col>
                                                        {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>

                                            {product.countInStock > 0 && (
                                                <ListGroup.Item>
                                                    <Row>
                                                        <Col>Qty</Col>
                                                        <Col xs='auto' className='my-1'>
                                                            <Form.Control
                                                                as="select"
                                                                value={qty}
                                                                onChange={(e) => setQty(e.target.value)}
                                                            >
                                                                {

                                                                    [...Array(product.countInStock).keys()].map((x) => (
                                                                        <option key={x + 1} value={x + 1}>
                                                                            {x + 1}
                                                                        </option>
                                                                    ))
                                                                }

                                                            </Form.Control>
                                                        </Col>
                                                    </Row>
                                                </ListGroup.Item>
                                            )}


                                            <ListGroup.Item>
                                                <Button
                                                    onClick={addToCartHandler}
                                                    className='btn-block'
                                                    disabled={product.countInStock == 0}
                                                    size="sm"
                                                    type='button'>
                                                    Add to Cart
                                                </Button>
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </Card>
                                  
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                   
                                    <Card className="p-2 border border-white">
                                    <h4>Reviews</h4>
                                    {product.reviews.length === 0 && <Message variant='info' size="sm">No Reviews</Message>}

                                    <ListGroup variant='flush'>
                                        {product.reviews.map((review) => (
                                            <ListGroup.Item key={review._id}>
                                                <strong>{review.name}</strong>
                                                <Rating value={review.rating} color='#f8e825' />
                                                <p>{review.createdAt.substring(0, 10)}</p>
                                                <p>{review.comment}</p>
                                            </ListGroup.Item>
                                        ))}

                                        <ListGroup.Item>
                                            <h4>Write a review</h4>

                                            {loadingProductReview && <Loader />}
                                            {successProductReview && <Message variant='success'>Review Submitted</Message>}
                                            {errorProductReview && <Message variant='danger'>{errorProductReview}</Message>}

                                            {userInfo ? (
                                                <Form onSubmit={submitHandler}>
                                                    <Form.Group controlId='rating'>
                                                        <Form.Label>Rating</Form.Label>
                                                        <Form.Control
                                                            as='select'
                                                            value={rating}
                                                            onChange={(e) => setRating(e.target.value)}
                                                            size="sm"
                                                        >
                                                            <option value=''>Select...</option>
                                                            <option value='1'>1 - Poor</option>
                                                            <option value='2'>2 - Fair</option>
                                                            <option value='3'>3 - Good</option>
                                                            <option value='4'>4 - Very Good</option>
                                                            <option value='5'>5 - Excellent</option>
                                                        </Form.Control>
                                                    </Form.Group>

                                                    <Form.Group controlId='comment'>
                                                        <Form.Label>Review</Form.Label>
                                                        <Form.Control
                                                            as='textarea'
                                                            row='5'
                                                            value={comment}
                                                            onChange={(e) => setComment(e.target.value)}
                                                            size="sm"
                                                        ></Form.Control>
                                                    </Form.Group>

                                                    <Button
                                                        disabled={loadingProductReview}
                                                        type='submit'
                                                        variant='primary'
                                                        size="sm"
                                                    >
                                                        Submit
                                                    </Button>

                                                </Form>
                                            ) : (
                                                    <Message size="sm" variant='info'>Please <Link to='/login'>login</Link> to write a review</Message>
                                                )}
                                        </ListGroup.Item>
                                    </ListGroup>
                                    </Card>
                                    <Link to='/'  className='btn btn-primary my-3 btn-sm'>Go Back</Link>  
                                </Col>
                            </Row>
                        </div>
                    )

            }


        </div >
    )
}

export default ProductScreen
