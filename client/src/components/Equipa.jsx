import React from 'react';
import { 
  FaCode, 
  FaChartLine, 
  FaBullhorn, 
  FaLaptopCode,
  FaEnvelope,
  FaPhone,
  FaLinkedin,
  FaStar,
  FaHandshake,
  FaAward,
  FaHome,
  FaLightbulb
} from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Equipa() {
  const teamMembers = [
    {
      id: 1,
      name: 'Patricio Clemente Chapelemo',
      role: 'Programador & Contabilista',
      description: 'Especialista em desenvolvimento de software e gestão financeira. Responsável pela infraestrutura tecnológica e análise financeira da Easy-Home.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      skills: ['Desenvolvimento', 'Finanças', 'Análise de Dados', 'Sistemas'],
      contact: {
        email: 'patricio@easy-home.co.mz',
        phone: '+258 84 431 4455',
        linkedin: '#'
      },
      icon: <FaCode className="text-blue-500" />
    },
    {
      id: 2,
      name: 'Virgilio Mario Massamba',
      role: 'Especialista em Marketing',
      description: 'Responsável pela estratégia de marketing digital e presencial da Easy-Home. Foco em branding e expansão da marca na região de Niassa.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      skills: ['Marketing Digital', 'Branding', 'Redes Sociais', 'Estratégia'],
      contact: {
        email: 'virgilio@easy-home.co.mz',
        phone: '+258 82 453 3491',
        linkedin: '#'
      },
      icon: <FaBullhorn className="text-green-500" />
    },
    {
      id: 3,
      name: 'Ali Azimo',
      role: 'Programador Fullstack',
      description: 'Desenvolvedor fullstack com experiência em criação de plataformas web modernas. Responsável pelo desenvolvimento e manutenção do site.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
      skills: ['Frontend', 'Backend', 'UI/UX', 'DevOps'],
      contact: {
        email: 'ali@easy-home.co.mz',
        phone: '+258 84 321 6547',
        linkedin: '#'
      },
      icon: <FaLaptopCode className="text-purple-500" />
    }
  ];

  const values = [
    {
      icon: <FaHandshake className="text-2xl text-blue-500" />,
      title: 'Transparência',
      description: 'Honestidade em todas as transações'
    },
    {
      icon: <FaAward className="text-2xl text-green-500" />,
      title: 'Excelência',
      description: 'Qualidade em cada detalhe'
    },
    {
      icon: <FaHome className="text-2xl text-purple-500" />,
      title: 'Compromisso',
      description: 'Dedicação aos nossos clientes'
    },
    {
      icon: <FaLightbulb className="text-2xl text-orange-500" />,
      title: 'Inovação',
      description: 'Soluções tecnológicas modernas'
    }
  ];

  const stats = [
    { value: '3', label: 'Especialistas' },
    { value: '8+', label: 'Anos Combinados' },
    { value: '500+', label: 'Clientes Atendidos' },
    { value: '100%', label: 'Satisfação' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Nossa <span className="text-blue-600">Equipa</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            A equipa por trás da Easy-Home. Profissionais dedicados a ajudar você a encontrar o lar perfeito em Lichinga.
          </p>
          <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
            <FaStar className="text-yellow-500" />
            <span className="text-blue-700 font-medium">Especialistas em Imóveis</span>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-4 rounded-xl shadow-sm border text-center">
              <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Valores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Nossos <span className="text-blue-600">Valores</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow-sm border text-center hover:shadow-md transition-shadow"
              >
                <div className="inline-block p-3 bg-gray-50 rounded-lg mb-3">
                  {value.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{value.title}</h3>
                <p className="text-sm text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Equipa */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Conheça a <span className="text-blue-600">Equipa</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
                className="bg-white rounded-xl shadow-lg overflow-hidden border hover:shadow-xl transition-shadow"
              >
                
                {/* Imagem */}
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      {member.icon}
                    </div>
                  </div>
                </div>

                {/* Informações */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                    <p className="text-blue-600 font-medium">{member.role}</p>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">{member.description}</p>

                  {/* Habilidades */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Habilidades:</h4>
                    <div className="flex flex-wrap gap-2">
                      {member.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Contactos */}
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex justify-center gap-4">
                      <a
                        href={`mailto:${member.contact.email}`}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Email"
                      >
                        <FaEnvelope />
                      </a>
                      <a
                        href={`tel:${member.contact.phone}`}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                        title="Telefone"
                      >
                        <FaPhone />
                      </a>
                      <a
                        href={member.contact.linkedin}
                        className="p-2 text-gray-400 hover:text-blue-700 transition-colors"
                        title="LinkedIn"
                      >
                        <FaLinkedin />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-blue-50 to-white p-8 rounded-xl shadow-lg border">
            <FaChartLine className="text-4xl text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Precisa de Ajuda?
            </h3>
            <p className="text-gray-600 max-w-xl mx-auto mb-6">
              Nossa equipa está pronta para ajudá-lo a encontrar a propriedade perfeita em Lichinga.
            </p>
            <a 
              href="/contact" 
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Contactar Equipa
            </a>
          </div>
        </motion.div>

      </div>
    </div>
  );
}