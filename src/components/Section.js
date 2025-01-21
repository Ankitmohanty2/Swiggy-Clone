import React, { useEffect, useRef, useState } from 'react';
import Carousel from './Carousel';
import { Link } from 'react-router-dom';
import RestaurantCard, { withOfferText } from './RestaurantCard';
import { useDispatch, useSelector } from 'react-redux';
import { updateRestaurants } from '../utils/restaurantsSlice';
import Shimmer from './Shimmer';

const Section = ({ card }) => {
    const RestaurantCardWithOffer = withOfferText(RestaurantCard);
    const [isLoading, setIsLoading] = useState(false);
    const [restaurants, setRestaurants] = useState([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const [isHandlePureVeg, setIsHandlePureVeg] = useState(false);
    const [isHandleRating, setIsHandleRating] = useState(false);
    const [error, setError] = useState(null);

    const containerRef = useRef(null);
    const scrollDivRef = useRef(null);
    const dispatch = useDispatch();

    const allRestaurants = useSelector((store) => store.restaurants.restaurants);

    const prev = () => {
        containerRef.current.scrollLeft -= 500;
    };

    const next = () => {
        containerRef.current.scrollLeft += 500;
    };

    if (card[0] === 'restaurants_list') {
        localStorage.setItem('resCount', allRestaurants.length + 1);
    }

    useEffect(() => {
        if (card[0] === 'restaurants_list') {
            setRestaurants(allRestaurants);
            setFilteredRestaurants(allRestaurants);
        } else if (card[0] === 'top_brands_for_you') {
            setRestaurants(card[1].data.gridElements.infoWithStyle.restaurants);
            setFilteredRestaurants(card[1].data.gridElements.infoWithStyle.restaurants);
        }
    }, [card, allRestaurants]);

    const handlePureVeg = () => {
        setIsHandlePureVeg(!isHandlePureVeg);
        if (!isHandlePureVeg) {
            const vegRestaurants = filteredRestaurants.filter(restaurant => restaurant.info.veg);
            setFilteredRestaurants(vegRestaurants);
        } else {
            setFilteredRestaurants(restaurants);
        }
    };

    const handleRating = () => {
        setIsHandleRating(!isHandleRating);
        if (!isHandleRating) {
            const highRatedRestaurants = filteredRestaurants.filter(
                restaurant => parseFloat(restaurant.info.avgRating) > 4.0
            );
            setFilteredRestaurants(highRatedRestaurants);
        } else {
            setFilteredRestaurants(restaurants);
        }
    };

    useEffect(() => {
        if (card[0] === 'restaurants_list') {
            let isFetchCalled = false;
            const initialRes = card[1].data?.gridElements?.infoWithStyle?.restaurants;
            dispatch(updateRestaurants({ cardDetails: initialRes, isUpdate: false }));
    
            const fetchRes = async () => {
                try {
                    setIsLoading(true);
                    setError(null);
                    
                    const count = localStorage.getItem('resCount') ? JSON.parse(localStorage.getItem('resCount')) : 10;
                    const latLng = JSON.parse(localStorage.getItem('latLng')) || { lat: 17.385044, lng: 78.486671 };
    
                    // Using a different CORS proxy and adding necessary headers
                    const response = await fetch('https://api.allorigins.win/raw?url=' + encodeURIComponent(`https://www.swiggy.com/dapi/restaurants/list/v5`), {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                            "Accept": "application/json, text/plain, */*",
                            "Accept-Language": "en-US,en;q=0.9",
                            "Access-Control-Allow-Origin": "*"
                        },
                        body: JSON.stringify({
                            lat: latLng.lat,
                            lng: latLng.lng,
                            offset: count,
                            sortBy: "RELEVANCE",
                            pageType: "SEE_ALL",
                            page_type: "DESKTOP_WEB_LISTING",
                            filters: {},
                            _csrf: "YH5n08SgbkUZ-zpAL-zeJwmc09fXXBG7yc5H8D_s"
                        })
                    });
    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
    
                    const json = await response.json();
    
                    if (!json?.data?.cards?.[0]?.card?.card?.gridElements?.infoWithStyle?.restaurants) {
                        throw new Error('Invalid response structure');
                    }
    
                    const restaurantsData = json.data.cards[0].card.card.gridElements.infoWithStyle.restaurants;
                    localStorage.setItem('resCount', JSON.stringify(restaurantsData.length));
                    dispatch(updateRestaurants({ cardDetails: restaurantsData, isUpdate: true }));
    
                } catch (err) {
                    console.error("Error fetching restaurants:", err);
                    setError("Failed to load restaurants. Please try again later.");
                    
                    // Fallback to initial data if available
                    if (initialRes && initialRes.length > 0) {
                        dispatch(updateRestaurants({ cardDetails: initialRes, isUpdate: true }));
                    }
                } finally {
                    setIsLoading(false);
                    isFetchCalled = false;
                }
            };
    
            const handleScroll = () => {
                if (scrollDivRef.current && !isLoading) {
                    const rect = scrollDivRef.current.getBoundingClientRect();
                    const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
    
                    if (isVisible && !isFetchCalled) {
                        fetchRes();
                        isFetchCalled = true;
                    }
                }
            };
    
            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        }
    }, [card, dispatch]);

    if (card[0] === 'offers' || card[0] === 'whats_on_mind') {
        const style = card[0] === 'offers' 
            ? { width: 425, height: 252 }
            : { width: 144, height: 180 };

        const imageUrl = card[0] === 'offers'
            ? 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_850,h_504/'
            : 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/';

        const title = card[0] === 'offers'
            ? 'Best offers for you'
            : card[1].data.header.title;

        return (
            <Carousel 
                style={style} 
                imageUrl={imageUrl} 
                data={card[1].data.gridElements.infoWithStyle.info}
                title={title}
            />
        );
    }

    if (card[0] === 'restaurants_list' || card[0] === 'top_brands_for_you') {
        return (
            <div className='sm:m-[5%] min-[375px]:m-[5%] max-[412px]:m-[5%]'>
                <div className='flex justify-between mt-5'>
                    <div className='font-bold text-2xl'>
                        {card[1].data.title ? card[1].data.title : card[1].data.header.title}
                    </div>
                    {card[0] === 'top_brands_for_you' && (
                        <div className='flex space-x-2'>
                            <button className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center" onClick={prev}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                                </svg>
                            </button>
                            <button className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center" onClick={next}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>

                {card[0] === 'restaurants_list' && (
                    <div className='mt-4 ml-4'>
                        <div className='flex justify-between'>
                            <div>
                                <ul className='flex'>
                                    <li 
                                        className='p-2 border border-slate-300 rounded-3xl w-36 text-center mr-2 cursor-pointer hover:bg-slate-200'
                                        onClick={handleRating}
                                    >
                                        <div className='flex'>
                                            <div className='mr-3'>Ratings 4.0+</div>
                                            {isHandleRating && (
                                                <img 
                                                    alt='close' 
                                                    src='https://static.thenounproject.com/png/1202535-200.png' 
                                                    className='w-6 h-6'
                                                />
                                            )}
                                        </div>
                                    </li>
                                    <li 
                                        className='p-2 border border-slate-300 rounded-3xl w-28 text-center mr-2 cursor-pointer hover:bg-slate-200'
                                        onClick={handlePureVeg}
                                    >
                                        <div className='flex'>
                                            <div className='mr-1'>Pure Veg</div>
                                            {isHandlePureVeg && (
                                                <img 
                                                    alt='close' 
                                                    src='https://static.thenounproject.com/png/1202535-200.png' 
                                                    className='w-6 h-6'
                                                />
                                            )}
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={containerRef} 
                    className={card[0] === 'top_brands_for_you' 
                        ? 'flex mt-4 space-x-5 overflow-x-scroll no-scrollbar' 
                        : 'flex flex-wrap mt-4'}
                >
                    {filteredRestaurants.map((restaurant) => (
                        <Link key={restaurant.info.id} to={`restaurant/${restaurant.info.id}`}>
                            {restaurant.info.aggregatedDiscountInfoV3 
                                ? <RestaurantCardWithOffer resData={restaurant}/> 
                                : <RestaurantCard 
                                    resData={restaurant} 
                                    shouldEnableCarousel={card[0] === 'top_brands_for_you'}
                                  />
                            }
                        </Link>
                    ))}
                </div>

                {card[0] === 'restaurants_list' && <div ref={scrollDivRef}></div>}
                
                {isLoading && (
                    <div className='flex flex-wrap'>
                        <Shimmer />
                        <Shimmer />
                        <Shimmer />
                        <Shimmer />
                    </div>
                )}

                {error && (
                    <div className="text-center text-red-500 p-4">
                        {error}
                        <button 
                            onClick={() => window.location.reload()}
                            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </div>
        );
    }

    if (card[0] === 'otherDetails') {
        return (
            <div>
                {card[1].data.map((details, index) => (
                    <div key={index}>
                        <div className='font-bold text-2xl'>{details.title}</div>
                        <div className='grid grid-cols-4 gap-4 mt-4 text-center'>
                            {details.brands.map((brand, index) => (
                                <div className='border p-4 truncate cursor-pointer' key={index}>
                                    <a href={brand.link} target='_blank' rel="noreferrer">
                                        {brand.text}
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return null;
};

export default Section;