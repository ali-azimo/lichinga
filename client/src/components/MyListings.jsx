// pages/MyListings.jsx
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  FaHome, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaCalendarAlt, 
  FaTag, 
  FaDollarSign,
  FaMapMarkerAlt,
  FaFilter,
  FaPlusCircle
} from 'react-icons/fa';
import { MdApartment, MdTerrain, MdConstruction } from 'react-icons/md';
import { GiFarmTractor } from 'react-icons/gi';

export default function MyListings() {
  const { currentUser } = useSelector((state) => state.user);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    sold: 0,
  });

  const fetchMyListings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/listing/get?userRef=${currentUser._id}`);
      const data = await res.json();
      
      if (data.success === false) {
        setError(data.message);
        return;
      }
      
      setListings(data);
      
      // Calcular estatísticas
      const statsData = {
        total: data.length,
        active: data.filter(listing => listing.status === 'active').length,
        pending: data.filter(listing => listing.status === 'pending').length,
        sold: data.filter(listing => listing.status === 'sold').length,
      };
      setStats(statsData);
      
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchMyListings();
    }
  }, [currentUser]);

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este anúncio?')) {
      return;
    }
    
    try {
      const res = await fetch(`/api/listing/delete/${id}`, {
        method: 'DELETE',
      });
      
      const data = await res.json();
      
      if (data.success === false) {
        alert(data.message);
        return;
      }
      
      // Atualizar lista
      setListings(prev => prev.filter(listing => listing._id !== id));
      alert('Anúncio excluído com sucesso!');
    } catch (error) {
      alert('Erro ao excluir anúncio');
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'casa': return <FaHome className="text-blue-500" />;
      case 'apartamento': return <MdApartment className="text-purple-500" />;
      case 'terreno': return <MdTerrain className="text-green-500" />;
      case 'machamba': return <GiFarmTractor className="text-yellow-500" />;
      case 'obra': return <MdConstruction className="text-orange-500" />;
      default: return <FaHome />;
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'active': { color: 'bg-green-100 text-green-800', text: 'Ativo' },
      'pending': { color: 'bg-yellow-100 text-yellow-800', text: 'Pendente' },
      'sold': { color: 'bg-red-100 text-red-800', text: 'Vendido' },
      'rented': { color: 'bg-blue-100 text-blue-800', text: 'Arrendado' },
    };
    
    const config = statusConfig[status] || statusConfig.active;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const filteredListings = filter === 'all' 
    ? listings 
    : listings.filter(listing => listing.status === filter);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Meus Anúncios</h1>
          <p className="text-gray-600">Gerencie todas as suas propriedades listadas</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total de Anúncios</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaHome className="text-2xl text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Ativos</p>
                <p className="text-3xl font-bold text-gray-900">{stats.active}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FaEye className="text-2xl text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pendentes</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FaCalendarAlt className="text-2xl text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Vendidos/Arrendados</p>
                <p className="text-3xl font-bold text-gray-900">{stats.sold}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <FaDollarSign className="text-2xl text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-xl shadow mb-8 p-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FaFilter className="text-gray-500" />
                <span className="text-gray-700 font-medium">Filtrar por:</span>
              </div>
              <div className="flex space-x-2">
                {['all', 'active', 'pending', 'sold'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      filter === status 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status === 'all' ? 'Todos' : 
                     status === 'active' ? 'Ativos' :
                     status === 'pending' ? 'Pendentes' : 'Vendidos'}
                  </button>
                ))}
              </div>
            </div>
            
            <Link
              to="/create-listing"
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <FaPlusCircle className="mr-2" />
              Criar Novo Anúncio
            </Link>
          </div>
        </div>

        {/* Listings Grid */}
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600">Erro ao carregar anúncios: {error}</p>
            <button
              onClick={fetchMyListings}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Tentar Novamente
            </button>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <FaHome className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">Nenhum anúncio encontrado</h3>
            <p className="text-gray-500 mb-6">
              {filter === 'all' 
                ? 'Você ainda não tem nenhum anúncio. Crie seu primeiro anúncio!' 
                : 'Nenhum anúncio com este status'}
            </p>
            <Link
              to="/create-listing"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <FaPlusCircle className="mr-2" />
              Criar Primeiro Anúncio
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <div key={listing._id} className="bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition-shadow">
                {/* Image */}
                <div className="h-48 overflow-hidden">
                  <img
                    src={listing.imageUrls[0]}
                    alt={listing.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    {getStatusBadge(listing.status || 'active')}
                  </div>
                  {listing.offer && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      <FaTag className="inline mr-1" /> OFERTA
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-1">{listing.name}</h3>
                      <div className="flex items-center text-gray-600 text-sm">
                        <FaMapMarkerAlt className="mr-2 text-red-500" />
                        {listing.address}
                      </div>
                    </div>
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {getTypeIcon(listing.type)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-gray-900">
                      ${listing.offer ? listing.discountPrice.toLocaleString() : listing.regularPrice.toLocaleString()}
                      {listing.offer && (
                        <span className="ml-2 text-sm text-gray-500 line-through">
                          ${listing.regularPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      <FaCalendarAlt className="inline mr-1" />
                      {new Date(listing.createdAt).toLocaleDateString('pt-BR')}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex items-center space-x-4 mb-6 text-sm text-gray-600">
                    {listing.bedroom && (
                      <span>{listing.bedroom} 🛏️</span>
                    )}
                    {listing.bathroom && (
                      <span>{listing.bathroom} 🛁</span>
                    )}
                    {listing.parking && (
                      <span>🏠</span>
                    )}
                    <span>{listing.type}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Link
                      to={`/listing/${listing._id}`}
                      className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 py-2 rounded-lg text-center font-medium transition-colors"
                    >
                      <FaEye className="inline mr-2" />
                      Visualizar
                    </Link>
                    <Link
                      to={`/update-listing/${listing._id}`}
                      className="flex-1 bg-green-50 text-green-600 hover:bg-green-100 py-2 rounded-lg text-center font-medium transition-colors"
                    >
                      <FaEdit className="inline mr-2" />
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(listing._id)}
                      className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 py-2 rounded-lg text-center font-medium transition-colors"
                    >
                      <FaTrash className="inline mr-2" />
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}