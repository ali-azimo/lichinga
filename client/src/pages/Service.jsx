// components/Service.jsx
import React from 'react';
import { 
  FaHandshake, 
  FaChartPie, 
  FaFileContract, 
  FaUserTie, 
  FaLightbulb, 
  FaBalanceScale,
  FaCheckCircle,
  FaArrowRight,
  FaWhatsapp,
  FaPhone,
  FaStar,
  FaMapMarkerAlt,
  FaClock,
  FaShieldAlt
} from 'react-icons/fa';

const Service = () => {
  const services = [
    {
      icon: <FaHandshake className="text-4xl text-blue-600" />,
      title: "Avaliação de Imóveis",
      description: "Avaliação profissional do seu imóvel com relatório detalhado de valor de mercado",
      features: [
        "Análise comparativa de mercado",
        "Avaliação técnica do imóvel",
        "Relatório de valorização",
        "Recomendações de melhorias"
      ],
      color: "border-l-4 border-blue-500"
    },
    {
      icon: <FaChartPie className="text-4xl text-green-600" />,
      title: "Consultoria de Investimentos",
      description: "Orientações estratégicas para investir em propriedades com maior potencial",
      features: [
        "Análise de ROI (Retorno sobre Investimento)",
        "Identificação de áreas em crescimento",
        "Estratégias de diversificação",
        "Projeções de valorização"
      ],
      color: "border-l-4 border-green-500"
    },
    {
      icon: <FaFileContract className="text-4xl text-purple-600" />,
      title: "Assistência Jurídica",
      description: "Suporte completo em documentação e processos legais imobiliários",
      features: [
        "Revisão de contratos",
        "Regularização de documentação",
        "Processos de escrituração",
        "Assessoria em negociações"
      ],
      color: "border-l-4 border-purple-500"
    },
    {
      icon: <FaUserTie className="text-4xl text-orange-600" />,
      title: "Gestão de Propriedades",
      description: "Administração completa do seu imóvel para proprietários e investidores",
      features: [
        "Gestão de aluguéis",
        "Manutenção preventiva",
        "Cobrança de rendas",
        "Relatórios financeiros"
      ],
      color: "border-l-4 border-orange-500"
    },
    {
      icon: <FaLightbulb className="text-4xl text-yellow-600" />,
      title: "Projeto e Decoração",
      description: "Serviços de design de interiores para valorizar seu imóvel",
      features: [
        "Projetos arquitetônicos",
        "Decoração de interiores",
        "Consultoria de espaços",
        "Seleção de materiais"
      ],
      color: "border-l-4 border-yellow-500"
    },
    {
      icon: <FaBalanceScale className="text-4xl text-teal-600" />,
      title: "Mediação de Negócios",
      description: "Intermediação profissional em compra, venda e locação de imóveis",
      features: [
        "Negociação estratégica",
        "Mediação de conflitos",
        "Fechamento de contratos",
        "Follow-up pós-venda"
      ],
      color: "border-l-4 border-teal-500"
    }
  ];

  const testimonials = [
    {
      name: "Carlos M.",
      role: "Investidor",
      text: "A consultoria de investimentos transformou minha carteira imobiliária. Retorno excelente!",
      rating: 5
    },
    {
      name: "Ana S.",
      role: "Proprietária",
      text: "O serviço de gestão de propriedades me tirou um grande peso das costas. Profissionais incríveis!",
      rating: 5
    },
    {
      name: "Miguel T.",
      role: "Comprador",
      text: "A assistência jurídica foi fundamental para fechar meu primeiro imóvel com segurança total.",
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-white" id="servicos">
      <div className="max-w-7xl mx-auto px-4">
        {/* Cabeçalho */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Nossos Serviços Especializados
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Oferecemos soluções completas para todas as suas necessidades imobiliárias em Moçambique
          </p>
        </div>

        {/* Serviços */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div 
              key={index}
              className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 ${service.color}`}
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-lg bg-gray-50">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{service.title}</h3>
                </div>
                
                <p className="text-gray-600 mb-6">{service.description}</p>
                
                <ul className="space-y-3 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <FaCheckCircle className="text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center gap-2">
                  <span>Solicitar Orçamento</span>
                  <FaArrowRight />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Por que Escolher Nossos Serviços */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-16">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              Por que Escolher Nossos Serviços?
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Oferecemos uma abordagem única e personalizada para cada cliente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                icon: <FaShieldAlt className="text-2xl text-blue-600" />,
                title: "Segurança Total",
                description: "Garantia em todos os processos"
              },
              {
                icon: <FaClock className="text-2xl text-green-600" />,
                title: "Agilidade",
                description: "Processos otimizados e rápidos"
              },
              {
                icon: <FaMapMarkerAlt className="text-2xl text-purple-600" />,
                title: "Cobertura Nacional",
                description: "Atendimento em todo Moçambique"
              },
              {
                icon: <FaStar className="text-2xl text-orange-600" />,
                title: "Excelência",
                description: "Padrão de qualidade superior"
              }
            ].map((item, index) => (
              <div key={index} className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                  {item.icon}
                </div>
                <h4 className="font-bold text-gray-800 mb-2">{item.title}</h4>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Depoimentos */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              O Que Nossos Clientes Dizem
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Histórias reais de sucesso e satisfação
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Final */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Pronto para Transformar seu Negócio Imobiliário?
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Entre em contato com nossa equipe de especialistas e descubra como podemos ajudar você
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/258841234567"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center gap-3 shadow-lg"
            >
              <FaWhatsapp />
              Falar no WhatsApp
            </a>
            <a
              href="tel:+258841234567"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors duration-300 flex items-center justify-center gap-3"
            >
              <FaPhone />
              Ligar Agora
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Service;