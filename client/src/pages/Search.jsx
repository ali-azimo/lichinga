import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import ListingItems from './ListingItems';
import { FaSearch, FaFilter, FaSortAmountDown, FaSortAmountUp, FaHome, FaBuilding, FaMountain, FaSeedling, FaHardHat, FaTag, FaCar, FaCheckCircle } from 'react-icons/fa';

// Tipos de propriedades baseados no seu modelo
const PROPERTY_TYPES = [
  { id: 'all', label: 'Todos', icon: <FaHome /> },
  { id: 'casa', label: 'Casas', icon: <FaHome /> },
  { id: 'apartamento', label: 'Apartamentos', icon: <FaBuilding /> },
  { id: 'terreno', label: 'Terrenos', icon: <FaMountain /> },
  { id: 'machamba', label: 'Machambas', icon: <FaSeedling /> },
  { id: 'obra', label: 'Obras', icon: <FaHardHat /> },
];

// Opções de ordenação
const SORT_OPTIONS = [
  { value: 'createdAt_desc', label: 'Mais recentes', icon: <FaSortAmountDown /> },
  { value: 'createdAt_asc', label: 'Mais antigos', icon: <FaSortAmountUp /> },
  { value: 'regularPrice_desc', label: 'Maior preço', icon: <FaSortAmountDown /> },
  { value: 'regularPrice_asc', label: 'Menor preço', icon: <FaSortAmountUp /> },
];

// Função para truncar texto para 3 linhas
const truncateText = (text, maxLines = 3) => {
  if (!text) return '';
  const lines = text.split('\n');
  if (lines.length <= maxLines) return text;
  
  const truncated = lines.slice(0, maxLines).join('\n');
  return truncated + '...';
};

// Função para calcular quantas linhas o texto ocupa
const countTextLines = (text) => {
  if (!text) return 0;
  return text.split('\n').length;
};

export default function Search() {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebardata, setSidebardata] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        finished: false,
        offer: false,
        sort: 'createdAt',
        order: 'desc',
        minPrice: '',
        maxPrice: '',
        minBedrooms: '',
        minBathrooms: '',
    });
    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    const [showMore, setShowMore] = useState(false);
    const [totalResults, setTotalResults] = useState(0);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
        const parkingFromUrl = urlParams.get('parking');
        const finishedFromUrl = urlParams.get('finished');
        const offerFromUrl = urlParams.get('offer');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');
        const minPriceFromUrl = urlParams.get('minPrice');
        const maxPriceFromUrl = urlParams.get('maxPrice');
        const minBedroomsFromUrl = urlParams.get('minBedrooms');
        const minBathroomsFromUrl = urlParams.get('minBathrooms');

        if(
            searchTermFromUrl ||
            typeFromUrl ||
            parkingFromUrl ||
            finishedFromUrl ||
            offerFromUrl ||
            sortFromUrl ||
            orderFromUrl ||
            minPriceFromUrl ||
            maxPriceFromUrl ||
            minBedroomsFromUrl ||
            minBathroomsFromUrl
        ){
           setSidebardata({
            searchTerm: searchTermFromUrl || '',
            type: typeFromUrl || 'all',
            parking: parkingFromUrl === 'true',
            finished: finishedFromUrl === 'true',
            offer: offerFromUrl === 'true',
            sort: sortFromUrl || 'createdAt',
            order: orderFromUrl || 'desc',
            minPrice: minPriceFromUrl || '',
            maxPrice: maxPriceFromUrl || '',
            minBedrooms: minBedroomsFromUrl || '',
            minBathrooms: minBathroomsFromUrl || '',
           }); 
        }
        
        const fetchListings = async () => {
            setShowMore(false);
            setLoading(true);
            const searchQuery = urlParams.toString();
            
            try {
                const res = await fetch(`/api/listing/get?${searchQuery}`);
                const data = await res.json();
                
                // Se a API retornar um objeto com listings e total
                if (data.listings) {
                    setListings(data.listings);
                    setTotalResults(data.total || data.listings.length);
                } else {
                    setListings(data);
                    setTotalResults(data.length);
                }
                
                if (data.length > 8) {
                    setShowMore(true);
                }
            } catch (error) {
                console.error('Error fetching listings:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchListings();
    }, [location.search]);

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        
        if (PROPERTY_TYPES.map(t => t.id).includes(id)) {
            setSidebardata({...sidebardata, type: id});
            return;
        }
        
        if (id === 'searchTerm') {
            setSidebardata({...sidebardata, searchTerm: value});
            return;
        }
        
        if (['parking', 'finished', 'offer'].includes(id)) {
            setSidebardata({...sidebardata, [id]: checked});
            return;
        }
        
        if (id === 'sort_order') {
            const sort = value.split('_')[0] || 'createdAt';
            const order = value.split('_')[1] || 'desc';
            setSidebardata({...sidebardata, sort, order});
            return;
        }
        
        if (['minPrice', 'maxPrice', 'minBedrooms', 'minBathrooms'].includes(id)) {
            setSidebardata({...sidebardata, [id]: value});
            return;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();
        
        // Adicionar apenas os parâmetros que têm valor
        if (sidebardata.searchTerm) urlParams.set('searchTerm', sidebardata.searchTerm);
        if (sidebardata.type !== 'all') urlParams.set('type', sidebardata.type);
        if (sidebardata.parking) urlParams.set('parking', sidebardata.parking);
        if (sidebardata.finished) urlParams.set('finished', sidebardata.finished);
        if (sidebardata.offer) urlParams.set('offer', sidebardata.offer);
        urlParams.set('sort', sidebardata.sort);
        urlParams.set('order', sidebardata.order);
        if (sidebardata.minPrice) urlParams.set('minPrice', sidebardata.minPrice);
        if (sidebardata.maxPrice) urlParams.set('maxPrice', sidebardata.maxPrice);
        if (sidebardata.minBedrooms) urlParams.set('minBedrooms', sidebardata.minBedrooms);
        if (sidebardata.minBathrooms) urlParams.set('minBathrooms', sidebardata.minBathrooms);
        
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    const handleReset = () => {
        setSidebardata({
            searchTerm: '',
            type: 'all',
            parking: false,
            finished: false,
            offer: false,
            sort: 'createdAt',
            order: 'desc',
            minPrice: '',
            maxPrice: '',
            minBedrooms: '',
            minBathrooms: '',
        });
        navigate('/search');
    };

    const onShowMoreClick = async () => {
        const numberOfListings = listings.length;
        const startIndex = numberOfListings;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        
        if (data.length < 9) {
            setShowMore(false);
        }
        
        setListings([...listings, ...data]);
    };

    const getTypeIcon = (type) => {
        const typeObj = PROPERTY_TYPES.find(t => t.id === type);
        return typeObj ? typeObj.icon : <FaHome />;
    };

    return (
        <div className='min-h-screen bg-gray-50'>
            {/* Mobile Filter Button */}
            <div className='md:hidden p-4'>
                <button
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className='w-full bg-white p-3 rounded-lg shadow flex items-center justify-center gap-2 font-semibold'
                >
                    <FaFilter /> {showMobileFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
                </button>
            </div>

            <div className='flex flex-col md:flex-row max-w-7xl mx-auto'>
                {/* Sidebar Filters */}
                <div className={`${showMobileFilters ? 'block' : 'hidden'} md:block md:w-80 p-4 md:p-6 bg-white border-r border-gray-200 md:min-h-screen`}>
                    <div className='sticky top-4'>
                        <div className='flex items-center justify-between mb-6'>
                            <h2 className='text-xl font-bold text-gray-800'>
                                <FaFilter className='inline mr-2' />
                                Filtros
                            </h2>
                            <button
                                onClick={handleReset}
                                className='text-sm text-blue-600 hover:text-blue-800'
                            >
                                Limpar todos
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
                            {/* Search Term */}
                            <div className="relative">
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Termo de Busca
                                </label>
                                <div className="relative">
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        id='searchTerm'
                                        placeholder='Pesquisar por nome, localização...'
                                        className='border border-gray-300 rounded-lg p-3 pl-10 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                        value={sidebardata.searchTerm}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Property Types */}
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-3'>
                                    Tipo de Propriedade
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {PROPERTY_TYPES.map((type) => (
                                        <div key={type.id} className="relative">
                                            <input
                                                type="radio"
                                                id={type.id}
                                                name="propertyType"
                                                className="hidden peer"
                                                checked={sidebardata.type === type.id}
                                                onChange={handleChange}
                                            />
                                            <label
                                                htmlFor={type.id}
                                                className="flex flex-col items-center p-3 border border-gray-300 rounded-lg cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:bg-gray-50"
                                            >
                                                <span className="text-lg text-gray-600 peer-checked:text-blue-600">
                                                    {type.icon}
                                                </span>
                                                <span className="text-xs font-medium mt-1 text-gray-700 peer-checked:text-blue-700">
                                                    {type.label}
                                                </span>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-3'>
                                    Faixa de Preço
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className='text-xs text-gray-500'>Mínimo</label>
                                        <input
                                            type="number"
                                            id='minPrice'
                                            placeholder='R$ 0'
                                            className='border border-gray-300 rounded-lg p-2 w-full'
                                            value={sidebardata.minPrice}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label className='text-xs text-gray-500'>Máximo</label>
                                        <input
                                            type="number"
                                            id='maxPrice'
                                            placeholder='R$ 999.999'
                                            className='border border-gray-300 rounded-lg p-2 w-full'
                                            value={sidebardata.maxPrice}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Bedrooms and Bathrooms */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Mín. Quartos
                                    </label>
                                    <select
                                        id='minBedrooms'
                                        className='border border-gray-300 rounded-lg p-2 w-full'
                                        value={sidebardata.minBedrooms}
                                        onChange={handleChange}
                                    >
                                        <option value="">Qualquer</option>
                                        <option value="1">1+ quarto</option>
                                        <option value="2">2+ quartos</option>
                                        <option value="3">3+ quartos</option>
                                        <option value="4">4+ quartos</option>
                                        <option value="5">5+ quartos</option>
                                    </select>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Mín. Banheiros
                                    </label>
                                    <select
                                        id='minBathrooms'
                                        className='border border-gray-300 rounded-lg p-2 w-full'
                                        value={sidebardata.minBathrooms}
                                        onChange={handleChange}
                                    >
                                        <option value="">Qualquer</option>
                                        <option value="1">1+ banheiro</option>
                                        <option value="2">2+ banheiros</option>
                                        <option value="3">3+ banheiros</option>
                                        <option value="4">4+ banheiros</option>
                                    </select>
                                </div>
                            </div>

                            {/* Amenities */}
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-3'>
                                    Comodidades
                                </label>
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="parking"
                                            className='w-4 h-4 text-blue-600 rounded'
                                            checked={sidebardata.parking}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="parking" className='ml-2 text-sm text-gray-700 flex items-center'>
                                            <FaCar className="mr-1" /> Estacionamento
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="finished"
                                            className='w-4 h-4 text-blue-600 rounded'
                                            checked={sidebardata.finished}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="finished" className='ml-2 text-sm text-gray-700 flex items-center'>
                                            <FaCheckCircle className="mr-1" /> Acabada
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="offer"
                                            className='w-4 h-4 text-blue-600 rounded'
                                            checked={sidebardata.offer}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="offer" className='ml-2 text-sm text-gray-700 flex items-center'>
                                            <FaTag className="mr-1" /> Com Oferta
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Sort */}
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Ordenar por
                                </label>
                                <select
                                    onChange={handleChange}
                                    value={`${sidebardata.sort}_${sidebardata.order}`}
                                    id="sort_order"
                                    className='border border-gray-300 rounded-lg p-2 w-full'
                                >
                                    {SORT_OPTIONS.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <button
                                    type="submit"
                                    className='w-full bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-300 p-3'
                                >
                                    Aplicar Filtros
                                </button>
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className='w-full bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition duration-300 p-3'
                                >
                                    Limpar Filtros
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-4 md:p-6">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className='text-2xl md:text-3xl font-bold text-gray-800 mb-2'>
                            {totalResults > 0 ? `${totalResults} propriedades encontradas` : 'Nenhuma propriedade encontrada'}
                        </h1>
                        
                        {/* Active Filters */}
                        {location.search && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {sidebardata.searchTerm && (
                                    <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                                        Busca: {sidebardata.searchTerm}
                                    </span>
                                )}
                                {sidebardata.type !== 'all' && (
                                    <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full flex items-center">
                                        {getTypeIcon(sidebardata.type)}
                                        <span className="ml-1">{PROPERTY_TYPES.find(t => t.id === sidebardata.type)?.label}</span>
                                    </span>
                                )}
                                {sidebardata.offer && (
                                    <span className="bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full flex items-center">
                                        <FaTag className="mr-1" /> Oferta
                                    </span>
                                )}
                                {sidebardata.parking && (
                                    <span className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full flex items-center">
                                        <FaCar className="mr-1" /> Estacionamento
                                    </span>
                                )}
                                {sidebardata.finished && (
                                    <span className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full flex items-center">
                                        <FaCheckCircle className="mr-1" /> Acabada
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex justify-center items-center h-64">
                            <div className="text-center">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                                <p className="mt-4 text-gray-600">Carregando propriedades...</p>
                            </div>
                        </div>
                    )}

                    {/* Results Grid */}
                    {!loading && listings.length === 0 ? (
                        <div className="text-center py-16">
                            <FaSearch className="text-6xl text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhuma propriedade encontrada</h3>
                            <p className="text-gray-500">Tente ajustar seus filtros ou pesquisar outros termos.</p>
                            <button
                                onClick={handleReset}
                                className="mt-4 text-blue-600 hover:text-blue-800 font-semibold"
                            >
                                Limpar todos os filtros
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {listings.map((listing) => (
                                    <div key={listing._id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition">
                                        <ListingItems listing={listing} />
                                        
                                        {/* Conteúdo do item */}
                                        <div className="p-4">
                                            <h3 className="font-bold text-lg mb-2 line-clamp-1">{listing.name}</h3>
                                            
                                            {/* Localização */}
                                            {listing.address && (
                                                <div className="text-gray-600 text-sm mb-3 line-clamp-1">
                                                    {listing.address}
                                                </div>
                                            )}
                                            
                                            {/* Descrição com truncamento de 3 linhas */}
                                            <div className="mb-4">
                                                <div className="text-gray-700 text-sm">
                                                    {listing.description && countTextLines(listing.description) > 3 ? (
                                                        <div className="line-clamp-3">
                                                            {truncateText(listing.description, 3)}
                                                        </div>
                                                    ) : (
                                                        <div className="whitespace-pre-line">
                                                            {listing.description}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            {/* Detalhes */}
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {listing.bedrooms > 0 && (
                                                    <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                                                        {listing.bedrooms} quarto{listing.bedrooms > 1 ? 's' : ''}
                                                    </span>
                                                )}
                                                {listing.bathrooms > 0 && (
                                                    <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                                                        {listing.bathrooms} banheiro{listing.bathrooms > 1 ? 's' : ''}
                                                    </span>
                                                )}
                                                {listing.parking && (
                                                    <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                                                        Estacionamento
                                                    </span>
                                                )}
                                            </div>
                                            
                                            {/* Preço e Tipo */}
                                            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                                <div>
                                                    <span className="text-xl font-bold text-blue-600">
                                                        {listing.regularPrice?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                    </span>
                                                    {listing.offer && listing.discountPrice && (
                                                        <div className="text-xs text-gray-500 line-through">
                                                            {listing.discountPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="text-sm text-gray-500 capitalize">
                                                    {listing.type}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Show More Button */}
                            {showMore && !loading && (
                                <div className="text-center mt-8">
                                    <button
                                        onClick={onShowMoreClick}
                                        className='bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300'
                                    >
                                        Carregar mais propriedades
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    {/* Mobile Filter Button at Bottom */}
                    <div className='md:hidden fixed bottom-4 right-4 z-50'>
                        <button
                            onClick={() => setShowMobileFilters(!showMobileFilters)}
                            className='bg-blue-600 text-white p-4 rounded-full shadow-lg'
                        >
                            <FaFilter size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}