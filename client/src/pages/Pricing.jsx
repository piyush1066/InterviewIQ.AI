import React, { useState } from 'react'
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import axios from "axios";
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userScile';
import { ServerUrl } from '../App';

function Pricing() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [loadingPlan, setLoadingPlan] = useState(null);
  const plans = [
    {
      id: "free",
      name: "Free",
      price: "Rs.0",
      credits: 100,
      description: "Perfect for beginers strating interview preparation",
      features: [
        "100 AI Inetrview Credits",
        "Basic Performance Report",
        "Voice Interview Access",
        "Limited History Tracking",
      ],
      default: true,
    },
    {
      id: "Basic",
      name: "Plus",
      price: "Rs.100",
      credits: 500,
      description: "Great for focused practice and skill improvement.",
      features: [
        "500 AI Interview Credits",
        "Detailed Feedback",
        "Performance Analysis",
        "Full Interview History",
      ]
    },
    {
      id: "Pro",
      name: "Max",
      price: "Rs.500",
      credits: 1000,
      description: "Best value for serious job preparation.",
      features: [
        "1000 AI Interview Credits",
        "DAdvanced AI Feedback",
        "Skill Trend Analysis",
        "Priority AI Processing",
      ],
      badge: "Best Value",
    },]

  const handlePayment = async (plan) => {
    try {
      setLoadingPlan(plan.id)

      if (!window.Razorpay) {
        alert("Payment service is still loading. Please try again in a moment.");
        setLoadingPlan(null);
        return;
      }

      const amount =
        plan.id === "Basic" ? 100 :
          plan.id === "Pro" ? 500 : 0;

      const result = await axios.post(ServerUrl + "/api/payment/order", {
        planId: plan.id,
        amount: amount,
        credits: plan.credits,
      }, { withCredentials: true })
      console.log(result.data);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: result.data.order.amount,
        currency: "INR",
        name: "InterviewIQ.AI",
        description: `${plan.name} - ${plan.credits} Credits`,
        order_id: result.data.order.id,

        handler: async function (response) {
          try {
            const verifypay = await axios.post(ServerUrl + "/api/payment/verify", response, { withCredentials: true });
            dispatch(setUserData(verifypay.data.user))

            alert("Payment Successful🎉! Credits Added.");
            navigate("/")
          } catch (error) {
            alert(error.response?.data?.message || "Payment completed, but verification failed. Please contact support.");
          } finally {
            setLoadingPlan(null);
          }
        },
        theme: {
          color: "#10b981"
        },
        modal: {
          ondismiss: function () {
            setLoadingPlan(null);
          }
        },
      }
      const rzp = new window.Razorpay(options)
      rzp.on("payment.failed", function (response) {
        alert(response.error?.description || "Payment failed. Please try again.");
        setLoadingPlan(null);
      });
      rzp.open()
    } catch (error) {
      setLoadingPlan(null)
      console.log(error)
      alert(error.response?.data?.message || "Unable to start payment. Please try again.")

    }

  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-emerald-5 py-16 px-6'>

      <div className='max-w-6xl mx-auto mb-14 flex items-start gap-4'>

        <button onClick={() => navigate("/")} className='mt-2 p-3 rounded-full bg-white shadow hover:shadow-md transition'>
          <FaArrowLeft className='text-gray-600' />
        </button>

        <div className='text-center w-full'>
          <h1 className='text-4xl font-bold text-gray-800'>
            Choose Your Plan
          </h1>

          <p className='text-gray-500 mt-3 text-lg'>
            Flexible pricing to match your interview preparation goals.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id;

          return (
            <motion.div key={plan.id}
              whileHover={!plan.default && { scale: 1.03 }}
              onClick={() => !plan.default && setSelectedPlan(plan.id)}
              className={`relative rounded-3xl p-8 transition-all duration-300 border
              ${isSelected
                  ? "border-emerald-600 shadow-2xl bg-white"
                  : "border-gray-200 bg-white shadow-md"
                }
              ${plan.default ? "cursor-default" : "cursor-pointer"
                }
              `}
            >

              {/* Badge */}

              {plan.badge && (
                <div className="absolute top-6 right-6 bg-emerald-600 text-white text-xs px-4 py-1 rounded-full shadow">
                  {plan.badge}
                </div>
              )}

              {/* Default Tag */}
              {plan.default && (
                <div className='absolute top-6 right-6 bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full'>
                  Default
                </div>
              )}

              {/* plan name */}

              <h3 className='text-xl font-semibold text-gray-800'>
                {plan.name}
              </h3>

              {/* price */}

              <div className='mt-4'>
                <span className='text-3xl font-bold text-emerald-600'>
                  {plan.price}
                </span>

                <p className='text-gray-500 mt-1'>
                  {plan.credits} Credits
                </p>
              </div>

              {/* Description */}
              <p className="text-gray-500 mt-4 text-sm leading-relaxed">
                {plan.description}
              </p>

              {/* Features */}
              <div className="mt-6 space-y-3 text-left">
                {plan.features.map((feature, i) => (
                  <div key={i} className='flex items-center gap-3'>
                    <FaCheckCircle className='text-emerald-500 text-sm' />
                    <span className='text-gray-700 text-sm'>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {!plan.default &&
                <button
                  disabled={loadingPlan === plan.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isSelected) {
                      setSelectedPlan(plan.id);
                    } else {
                      handlePayment(plan)
                    }


                  }} className={`w-full mt-8 py-3 rounded-xl font-semibold transaction ${isSelected
                    ? "bg-emerald-600 text-white hover:opacity"
                    : "bg-gray-100 text-gray-700 hover:bgemerald-50"
                    }`}>

                  {loadingPlan === plan.id
                    ? "Processing..."
                    : isSelected ? "proceed to pay" : "Select Plan"}

                </button>
              }

            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default Pricing
