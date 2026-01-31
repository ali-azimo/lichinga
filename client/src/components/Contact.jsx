import React, { useState } from 'react';
import { 
  FaPhone, 
  FaWhatsapp, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaClock,
  FaPaperPlane,
  FaUser,
  FaBuilding
} from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simular envio do formulário
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitMessage('Mensagem enviada com sucesso! Entraremos em contacto em breve.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      setTimeout(() => setSubmitMessage(''), 5000);
    } catch (error) {
      setSubmitMessage('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <FaPhone className="text-2xl text-blue-500" />,
      title: 'Telefone',
      details: ['+258 84 431 4455', '+258 82 453 3491'],
      color: 'bg-blue-50'
    },
    {
      icon: <FaWhatsapp className="text-2xl text-green-500" />,
      title: 'WhatsApp',
      details: ['84 431 4455'],
      action: 'https://wa.me/258844314455',
      color: 'bg-green-50'
    },
    {
      icon: <FaEnvelope className="text-2xl text-red-500" />,
      title: 'Email',
      details: ['niassa-house@gmail.com', 'suporte@easy-home.co.mz'],
      color: 'bg-red-50'
    },
    {
      icon: <FaMapMarkerAlt className="text-2xl text-purple-500" />,
      title: 'Endereço',
      details: ['Av. Samora Machel, Nº 123', 'Lichinga, Niassa - Moçambique'],
      color: 'bg-purple-50'
    },
    {
      icon: <FaClock className="text-2xl text-orange-500" />,
      title: 'Horário de Funcionamento',
      details: ['Segunda - Sexta: 8:00 - 18:00', 'Sábado: 9:00 - 13:00', 'Domingo: Fechado'],
      color: 'bg-orange-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Entre em <span className="text-blue-600">Contacto</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Estamos aqui para ajudar você a encontrar o lar perfeito. Entre em contacto connosco!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informações de Contacto */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FaBuilding className="mr-2 text-blue-600" />
                Informações de Contacto
              </h2>
              
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * (index + 1) }}
                    className={`p-4 rounded-xl ${info.color} border border-gray-100`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-white rounded-lg shadow-sm">
                        {info.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-2">{info.title}</h3>
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-gray-700">
                            {detail}
                          </p>
                        ))}
                        {info.action && (
                          <a
                            href={info.action}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                          >
                            Enviar Mensagem
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Mapa */}
              <div className="mt-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Localização</h3>
                <div className="h-64 bg-gray-200 rounded-xl overflow-hidden">
                  <iframe
                    title="Localização Easy-Home"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.556472693896!2d35.2406!3d-13.3124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDE4JzQ0LjYiUyAzNcKwMTQ'MjYuMiJF!5e0!3m2!1spt-PT!2smz!4v1641234567890!5m2!1spt-PT!2smz"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Formulário de Contacto */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Envie-nos uma Mensagem
                </h2>
                <p className="text-gray-600">
                  Preencha o formulário abaixo e entraremos em contacto consigo o mais breve possível.
                </p>
              </div>

              {submitMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-6 p-4 rounded-lg ${
                    submitMessage.includes('sucesso') 
                      ? 'bg-green-50 text-green-800 border border-green-200' 
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {submitMessage}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      <FaUser className="inline mr-2 text-gray-400" />
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      <FaEnvelope className="inline mr-2 text-gray-400" />
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      <FaPhone className="inline mr-2 text-gray-400" />
                      Telefone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="+258 84 000 0000"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Assunto *
                    </label>
                    <select
                      id="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="">Selecione um assunto</option>
                      <option value="consulta">Consulta sobre propriedade</option>
                      <option value="venda">Quero vender/arrendar</option>
                      <option value="visita">Agendar visita</option>
                      <option value="duvida">Dúvida geral</option>
                      <option value="parceria">Parceria comercial</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Mensagem *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows="6"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    placeholder="Descreva a sua mensagem em detalhes..."
                  />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <p className="text-sm text-gray-500">
                    * Campos obrigatórios
                  </p>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="mr-2" />
                        Enviar Mensagem
                      </>
                    )}
                  </motion.button>
                </div>
              </form>

              {/* FAQ Rápido */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Perguntas Frequentes</h3>
                <div className="space-y-4">
                  {[
                    {
                      q: 'Quanto tempo leva para receber uma resposta?',
                      a: 'Normalmente respondemos em até 24 horas úteis.'
                    },
                    {
                      q: 'Posso agendar uma visita virtual?',
                      a: 'Sim, oferecemos tours virtuais para todas as propriedades.'
                    },
                    {
                      q: 'Cobram comissão pelos serviços?',
                      a: 'Somente para o vendedor/arrendador. Para compradores é gratuito.'
                    }
                  ].map((faq, idx) => (
                    <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-medium text-gray-900 mb-1">{faq.q}</p>
                      <p className="text-gray-600 text-sm">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}