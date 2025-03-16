import { Truck, ShieldCheck, Beaker } from "lucide-react";

interface CompanyIntroProps {
  language?: "en" | "hi";
}

export function CompanyIntro({ language = "en" }: CompanyIntroProps) {
  const content = {
    en: {
      title: "Welcome to Shivanshi Enterprises",
      description: "We are a trusted PAN India supplier of high-quality chemicals and compounds serving industries across India. With a commitment to quality and customer satisfaction, we provide reliable solutions for all your chemical and compound needs.",
      features: [
        {
          icon: <Beaker className="text-2xl text-primary" />,
          title: "Premium Chemicals",
          description: "We source and supply only the highest quality chemicals and compounds from trusted manufacturers with verified purity and specifications."
        },
        {
          icon: <ShieldCheck className="text-2xl text-primary" />,
          title: "Safety Assured",
          description: "All our products are handled with proper safety protocols and come with complete documentation and safety data sheets."
        },
        {
          icon: <Truck className="text-2xl text-primary" />,
          title: "Pan India Delivery",
          description: "We ensure quick and reliable delivery of all products across India with proper handling and transportation of hazardous materials."
        }
      ]
    },
    hi: {
      title: "शिवांशी एंटरप्राइजेज में आपका स्वागत है",
      description: "हम पूरे भारत में उद्योगों की सेवा करने वाले उच्च गुणवत्ता वाले रसायनों और यौगिकों के विश्वसनीय पैन इंडिया आपूर्तिकर्ता हैं। गुणवत्ता और ग्राहक संतुष्टि के प्रति प्रतिबद्धता के साथ, हम आपकी सभी रासायनिक और यौगिक आवश्यकताओं के लिए विश्वसनीय समाधान प्रदान करते हैं।",
      features: [
        {
          icon: <Beaker className="text-2xl text-primary" />,
          title: "प्रीमियम रसायन",
          description: "हम सत्यापित शुद्धता और विनिर्देशों के साथ विश्वसनीय निर्माताओं से केवल उच्चतम गुणवत्ता वाले रसायनों और यौगिकों का स्रोत और आपूर्ति करते हैं।"
        },
        {
          icon: <ShieldCheck className="text-2xl text-primary" />,
          title: "सुरक्षा सुनिश्चित",
          description: "हमारे सभी उत्पादों को उचित सुरक्षा प्रोटोकॉल के साथ संभाला जाता है और पूर्ण दस्तावेज़ीकरण और सुरक्षा डेटा शीट के साथ आते हैं।"
        },
        {
          icon: <Truck className="text-2xl text-primary" />,
          title: "पैन इंडिया डिलीवरी",
          description: "हम खतरनाक सामग्रियों के उचित हैंडलिंग और परिवहन के साथ पूरे भारत में सभी उत्पादों की त्वरित और विश्वसनीय डिलीवरी सुनिश्चित करते हैं।"
        }
      ]
    }
  };
  
  const currentContent = language === "en" ? content.en : content.hi;
  
  return (
    <section className="py-16 bg-white dark:bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{currentContent.title}</h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
          <p className="max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
            {currentContent.description}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {currentContent.features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md text-center translate-effect"
            >
              <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}