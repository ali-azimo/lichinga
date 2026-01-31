// pages/Favorites.jsx
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  FaHeart, 
  FaHome, 
  FaMapMarkerAlt, 
  FaDollarSign,
  FaBed,
  FaBath,
  FaCar,
  FaCalendarAlt,
  FaTag,
  FaFilter,
  FaTrash
} from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Favorites() {
  const { currentUser } = useSelector((state) => state.user);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/favorites/${currentUser._id}`);
      const data = await res.json();
      
      if (data.success === false) {
        setError(data.message);
        return;
      }
      
      setFavorites(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchFavorites();
    }
  }, [currentUser]);

  const handleRemoveFavorite = async (listingId) => {
    try {
      const res = await fetch(`/api/favorites/remove/${listingId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: currentUser._id }),
      });
      
      const data = await res.json();
      
      if (data.success === false) {
        alert(data.message);
        return;
      }
      
      // Atualizar lista localmente
      setFavorites(prev => prev.filter(fav => fav._id !== listingId));
      alert('Removido dos favoritos!');
    } catch (error) {
      alert('Erro ao remover dos favoritos');
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      'casa': 'bg-blue-100 text-blue-600',
      'apartamento': 'bg-purple-100 text-purple-600',
      'terreno': 'bg-green-100 text-green-600',
      'machamba': 'bg-yellow-100 text-yellow-600',
      'obra': 'bg-orange-100 text-orange-600',
    };
    return colors[type] || 'bg-gray-100 text-gray-600';
  };

  const filteredFavorites = filter === 'all' 
    ? favorites 
    : favorites.filter(item => item.type === filter);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-pink-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-block mb-4"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center">
              <FaHeart className="text-3xl text-white" />
            </div>
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Meus Favoritos</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Suas propriedades favoritas guardadas para consulta futura
          </p>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total de Favoritos</p>
              <p className="text-3xl font-bold text-gray-900">{favorites.length}</p>
            </div>
            <div className="text-pink-500">
              <FaHeart className="text-4xl" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FaFilter className="text-gray-500" />
              <span className="font-medium text-gray-700">Filtrar por tipo:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['all', 'casa', 'apartamento', 'terreno', 'machamba', 'obra'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    filter === type 
                      ? 'bg-pink-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type === 'all' ? 'Todos' : 
                   type === 'casa' ? 'Casas' :
                   type === 'apartamento' ? 'Apartamentos' :
                   type === 'terreno' ? 'Terrenos' :
                   type === 'machamba' ? 'Machambas' : 'Obras'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Favorites List */}
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <p className="text-red-600 mb-4">Erro ao carregar favoritos: {error}</p>
            <button
              onClick={fetchFavorites}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Tentar Novamente
            </button>
          </div>
        ) : filteredFavorites.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <FaHeart className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              {filter === 'all' ? 'Nenhum favorito encontrado' : 'Nenhum favorito deste tipo'}
            </h3>
            <p className="text-gray-500 mb-6">
              {filter === 'all' 
                ? 'Comece a explorar propriedades e salve as que você mais gostar!' 
                : 'Nenhuma propriedade deste tipo nos favoritos'}
            </p>
            <Link
              to="/search"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              <FaHome className="mr-2" />
              Explorar Propriedades
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredFavorites.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative">
                  <img
                    src={item.imageUrls[0]}
                    alt={item.name}
                    className="w-full h-56 object-cover"
                  />
                  <button
                    onClick={() => handleRemoveFavorite(item._id)}
                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-red-50 hover:text-red-500 transition-colors"
                    title="Remover dos favoritos"
                  >
                    <FaTrash className="text-red-500" />
                  </button>
                  {item.offer && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      <FaTag className="inline mr-1" /> OFERTA
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-xl text-gray-900 mb-1">{item.name}</h3>
                      <div className="flex items-center text-gray-600">
                        <FaMapMarkerAlt className="mr-2 text-red-500" />
                        <span className="text-sm">{item.address}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(item.type)}`}>
                      {item.type}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <div className="text-2xl font-bold text-gray-900">
                      <FaDollarSign className="inline mr-1 text-green-500" />
                      {item.offer ? item.discountPrice.toLocaleString() : item.regularPrice.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      <FaCalendarAlt className="inline mr-1" />
                      {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {item.bedroom && (
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <FaBed className="text-blue-500 mx-auto mb-1" />
                        <div className="font-bold text-gray-900">{item.bedroom}</div>
                        <div className="text-xs text-gray-500">Quartos</div>
                      </div>
                    )}
                    {item.bathroom && (
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <FaBath className="text-blue-500 mx-auto mb-1" />
                        <div className="font-bold text-gray-900">{item.bathroom}</div>
                        <div className="text-xs text-gray-500">Banheiros</div>
                      </div>
                    )}
                    {item.parking && (
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <FaCar className="text-green-500 mx-auto mb-1" />
                        <div className="font-bold text-gray-900">Sim</div>
                        <div className="text-xs text-gray-500">Estacionamento</div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3">
                    <Link
                      to={`/listing/${item._id}`}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg text-center font-medium hover:opacity-90 transition-opacity"
                    >
                      Ver Detalhes
                    </Link>
                    <button
                      onClick={() => handleRemoveFavorite(item._id)}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}