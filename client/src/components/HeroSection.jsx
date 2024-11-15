import React, { useState, useEffect } from 'react';
import '../customStyles.css'; // Import custom styles
import img1 from '../assets/img1.jpg'; // Import images from assets folder
import img2 from '../assets/img2.jpg';
import img3 from '../assets/img3.jpg';
import img4 from '../assets/img4.jpg';

const HeroSection = () => {
    const slides = [img1, img2, img3, img4]; // Use imported images for the slides
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section id="home" className="hero-section">
            <div className="container mx-auto text-center">
                <h1 className="text-6xl font-bold mb-4 text-blue-700">Welcome to HealthCheck Pro</h1>
                <p className="text-lg mb-8 text-gray-700">Your health is our priority. Get examined today "Digitally" to know your health.</p>
                <button className="hero-section-button">Get Examined</button>
            </div>
            <div className="carousel mt-8">
                {slides.map((slide, index) => (
                    <img
                        key={index}
                        src={slide}
                        alt={`Slide ${index + 1}`}
                        className={`transition-transform duration-500 ease-in-out ${currentSlide === index ? 'block' : 'hidden'}`}
                    />
                ))}
            </div>
        </section>
    );
};

export default HeroSection;
