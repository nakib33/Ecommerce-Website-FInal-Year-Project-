import React, { useState } from 'react'
import { Button, Form, Nav } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

const Navs2 = () =>{

    const [keyword, setKeyword] = useState('')

    let history = useHistory()

    const submitHandler = (e) => {
        e.preventDefault()
        if (keyword) {
            history.push(`/?keyword=${keyword}&page=1`)
        } else {
            history.push(history.push(history.location.pathname))
        }
    }




    return(
        <>
        
            <h5 className="text-center mt-2 mb-2">Top Operating System</h5>

            <p className="text-center mt-1 mb-1">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
            <Nav className="justify-content-center">
                <Nav.Item>
                        <Form onSubmit={submitHandler} inline>
                            <Button
                                type='submit'
                                onClick={() => setKeyword('linux')}
                            >
                                <div className="bg-warning p-3 br"  >
                                    <div className="text-center nav-text" ><i class="fab fa-linux"></i></div>
                                    <div className="text-center">Linux</div>
                                </div>
                                
                            </Button>
                        </Form>
                </Nav.Item>


                <Nav.Item>
                    <Form onSubmit={submitHandler} inline>
                        <Button
                            type='submit'
                            onClick={() => setKeyword('apple')}
                        >
                            <div className="bg-warning p-3 br" >
                                <div className="text-center nav-text" ><i class="fab fa-apple"></i></div>
                                <div className="text-center">Apple</div>
                            </div>
                        </Button>
                    </Form>
                </Nav.Item>
               
                        
                        
                        
                <Nav.Item>
                    <Form onSubmit={submitHandler} inline>
                        <Button
                            type='submit'
                            onClick={() => setKeyword('android')}
                        >
                            <div className="bg-warning p-3 br"  >
                                <div className="text-center nav-text" ><i class="fab fa-android"></i></div>
                                <div className="text-center">Android</div>
                            </div>
                        </Button>
                    </Form>
                </Nav.Item>

                <Nav.Item>
                    <Form onSubmit={submitHandler} inline>
                        <Button
                            type='submit'
                            onClick={() => setKeyword('windows')}
                        >
                            <div className="bg-warning p-3 br"  >
                                <div className="text-center nav-text" ><i class="fab fa-windows"></i></div>
                                <div className="text-center">Windows</div>
                            </div>

                        </Button>
                    </Form>
                </Nav.Item>

                        
            
            </Nav>
   
           
        </>
    )
}

export default Navs2;