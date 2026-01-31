// pages/Settings.jsx
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserStart, updateUserSuccess, updateUserFailure } from '../redux/user/userSlice';
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaBell, 
  FaGlobe, 
  FaShieldAlt,
  FaSave,
  FaCamera,
  FaPhone,
  FaMapMarkerAlt
} from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Settings() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    language: 'pt',
    notifications: {
      email: true,
      push: true,
      marketing: false,
    },
    privacy: {
      profilePublic: true,
      showEmail: false,
      showPhone: false,
    }
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        address: currentUser.address || '',
        bio: currentUser.bio || '',
        language: currentUser.language || 'pt',
        notifications: currentUser.notifications || {
          email: true,
          push: true,
          marketing: false,
        },
        privacy: currentUser.privacy || {
          profilePublic: true,
          showEmail: false,
          showPhone: false,
        }
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      dispatch(updateUserStart());
      
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        setMessage(data.message);
        return;
      }
      
      dispatch(updateUserSuccess(data));
      setMessage('Configurações atualizadas com sucesso!');
      
      // Limpar mensagem após 3 segundos
      setTimeout(() => setMessage(''), 3000);
      
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      setMessage(error.message);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('As senhas não coincidem!');
      return;
    }
    
    try {
      const res = await fetch(`/api/user/change-password/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData),
      });
      
      const data = await res.json();
      
      if (data.success === false) {
        setMessage(data.message);
        return;
      }
      
      setMessage('Senha alterada com sucesso!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      setTimeout(() => setMessage(''), 3000);
      
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formDataObj = new FormData();
    formDataObj.append('avatar', file);
    
    try {
      const res = await fetch(`/api/user/avatar/${currentUser._id}`, {
        method: 'POST',
        body: formDataObj,
      });
      
      const data = await res.json();
      
      if (data.success === false) {
        setMessage(data.message);
        return;
      }
      
      dispatch(updateUserSuccess(data));
      setMessage('Foto de perfil atualizada!');
      
      setTimeout(() => setMessage(''), 3000);
      
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Configurações da Conta</h1>
          <p className="text-gray-600">Gerencie suas preferências e informações pessoais</p>
        </div>

        {/* Message Alert */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg ${
              message.includes('sucesso') 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message}
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-white rounded-xl shadow p-1">
          {[
            { id: 'profile', label: 'Perfil', icon: <FaUser /> },
            { id: 'security', label: 'Segurança', icon: <FaLock /> },
            { id: 'notifications', label: 'Notificações', icon: <FaBell /> },
            { id: 'privacy', label: 'Privacidade', icon: <FaShieldAlt /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.icon}
              <span className="ml-2">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-8"
            >
              <div className="flex flex-col md:flex-row gap-8">
                {/* Avatar Section */}
                <div className="md:w-1/3">
                  <div className="text-center">
                    <div className="relative inline-block mb-4">
                      <img
                        src={currentUser?.avatar || '/default-avatar.png'}
                        alt="Avatar"
                        className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                      <label
                        htmlFor="avatar-upload"
                        className="absolute bottom-2 right-2 p-2 bg-blue-500 text-white rounded-full cursor-pointer hover:bg-blue-600 transition-colors"
                      >
                        <FaCamera />
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarUpload}
                        />
                      </label>
                    </div>
                    <p className="text-sm text-gray-500">Clique no ícone para alterar a foto</p>
                  </div>
                </div>

                {/* Form Section */}
                <div className="md:w-2/3">
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <FaUser className="inline mr-2" />
                            Nome de Usuário
                          </label>
                          <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <FaEnvelope className="inline mr-2" />
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <FaPhone className="inline mr-2" />
                            Telefone
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <FaGlobe className="inline mr-2" />
                            Idioma
                          </label>
                          <select
                            name="language"
                            value={formData.language}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="pt">Português</option>
                            <option value="en">English</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <FaMapMarkerAlt className="inline mr-2" />
                          Endereço
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Biografia
                        </label>
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleChange}
                          rows="4"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Conte um pouco sobre você..."
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                        >
                          <FaSave className="mr-2" />
                          {loading ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-8"
            >
              <div className="max-w-2xl mx-auto">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Alterar Senha</h3>
                
                <form onSubmit={handlePasswordSubmit}>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Senha Atual
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nova Senha
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmar Nova Senha
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                      >
                        Alterar Senha
                      </button>
                    </div>
                  </div>
                </form>

                <div className="mt-12 pt-8 border-t border-gray-200">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Sessões Ativas</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Chrome - Windows 10</p>
                        <p className="text-sm text-gray-500">Lisboa, Portugal • Ativa agora</p>
                      </div>
                      <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                        Terminar Sessão
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-8"
            >
              <div className="max-w-2xl mx-auto">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Preferências de Notificação</h3>
                
                <div className="space-y-6">
                  {[
                    { name: 'notifications.email', label: 'Notificações por Email', description: 'Receba atualizações importantes por email' },
                    { name: 'notifications.push', label: 'Notificações Push', description: 'Receba notificações no seu navegador' },
                    { name: 'notifications.marketing', label: 'Emails de Marketing', description: 'Receba ofertas e novidades' },
                  ].map((item) => (
                    <div key={item.name} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div>
                        <p className="font-medium text-gray-900">{item.label}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name={item.name}
                          checked={formData.notifications[item.name.split('.')[1]]}
                          onChange={handleChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Frequência de Emails</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['Diariamente', 'Semanalmente', 'Mensalmente'].map((freq) => (
                      <button
                        key={freq}
                        className={`px-6 py-3 rounded-lg border-2 font-medium transition-colors ${
                          formData.notifications.frequency === freq.toLowerCase()
                            ? 'border-blue-500 bg-blue-50 text-blue-600'
                            : 'border-gray-200 text-gray-700 hover:border-blue-300'
                        }`}
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          notifications: {
                            ...prev.notifications,
                            frequency: freq.toLowerCase()
                          }
                        }))}
                      >
                        {freq}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-8"
            >
              <div className="max-w-2xl mx-auto">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Configurações de Privacidade</h3>
                
                <div className="space-y-6">
                  {[
                    { name: 'privacy.profilePublic', label: 'Perfil Público', description: 'Permitir que outros usuários vejam seu perfil' },
                    { name: 'privacy.showEmail', label: 'Mostrar Email', description: 'Tornar seu email visível para outros usuários' },
                    { name: 'privacy.showPhone', label: 'Mostrar Telefone', description: 'Tornar seu telefone visível para outros usuários' },
                  ].map((item) => (
                    <div key={item.name} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div>
                        <p className="font-medium text-gray-900">{item.label}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name={item.name}
                          checked={formData.privacy[item.name.split('.')[1]]}
                          onChange={handleChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Exportar Dados</h4>
                  <p className="text-gray-600 mb-4">
                    Você pode baixar uma cópia dos seus dados pessoais a qualquer momento.
                  </p>
                  <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors font-medium">
                    Solicitar Exportação de Dados
                  </button>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h4 className="text-lg font-bold text-red-900 mb-4">Zona de Perigo</h4>
                  <div className="space-y-4">
                    <button className="w-full px-6 py-3 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors font-medium">
                      Desativar Conta Temporariamente
                    </button>
                    <button className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                      Excluir Conta Permanentemente
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}