import React from 'react';
import { Calendar } from 'lucide-react';

export default function About() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 text-center">
        <div className="w-16 h-16 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <Calendar size={32} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">About Us</h1>
        <p className="text-gray-600 leading-relaxed mb-6">
          Welcome to Next Pet Food! We are dedicated to providing the best nutrition and accessories for your beloved pets. Our mission is to ensure every pet lives a healthy, happy, and fulfilling life.
        </p>
        <p className="text-gray-600 leading-relaxed">
          From premium pet food to expert veterinary consultations, we are your one-stop solution for all pet care needs. Thank you for trusting us with your furry, feathered, and scaled friends!
        </p>
      </div>
    </div>
  );
}
