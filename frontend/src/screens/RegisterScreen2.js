import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { register } from '../actions/userActions'
import axios from 'axios'

const baseURL = "http://127.0.0.1:8000/api/users/temp_register/";

function RegisterScreen2({ location, history }) {

    const [name, setName] = useState('')
    const [mobile, setMobile] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')
    const [isOk, setIsOk] = useState(false);
    const [data_tkn, setData_tkn] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoadding] = useState(false)
    const [success, setSuccess] = useState(false);

    const dispatch = useDispatch()

    const redirect = location.search ? location.search.split('=')[1] : '/'


    useEffect(() => {
        if (success) {
            history.push('/otp_screen');
        }
    }, [success]);

    const submitHandler = (e) => {
        e.preventDefault()

        if (password != confirmPassword) {
            setError('Passwords do not match')
        } else {
            //dispatch(register(name, email, password, mobile))
            setLoadding(true)
    
                axios.post(baseURL, {
                    name,
                    email,
                    mobile,
                    password

                }).then((response) => {
                    setData_tkn(response.data);
                    localStorage.setItem('data_tkn', response.data);
                    setSuccess(true);
                    
                }).catch(error =>{
                    setError(error.response.data);
                })
               
            
            setLoadding(false)
            
        }
       

    }

    return (

        <FormContainer>
            <div className="card p-4">
                <h1>Register</h1>
                {error && <Message variant='danger'>{error}</Message>}
                {loading && <Loader />}
                <Form onSubmit={submitHandler}>

                    <Form.Group controlId='name'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            required
                            size="sm"
                            type='name'
                            placeholder='Enter name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId='mobile'>
                        <Form.Label>Mobile</Form.Label>
                        <Form.Control
                            required
                            size="sm"
                            type='text'
                            placeholder='019*******'
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='email'>
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            required
                            size="sm"
                            type='email'
                            placeholder='Enter Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='password'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            required
                            size="sm"
                            type='password'
                            placeholder='Enter Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='passwordConfirm'>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            required
                            size="sm"
                            type='password'
                            placeholder='Confirm Password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>

                    <Button size="sm" type='submit' variant='primary' className="btn-block mt-4">
                        Register
                    </Button>

                </Form>

                <Row className='py-3'>
                    <Col>
                        Have an Account? <Link
                            to={redirect ? `/login?redirect=${redirect}` : '/login'}>
                            Sign In
                        </Link>
                    </Col>
                </Row>
            </div>
        </FormContainer >

    )
}

export default RegisterScreen2;
