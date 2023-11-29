// AboutPage.js

import React from "react";

const AboutPage = () => {
  return (
    <div className="container mx-auto my-8 p-4">
      <header>
        <h1 className="text-3xl font-bold mb-4">About Us</h1>
      </header>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
        <p>
          Welcome to LearnCraft, where we are committed to providing
          high-quality education in a flexible and accessible manner. Our
          mission is to empower learners worldwide by offering a diverse range
          of courses taught by experienced instructors.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">What Sets Us Apart</h2>
        <p>
          At LearnCraft, we believe in the transformative power of education.
          Here are some key features that set us apart:
        </p>
        <ul className="list-disc pl-4">
          <li>Wide range of courses covering various subjects.</li>
          <li>Engaging and interactive learning materials.</li>
          <li>Expert instructors with real-world experience.</li>
          <li>Flexible scheduling to accommodate different learning styles.</li>
          <li>Robust discussion forums for collaborative learning.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
        <p>
          Have questions or suggestions? We'd love to hear from you! Contact our
          support team at-
          <a className="text-[#0689b6]" href="mailto:support@learncraft.com">
            support@learncraft.com
          </a>
          .
        </p>
      </section>

      <footer className="text-center">
        <p className="text-gray-600">
          &copy; 2023 LearnCraft. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default AboutPage;
