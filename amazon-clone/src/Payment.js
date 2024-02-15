import React, {useState, useEffect} from 'react'
import './Payment.css'
import { useStateValue } from './StateProvider';
import CheckoutProduct from './CheckoutProduct';
import { Link } from 'react-router-dom';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import CurrencyFormat from 'react-currency-format';
import { getBasketTotal } from './reducer';
import { useNavigate } from 'react-router-dom';
import axios from './axios';
import  {db}  from './firebase';
function Payment() {
    const navigate = useNavigate();
    const [{basket,user}, dispatch]=useStateValue();
    const stripe=useStripe();
    const elements=useElements();

    const [succeeded,setSucceded]=useState(false);
    const [processing, setProcessing]=useState("");
    const [error, setError]=useState(null);
    const [disabled, setDisabled]=useState(true);
    const [clientSecret, setClientSecret]=useState(null);

    useEffect(()=>{
        const getClientSecret=async()=>{
            const response = await axios({ 
                method: 'post',
                url: `http://127.0.0.1:5001/challenge-48a75/us-central1/api/payments/create?total=${getBasketTotal(basket)*100}`
            });
            
            setClientSecret(response.data.clientSecret)
        }
        getClientSecret();
    }, [basket])
    console.log('The SECRET IS >>>>>>', clientSecret)
    console.log(user);
    const handleSubmit= async (e)=>{
        //do all the fancy 
        e.preventDefault();
        setProcessing(true);
        console.log("Logging db object before using it:", db);
        const payload=await stripe.confirmCardPayment(clientSecret,{payment_method:{
            card: elements.getElement(CardElement)
        }}).then(({paymentIntent })=>{
            
            db.collection()
            .doc(user?.id)
            .collection()
            .doc(paymentIntent.uid)
            .set({
                basket: basket,
                amount: paymentIntent.amount,
                created: paymentIntent.created
            })
            setSucceded(true);
            setError(null);
            setProcessing(false);
            dispatch({
                type:'EMPTY_BASKET'
            })
            navigate('/orders', { replace: true });
        })
    }
    const handleChange=e=>{
        setDisabled(e.empty);
        setError(e.error?e.error.message:"");
    }
  return (
    <div className='payment'>
        <div className='payment__container'>
            <h1>
                Checkout(
                    <Link to="/checkout">{basket?.length} items</Link>
                )
            </h1>
            <div className='payment__section'>
                <div className='payment__title'>
                    <h3>DeliveryAddress</h3>
                </div>
                <div className='payment__address'>
                    <p>{user?.email}</p>
                    <p>123 React Lane</p>
                    <p>Los Angeles, CA</p>
                </div>
            </div>
            <div className='payment__section'>
                <div className='payment__title'>
                    <h3>Review items and delivery</h3>
                </div>
                <div className='payment__items'>
                    {basket.map(item=>(
                        <CheckoutProduct
                        id={item.id}
                        title={item.title}
                        image={item.image}
                        price={item.price}
                        rating={item.rating}/>
                    ))}
                </div>
            </div>
            <div className='payment__section'>
                <div className='payment__title'>
                    <h3>Payment Method</h3>
                </div>
                <div className='payment__details'>
                    {/* Stripe magic will go*/}
                    <form onSubmit={handleSubmit}>
                        <CardElement onChange={handleChange}/>
                        <div className='payment__priceContainer'>
                            <CurrencyFormat
                            renderText={(value)=>(
                                <>
                                <h3>Order Total: {value}</h3>
                                </>
                            )}
                            decimalScale={2}
                            value={getBasketTotal(basket)}
                            displayType={"text"}
                            thousandSeparator={true}
                            prefix={"$"}
                            />
                            <button disabled={processing ||disabled|| succeeded }>
                                <span>
                                    {processing? <p>Processing</p>:"Buy Now"}
                                </span>
                            </button>
                        </div>
                        {/*ERRORS...*/}
                        {error && <div>{error}</div>}
                    </form>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Payment