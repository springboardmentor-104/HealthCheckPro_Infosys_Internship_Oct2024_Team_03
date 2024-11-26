import React from 'react';
import '../customStyles.css';  // Import customStyles.css from the src folder

const articles = [
  {
    title: "Understanding Nutrition: A Comprehensive Guide",
    description:
      "Learn the basics of nutrition and how it affects your health.",
    link: "#",
  },
  {
    title: "The Importance of Regular Exercise",
    description:
      "Discover the benefits of staying active and how to incorporate exercise into your daily routine.",
    link: "#",
  },
  {
    title: "Mental Health Awareness: Breaking the Stigma",
    description:
      "Explore the importance of mental health and ways to support yourself and others.",
    link: "#",
  },
  {
    title: "Healthy Eating Habits for a Better Life",
    description:
      "Tips and tricks for developing healthy eating habits that last.",
    link: "#",
  },
  {
    title: "Sleep: The Key to a Healthy Lifestyle",
    description:
      "Understand the importance of sleep and how to improve your sleep quality.",
    link: "#",
  },
  {
    title: "Mental Health Awareness: Breaking the Stigma",
    description:
      "Explore the importance of mental health and ways to support yourself and others.",
    link: "#",
  }
];

const ArticlesSection = () => {
    return (
        <section className="articles-section">
            <div className="container mx-auto">
                <h2 className="text-2xl font-bold mb-4">Latest Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {articles.map((article, index) => (
                        <div key={index} className="article-card">
                            <h3 className="font-semibold text-lg">{article.title}</h3>
                            <p className="text-gray-600 mb-2">{article.description}</p>
                            <a href={article.link} className="text-blue-500 hover:underline">
                                Read More
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ArticlesSection;
