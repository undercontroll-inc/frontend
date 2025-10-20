import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`faq-item mb-6 bg-[#BA4610] text-white p-4 rounded-md shadow-2xl cursor-pointer transition-all duration-300 ${
        isOpen ? "active" : ""
      }`}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="faq-question flex items-center justify-between">
        <h3 className="text-lg">{question}</h3>
        <ChevronDown
          className={`arrow transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>
      <p
        className={`text-white overflow-hidden transition-all duration-300 ${
          isOpen ? "h-fit opacity-100 mt-4" : "max-h-0 opacity-0"
        }`}
      >
        {answer}
      </p>
    </div>
  );
};

export default FAQItem;