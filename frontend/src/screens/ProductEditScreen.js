import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { listProductDetails, updateProduct } from '../actions/productActions'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';


function ProductEditScreen({ match, history }) {

    const productId = match.params.id

    
    const [category, setCategory] = useState('')
    const [brand, setBrand] = useState('')
    const [name, setName] = useState('')
    const [model, setModel] = useState('')
    const [processor, setProcessor] = useState('')
    const [display, setDisplay] = useState('')
    const [graphics_card, setGraphics_card] = useState('')
    const [ram_memory, setRam_memory] = useState('')
    const [storage, setStorage] = useState('')
    const [operating_system, setOperating_system] = useState('')
    const [web_cam, setWeb_cam] = useState('')
    const [weight, setWeight] = useState('')
    const [color, setColor] = useState('')
    const [battery, setBattery] = useState('')
    const [warranty, setWarranty] = useState('')
    const [price, setPrice] = useState(0)
    const [image, setImage] = useState('')
    const [image2, setImage2] = useState('')
    const [image3, setImage3] = useState('')
    const [countInStock, setCountInStock] = useState(0)
    const [description, setDescription] = useState('')
    const [is_offer, setIsOffer] = useState('')
    const [offer_percentage, setOfferPercentage] = useState(0)
    const [uploading, setUploading] = useState(false)

    const dispatch = useDispatch()

    const productDetails = useSelector(state => state.productDetails)
    const { error, loading, product } = productDetails

    const productUpdate = useSelector(state => state.productUpdate)
    const { error: errorUpdate, loading: loadingUpdate, success: successUpdate } = productUpdate


    useEffect(() => {
        console.log(history)

        if (successUpdate) {
            dispatch({ type: PRODUCT_UPDATE_RESET })

            history.push('/admin/productlist')
        } else {
            if (!product.name || product._id !== Number(productId)) {
                dispatch(listProductDetails(productId))
            } else {
                setCategory(product.category)
                setBrand(product.brand)
                setName(product.name)
                setModel(product.model)
                setProcessor(product.processor)
                setGraphics_card(product.graphics_card)
                setRam_memory(product.ram_memory)
                setStorage(product.storage)
                setOperating_system(product.operating_system)
                setWeb_cam(product.web_cam)
                setWeight(product.weight)
                setColor(product.color)
                setBattery(product.battery)
                setWarranty(product.warranty)
                setPrice(product.price)
                setImage(product.image)
                setImage2(product.image2)
                setImage3(product.image3)
                
                setCountInStock(product.countInStock)
                setDescription(product.description)
                setIsOffer(product.is_offer)
                setOfferPercentage(product.offer_percentage)

            }
        }



    }, [dispatch, product, productId, history, successUpdate])

    const submitHandler = (e) => {
        e.preventDefault()
        if (is_offer == 'True' && offer_percentage >= 0) {
            alert("something went wrong");
            return;
        }
        dispatch(updateProduct({
            _id: productId,
            category,
            brand,
            name,
            model,
            processor,
            display,
            graphics_card,
            ram_memory,
            storage,
            operating_system,
            web_cam,
            weight,
            color,
            battery,
            warranty,
            price,
            image,
            image2,
            image3,
            countInStock,
            description,
            is_offer,
            offer_percentage,
        }))
    }

    const uploadFileHandler = async (e) => {

        const file = e.target.files[0]
        const formData = new FormData()

        formData.append('image', file)
        formData.append('product_id', productId)

        setUploading(true)

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }

            const { data } = await axios.post('/api/products/upload/', formData, config)


            setImage(data)
            setUploading(false)

        } catch (error) {
            setUploading(false)
        }
    }

    const uploadFileHandler2 = async (e) => {

        const file = e.target.files[0]
        const formData = new FormData()

        formData.append('image2', file)
        formData.append('product_id', productId)

        setUploading(true)

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }

            const { data } = await axios.post('/api/products/upload/', formData, config)


            setImage2(data)
            setUploading(false)

        } catch (error) {
            setUploading(false)
        }
    }

    const uploadFileHandler3 = async (e) => {

        const file = e.target.files[0]
        const formData = new FormData()

        formData.append('image3', file)
        formData.append('product_id', productId)

        setUploading(true)

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }

            const { data } = await axios.post('/api/products/upload/', formData, config)


            setImage3(data)
            setUploading(false)

        } catch (error) {
            setUploading(false)
        }
    }

    return (
        <div>
            <Link to='/admin/productlist'>
                Go Back
            </Link>

            <FormContainer>
                <h1>Edit Product</h1>
                {loadingUpdate && <Loader />}
                {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}

                {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message>
                    : (

                        <Form onSubmit={submitHandler}>

                            <Form.Group controlId='category'>
                                <Form.Label>Category</Form.Label>
                                <Form.Control

                                    type='text'
                                    placeholder='Enter category'
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId='brand'>
                                <Form.Label>Brand</Form.Label>
                                <Form.Control

                                    type='text'
                                    placeholder='Enter brand'
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>


                            <Form.Group controlId='name'>
                                <Form.Label>Name</Form.Label>
                                <Form.Control

                                    type='name'
                                    placeholder='Enter name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId='model'>
                                <Form.Label>Model</Form.Label>
                                <Form.Control

                                    type='name'
                                    placeholder='Enter name'
                                    value={model}
                                    onChange={(e) => setModel(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId='processor'>
                                <Form.Label>Processor</Form.Label>
                                <Form.Control

                                    type='text'
                                    placeholder='Enter Processor'
                                    value={processor}
                                    onChange={(e) => setProcessor(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId='display'>
                                <Form.Label>Display</Form.Label>
                                <Form.Control

                                    type='text'
                                    placeholder='Enter Display'
                                    value={display}
                                    onChange={(e) => setDisplay(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId='graphics_card'>
                                <Form.Label>Graphics Card</Form.Label>
                                <Form.Control

                                    type='text'
                                    placeholder='Enter Graphics Card'
                                    value={graphics_card}
                                    onChange={(e) => setGraphics_card(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId='ram_memory'>
                                <Form.Label>Ram</Form.Label>
                                <Form.Control

                                    type='number'
                                    placeholder='Enter Ram'
                                    value={ram_memory}
                                    onChange={(e) => setRam_memory(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                                <Form.Group controlId='storage'>
                                <Form.Label>Storage</Form.Label>
                                <Form.Control

                                    type='text'
                                    placeholder='Enter Storage'
                                    value={storage}
                                    onChange={(e) => setStorage(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId='operating_system'>
                                <Form.Label>Operating System</Form.Label>
                                <Form.Control

                                    type='text'
                                    placeholder='Enter OS'
                                    value={operating_system}
                                    onChange={(e) => setOperating_system(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId='web_cam'>
                                <Form.Label>Web Cam</Form.Label>
                                <Form.Control

                                    type='text'
                                    placeholder='Enter Web Cam'
                                    value={web_cam}
                                    onChange={(e) => setWeb_cam(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId='weight'>
                                <Form.Label>Weight</Form.Label>
                                <Form.Control

                                    type='text'
                                    placeholder='Enter weight'
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId='color'>
                                <Form.Label>Color</Form.Label>
                                <Form.Control

                                    type='text'
                                    placeholder='Enter color'
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId='battery'>
                                <Form.Label>Battery</Form.Label>
                                <Form.Control

                                    type='text'
                                    placeholder='Enter battery'
                                    value={battery}
                                    onChange={(e) => setBattery(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId='warranty'>
                                <Form.Label>Warranty</Form.Label>
                                <Form.Control

                                    type='text'
                                    placeholder='Enter Warranty'
                                    value={warranty}
                                    onChange={(e) => setWarranty(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>







                            <Form.Group controlId='price'>
                                <Form.Label>Price</Form.Label>
                                <Form.Control

                                    type='number'
                                    placeholder='Enter price'
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>


                            <Form.Group controlId='image'>
                                <Form.Label>Image</Form.Label>
                                <Form.Control

                                    type='text'
                                    placeholder='Enter image'
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}
                                >
                                </Form.Control>

                                <Form.File
                                    id='image-file'
                                    label='Choose File'
                                    onChange={uploadFileHandler}
                                >

                                </Form.File>
                                <Form.File
                                    id='image-file2'
                                    label='Choose File'
                                    onChange={uploadFileHandler2}
                                >

                                </Form.File>
                                <Form.File
                                    id='image-file3'
                                    label='Choose File'
                                    onChange={uploadFileHandler3}
                                >

                                </Form.File>
                                {uploading && <Loader />}

                            </Form.Group>


                          
                           

                            <Form.Group controlId='countinstock'>
                                <Form.Label>Stock</Form.Label>
                                <Form.Control

                                    type='number'
                                    placeholder='Enter stock'
                                    value={countInStock}
                                    onChange={(e) => setCountInStock(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            

                            <Form.Group controlId='description'>
                                <Form.Label>Description</Form.Label>

                                <CKEditor editor={ClassicEditor}
                                    onChange={(e, editor) => setDescription(editor.getData())}
                                />
                                <div>
                                    {ReactHtmlParser(description)}
                                </div>
                            </Form.Group>


                            <Form.Group controlId='is_offer'>
                                <Form.Check
                                    type='checkbox'
                                    label='Is AOffer'
                                    checked={is_offer}
                                    onChange={(e) => setIsOffer(e.target.checked)}
                                >
                                </Form.Check>
                            </Form.Group>



                            <Form.Group controlId='offerPercentage'>
                                <Form.Label>Offer Percentage</Form.Label>
                                <Form.Control

                                    type='text'
                                    placeholder='Enter '
                                    value={offer_percentage}
                                    onChange={(e) => setOfferPercentage(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>


                            <Button type='submit' variant='primary'>
                                Update
                            </Button>

                        </Form>
                    )}

            </FormContainer >
        </div>

    )
}

export default ProductEditScreen