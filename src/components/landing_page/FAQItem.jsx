import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`faq-item mb-6 rounded-xl shadow-lg cursor-pointer transition-all duration-300 overflow-hidden ${
        isOpen ? "active" : ""
      }`}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="faq-question bg-gradient-to-r from-[#BA4610] to-[#d45012] text-white p-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{question}</h3>
        <ChevronDown
          className={`arrow transition-transform duration-300 flex-shrink-0 ml-4 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>
      <div
        className={`bg-white text-gray-800 transition-all duration-300 ${
          isOpen ? "max-h-96 p-4" : "max-h-0"
        } overflow-hidden`}
      >
        <p className="leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

export default FAQItem;