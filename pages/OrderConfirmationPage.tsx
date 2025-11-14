
import React from 'react';
import { useParams, Link } from 'react-router-dom';

const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <div className="max-w-2xl mx-auto">
        <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">Thank You For Your Order!</h1>
        <p className="mt-4 text-gray-300">
          Your order <span className="font-semibold text-white">#{orderId}</span> has been placed successfully.
        </p>
        <p className="mt-2 text-gray-400">
          We are now awaiting payment confirmation. You will receive a notification once your payment is verified and your order is processed.
        </p>
        <Link 
          to="/products" 
          className="mt-8 inline-block bg-white text-black px-8 py-3 text-lg font-semibold rounded-md hover:bg-gray-200 transition-all duration-300"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
