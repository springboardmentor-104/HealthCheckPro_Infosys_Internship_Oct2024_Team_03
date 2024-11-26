import React, { useState } from 'react';
import '../customStyles.css'; // Import custom styles

const InputSection = () => {
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle the input submission (e.g., send to an API)
        console.log('User Input:', input);
        setInput('');
    };

    return (
        <section className="input-section py-10 ">
            <div className="container mx-auto">
                <h2 className="text-2xl font-bold mb-4">Your Health Queries</h2>
                <form onSubmit={handleSubmit} className="flex">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a question..."
                        className="input-field flex-grow p-2 border border-gray-300 rounded-l"
                    />
                    <button type="submit" className="submit-btn bg-blue-500 text-white p-2 rounded-r">
                        Submit
                    </button>
                </form>
            </div>
        </section>
    );
};

export default InputSection;
