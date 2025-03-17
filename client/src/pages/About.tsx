import { useState } from "react";
import { Layout } from "@/components/layouts/Layout";
import { CTASection } from "@/components/sections/CTASection";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CheckCircle } from "lucide-react";

export default function About() {
  const [language, setLanguage] = useState<"en" | "hi">("en");
  
  const content = {
    en: {
      title: "About Shivanshi Enterprises",
      subtitle: "Your Trusted Partner in Chemicals & Compounds",
      intro: "Shivanshi Enterprises has been a leading supplier of high-quality chemicals and compounds. We take pride in offering exceptional products and services to businesses across India.",
      mission: {
        title: "Our Mission",
        text: "To provide reliable chemicals and compounds with exceptional service that empowers businesses to achieve operational excellence."
      },
      vision: {
        title: "Our Vision",
        text: "To be the most trusted partner for chemical solutions, known for quality, reliability, and customer satisfaction."
      },
      values: {
        title: "Our Values",
        items: [
          "Quality: We source only the best chemicals from reputable manufacturers",
          "Integrity: We conduct our business with honesty and transparency",
          "Service: We are committed to exceeding customer expectations",
          "Safety: We prioritize safety in all our chemical handling and delivery processes",
          "Expertise: We provide specialized knowledge and solutions"
        ]
      },
      commitment: {
        title: "Our Commitment",
        text: "At Shivanshi Enterprises, we are committed to ensuring that our customers receive the highest quality chemicals and compounds. We understand the critical role that reliable and pure chemicals play in your business operations, and we strive to be your trusted partner in meeting those needs."
      },
      contactButton: "Contact Us"
    },
    hi: {
      title: "शिवांशी एंटरप्राइजेज के बारे में",
      subtitle: "रसायन और यौगिकों में आपका विश्वसनीय साथी",
      intro: "शिवांशी एंटरप्राइजेज उच्च-गुणवत्ता वाले रसायनों और यौगिकों का अग्रणी आपूर्तिकर्ता रहा है। हम पूरे भारत में व्यवसायों को असाधारण उत्पाद और सेवाएं प्रदान करने पर गर्व करते हैं।",
      mission: {
        title: "हमारा मिशन",
        text: "विश्वसनीय रसायन और यौगिक प्रदान करना जो व्यवसायों को परिचालन उत्कृष्टता प्राप्त करने के लिए सशक्त बनाती है।"
      },
      vision: {
        title: "हमारी विजन",
        text: "गुणवत्ता, विश्वसनीयता और ग्राहक संतुष्टि के लिए जाना जाने वाला रासायनिक समाधानों के लिए सबसे विश्वसनीय भागीदार बनना।"
      },
      values: {
        title: "हमारे मूल्य",
        items: [
          "गुणवत्ता: हम केवल प्रतिष्ठित निर्माताओं से सर्वोत्तम उत्पाद प्राप्त करते हैं",
          "अखंडता: हम अपना व्यवसाय ईमानदारी और पारदर्शिता के साथ करते हैं",
          "सेवा: हम ग्राहक अपेक्षाओं से अधिक करने के लिए प्रतिबद्ध हैं",
          "नवाचार: हम बदलती बाजार की जरूरतों को पूरा करने के लिए लगातार विकसित होते हैं",
          "विशेषज्ञता: हम विशेष ज्ञान और समाधान प्रदान करते हैं"
        ]
      },
      commitment: {
        title: "हमारी प्रतिबद्धता",
        text: "शिवांशी एंटरप्राइजेज में, हम यह सुनिश्चित करने के लिए प्रतिबद्ध हैं कि हमारे ग्राहकों को उच्चतम गुणवत्ता वाले उत्पाद और सेवाएं प्राप्त हों। हम आपके व्यावसायिक संचालन में विश्वसनीय उपकरणों की महत्वपूर्ण भूमिका को समझते हैं, और हम उन आवश्यकताओं को पूरा करने में आपका विश्वसनीय भागीदार बनने का प्रयास करते हैं।"
      },
      contactButton: "संपर्क करें"
    }
  };
  
  const currentContent = language === "en" ? content.en : content.hi;
  
  return (
    <Layout>
      <div className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">{currentContent.title}</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {currentContent.subtitle}
            </p>
          </div>
          
          <div className="bg-white dark:bg-card p-8 rounded-lg shadow-md mb-12">
            <p className="text-lg mb-8 leading-relaxed">
              {currentContent.intro}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">{currentContent.mission.title}</h2>
                <p>{currentContent.mission.text}</p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">{currentContent.vision.title}</h2>
                <p>{currentContent.vision.text}</p>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">{currentContent.values.title}</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentContent.values.items.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-4">{currentContent.commitment.title}</h2>
              <p className="mb-6">{currentContent.commitment.text}</p>
              
              <div className="text-center mt-8">
                <Link href="/contact">
                  <Button className="bg-primary hover:bg-primary/90 text-white">
                    {currentContent.contactButton}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <CTASection language={language} />
    </Layout>
  );
}
