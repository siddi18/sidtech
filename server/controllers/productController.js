import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler";


const getProducts =  asyncHandler(async(req,res)=>{
  console.log('req keyword :', req.query.keyword, req.query.pageNumber)
  const pageNumber = +req.query.pageNumber
  const pageSize = process.env.PAGINATION_LIMIT
  const keyword = req.query.keyword
  ? {
      name: {
        $regex: req.query.keyword,
        $options: "i",
      },
    }
  : {}

    const count = await Product.countDocuments({...keyword})
    const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (pageNumber - 1))
    if(products){
      res.json({ products, pageNumber, pages: Math.ceil(count / pageSize) })
    }else{
        res.status(404);
        throw new Error('Products not found')
    }
})

const getProductById = asyncHandler(async(req,res)=>{
    console.log('req.params.id :',req.params.id)
    //const productId = mongoose.Types.ObjectId(req.params.id);
    const product =await Product.findById(req.params.id);
    if(product){
        res.json(product);  
    }else{
        res.status(404);
        throw new Error('Product not found')
    }
})

const createProduct = asyncHandler(async (req, res) => {
    
    console.log('body from createprod :', req.user._id)
    const product = new Product({
      name: "Sample Name",
      price: 0,
      user: req.user._id,
      image: "/images/sample.jpg",
      brand: "Sample Brand",
      category: "Sample category",
      countInStock: 0,
      numReviews: 0,
      description: "Sample description",
    })
  
    const createdProduct =await product.save()
    res.status(201).json(createdProduct)
  })


  const updateProduct = asyncHandler(async (req, res) => {
    const { name, price, image, brand, category, countInStock, description } =
      req.body
  
    const product = await Product.findById(req.params.id)
  
    if (product) {
      product.name = name
      product.price = price
      product.description = description
      product.image = image
      product.brand = brand
      product.category = category
      product.countInStock = countInStock
  
      const updatedProduct = await product.save()
      res.json(updatedProduct)
    } else {
      res.status(404)
      throw new Error("Product Not Found")
    }
  })

  const deleteProduct = asyncHandler(async(req, res) =>{

    const product = await Product.findById(req.params.id)

    if(product){
      await Product.deleteOne({_id: product._id})
      res.json({message : 'product deleted successfully'})
    }else{
      res.status(404)
      throw new Error('Product Not Found')
    }
  })

  const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body

    const product = await Product.findById(req.params.id)
  
    if (product) {
      const alreadyReviewed = product.reviews.find(
        review => review.user._id.toString() === req.user._id.toString()
      )
  
      if (alreadyReviewed) {
        res.status(400)
        throw new Error("Product already reviewed")
      }
      const review = {
        name: req.user.name,
        rating: +rating,
        comment,
        user: req.user._id,
      }
      product.reviews.push(review)
  
      product.numReviews = product.reviews.length
  
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length
  
      await product.save()
      res.status(201).json({
        message: "Review Added",
      })
    } else {
      res.status(404)
      throw new Error("Product Not Found")
    }
  })

export {getProducts, getProductById, createProduct, updateProduct, deleteProduct, createProductReview}