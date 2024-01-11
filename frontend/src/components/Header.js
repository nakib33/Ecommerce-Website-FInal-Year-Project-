import {React, useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navbar, Nav, Container, Row, NavDropdown } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import SearchBox from './SearchBox'
import { logout } from '../actions/userActions'
import './style.css';

function Header() {

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const dispatch = useDispatch()

    const logoutHandler = () => {
        dispatch(logout())
    }


    const cart = useSelector(state => state.cart)
    const { cartItems } = cart

  
    

    return (
        <header>
            <Navbar className="navbar-dark bg-dark pt-1 pb-1 shadow" expand="lg" fixed="top" collapseOnSelect>
                <Container>
                    <LinkContainer to='/'>
                        
                        <Navbar.Brand className="mr-0 mr-md-4">

                            <div>
                                <div className="text-center " > <i class="fas fa-laptop-house"></i></div>
                                <div className="text-center">


                                    <span class="text-info "> <b>L</b></span><span className="text-danger">a</span>
                                <span className="text-success">p</span>
                                <span className="text-warning">t</span>op S

                                </div>
                            </div>
                        
                        
                        
                        
                        
                        </Navbar.Brand>
                    </LinkContainer>

                    <LinkContainer to='/cart' className="text-white active mr-0 mr-md-4">
                        <Nav.Link><i className="fas fa-shopping-cart ct"></i> cart <span class="badge badge-warning ct3">{cartItems.length > 0 ? ( cartItems.reduce((acc, item) => acc + item.qty, 0) ) : null}</span></Nav.Link>
                    </LinkContainer>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <SearchBox/>
                        <Nav className="ml-auto">
                           
                           
                            {userInfo ? (
            
                                    <NavDropdown title={userInfo.name} id='username' className="active">
                                    <LinkContainer to='/profile'>
                                        <NavDropdown.Item>Profile</NavDropdown.Item>
                                    </LinkContainer>

                                    <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>

                                </NavDropdown>
                                
                            ) : (<>
        
                                    <LinkContainer to='/register2'>
                                        <Nav.Link><i className="fas fa-user"></i>Register A Account </Nav.Link>
                                    </LinkContainer>
                                    <LinkContainer to='/login'>
                                        <Nav.Link><i className="fas fa-user"></i>Login</Nav.Link>
                                    </LinkContainer>
                                </>
                                )}


                            {userInfo && userInfo.isAdmin && (
                                <>
                                <LinkContainer to='/dashboard'>
                                        <Nav.Link>Dashboard</Nav.Link>
                                 </LinkContainer>
                                </>
                    
                            )}


                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}

export default Header
