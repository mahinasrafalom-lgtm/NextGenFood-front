import React from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

export default function Faq() {
  const faqs = [
    {
      question: "How long does delivery take?",
      answer: "We offer next-day delivery for all orders placed before 4 PM within Dhaka. Outside Dhaka, delivery typically takes 2-3 business days."
    },
    {
      question: "What is your return policy?",
      answer: "You can return any unopened and undamaged product within 7 days of delivery for a full refund or exchange. Please contact our support team to initiate a return."
    },
    {
      question: "Are your veterinary consultations done by real doctors?",
      answer: "Yes! All of our consultations are handled by certified, professional veterinarians with years of experience."
    },
    {
      question: "How do I track my order?",
      answer: "Once your order is shipped, you will receive an SMS with a tracking link. You can also use the 'Track Order' button at the top of the website."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center mb-6">
            <HelpCircle size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            Find answers to common questions about our products, delivery, and services below.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-100 rounded-xl p-5 hover:border-brand-primary/30 transition-colors">
              <h3 className="font-bold text-gray-900 mb-2 flex items-center justify-between">
                {faq.question}
                <ChevronDown size={18} className="text-gray-400" />
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed pr-6">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
