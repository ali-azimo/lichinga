import { Link } from 'react-router-dom';
import { MdLocationOn, MdApartment, MdHome, MdLandscape, MdAgriculture, MdConstruction } from 'react-icons/md';
import { FaBed, FaBath, FaCar, FaCheckCircle, FaRulerCombined, FaTree, FaBuilding } from 'react-icons/fa';

export default function ListingItems({ listing }) {
  
  // Função para obter o texto do tipo em português
  const getTypeText = (type) => {
    const typeMap = {
      'casa': 'Casa',
      'apartamento': 'Apartamento',
      'terreno': 'Terreno',
      'machamba': 'Machamba',
      'obra': 'Obra'
    };
    return typeMap[type] || type;
  };

  // Função para obter o ícone baseado no tipo
  const getTypeIcon = (type) => {
    const iconMap = {
      'casa': <MdHome className="text-lg" />,
      'apartamento': <MdApartment className="text-lg" />,
      'terreno': <MdLandscape className="text-lg" />,
      'machamba': <MdAgriculture className="text-lg" />,
      'obra': <MdConstruction className="text-lg" />
    };
    return iconMap[type] || <MdHome className="text-lg" />;
  };

  // Função para obter a cor do badge baseado no tipo
  const getTypeColor = (type) => {
    const colorMap = {
      'casa': 'bg-blue-500',
      'apartamento': 'bg-purple-500',
      'terreno': 'bg-green-500',
      'machamba': 'bg-yellow-500',
      'obra': 'bg-orange-500'
    };
    return colorMap[type] || 'bg-gray-500';
  };

  // Função para formatar o preço
  const formatPrice = (price) => {
    return price.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Função para obter o texto do preço baseado no tipo
  const getPriceText = (listing) => {
    if (listing.type === 'apartamento') {
      return ' / mês';
    } else if (listing.type === 'terreno' || listing.type === 'machamba') {
      return ' / m²';
    }
    return '';
  };

  // Componente para detalhes específicos do tipo
  const renderTypeSpecificDetails = () => {
    switch (listing.type) {
      case 'casa':
      case 'apartamento':
        return (
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <FaBed className="text-gray-400" />
              <span className="font-medium">{listing.bedroom} {listing.bedroom === 1 ? 'quarto' : 'quartos'}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaBath className="text-gray-400" />
              <span className="font-medium">{listing.bathroom} {listing.bathroom === 1 ? 'banheiro' : 'banheiros'}</span>
            </div>
          </div>
        );
      
      case 'terreno':
        return (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaRulerCombined className="text-gray-400" />
            <span className="font-medium">Terreno disponível</span>
          </div>
        );
      
      case 'machamba':
        return (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaTree className="text-gray-400" />
            <span className="font-medium">Área agrícola</span>
          </div>
        );
      
      case 'obra':
        return (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaBuilding className="text-gray-400" />
            <span className="font-medium">Em construção</span>
          </div>
        );
      
      default:
        return null;
    }
  };

  // Componente para características
  const renderFeatures = () => {
    const features = [];
    
    if (listing.parking) {
      features.push({
        icon: <FaCar />,
        text: 'Estacionamento',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        filter: 'parking=true'
      });
    }
    
    if (listing.finished && (listing.type === 'casa' || listing.type === 'apartamento' || listing.type === 'obra')) {
      features.push({
        icon: <FaCheckCircle />,
        text: 'Finalizado',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        filter: 'finished=true'
      });
    }
    
    if (listing.offer) {
      features.push({
        icon: '💰',
        text: 'Oferta',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        filter: 'offer=true'
      });
    }
    
    return features;
  };

  const features = renderFeatures();

  return (
    <div className='bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group w-full sm:w-[300px] border border-gray-100 hover:border-gray-200'>
      <Link to={`/listing/${listing._id}`} className="block">
        {/* Image Section */}
        <div className='relative overflow-hidden'>
          <img 
            src={listing.imageUrls[0]} 
            alt={listing.name} 
            className='h-48 w-full object-cover group-hover:scale-105 transition-transform duration-500'
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Type Badge */}
          <div className={`absolute top-3 left-3 ${getTypeColor(listing.type)} text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1`}>
            {getTypeIcon(listing.type)}
            {getTypeText(listing.type)}
          </div>
          
          {/* Offer Badge */}
          {listing.offer && (
            <div className='absolute top-3 right-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg'>
              🔥 OFERTA ESPECIAL
            </div>
          )}
          
          {/* Price Tag */}
          <div className="absolute bottom-3 left-3 right-3">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  {listing.offer && (
                    <p className="text-xs text-gray-500 line-through">
                      ${formatPrice(listing.regularPrice)}
                    </p>
                  )}
                  <p className="text-lg font-bold text-gray-800">
                    ${formatPrice(listing.offer ? listing.discountPrice : listing.regularPrice)}
                    <span className="text-sm font-normal text-gray-600 ml-1">
                      {getPriceText(listing)}
                    </span>
                  </p>
                </div>
                {listing.offer && (
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded font-semibold">
                    -{Math.round((1 - listing.discountPrice / listing.regularPrice) * 100)}%
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Content Section */}
        <div className='p-4'>
          {/* Title */}
          <h3 className='font-bold text-gray-800 text-lg mb-1 group-hover:text-blue-600 transition-colors truncate'>
            {listing.name}
          </h3>
          
          {/* Location */}
          <div className='flex items-center gap-1 mb-3'>
            <MdLocationOn className='h-4 w-4 text-blue-500 flex-shrink-0'/>
            <p className='text-sm text-gray-600 truncate'>{listing.address}</p>
          </div>
          
          {/* Description */}
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">
            {listing.description}
          </p>
          
          {/* Type-specific details */}
          {renderTypeSpecificDetails()}
          
          {/* Features */}
          {features.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                {features.map((feature, index) => (
                  <Link 
                    key={index}
                    to={`/?${feature.filter}`}
                    className={`${feature.bgColor} ${feature.color} text-xs px-2 py-1 rounded-full flex items-center gap-1 hover:opacity-90 transition-opacity`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {feature.icon}
                    {feature.text}
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          {/* Action Button */}
          <div className="mt-4">
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 group-hover:shadow-lg">
              Ver Detalhes
            </button>
          </div>
          
          {/* Additional Info */}
          <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              {new Date(listing.createdAt).toLocaleDateString('pt-BR')}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              ID: {listing._id.slice(-6)}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}