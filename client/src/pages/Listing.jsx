import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation, Thumbs, Zoom } from 'swiper/modules';
import 'swiper/css/bundle';
import 'swiper/css/thumbs';
import 'swiper/css/zoom';
import { 
  FaBath, 
  FaBed, 
  FaChair, 
  FaMapMarkerAlt, 
  FaParking, 
  FaShare, 
  FaHeart,
  FaHome,
  FaBuilding,
  FaMountain,
  FaSeedling,
  FaHardHat,
  FaCheckCircle,
  FaCar,
  FaTag,
  FaWhatsapp,
  FaPhone,
  FaCalendarAlt,
  FaRulerCombined,
  FaTree,
  FaWarehouse,
  FaEye,
  FaEnvelope
} from 'react-icons/fa';
import { MdApartment, MdHome } from 'react-icons/md';
import Contact from '../components/Contact';
import Mapa from '../components/Mapa';
import { 
  likeStart, 
  likeSuccess, 
  likeCountSuccess, 
  likeFailure,
  viewCountSuccess 
} from '../redux/like/likeSlice';

export default function Listing(){
    SwiperCore.use([Navigation, Thumbs, Zoom]);
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const params = useParams();
    const [copied, setCopied] = useState(false);
    const {currentUser} = useSelector((state)=> state.user);
    const [contact, setContact] = useState(false);
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [viewCount, setViewCount] = useState(0);
    const [shareCount, setShareCount] = useState(45); // Valor inicial, pode vir do banco
    
    // Contatos fixos
    const contacts = {
        whatsapp: '844314455',
        phone: '824533491',
        email: 'niassa-house@gmail.com'
    };
    
    const dispatch = useDispatch();
    const { liked, count } = useSelector((state) => state.like);

    // Função para obter ícone baseado no tipo
    const getTypeIcon = (type) => {
        switch(type) {
            case 'casa': return <FaHome className="text-xl" />;
            case 'apartamento': return <MdApartment className="text-xl" />;
            case 'terreno': return <FaMountain className="text-xl" />;
            case 'machamba': return <FaSeedling className="text-xl" />;
            case 'obra': return <FaHardHat className="text-xl" />;
            default: return <FaHome className="text-xl" />;
        }
    };

    // Função para obter texto do tipo
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

    // Função para formatar preço
    const formatPrice = (price) => {
        return price.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    // Função para calcular desconto percentual
    const calculateDiscountPercentage = () => {
        if (!listing.offer) return 0;
        return Math.round((1 - listing.discountPrice / listing.regularPrice) * 100);
    };

    // Função para formatar data
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // Função para calcular tempo no ar
    const calculateTimeOnline = (createdAt) => {
        const createdDate = new Date(createdAt);
        const now = new Date();
        const diffTime = Math.abs(now - createdDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return '1 dia';
        return `${diffDays} dias`;
    };

    // Função para incrementar visualizações
    const incrementViewCount = async () => {
        if (!listing) return;
        
        try {
            const res = await fetch(`/api/listing/view/${listing._id}`, {
                method: 'POST',
            });
            const data = await res.json();
            if (data.success) {
                setViewCount(data.views);
                dispatch(viewCountSuccess(data.views));
            }
        } catch (error) {
            console.error('Erro ao incrementar visualizações:', error);
        }
    };

    // Função para incrementar compartilhamentos
    const incrementShareCount = async () => {
        if (!listing) return;
        
        try {
            const res = await fetch(`/api/listing/share/${listing._id}`, {
                method: 'POST',
            });
            const data = await res.json();
            if (data.success) {
                setShareCount(data.shares);
            }
        } catch (error) {
            console.error('Erro ao incrementar compartilhamentos:', error);
        }
    };

    // Função para copiar link e incrementar compartilhamentos
    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        incrementShareCount();
        setTimeout(() => setCopied(false), 2000);
    };

    // Função para compartilhar no WhatsApp
    const handleShareWhatsApp = () => {
        const text = `Confira esta propriedade: ${listing.name} - $${formatPrice(listing.offer ? listing.discountPrice : listing.regularPrice)}`;
        const url = `https://wa.me/?text=${encodeURIComponent(text + ' ' + window.location.href)}`;
        window.open(url, '_blank');
        incrementShareCount();
    };

    useEffect(() => {
        const fetchListing = async() => {
            try{
                setLoading(true);
                const res = await fetch(`/api/listing/get/${params.listingId}`);
                const data = await res.json();
                if(data.success === false){
                    setError(true);
                    setLoading(false);
                    return;
                }
                setListing(data);
                setLoading(false);
                setError(false);
                
                // Incrementar visualizações ao carregar a página
                if (data) {
                    incrementViewCount();
                }
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        };
        fetchListing();
    }, [params.listingId]);

    useEffect(() => {
        const fetchLikesAndViews = async () => {
            try {
                // Buscar curtidas
                const likesRes = await fetch(`/api/like/count/${params.listingId}`);
                const likesData = await likesRes.json();
                dispatch(likeCountSuccess(likesData.count));

                // Buscar visualizações
                const viewsRes = await fetch(`/api/listing/views/${params.listingId}`);
                const viewsData = await viewsRes.json();
                if (viewsData.success) {
                    setViewCount(viewsData.views);
                }

                // Verificar se usuário atual curtiu
                if (currentUser) {
                    const check = await fetch(`/api/like/check/${params.listingId}`);
                    const checkData = await check.json();
                    dispatch(likeSuccess({ liked: checkData.liked }));
                }
            } catch (error) {
                dispatch(likeFailure(error.message));
            }
        };

        if (listing) {
            fetchLikesAndViews();
        }
    }, [params.listingId, currentUser, dispatch, listing]);

    const handleLike = async () => {
        if (!currentUser) {
            alert("Faça login para curtir esta propriedade!");
            return;
        }
        if (!listing) return;

        try {
            dispatch(likeStart());
            const res = await fetch(`/api/like/toggle/${listing._id}`, {
                method: "POST",
            });
            const data = await res.json();
            dispatch(likeSuccess({ liked: data.liked }));

            // Buscar nova contagem
            const countRes = await fetch(`/api/like/count/${listing._id}`);
            const countData = await countRes.json();
            dispatch(likeCountSuccess(countData.count));
        } catch (error) {
            dispatch(likeFailure(error.message));
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    <p className='mt-4 text-lg text-gray-600'>Carregando propriedade...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className='text-2xl font-bold text-gray-800 mb-2'>Ops! Algo deu errado</h2>
                    <p className='text-gray-600'>Não foi possível carregar a propriedade. Tente novamente.</p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50">
            {listing && (
                <>
                    {/* Image Gallery Section */}
                    <div className="relative">
                        <Swiper
                            navigation
                            thumbs={{ swiper: thumbsSwiper }}
                            zoom={true}
                            className="h-[500px] md:h-[600px]"
                        >
                            {listing.imageUrls.map((url, index) => (
                                <SwiperSlide key={url}>
                                    <div className="swiper-zoom-container">
                                        <img 
                                            src={url} 
                                            alt={`${listing.name} - Imagem ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {/* Thumbnails */}
                        <div className="max-w-4xl mx-auto px-3 py-4">
                            <Swiper
                                onSwiper={setThumbsSwiper}
                                spaceBetween={10}
                                slidesPerView={4}
                                watchSlidesProgress
                                className="thumbnail-swiper"
                            >
                                {listing.imageUrls.map((url, index) => (
                                    <SwiperSlide key={url} className="cursor-pointer">
                                        <div className="h-20 rounded-lg overflow-hidden">
                                            <img 
                                                src={url} 
                                                alt={`Thumb ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>

                        {/* Floating Actions */}
                        <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
                            {/* Share Button */}
                            <button
                                onClick={handleCopyLink}
                                className="bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
                                title="Compartilhar link"
                            >
                                <FaShare className="text-gray-700" />
                            </button>

                            {/* Like Button */}
                            <button
                                onClick={handleLike}
                                className={`p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow relative ${
                                    liked ? 'bg-red-500 text-white' : 'bg-white text-gray-700'
                                }`}
                                title={liked ? 'Remover curtida' : 'Curtir'}
                            >
                                <FaHeart className={`${liked ? 'text-white' : ''}`} />
                                {count > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {count}
                                    </span>
                                )}
                            </button>

                            {/* WhatsApp Share */}
                            <button
                                onClick={handleShareWhatsApp}
                                className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl hover:bg-green-600 transition-all"
                                title="Compartilhar no WhatsApp"
                            >
                                <FaWhatsapp />
                            </button>
                        </div>

                        {copied && (
                            <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
                                Link copiado para a área de transferência!
                            </div>
                        )}
                    </div>

                    {/* Main Content */}
                    <div className="max-w-6xl mx-auto px-3 py-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column - Main Info */}
                            <div className="lg:col-span-2">
                                {/* Header */}
                                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className={`p-3 rounded-full ${
                                                    listing.type === 'casa' ? 'bg-blue-100 text-blue-600' :
                                                    listing.type === 'apartamento' ? 'bg-purple-100 text-purple-600' :
                                                    listing.type === 'terreno' ? 'bg-green-100 text-green-600' :
                                                    listing.type === 'machamba' ? 'bg-yellow-100 text-yellow-600' :
                                                    'bg-orange-100 text-orange-600'
                                                }`}>
                                                    {getTypeIcon(listing.type)}
                                                </div>
                                                <div>
                                                    <h1 className="text-3xl font-bold text-gray-900">{listing.name}</h1>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <FaMapMarkerAlt className="text-red-500" />
                                                        <span className="text-gray-600">{listing.address}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-3 mb-6">
                                                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                                    listing.type === 'casa' ? 'bg-blue-500 text-white' :
                                                    listing.type === 'apartamento' ? 'bg-purple-500 text-white' :
                                                    listing.type === 'terreno' ? 'bg-green-500 text-white' :
                                                    listing.type === 'machamba' ? 'bg-yellow-500 text-white' :
                                                    'bg-orange-500 text-white'
                                                }`}>
                                                    {getTypeText(listing.type)}
                                                </span>
                                                {listing.offer && (
                                                    <span className="px-4 py-2 bg-red-500 text-white rounded-full text-sm font-semibold flex items-center gap-2">
                                                        <FaTag /> OFERTA ESPECIAL
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Price Section */}
                                        <div className="text-right">
                                            <div className="mb-2">
                                                {listing.offer && (
                                                    <div className="text-sm text-gray-500 line-through mb-1">
                                                        ${formatPrice(listing.regularPrice)}
                                                    </div>
                                                )}
                                                <div className="text-4xl font-bold text-gray-900">
                                                    ${formatPrice(listing.offer ? listing.discountPrice : listing.regularPrice)}
                                                </div>
                                                {listing.offer && (
                                                    <div className="text-sm text-red-500 font-semibold mt-1">
                                                        {calculateDiscountPercentage()}% de desconto
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4 mt-4">
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-blue-600">{count}</div>
                                                    <div className="text-xs text-gray-500">Curtidas</div>
                                                </div>
                                                <button
                                                    onClick={handleLike}
                                                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                                                        liked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-700'
                                                    }`}
                                                >
                                                    <FaHeart className={liked ? 'text-red-500' : ''} />
                                                    {liked ? 'Curtido' : 'Curtir'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Descrição</h2>
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                        {listing.description}
                                    </p>
                                </div>

                                {/* Details */}
                                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Detalhes da Propriedade</h2>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                        {/* Detalhes específicos por tipo */}
                                        {(listing.type === 'casa' || listing.type === 'apartamento') && (
                                            <>
                                                <div className="text-center p-4 bg-gray-50 rounded-xl">
                                                    <FaBed className="text-3xl text-blue-500 mx-auto mb-2" />
                                                    <div className="text-2xl font-bold text-gray-900">{listing.bedroom}</div>
                                                    <div className="text-gray-600">Quarto{listing.bedroom !== 1 ? 's' : ''}</div>
                                                </div>
                                                <div className="text-center p-4 bg-gray-50 rounded-xl">
                                                    <FaBath className="text-3xl text-blue-500 mx-auto mb-2" />
                                                    <div className="text-2xl font-bold text-gray-900">{listing.bathroom}</div>
                                                    <div className="text-gray-600">Banheiro{listing.bathroom !== 1 ? 's' : ''}</div>
                                                </div>
                                            </>
                                        )}

                                        {listing.parking && (
                                            <div className="text-center p-4 bg-gray-50 rounded-xl">
                                                <FaCar className="text-3xl text-green-500 mx-auto mb-2" />
                                                <div className="text-2xl font-bold text-gray-900">Sim</div>
                                                <div className="text-gray-600">Estacionamento</div>
                                            </div>
                                        )}

                                        {listing.finished && (
                                            <div className="text-center p-4 bg-gray-50 rounded-xl">
                                                <FaCheckCircle className="text-3xl text-green-500 mx-auto mb-2" />
                                                <div className="text-2xl font-bold text-gray-900">Sim</div>
                                                <div className="text-gray-600">Acabada</div>
                                            </div>
                                        )}

                                        {/* Detalhes específicos para terrenos */}
                                        {listing.type === 'terreno' && (
                                            <div className="text-center p-4 bg-gray-50 rounded-xl">
                                                <FaRulerCombined className="text-3xl text-green-500 mx-auto mb-2" />
                                                <div className="text-2xl font-bold text-gray-900">Terreno</div>
                                                <div className="text-gray-600">Área disponível</div>
                                            </div>
                                        )}

                                        {/* Detalhes específicos para machambas */}
                                        {listing.type === 'machamba' && (
                                            <div className="text-center p-4 bg-gray-50 rounded-xl">
                                                <FaTree className="text-3xl text-green-500 mx-auto mb-2" />
                                                <div className="text-2xl font-bold text-gray-900">Machamba</div>
                                                <div className="text-gray-600">Área agrícola</div>
                                            </div>
                                        )}

                                        {/* Detalhes específicos para obras */}
                                        {listing.type === 'obra' && (
                                            <div className="text-center p-4 bg-gray-50 rounded-xl">
                                                <FaHardHat className="text-3xl text-orange-500 mx-auto mb-2" />
                                                <div className="text-2xl font-bold text-gray-900">Obra</div>
                                                <div className="text-gray-600">Em construção</div>
                                            </div>
                                        )}

                                        {/* Data de criação */}
                                        <div className="text-center p-4 bg-gray-50 rounded-xl">
                                            <FaCalendarAlt className="text-3xl text-purple-500 mx-auto mb-2" />
                                            <div className="text-lg font-bold text-gray-900">
                                                {formatDate(listing.createdAt)}
                                            </div>
                                            <div className="text-gray-600">Publicado em</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Section */}
                                {currentUser && listing.userRef !== currentUser._id && !contact && (
                                    <div className="bg-white rounded-2xl shadow-lg p-6">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Interessado nesta propriedade?</h2>
                                        <p className="text-gray-600 mb-6">
                                            Entre em contato com o proprietário para mais informações ou para agendar uma visita.
                                        </p>
                                        <button
                                            onClick={() => setContact(true)}
                                            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors duration-300"
                                        >
                                            Entrar em Contato
                                        </button>
                                    </div>
                                )}

                                {contact && <Contact listing={listing} />}

                                {/* Mapa do Bairro Cadastrado */}
                                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Localização</h2>
                                    <p className="text-gray-600 mb-4">
                                        Mapa indicando o bairro cadastrado em Lichinga:
                                    </p>
                                    <div className="h-96 rounded-xl overflow-hidden">
                                        <Mapa 
                                            address={listing.address} 
                                            cidade="Lichinga"
                                        />
                                    </div>
                                    <p className="text-sm text-gray-500 mt-3">
                                        * A localização é aproximada e baseada no bairro informado
                                    </p>
                                </div>
                            </div>

                            {/* Right Column - Sidebar */}
                            <div className="space-y-6">
                                {/* Owner Info with Fixed Contacts */}
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Contatos da Imobiliária</h3>
                                    <div className="space-y-4">
                                        {/* WhatsApp */}
                                        <a 
                                            href={`https://wa.me/258${contacts.whatsapp}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                                        >
                                            <div className="bg-green-100 p-2 rounded-lg">
                                                <FaWhatsapp className="text-green-600 text-xl" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-semibold">WhatsApp</div>
                                                <div className="text-sm">+258 {contacts.whatsapp}</div>
                                            </div>
                                        </a>

                                        {/* Telefone */}
                                        <a 
                                            href={`tel:+258${contacts.phone}`}
                                            className="flex items-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                                        >
                                            <div className="bg-blue-100 p-2 rounded-lg">
                                                <FaPhone className="text-blue-600 text-xl" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-semibold">Telefone</div>
                                                <div className="text-sm">+258 {contacts.phone}</div>
                                            </div>
                                        </a>

                                        {/* Email */}
                                        <a 
                                            href={`mailto:${contacts.email}`}
                                            className="flex items-center gap-3 p-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                                        >
                                            <div className="bg-red-100 p-2 rounded-lg">
                                                <FaEnvelope className="text-red-600 text-xl" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-semibold">Email</div>
                                                <div className="text-sm">{contacts.email}</div>
                                            </div>
                                        </a>
                                    </div>
                                </div>

                                {/* Quick Stats - Dynamic */}
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Estatísticas</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <FaEye className="text-blue-500" />
                                                <span className="text-gray-600">Visualizações</span>
                                            </div>
                                            <span className="font-bold text-gray-900">{viewCount}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <FaHeart className="text-red-500" />
                                                <span className="text-gray-600">Curtidas</span>
                                            </div>
                                            <span className="font-bold text-gray-900">{count}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <FaShare className="text-green-500" />
                                                <span className="text-gray-600">Compartilhamentos</span>
                                            </div>
                                            <span className="font-bold text-gray-900">{shareCount}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <FaCalendarAlt className="text-purple-500" />
                                                <span className="text-gray-600">Tempo no ar</span>
                                            </div>
                                            <span className="font-bold text-gray-900">
                                                {calculateTimeOnline(listing.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Safety Tips */}
                                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                                    <h3 className="text-lg font-bold text-yellow-800 mb-3">Dicas de Segurança</h3>
                                    <ul className="space-y-2 text-sm text-yellow-700">
                                        <li className="flex items-start gap-2">
                                            <span className="text-yellow-500">•</span>
                                            <span>Nunca faça pagamentos antecipados</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-yellow-500">•</span>
                                            <span>Verifique a documentação da propriedade</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-yellow-500">•</span>
                                            <span>Recomendamos visitas presenciais</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-yellow-500">•</span>
                                            <span>Desconfie de preços muito abaixo do mercado</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related Properties */}
                    <div className="max-w-6xl mx-auto px-3 py-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Propriedades Similares</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Aqui você pode adicionar o componente para propriedades similares */}
                            <div className="text-center py-12 bg-gray-100 rounded-2xl">
                                <p className="text-gray-500">Propriedades similares serão carregadas aqui</p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </main>
    );
}