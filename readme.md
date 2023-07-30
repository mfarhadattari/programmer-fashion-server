# -----------| PROGRAMMER FASHION |-------------

### ---- This is the backend of programmer fashion ----

# URL

### Live Site: https://programmer-fashion.netlify.app

### Sever Site: https://programmer-fashion.vercel.app

### Client Repo: https://github.com/mfarhadattari/programmer-fashion-client

# APIs

## Admin API:

- Admin Overview (GET): https://programmer-fashion.vercel.app/admin/overview
- All Product (GET): https://programmer-fashion.vercel.app/admin/all-products
- All Customer (GET): https://programmer-fashion.vercel.app/admin/all-customer
- Customer Details (GET): https://programmer-fashion.vercel.app/admin/customer/id
- All Order (GET): https://programmer-fashion.vercel.app/admin/all-order
- All Payment (GET): https://programmer-fashion.vercel.app/admin/all-payment
- Add Product (POST): https://programmer-fashion.vercel.app/admin/add-product
- Delete Product (DELETE): https://programmer-fashion.vercel.app/admin/delete-product/id
- Update Product (PATCH): https://programmer-fashion.vercel.app/admin/update-product/id

## User API:

- User Overview (GET): https://programmer-fashion.vercel.app/my-overview
- User Payment (GET): https://programmer-fashion.vercel.app/my-payments
- User Orders (GET): https://programmer-fashion.vercel.app/my-orders
- Order Details (GET) : https://programmer-fashion.vercel.app/order/id
- User Cart (GET): https://programmer-fashion.vercel.app/my-cart
- User Total Cart (GET): https://programmer-fashion.vercel.app/total-cart
- Add to Cart (POST): https://programmer-fashion.vercel.app/add-to-cart
- Delete Cart (DELETE): https://programmer-fashion.vercel.app/delete-cart/id
- Update Cart Quantity (PATCH): https://programmer-fashion.vercel.app/delete-cart/id

## Public API:

- All Product (GET): https://programmer-fashion.vercel.app/products
- New Product (GET): https://programmer-fashion.vercel.app/new-products
- Popular Product (GET): https://programmer-fashion.vercel.app/popular-products
- Product Details (GET): https://programmer-fashion.vercel.app/products/id
- Product Reviews (GET): https://programmer-fashion.vercel.app/product-reviews/id
- Testimonials (GET): https://programmer-fashion.vercel.app/our-teams
- Our Teams (GET): https://programmer-fashion.vercel.app/our-teams

## Auth API:

- Check Admin (GET) : https://programmer-fashion.vercel.app/isAdmin
- User Info (GET) : https://programmer-fashion.vercel.app/get-user
- Save User (POST) : https://programmer-fashion.vercel.app/create-user
- Save User (PATCH) : https://programmer-fashion.vercel.app/update-info
- Generate JWT (POST) : https://programmer-fashion.vercel.app/generate-jwt

## Payment API:

- Initialize Payment (POST) : https://programmer-fashion.vercel.app/initialize-payment
- Payment success (POST) : https://programmer-fashion.vercel.app/payment-success/tran_id
- Payment Failed (POST) : https://programmer-fashion.vercel.app/payment-failed/tran_id

# Middlewares

- jwtVerify
- adminVerify
