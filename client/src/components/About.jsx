import React from 'react';
import { 
  FaHistory, 
  FaBullseye, 
  FaUsers, 
  FaHandshake,
  FaAward,
  FaChartLine,
  FaHome,
  FaHeart,
  FaEye,
  FaKey 
} from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function About() {
  const milestones = [
    { year: '2016', title: 'Fundação', description: 'Easy-Home nasce em Lichinga com uma visão inovadora.' },
    { year: '2018', title: 'Primeiro Milhão', description: 'Alcançamos 1 milhão em transações imobiliárias.' },
    { year: '2020', title: 'Expansão Digital', description: 'Lançamento da plataforma online completa.' },
    { year: '2022', title: 'Prêmio Excelência', description: 'Reconhecidos como melhor imobiliária da região.' },
    { year: '2023', title: '500+ Clientes', description: 'Superamos a marca de 500 clientes satisfeitos.' },
    { year: '2024', title: 'Inovação Contínua', description: 'Implementamos realidade virtual para tours.' }
  ];

  const missionValues = [
    {
      icon: <FaBullseye className="text-3xl text-blue-500" />,
      title: 'Missão',
      description: 'Conectar pessoas aos seus lares perfeitos através de um serviço transparente, eficiente e humano.'
    },
    {
      icon: <FaEye className="text-3xl text-green-500" />,
      title: 'Visão',
      description: 'Ser a imobiliária de referência em Moçambique, reconhecida pela excelência e inovação.'
    },
    {
      icon: <FaHeart className="text-3xl text-red-500" />,
      title: 'Valores',
      description: 'Integridade, transparência, excelência, paixão pelo cliente e inovação constante.'
    }
  ];

  const services = [
    {
      title: 'Compra e Venda',
      description: 'Acompanhamos todo o processo de transação imobiliária.',
      icon: <FaHome />
    },
    {
      title: 'Arrendamento',
      description: 'Gestão completa de propriedades para arrendamento.',
      icon: <FaKey />
    },
    {
      title: 'Avaliações',
      description: 'Avaliação profissional e justa do seu imóvel.',
      icon: <FaChartLine />
    },
    {
      title: 'Consultoria',
      description: 'Aconselhamento especializado para investimentos.',
      icon: <FaUsers />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Sobre a <span className="text-blue-600">Easy-Home</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Há mais de 8 anos transformando o mercado imobiliário de Lichinga com inovação, 
            transparência e paixão pelo que fazemos.
          </p>
          <div className="inline-flex items-center space-x-2 bg-blue-50 px-6 py-3 rounded-full">
            <FaAward className="text-yellow-500" />
            <span className="text-blue-700 font-medium">Imobiliária Confiável desde 2016</span>
          </div>
        </motion.div>

        {/* Nossa História */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <FaHistory className="text-3xl text-blue-500 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Nossa História</h2>
              </div>
              <p className="text-gray-600 mb-4">
                A Easy-Home nasceu em 2016 em Lichinga, Niassa, com uma visão simples mas poderosa: 
                tornar o processo de compra, venda e arrendamento de imóveis mais transparente, 
                eficiente e humano.
              </p>
              <p className="text-gray-600 mb-4">
                Começamos como uma pequena equipe apaixonada pelo setor imobiliário local. 
                Com o tempo, fomos crescendo graças à confiança dos nossos clientes e ao nosso 
                compromisso com a excelência.
              </p>
              <p className="text-gray-600">
                Hoje, somos uma referência no mercado imobiliário da região, 
                combinando experiência local com tecnologia de ponta para oferecer 
                o melhor serviço possível.
              </p>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-64 rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=400&fit=crop"
                  alt="História Easy-Home"
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl w-3/4">
                <div className="text-4xl font-bold text-blue-600 mb-2">8+</div>
                <div className="text-lg font-medium text-gray-900">Anos de Experiência</div>
                <div className="text-gray-600 text-sm">No mercado imobiliário de Lichinga</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Linha do Tempo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Nossa <span className="text-blue-600">Jornada</span>
          </h2>
          <div className="relative">
            {/* Linha central */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200"></div>
            
            {/* Marcos */}
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * (index + 1) }}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'justify-start' : 'justify-end'
                  }`}
                >
                  {/* Ponto na linha */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-lg z-10"></div>
                  
                  {/* Conteúdo */}
                  <div className={`w-5/12 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12'}`}>
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                      <div className="text-2xl font-bold text-blue-600 mb-2">{milestone.year}</div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Missão, Visão e Valores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Nossa <span className="text-blue-600">Essência</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {missionValues.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * (index + 1) }}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center"
              >
                <div className="inline-block p-4 bg-gray-50 rounded-full mb-6">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Nossos Serviços */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            O Que <span className="text-blue-600">Oferecemos</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
              >
                <div className="text-blue-500 mb-4 text-2xl">
                  {service.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Compromisso */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <FaHandshake className="text-5xl mb-4" />
              <h3 className="text-2xl font-bold mb-4">Nosso Compromisso</h3>
              <p className="text-blue-100 max-w-2xl">
                Estamos comprometidos em fornecer um serviço excepcional, baseado na confiança, 
                transparência e dedicação total aos nossos clientes. Cada propriedade é única, 
                e cada cliente merece atenção personalizada.
              </p>
            </div>
            <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-blue-200">Famílias Felizes</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}