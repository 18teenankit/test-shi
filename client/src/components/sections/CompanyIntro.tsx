import { Medal, Headset, Truck } from "lucide-react";

interface CompanyIntroProps {
  language?: "en" | "hi";
}

export function CompanyIntro({ language = "en" }: CompanyIntroProps) {
  const content = {
    en: {
      title: "Welcome to Shivanshi Enterprises",
      description: "We are a leading supplier of industrial equipment, electric motors, and power tools serving businesses across India. With a commitment to quality and customer satisfaction, we provide reliable solutions for all your industrial needs.",
      features: [
        {
          icon: <Medal className="text-2xl text-primary" />,
          title: "Quality Products",
          description: "We source and supply only the highest quality industrial equipment and tools from trusted manufacturers."
        },
        {
          icon: <Headset className="text-2xl text-primary" />,
          title: "Expert Support",
          description: "Our team of experts is always ready to help you find the right solutions for your specific requirements."
        },
        {
          icon: <Truck className="text-2xl text-primary" />,
          title: "Fast Delivery",
          description: "We ensure quick and reliable delivery of all products to minimize downtime for your business."
        }
      ]
    },
    hi: {
      title: "शिवांशी एंटरप्राइजेज में आपका स्वागत है",
      description: "हम औद्योगिक उपकरण, इलेक्ट्रिक मोटर्स और पावर टूल्स के अग्रणी आपूर्तिकर्ता हैं जो पूरे भारत में व्यवसायों की सेवा करते हैं। गुणवत्ता और ग्राहक संतुष्टि के प्रति प्रतिबद्धता के साथ, हम आपकी सभी औद्योगिक आवश्यकताओं के लिए विश्वसनीय समाधान प्रदान करते हैं।",
      features: [
        {
          icon: <Medal className="text-2xl text-primary" />,
          title: "गुणवत्तापूर्ण उत्पाद",
          description: "हम विश्वसनीय निर्माताओं से केवल उच्चतम गुणवत्ता वाले औद्योगिक उपकरण और उपकरण प्राप्त करते हैं और आपूर्ति करते हैं।"
        },
        {
          icon: <Headset className="text-2xl text-primary" />,
          title: "विशेषज्ञ सहायता",
          description: "हमारी विशेषज्ञों की टीम आपकी विशिष्ट आवश्यकताओं के लिए सही समाधान खोजने में मदद करने के लिए हमेशा तैयार है।"
        },
        {
          icon: <Truck className="text-2xl text-primary" />,
          title: "तेज़ डिलीवरी",
          description: "हम आपके व्यवसाय के लिए डाउनटाइम को कम करने के लिए सभी उत्पादों की त्वरित और विश्वसनीय डिलीवरी सुनिश्चित करते हैं।"
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
