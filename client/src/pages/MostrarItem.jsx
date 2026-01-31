import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const [userListng, setUserListing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchUserListings();
  }, []);

  const fetchUserListings = async () => {
    try {
      setLoading(true);
      setError(false);
      const res = await fetch(`/api/user/listing/${currentUser._id}`);
      const data = await res.json();
      
      if (data.success === false) {
        setError(true);
        return;
      }
      
      setUserListing(data);
    } catch (error) {
      setError(true);
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      
      setUserListing((prev) => prev.filter((listing) => listing._id !== listingId));
    } catch (error) {
      console.log(error.message);
    }
  };

  const refreshListings = () => {
    fetchUserListings();
  };

  return (
    <div className='p-3 max-w-4xl mx-auto'>
      <div className='mb-8'>
        <div className='flex justify-between items-center mb-4'>
          <h1 className='text-3xl font-bold text-gray-800'>Seus Anúncios</h1>
          <button
            onClick={refreshListings}
            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2'
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Atualizar
          </button>
        </div>
        
        <p className='text-gray-600 mb-6'>
          Gerencie todos os seus anúncios cadastrados em um só lugar
        </p>
      </div>

      {loading ? (
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
        </div>
      ) : error ? (
        <div className='text-center py-8'>
          <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className='text-xl font-semibold text-gray-800 mb-2'>Erro ao carregar anúncios</h3>
          <p className='text-gray-600 mb-4'>Não foi possível carregar seus anúncios. Tente novamente.</p>
          <button
            onClick={refreshListings}
            className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            Tentar novamente
          </button>
        </div>
      ) : userListng.length > 0 ? (
        <div className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {userListng.map((listing) => (
              <div key={listing._id} className='bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300'>
                <div className='relative h-48 overflow-hidden'>
                  <Link to={`/listing/${listing._id}`}>
                    <img
                      src={listing.imageUrls[0]}
                      alt={listing.name}
                      className='w-full h-full object-cover hover:scale-105 transition-transform duration-300'
                    />
                  </Link>
                  <div className='absolute top-3 right-3'>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      listing.type === 'rent' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {listing.type === 'rent' ? 'ALUGUEL' : 'VENDA'}
                    </span>
                  </div>
                </div>
                
                <div className='p-5'>
                  <Link to={`/listing/${listing._id}`}>
                    <h3 className='text-lg font-bold text-gray-800 mb-2 hover:text-blue-600 transition-colors line-clamp-1'>
                      {listing.name}
                    </h3>
                  </Link>
                  
                  <div className='flex items-center text-gray-600 mb-3'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className='text-sm line-clamp-1'>{listing.address}</span>
                  </div>
                  
                  <div className='flex justify-between items-center mb-4'>
                    <div>
                      <p className='text-2xl font-bold text-blue-600'>
                        R$ {listing.regularPrice.toLocaleString('pt-BR')}
                      </p>
                      {listing.type === 'rent' && (
                        <p className='text-sm text-gray-500'>/mês</p>
                      )}
                    </div>
                    <div className='text-right'>
                      <p className='text-sm font-medium text-gray-700'>{listing.bedrooms} quarto{listing.bedrooms !== 1 ? 's' : ''}</p>
                      <p className='text-sm text-gray-500'>{listing.bathrooms} banheiro{listing.bathrooms !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  
                  <div className='flex space-x-3 border-t border-gray-100 pt-4'>
                    <Link 
                      to={`/update-listing/${listing._id}`}
                      className='flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      Editar
                    </Link>
                    <button
                      onClick={() => handleListingDelete(listing._id)}
                      className='flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors'
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className='mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className='ml-4'>
                <h3 className='text-lg font-medium text-blue-900'>Total de anúncios: {userListng.length}</h3>
                <p className='text-blue-700'>Você tem {userListng.length} anúncio{userListng.length !== 1 ? 's' : ''} ativo{userListng.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='text-center py-12'>
          <div className='inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
            </svg>
          </div>
          <h3 className='text-2xl font-bold text-gray-800 mb-3'>Nenhum anúncio cadastrado</h3>
          <p className='text-gray-600 mb-8 max-w-md mx-auto'>
            Você ainda não possui anúncios cadastrados. Crie seu primeiro anúncio para começar!
          </p>
          <Link
            to="/create-listing"
            className='inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium'
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Criar Primeiro Anúncio
          </Link>
        </div>
      )}
    </div>
  );
}