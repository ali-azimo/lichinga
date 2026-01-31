import React, { useState } from 'react';
import { 
  FaFileContract, 
  FaShieldAlt, 
  FaLock, 
  FaUserCheck,
  FaBalanceScale,
  FaExclamationTriangle,
  FaCheckCircle,
  FaQuestionCircle
} from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function TermS() {
  const [activeSection, setActiveSection] = useState('uso');

  const termsSections = [
    {
      id: 'uso',
      title: 'Termos de Uso',
      icon: <FaFileContract />,
      content: [
        {
          subtitle: 'Aceitação dos Termos',
          text: 'Ao acessar e usar a plataforma Easy-Home, você concorda em cumprir estes Termos de Uso.'
        },
        {
          subtitle: 'Uso Permitido',
          text: 'A plataforma destina-se apenas para fins legítimos de busca, compra, venda e arrendamento de propriedades.'
        },
        {
          subtitle: 'Restrições',
          text: 'É proibido usar a plataforma para atividades fraudulentas, spam ou qualquer uso que viole leis aplicáveis.'
        }
      ]
    },
    {
      id: 'privacidade',
      title: 'Política de Privacidade',
      icon: <FaLock />,
      content: [
        {
          subtitle: 'Coleta de Dados',
          text: 'Coletamos informações necessárias para fornecer nossos serviços, incluindo dados de contacto e preferências de busca.'
        },
        {
          subtitle: 'Uso dos Dados',
          text: 'Seus dados são utilizados apenas para fornecer nossos serviços, melhorar a plataforma e comunicação relacionada.'
        },
        {
          subtitle: 'Segurança',
          text: 'Implementamos medidas de segurança para proteger suas informações contra acesso não autorizado.'
        }
      ]
    },
    {
      id: 'cookies',
      title: 'Política de Cookies',
      icon: <FaShieldAlt />,
      content: [
        {
          subtitle: 'O que são Cookies',
          text: 'Cookies são pequenos arquivos armazenados no seu dispositivo para melhorar sua experiência na plataforma.'
        },
        {
          subtitle: 'Tipos de Cookies',
          text: 'Utilizamos cookies essenciais, funcionais e analíticos para operação e melhoria do serviço.'
        },
        {
          subtitle: 'Controle',
          text: 'Você pode controlar as configurações de cookies através do seu navegador a qualquer momento.'
        }
      ]
    },
    {
      id: 'responsabilidade',
      title: 'Limitação de Responsabilidade',
      icon: <FaBalanceScale />,
      content: [
        {
          subtitle: 'Informações das Propriedades',
          text: 'As informações sobre propriedades são fornecidas pelos anunciantes e não garantimos sua precisão absoluta.'
        },
        {
          subtitle: 'Transações',
          text: 'Não nos responsabilizamos por transações entre usuários, atuando apenas como intermediários.'
        },
        {
          subtitle: 'Disponibilidade',
          text: 'Não garantimos disponibilidade contínua da plataforma e podemos realizar manutenções sem aviso prévio.'
        }
      ]
    }
  ];

  const faqs = [
    {
      question: 'Como posso denunciar um anúncio inadequado?',
      answer: 'Utilize o botão de denúncia disponível em cada anúncio ou contacte-nos diretamente.'
    },
    {
      question: 'Posso cancelar minha conta a qualquer momento?',
      answer: 'Sim, você pode solicitar o cancelamento da sua conta através das configurações da conta.'
    },
    {
      question: 'Como funcionam as comissões?',
      answer: 'As comissões são acordadas diretamente entre as partes envolvidas na transação.'
    },
    {
      question: 'Quais são os métodos de pagamento aceitos?',
      answer: 'Aceitamos transferências bancárias, depósitos e outros métodos acordados entre as partes.'
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
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
            <FaFileContract className="text-3xl text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Termos e <span className="text-blue-600">Condições</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Conheça as regras e políticas que regem o uso da plataforma Easy-Home.
          </p>
          <div className="mt-6 text-sm text-gray-500">
            Última atualização: 15 de Janeiro de 2024
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Menu Lateral */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Conteúdo</h3>
              <nav className="space-y-2">
                {termsSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`
                      w-full text-left flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                      ${activeSection === section.id
                        ? 'bg-blue-50 text-blue-600 border border-blue-100'
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    <span className="text-gray-400">{section.icon}</span>
                    <span className="font-medium">{section.title}</span>
                  </button>
                ))}
              </nav>

              {/* Aviso Importante */}
              <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <FaExclamationTriangle className="text-yellow-500 mb-2" />
                <p className="text-sm text-yellow-800">
                  Ao usar nossa plataforma, você aceita todos os termos e condições aqui descritos.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Conteúdo Principal */}
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Cabeçalho da Seção */}
              <div className="flex items-center mb-8">
                {termsSections.find(s => s.id === activeSection)?.icon}
                <h2 className="text-2xl font-bold text-gray-900 ml-3">
                  {termsSections.find(s => s.id === activeSection)?.title}
                </h2>
              </div>

              {/* Conteúdo da Seção */}
              <div className="space-y-8">
                {termsSections
                  .find(s => s.id === activeSection)
                  ?.content.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * (index + 1) }}
                      className="pb-6 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-start">
                        <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-2">
                            {item.subtitle}
                          </h3>
                          <p className="text-gray-600">{item.text}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>

              {/* Avisos Específicos */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-12 p-6 bg-blue-50 rounded-xl"
              >
                <div className="flex items-start">
                  <FaUserCheck className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Seus Direitos e Deveres
                    </h3>
                    <ul className="text-gray-600 space-y-2">
                      <li>• Você tem direito à transparência em todas as transações</li>
                      <li>• Deve fornecer informações verdadeiras e atualizadas</li>
                      <li>• Tem direito à privacidade e proteção de dados</li>
                      <li>• Deve respeitar os direitos de outros usuários</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* FAQ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8 bg-white rounded-2xl shadow-lg p-8"
            >
              <div className="flex items-center mb-6">
                <FaQuestionCircle className="text-blue-500 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Perguntas Frequentes</h2>
              </div>
              
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * (index + 1) }}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                      <h3 className="font-medium text-gray-900">{faq.question}</h3>
                    </div>
                    <div className="p-4">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Aceitação */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-8 p-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl text-white"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">Ao usar nossa plataforma você concorda com:</h3>
                  <p className="text-blue-100">
                    Todos os termos e condições descritos nesta página, incluindo políticas de privacidade e uso.
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <button className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium">
                    Baixar PDF
                  </button>
                  <button className="px-6 py-3 border border-white text-white rounded-lg hover:bg-white/10 transition-colors font-medium">
                    Contactar Suporte
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Rodapé Informativo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center text-sm text-gray-500"
        >
          <p>
            Para questões específicas sobre nossos termos e condições, entre em contacto através do nosso email: 
            <a href="mailto:juridico@easy-home.co.mz" className="text-blue-600 hover:underline ml-1">
              juridico@easy-home.co.mz
            </a>
          </p>
          <p className="mt-2">
            Horário de atendimento: Segunda a Sexta, das 8:00 às 17:00
          </p>
        </motion.div>
      </div>
    </div>
  );
}