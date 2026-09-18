import dotenv from "dotenv"
dotenv.config()
import Razorpay from "razorpay"


const razorpay = new Razorpay({
    key_id: 'rzp_test_TcbRx3aWgDazM3',
    key_secret: 'te8XTJ1bG81Zpa9CpsC5KXrF',
});

export default razorpay

