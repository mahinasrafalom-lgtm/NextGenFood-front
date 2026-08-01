import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, MessageCircle, Phone, Star, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import { fetchProductById } from '../services/api';
import { showToast } from '../components/Toast';

// Removed Mock data

const ProductDetails = ({ isLoggedIn }) => {
  const { id } = useParams();
  const { addToCart, openCartDrawer } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState("Select One");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const getProduct = async () => {
      setLoading(true);
      try {
        const dbProduct = await fetchProductById(id);
        if (dbProduct) {
          // Combine main image and gallery images into a complete gallery list
          const combinedImages = [];
          if (dbProduct.image) combinedImages.push(dbProduct.image);
          if (Array.isArray(dbProduct.images)) {
            dbProduct.images.forEach(img => {
              if (img && !combinedImages.includes(img)) combinedImages.push(img);
            });
          }
          if (combinedImages.length === 0) combinedImages.push('');
          
          setProduct({
            ...dbProduct,
            images: combinedImages,
            rating: dbProduct.rating || 0,
            reviewCount: dbProduct.reviewCount || 0,
            reviews: dbProduct.reviews || [],
            description: dbProduct.description || 'No description available for this product.'
          });
          setActiveImage(combinedImages[0]);
          
          // Optionally fetch related products based on category
          try {
            const api = await import('../services/api');
            const all = await api.fetchProducts();
            setRelatedProducts(all.filter(p => p.category === dbProduct.category && (p._id || p.id) !== dbProduct._id).slice(0, 4));
          } catch(e) {}
        }
      } catch (error) {
        console.warn("Product API fetch error:", error.message);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) getProduct();
  }, [id]);

  const activeIndex = product && product.images ? product.images.indexOf(activeImage) : 0;
  const handlePrevImage = () => {
    if (!product.images || product.images.length === 0) return;
    setActiveImage(product.images[(activeIndex - 1 + product.images.length) % product.images.length]);
  };
  const handleNextImage = () => {
    if (!product.images || product.images.length === 0) return;
    setActiveImage(product.images[(activeIndex + 1) % product.images.length]);
  };

  const handleReviewSubmit = async (e) => {
    if (e) e.preventDefault();
    if (reviewRating === "Select One" || !reviewComment.trim()) {
      showToast("Please provide both a rating and a comment.");
      return;
    }
    setSubmittingReview(true);
    try {
      const api = await import('../services/api');
      const userName = currentUser?.displayName || currentUser?.name || currentUser?.email?.split('@')[0] || "User";
      const res = await api.addProductReview(product._id || product.id, {
        user: userName,
        userEmail: currentUser?.email,
        rating: parseInt(reviewRating),
        comment: reviewComment
      });
      if (res.success) {
        setProduct({
            ...res.product,
            images: product.images // Preserve already-combined images
        });
        setReviewComment("");
        setReviewRating("Select One");
        showToast("Review submitted successfully!");
      }
    } catch (error) {
      showToast(error.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  const productRating = product ? (product.rating || 0) : 0;
  const productReviews = product ? (product.reviews || []) : [];
  
  const calculateBar = (star) => {
    if (productReviews.length === 0) return 0;
    const count = productReviews.filter(r => r.rating === star).length;
    return Math.round((count / productReviews.length) * 100);
  };
  
  const recommendPercent = productReviews.length > 0 
    ? Math.round((productReviews.filter(r => r.rating >= 4).length / productReviews.length) * 100) 
    : 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-[#f5f6f8]">
        <Loader2 className="w-10 h-10 animate-spin text-brand-mid mb-4" />
        <p className="text-gray-500 font-medium">Loading product details...</p>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-[#f5f6f8]">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
        <p className="text-gray-500 mb-6">The product you are looking for does not exist or has been removed.</p>
        <Link to="/products" className="bg-brand-mid text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#e87a0c] transition-colors">
          Browse Products
        </Link>
      </div>
    );
  }
  
  return (
    <div className="bg-[#f5f6f8] min-h-screen pb-20 font-sans">
      <div className="max-w-[1400px] xl:max-w-[1350px] mx-auto px-0 md:px-8 xl:px-12">
        
        {/* Breadcrumb */}
        <div className="flex items-center flex-wrap gap-2 text-[13px] text-[#666666] py-[3px] md:py-1.5 px-4 md:px-0 bg-white md:bg-transparent border-b md:border-b-0 border-gray-100 mb-2">
          <Link to="/" className="hover:text-brand-mid transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link to="/products" className="hover:text-brand-mid transition-colors">Products</Link>
          {product?.category && (
            <>
              <ChevronRight size={12} />
              <Link to={`/products?category=${encodeURIComponent(product.category.toLowerCase())}`} className="hover:text-brand-mid transition-colors capitalize">
                {product.category}{product.subcategory ? ` ${product.subcategory}` : ''}
              </Link>
            </>
          )}
        </div>

        {/* Main Product Container */}
        <div className="bg-white rounded-none md:rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.02)] overflow-hidden mb-4 p-4 md:p-8 lg:p-10">
          <div className="flex flex-col xl:flex-row gap-8 xl:gap-12">
            
            {/* Image Gallery */}
            <div className="flex flex-row items-start gap-3 md:gap-4 xl:gap-6 w-full xl:w-[40%] max-w-[767px] mx-auto xl:mx-0 flex-shrink-0 xl:sticky xl:top-24">
              
              {/* Thumbnails (Left Column) */}
              <div className="w-[60px] md:w-[80px] lg:w-[90px] flex-shrink-0 flex flex-col gap-3 md:gap-4">
                {product.images.map((img, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setActiveImage(img)}
                    className={`w-full aspect-square rounded-lg cursor-pointer overflow-hidden transition-all flex items-center justify-center ${activeImage === img ? 'ring-2 ring-[#ba0036] shadow-[0_2px_8px_rgba(186,0,54,0.15)] bg-[#ba0036]/5' : 'bg-white shadow-sm border border-gray-100 hover:border-gray-300'}`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover mix-blend-multiply" />
                  </div>
                ))}
              </div>

              {/* Main Image (Right Column) */}
              <div className="flex-1 w-full aspect-[767/784] max-w-[767px] max-h-[784px] rounded-2xl overflow-hidden relative flex items-center justify-center bg-[#fdfdfd] shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-gray-50">
                <img src={activeImage} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
                
                {/* Navigation Arrows */}
                <button 
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-[#007aff] hover:bg-black/5 rounded-full transition-colors cursor-pointer shadow-sm"
                >
                  <ChevronLeft className="w-6 h-6 md:w-7 md:h-7" strokeWidth={2.5} />
                </button>
                <button 
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-[#007aff] hover:bg-black/5 rounded-full transition-colors cursor-pointer shadow-sm"
                >
                  <ChevronRight className="w-6 h-6 md:w-7 md:h-7" strokeWidth={2.5} />
                </button>
              </div>
              
            </div>

            {/* Product Info Block */}
            <div className="w-full flex-1 flex flex-col pt-2 lg:pt-4">
              <h1 className="text-[20px] md:text-[24px] lg:text-[28px] font-bold text-[#333333] mb-2">{product.name}</h1>
              
              {/* Pricing */}
              <div className="flex items-center gap-2 mb-5">
                <span className="text-[24px] md:text-[28px] lg:text-[32px] font-bold text-brand-mid">৳{product.priceMin.toLocaleString()}</span>
                {product.priceMax && (
                  <span className="text-[#a0a0a0] line-through text-[16px] md:text-[18px] lg:text-[20px] font-normal mt-1 md:mt-2">৳{product.priceMax.toLocaleString()}</span>
                )}
                {product.discount && (
                  <span className="bg-[#2ecc71] text-white text-[12px] md:text-[14px] font-medium px-2 py-0.5 md:px-3 md:py-1 rounded shadow-sm ml-1 md:ml-3">
                    {product.discount}
                  </span>
                )}
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6 md:mb-8">
                <span className="text-[#333333] font-medium text-[15px] md:text-[16px]">Quantity:</span>
                <div className="flex items-center border border-gray-200 rounded-lg w-[110px] md:w-[130px] h-9 md:h-11 bg-white shadow-sm overflow-hidden">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 md:w-11 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 bg-[#f9f9f9] transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </button>
                  <span className="flex-1 text-center font-medium text-[#333333] md:text-[16px] border-x border-gray-200 h-full flex items-center justify-center">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 md:w-11 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 bg-[#f9f9f9] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 md:gap-4 mb-8 md:mb-10 w-full">
                <button 
                  onClick={() => {
                    addToCart({...product, quantity});
                  }}
                  className="bg-brand-mid hover:bg-[#e87a0c] text-white h-[40px] md:h-[50px] rounded-md font-bold text-[13px] md:text-[15px] flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
                >
                  <ShoppingBag size={16} className="md:w-5 md:h-5" /> ADD TO CART
                </button>
                <button 
                  onClick={() => {
                    addToCart({...product, quantity});
                    navigate('/checkout');
                  }}
                  className="bg-[#0b2727] hover:bg-black text-white h-[40px] md:h-[50px] rounded-md font-bold text-[13px] md:text-[15px] transition-all shadow-sm active:scale-95"
                >
                  BUY NOW
                </button>
                <a 
                  href={`https://wa.me/8801706066407?text=${encodeURIComponent(`Hello, I would like to order:\n\nProduct: ${product.name}\nQuantity: ${quantity}\nPrice: ৳${product.priceMin.toLocaleString()}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#27ae60] hover:bg-[#219653] text-white h-[40px] md:h-[50px] rounded-md font-bold text-[13px] md:text-[15px] flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
                >
                  <MessageCircle size={16} className="md:w-5 md:h-5" /> Order On WhatsApp
                </a>
                <a 
                  href="tel:01706066407"
                  className="bg-[#2a4592] hover:bg-[#1a316b] text-white h-[40px] md:h-[50px] rounded-md font-bold text-[13px] md:text-[15px] flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
                >
                  <Phone size={16} className="md:w-5 md:h-5" /> Call For Order
                </a>
              </div>

              {/* Metadata Boxes */}
              <div className="flex flex-wrap gap-4 mt-2">
                {/* Brand Box */}
                {product.brand && (
                  <div className="border border-gray-200 rounded-lg px-4 py-2.5 inline-flex items-center gap-2 bg-white shadow-sm">
                    <span className="font-bold text-[#222831] text-[15px]">Brand:</span>
                    <span className="text-[#666666] flex items-center font-medium ml-1">
                       {product.brandImage ? (
                         <img src={product.brandImage} alt={product.brand} className="h-9 sm:h-11 max-w-[120px] object-contain" />
                       ) : (
                         product.brand
                       )}
                    </span>
                  </div>
                )}
                
                {/* Category Box */}
                {product.category && (
                  <div className="border border-gray-200 rounded-lg px-4 py-2.5 inline-flex items-center gap-2 bg-white shadow-sm">
                    <span className="font-bold text-[#222831] text-[15px]">Category:</span>
                    <span className="text-[#666666] font-medium capitalize">
                       {product.category}{product.subcategory ? ` ${product.subcategory}` : ''}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Product Details & Reviews Box */}
        <div className="bg-white rounded-none md:rounded-xl shadow-sm mb-8 overflow-hidden">
          {/* Details Section */}
          <div className="p-5 md:p-8 border-b border-gray-100">
            <h2 className="text-[18px] font-bold text-[#222831] border-b-[3px] border-[#222831] inline-block pb-1.5 mb-5">Product Details</h2>
            <div className="text-[#444] text-[15px] leading-[1.8] whitespace-pre-line font-medium">
              {product.description}
            </div>
          </div>
          
          {/* Reviews Section */}
          <div className="p-5 md:p-8">
            <div className="flex flex-col xl:flex-row gap-8 md:gap-10">
              {/* Rating Stats & Bars (Left Column) */}
              <div className="w-full md:w-[280px] xl:w-[300px] flex-shrink-0">
                
                {/* Average Rating */}
                <div className="flex items-center gap-4 text-[#222831] mb-4">
                  <span className="text-[44px] font-bold leading-none">{productRating.toFixed(1)}</span>
                  <div>
                    <p className="text-[13px] font-bold text-gray-800 mb-0.5">Average Rating</p>
                    <div className="flex items-center gap-1.5">
                      <div className="flex text-brand-mid">
                        {Array(Math.round(productRating)).fill(0).map((_, i) => <Star key={`fill-${i}`} size={14} fill="currentColor" />)}
                        {Array(5 - Math.round(productRating)).fill(0).map((_, i) => <Star key={`empty-${i}`} size={14} className="text-gray-300" fill="currentColor" />)}
                      </div>
                      <span className="text-[12px] text-gray-500">({productReviews.length} Reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Recommended */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-[22px] font-bold text-[#222831] leading-none">{recommendPercent}%</div>
                  <div className="text-[13px] text-gray-600">Recommended <span className="text-gray-400">({productReviews.filter(r => r.rating >= 4).length} of {productReviews.length})</span></div>
                </div>

                {/* Bars */}
                <div className="space-y-3">
                  {[5,4,3,2,1].map(star => {
                    const percent = calculateBar(star);
                    return (
                    <div key={star} className="flex items-center gap-3">
                      <div className="flex text-brand-mid w-[70px]">
                        {Array(star).fill(0).map((_, i) => <Star key={i} size={13} fill="currentColor" />)}
                        {Array(5-star).fill(0).map((_, i) => <Star key={i} size={13} className="text-gray-200" fill="currentColor" />)}
                      </div>
                      <div className="flex-1 h-2 bg-[#f0f0f0] rounded-full overflow-hidden">
                        <div className="h-full bg-brand-mid" style={{ width: `${percent}%` }}></div>
                      </div>
                      <span className="w-8 text-right text-[13px] font-medium text-gray-600">{percent}%</span>
                    </div>
                  )})}
                </div>
              </div>

              {/* Submit Review */}
              <div className="w-full flex-1">
                <h3 className="text-[16px] font-bold text-[#222831] border-b-[3px] border-brand-mid inline-block pb-1.5 mb-4">Submit Your Review</h3>
                
                {!isLoggedIn ? (
                  <div className="bg-[#fff9f9] border border-[#ffeded] rounded-lg p-6 text-center">
                    <p className="text-[15px] text-[#444] mb-4">You must be logged in to rate and review this product.</p>
                    <Link to="/login" className="bg-brand-mid hover:bg-[#e87a0c] text-white px-8 py-2.5 rounded font-bold text-[14px] transition-colors inline-block">
                      Login to Review
                    </Link>
                  </div>
                ) : (
                  <>
                    <p className="text-[14px] text-[#666] mb-5">Your email address will not be published. Required fields are marked *</p>
                    
                    <div className="mb-5">
                      <label className="block text-[14px] text-[#444] mb-2 font-medium">Write your opinion about the product *</label>
                      <textarea 
                        rows="5" 
                        placeholder="Write Your Review Here..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        className="w-full border border-gray-200 rounded-[4px] p-3 text-[14px] focus:border-brand-mid outline-none resize-none bg-[#fdfdfd]"
                      ></textarea>
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-[14px] text-[#444] mb-2 font-medium">Your Rating *</label>
                      <select 
                        value={reviewRating}
                        onChange={(e) => setReviewRating(e.target.value)}
                        className="w-full border border-gray-200 rounded-[4px] p-3 text-[14px] focus:border-brand-mid outline-none bg-[#fdfdfd] appearance-none cursor-pointer"
                      >
                        <option value="Select One">Select One</option>
                        <option value="1">1 Star</option>
                        <option value="2">2 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="5">5 Stars</option>
                      </select>
                    </div>
                    
                    <div className="flex justify-end">
                      <button 
                        type="button"
                        onClick={handleReviewSubmit}
                        disabled={submittingReview}
                        className="bg-[#4a4a4a] hover:bg-[#333] disabled:opacity-50 text-white px-7 py-3 rounded-[4px] text-[13px] font-bold tracking-wide transition-colors"
                      >
                        {submittingReview ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Display Reviews */}
            {productReviews.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-100">
                <h3 className="text-[18px] font-bold text-[#222831] mb-6">Customer Reviews ({productReviews.length})</h3>
                <div className="space-y-4">
                  {productReviews.map((rev, idx) => (
                    <div key={idx} className="border border-gray-100 p-5 rounded-lg bg-[#fdfdfd]">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-[#222831] flex items-center gap-2">
                           <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                             {rev.user ? rev.user.charAt(0).toUpperCase() : 'U'}
                           </div>
                           {rev.user}
                        </span>
                        <div className="flex text-brand-mid">
                          {Array(rev.rating).fill(0).map((_, i) => <Star key={`r-fill-${i}`} size={13} fill="currentColor" />)}
                          {Array(5-rev.rating).fill(0).map((_, i) => <Star key={`r-empty-${i}`} size={13} className="text-gray-200" fill="currentColor" />)}
                        </div>
                      </div>
                      <p className="text-[#555] text-[14px] leading-relaxed pl-10">{rev.comment}</p>
                      <p className="text-[12px] text-gray-400 mt-3 pl-10">{new Date(rev.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="py-2">
            <div className="text-center mb-8">
              <h2 className="text-[26px] font-bold text-[#222831] mb-2 tracking-tight">Related Products</h2>
              <Link to={`/products?category=${product.category}`} className="text-brand-mid font-bold text-[15px] inline-flex items-center gap-1 hover:underline">
                More Products <ChevronRight size={16} />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map(prod => (
                <ProductCard key={prod.id || prod._id} product={prod} />
              ))}
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default ProductDetails;
