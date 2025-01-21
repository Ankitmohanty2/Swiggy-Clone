import { useEffect, useState } from "react";
import { FETCH_CARDS_URL, ADDRESS_RECOMMEND_URL } from '../utils/constants';
import { useSelector } from "react-redux";
import Loading from '../components/Loading';

const useFetchCards = () => {
    const [cards, setCards] = useState([]);
    const [isDataFetched, setIsDataFetched] = useState(false);
    const [error, setError] = useState(null);

    const location = useSelector((store) => store.location.location);

    useEffect(() => {
        const getLatLng = async () => {
            try {
                const response = await fetch(ADDRESS_RECOMMEND_URL + location.place_id);
                if (!response.ok) throw new Error('Failed to fetch location details');
                
                const json = await response.json();
                if (!json?.data?.[0]?.geometry?.location) {
                    throw new Error('Invalid location data');
                }

                const geometry = json.data[0].geometry.location;
                localStorage.setItem('latLng', JSON.stringify(geometry));
                await fetchData(geometry);
            } catch (error) {
                console.error("Error fetching location:", error);
                // Fallback to default coordinates
                await fetchData({lat: 17.385044, lng: 78.486671});
            }
        };
    
        const fetchData = async (geometry) => {
            try {
                setIsDataFetched(false);
                const url = `${FETCH_CARDS_URL}lat=${geometry.lat}&lng=${geometry.lng}`;
                
                const response = await fetch(url);
                if (!response.ok) throw new Error('Failed to fetch restaurants');
                
                const json = await response.json();
                if (!json?.data?.cards) {
                    throw new Error('Invalid restaurant data');
                }

                const sections = new Map();
                let title = '';
                let isFirstTime = true;
    
                json.data.cards.forEach((card) => {
                    if (!card?.card?.card) return;
                    
                    const cardDetails = card.card.card;

                    if (cardDetails.imageGridCards && cardDetails.gridElements && !cardDetails.header?.title) {
                        cardDetails.title = 'Offers';
                        sections.set('offers', {isPresent: true, data: cardDetails});
                    } else if (cardDetails.id === 'whats_on_your_mind') {
                        cardDetails.title = "What's on your mind?";
                        sections.set('whats_on_mind', {isPresent: true, data: cardDetails});
                    } else if (cardDetails.id === 'top_brands_for_you') {
                        sections.set('top_brands_for_you', {isPresent: true, data: cardDetails});
                    } else if (cardDetails.id === 'popular_restaurants_title') {
                        title = cardDetails.title;
                    } else if (cardDetails.id === 'restaurant_grid_listing') {
                        cardDetails.title = title;
                        sections.set('restaurants_list', {isPresent: true, data: cardDetails});
                    } else if (cardDetails.id === 'restaurant_near_me_links') {
                        if (isFirstTime) {
                            sections.set('otherDetails', {isPresent: true, data: [cardDetails]});
                            isFirstTime = false;
                        } else {
                            const details = sections.get('otherDetails');
                            details.data.push(cardDetails);
                            sections.set('otherDetails', details);
                        }
                    }
                });

                if (sections.size === 0) {
                    throw new Error('No restaurant data found');
                }

                setCards(sections);
                setError(null);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err.message);
            } finally {
                setIsDataFetched(true);
            }
        };
        
        if (Object.keys(location).length > 0) {
            getLatLng();
        } else {
            fetchData({lat: 17.385044, lng: 78.486671});
        }
    }, [location]);

    if (!isDataFetched) {
        return <Loading text={'Looking for great food near you...'}/>;
    }

    if (error) {
        return (
            <div className="text-center p-4">
                <div className="text-red-500 mb-4">{error}</div>
                <button 
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return cards;
};

export default useFetchCards;