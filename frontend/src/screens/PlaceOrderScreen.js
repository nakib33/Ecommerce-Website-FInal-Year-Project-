import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Button, Row, Col, ListGroup, Image, Card, InputGroup, FormControl, Form, ButtonGroup } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import CheckoutSteps from '../components/CheckoutSteps'
import { createOrder } from '../actions/orderActions'
import { ORDER_CREATE_RESET } from '../constants/orderConstants'

function PlaceOrderScreen({ history }) {

    const [coupon_code, setCoupon_code] = useState('')
    const [coupon_code_status, setCoupon_code_status] = useState(0)
    const [user_id, setUser_id] = useState()
    const [total_discount, setTotal_discount] = useState(0)
    const orderCreate = useSelector(state => state.orderCreate)
    const { order, error, success } = orderCreate
    const [count, setCount] = useState(0);
    const [coinPrice, setCoinPrice] =  useState(0);
    const [userCoins, setUserCoins] = useState(0);
    const [leftCoins, setLeftCoins] = useState(0);
    const [coupon_id, setCoupon_id] = useState(0);


    const dispatch = useDispatch()

    const cart = useSelector(state => state.cart)
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    cart.itemsPrice = cart.cartItems.reduce((acc, item) => acc + (item.offer_percentage ? parseFloat(item.price - ((item.price * item.offer_percentage) / 100)).toFixed(2) : item.price) * item.qty, 0).toFixed(2)
    cart.shippingPrice = (cart.itemsPrice > 100 ? 0 : 10).toFixed(2)
    cart.taxPrice = Number((0.050) * cart.itemsPrice).toFixed(2)
    cart.totalPrice = (Number(cart.itemsPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice)).toFixed(2) - total_discount - (count * 10);
    useEffect(() => {
        setUser_id(userInfo._id);
        axios.get(`http://127.0.0.1:8000/api/users/coin/${userInfo._id}`).then(res => {
            setUserCoins(res.data);
        },[userCoins])
     
    })
  

    const getCoouponCodeStatus = () =>{
        
        try{
        axios.post(`/api/products/coupon_check/`, {user_id, coupon_code}).then(res =>{
            console.log("res--->>>", res.data.status)
            console.log("Discount --->>>>>", res.data.total_discount)
            setCoupon_code_status(res.data.status);
            setTotal_discount(res.data.total_discount);
            setCoupon_id(res.data.coupon_id)
        })
    }
    catch(erro)
    {
        console.log(error)
    }
    }

    const coupon_discount = (
        <ListGroup.Item>
            <Row>
                <Col>Total Discount:</Col>
                <Col>&#2547;{total_discount}</Col>
            </Row>
        </ListGroup.Item>
    );


    if (!cart.paymentMethod) {
        history.push('/payment')
    }

    useEffect(() => {
        
        if (success) {
            history.push(`/order/${order._id}`)
            dispatch({ type: ORDER_CREATE_RESET })
        }
    }, [[success, history]])

    const placeOrder = () => {
        dispatch(createOrder({
            orderItems: cart.cartItems,
            shippingAddress: cart.shippingAddress,
            paymentMethod: cart.paymentMethod,
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice,
            left_coins: leftCoins,
            coupon_id: coupon_id
        }))
    }

    const setRemoveCoin = () =>
    {
        if(count)
        {
            setCount(count - 100);
            setLeftCoins(userCoins - count)
        }
        else{
            alert("You have not enough coin");
        }

    }

    const setAddCoin = () =>{
        if(count + 100 > userCoins)
        {
            alert("You have not enough coin");
        }
        else{
            setCount(count + 100)
            setLeftCoins(userCoins - count)
        }
    }

    return (
        <div className="large-devices-margin">
            <CheckoutSteps step1 step2 step3 step4 />
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>

                            <Form onSubmit={getCoouponCodeStatus}>

                            <h4>Enter Coupon Id</h4><span>if you have otherwise no need to submit</span>
                            <p>
                                <InputGroup className="mb-3">
                                    <FormControl
                                        placeholder="XY123ABC"
                                        aria-label="Recipient's username"
                                        aria-describedby="basic-addon2"
                                        size="sm"
                                        onChange={(e)=>{setCoupon_code(e.target.value)}}
                                    />
                                    <Button type="submit" variant="outline-warning" id="button-addon2" size="sm">
                                        Submit
                                    </Button>
                                </InputGroup>
                                    {coupon_code_status == 3 ? <p>Your Code is right you are being discounted</p> : coupon_code_status == 2 ?  <p>Your Code is not right please try again</p>: null}
                            </p>
                            </Form>
                            
                            <div>
                                <p>You have {count} coins and these coins value in tk : {count * 10} </p>
                                <ButtonGroup aria-label="Basic example">
                                    <Button size="sm" variant="danger" onClick={setRemoveCoin}>-</Button>
                                    <Button size="sm" variant="warning" onClick={setAddCoin}>+</Button>
                                    <h5 className="ml-2"> Left Coins : {leftCoins} </h5>
                                </ButtonGroup>
                            </div>


                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h3>Shipping</h3>

                            <p>
                                <strong>Shipping: </strong>
                                {cart.shippingAddress.address},  {cart.shippingAddress.city}
                                {'  '}
                                {cart.shippingAddress.postalCode},
                                {'  '}
                                {cart.shippingAddress.country}
                            </p>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            
                            <h3>Payment Method</h3>
                            <p>
                                <strong>Method: </strong>
                                {cart.paymentMethod}
                            </p>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h3>Order Items</h3>
                            {cart.cartItems.length === 0 ? <Message variant='info'>
                                Your cart is empty
                            </Message> : (
                                    <ListGroup variant='flush'>
                                        {cart.cartItems.map((item, index) => (
                                            <ListGroup.Item key={index}>
                                                <Row>
                                                    <Col md={1}>
                                                        <Image src={item.image} alt={item.name} fluid rounded />
                                                    </Col>

                                                    <Col>
                                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                                    </Col>

                                                    <Col md={4}>
                                                        {item.qty} X &#2547; {item.offer_percentage ? parseFloat(item.price - ((item.price * item.offer_percentage) / 100)).toFixed(2) : item.price} = &#2547; {(item.qty * (item.offer_percentage ? parseFloat(item.price - ((item.price * item.offer_percentage) / 100)).toFixed(2) : item.price)).toFixed(2)}
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                )}
                        </ListGroup.Item>

                    </ListGroup>

                </Col>

                <Col md={4} >
                    <Card className="mb-2 p-2 bg-warning">
                        <h3><i class="fas fa-coins"></i> Total Coins :  {userCoins}</h3>
                    </Card>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h3>Order Summary</h3>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Items:</Col>
                                    <Col>&#2547; {cart.itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping:</Col>
                                    <Col>&#2547; {cart.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax:</Col>
                                    <Col>&#2547; {cart.taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Coin Exchange:</Col>
                                    <Col>&#2547; {29 < count ? count * 120 : 19 < count ? count * 110 : 9 < count ? count * 105 : count * 100}</Col>
                                </Row>
                            </ListGroup.Item>

                           {coupon_code_status == 3 ? coupon_discount : null}
                            

                            
                            <ListGroup.Item>
                                <Row>
                                    <Col>Total:</Col>
                                    <Col>&#2547; {cart.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>


                            <ListGroup.Item>
                                {error && <Message variant='danger'>{error}</Message>}
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Button
                                    type='button'
                                    className='btn-block'
                                    disabled={cart.cartItems === 0}
                                    onClick={placeOrder}
                                    size="sm"
                                >
                                    Place Order
                                </Button>
                            </ListGroup.Item>

                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default PlaceOrderScreen
