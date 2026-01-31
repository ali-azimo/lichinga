import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaPaperPlane, FaSearch, FaUserCircle, FaClock } from 'react-icons/fa';
import { useSelector } from 'react-redux';

export default function Messages() {
  const { currentUser } = useSelector((state) => state.user);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (currentUser) {
      fetchConversations();
    }
  }, [currentUser]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/messages/conversations');
      const data = await res.json();
      setConversations(data);
      if (data.length > 0 && !selectedConversation) {
        setSelectedConversation(data[0]);
        fetchMessages(data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const res = await fetch(`/api/messages/${conversationId}`);
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: selectedConversation._id,
          content: newMessage,
          receiverId: selectedConversation.participants.find(p => p._id !== currentUser._id)?._id,
        }),
      });

      if (res.ok) {
        const sentMessage = await res.json();
        setMessages([...messages, sentMessage]);
        setNewMessage('');

        // Atualizar última mensagem na lista de conversas
        setConversations(conversations.map(conv =>
          conv._id === selectedConversation._id
            ? { ...conv, lastMessage: sentMessage.content, updatedAt: new Date().toISOString() }
            : conv
        ));
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 24) {
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffHours < 48) {
      return 'Ontem';
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.otherParticipant?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaEnvelope className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Faça login para ver mensagens</h2>
          <p className="text-gray-600 mb-6">Entre na sua conta para acessar suas conversas.</p>
          <Link to="/sign-in" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
            Fazer Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-blue-100 rounded-full">
              <FaEnvelope className="text-2xl text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mensagens</h1>
              <p className="text-gray-600">Converse com proprietários e interessados</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lista de Conversas */}
            <div className="lg:col-span-1">
              <div className="relative mb-4">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar conversas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="mt-2 text-gray-600">Carregando conversas...</p>
                  </div>
                ) : filteredConversations.length > 0 ? (
                  filteredConversations.map((conversation) => (
                    <div
                      key={conversation._id}
                      onClick={() => {
                        setSelectedConversation(conversation);
                        fetchMessages(conversation._id);
                      }}
                      className={`p-4 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedConversation?._id === conversation._id ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={conversation.otherParticipant?.avatar || '/default-avatar.png'}
                            alt={conversation.otherParticipant?.username}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          {conversation.unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {conversation.otherParticipant?.username}
                            </h3>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <FaClock /> {formatTime(conversation.updatedAt)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            {conversation.lastMessage || 'Nenhuma mensagem ainda'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FaEnvelope className="text-4xl text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Nenhuma conversa encontrada</p>
                  </div>
                )}
              </div>
            </div>

            {/* Área de Mensagens */}
            <div className="lg:col-span-2">
              {selectedConversation ? (
                <div className="bg-white rounded-xl shadow h-full flex flex-col">
                  {/* Cabeçalho da Conversa */}
                  <div className="border-b p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedConversation.otherParticipant?.avatar || '/default-avatar.png'}
                        alt={selectedConversation.otherParticipant?.username}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {selectedConversation.otherParticipant?.username}
                        </h3>
                        <p className="text-sm text-gray-500">Online há 5 minutos</p>
                      </div>
                    </div>
                  </div>

                  {/* Lista de Mensagens */}
                  <div className="flex-1 p-4 overflow-y-auto max-h-[400px] space-y-4">
                    {messages.length > 0 ? (
                      messages.map((message) => (
                        <div
                          key={message._id}
                          className={`flex ${message.sender === currentUser._id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                              message.sender === currentUser._id
                                ? 'bg-blue-500 text-white rounded-br-none'
                                : 'bg-gray-100 text-gray-800 rounded-bl-none'
                            }`}
                          >
                            <p>{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.sender === currentUser._id ? 'text-blue-200' : 'text-gray-500'
                            }`}>
                              {formatTime(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <FaEnvelope className="text-4xl text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">Nenhuma mensagem nesta conversa</p>
                        <p className="text-sm text-gray-400">Envie a primeira mensagem!</p>
                      </div>
                    )}
                  </div>

                  {/* Input de Mensagem */}
                  <form onSubmit={sendMessage} className="border-t p-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Digite sua mensagem..."
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <FaPaperPlane />
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow h-full flex items-center justify-center p-8">
                  <div className="text-center">
                    <FaUserCircle className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Selecione uma conversa</h3>
                    <p className="text-gray-500">Escolha uma conversa da lista para começar a trocar mensagens.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}