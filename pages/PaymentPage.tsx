
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { MOCK_UPI_DETAILS } from '../data/mockData';

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { lastOrder, cartTotal } = useCart();
  const [upiDetails, setUpiDetails] = useState(MOCK_UPI_DETAILS);

  useEffect(() => {
    const storedUpi = localStorage.getItem('renisUpiDetails');
    if (storedUpi) {
      setUpiDetails(JSON.parse(storedUpi));
    }
  }, []);

  if (!lastOrder) {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <h1 className="text-2xl font-bold">No order found to pay for.</h1>
            <button onClick={() => navigate('/products')} className="mt-4 text-white font-semibold border-b-2 border-white pb-1">Start Shopping</button>
        </div>
    );
  }

  const handlePaymentConfirmation = () => {
    navigate(`/confirmation/${lastOrder.id}`);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-2xl text-center">
        <h1 className="text-2xl font-bold mb-2">Complete Your Payment</h1>
        <p className="text-gray-400 mb-6">Scan the QR code using any UPI app.</p>

        <div className="flex justify-center mb-4">
          <img src={upiDetails.qrCodeUrl} alt="UPI QR Code" className="w-56 h-56 rounded-lg bg-white p-2" />
        </div>
        
        <div className="mb-6">
          <p className="text-gray-400">Amount to be paid:</p>
          <p className="text-3xl font-bold tracking-wider">${lastOrder.total.toFixed(2)}</p>
        </div>

        <div className="mb-6">
            <p className="text-gray-400">Or pay to UPI ID:</p>
            <p className="font-semibold text-lg bg-gray-800 py-2 px-4 rounded-md inline-block mt-2">{upiDetails.upiId}</p>
        </div>
        
        <button 
          onClick={handlePaymentConfirmation}
          className="w-full bg-white text-black py-3 px-6 text-lg font-semibold rounded-md hover:bg-gray-200 transition-all duration-300"
        >
          I have completed my payment
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
