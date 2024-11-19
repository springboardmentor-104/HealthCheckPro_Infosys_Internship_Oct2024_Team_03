// src/components/QuoteSection.jsx
import React, { useState, useEffect } from 'react';
import '../customStyles.css'; // Import custom styles

const quotes = [
    "The greatest wealth is health. - Virgil",
    "Health is not valued until sickness comes. - Thomas Fuller",
    "Take care of your body. It's the only place you have to live. - Jim Rohn",
    "The mind and body are not separate. what affects one, affects the other. - Unknown",
    "Your body hears everything your mind says. - Naomi Judd",
];

const QuoteSection = () => {
    const [currentQuote, setCurrentQuote] = useState(quotes[0]);
    const [quoteIndex, setQuoteIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
        }, 4000); // Change quote every 4 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    useEffect(() => {
        setCurrentQuote(quotes[quoteIndex]);
    }, [quoteIndex]);

    return (
      <section className="quote-section py-10">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Quote of the Day</h2>
          <blockquote className="italic text-gray-600">
            {currentQuote}
          </blockquote>
        </div>
      </section>
    );
};

export default QuoteSection;
