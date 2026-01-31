// Home.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import { 
  FaHome, 
  FaBuilding, 
  FaMountain, 
  FaSeedling, 
  FaHardHat, 
  FaTag, 
  FaSearch, 
  FaArrowRight,
  FaChartLine,
  FaShieldAlt,
  FaClock,
  FaUsers,
  FaMapMarkerAlt,
  FaStar,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaCalendarAlt
} from 'react-icons/fa';
import { GiMoneyStack } from 'react-icons/gi';

// Importar componente Service
import Service from './Service';

// Formatar preço em MZN
const formatPriceMZN = (price) => {
  if (!price) return 'Consultar';
  return `${price.toLocaleString('pt-MZ')} MZN`;
};

// Formatador de data
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-MZ', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

// Componente de Card de Propriedade
const PropertyCard = ({ listing }) => {
  const isRent = listing.transactionType === 'arrendar';
  const discountPrice = listing.offer && listing.discountPrice 
    ? listing.discountPrice 
    : (listing.offer ? listing.regularPrice * 0.8 : null);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 group transform hover:-translate-y-1">
      <Link to={`/listing/${listing._id}`} className="block">
        <div className="relative h-48 overflow-hidden">
          <img
            src={listing.imageUrls?.[0] || '/default-property.jpg'}
            alt={listing.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = '/default-property.jpg';
            }}
          />
          
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
              isRent ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
            } shadow-sm`}>
              {isRent ? 'ARREENDAR' : 'VENDA'}
            </span>
            
            {listing.offer && (
              <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold shadow-lg">
                PROMOÇÃO
              </span>
            )}
          </div>
        </div>
      </Link>
      
      <div className="p-4">
        <Link to={`/listing/${listing._id}`}>
          <h4 className="font-bold text-gray-800 mb-2 hover:text-blue-600 transition-colors line-clamp-1">
            {listing.name}
          </h4>
        </Link>
        
        {listing.address && (
          <div className="flex items-center gap-1 text-gray-600 text-sm mb-2">
            <FaMapMarkerAlt className="text-gray-400 text-xs flex-shrink-0" />
            <span className="line-clamp-1">{listing.address.split(',')[0]}</span>
          </div>
        )}
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 min-h-[40px]">
          {listing.description || 'Descrição não disponível'}
          {listing.description && listing.description.length > 100 && '...'}
        </p>
        
        {listing.createdAt && (
          <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
            <FaCalendarAlt className="text-gray-400" />
            <span>Publicado em {formatDate(listing.createdAt)}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <GiMoneyStack className="text-xl text-green-600" />
            <div>
              {listing.offer && discountPrice ? (
                <>
                  <p className="text-lg font-bold text-green-700">
                    {formatPriceMZN(discountPrice)}
                  </p>
                  <p className="text-xs text-gray-500 line-through">
                    {formatPriceMZN(listing.regularPrice)}
                  </p>
                </>
              ) : (
                <p className="text-lg font-bold text-green-700">
                  {formatPriceMZN(listing.regularPrice)}
                </p>
              )}
              {isRent && (
                <span className="text-xs text-gray-500">/mês</span>
              )}
            </div>
          </div>
          
          {listing.offer && !discountPrice && (
            <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">20% OFF</span>
          )}
        </div>
        
        <div className="flex items-center justify-between text-gray-600 border-t border-gray-100 pt-3">
          <div className="flex items-center gap-4">
            {listing.bedroom > 0 && (
              <div className="flex items-center gap-1" title="Quartos">
                <FaBed className="text-blue-500 text-sm" />
                <span className="text-sm font-medium">{listing.bedroom}</span>
              </div>
            )}
            
            {listing.bathroom > 0 && (
              <div className="flex items-center gap-1" title="Banheiros">
                <FaBath className="text-teal-500 text-sm" />
                <span className="text-sm font-medium">{listing.bathroom}</span>
              </div>
            )}
            
            {listing.area > 0 && (
              <div className="flex items-center gap-1" title="Área">
                <FaRulerCombined className="text-orange-500 text-sm" />
                <span className="text-sm font-medium">{listing.area}m²</span>
              </div>
            )}
          </div>
          
          {listing.address && (
            <div className="text-xs text-gray-500 line-clamp-1 max-w-[100px]">
              {listing.address.split(',')[0]}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [featuredListings, setFeaturedListings] = useState([]);
  const [propertyTypeListings, setPropertyTypeListings] = useState({});
  const [loading, setLoading] = useState(true);
  const [backgroundSlides, setBackgroundSlides] = useState([]);
  const [stats, setStats] = useState({
    totalProperties: 0,
    satisfiedClients: 0,
    citiesCovered: 0,
    activeUsers: 0
  });

  // Tipos de propriedades
  const propertyTypes = [
    { id: 'casa', name: 'Casas', icon: <FaHome />, color: 'bg-blue-100 text-blue-600' },
    { id: 'apartamento', name: 'Apartamentos', icon: <FaBuilding />, color: 'bg-purple-100 text-purple-600' },
    { id: 'terreno', name: 'Terrenos', icon: <FaMountain />, color: 'bg-green-100 text-green-600' },
    { id: 'machamba', name: 'Machambas', icon: <FaSeedling />, color: 'bg-yellow-100 text-yellow-600' },
    { id: 'obra', name: 'Obras', icon: <FaHardHat />, color: 'bg-orange-100 text-orange-600' },
  ];

  // Mensagens de boas-vindas
  const welcomeMessages = [
    {
      title: "Encontre seu Lar dos Sonhos",
      subtitle: "A melhor seleção de propriedades em Moçambique",
      gradient: "from-blue-600/90 to-purple-600/90",
      cta: "Explorar Propriedades"
    },
    {
      title: "Investimento Inteligente",
      subtitle: "Propriedades com alto potencial de valorização",
      gradient: "from-green-600/90 to-teal-600/90",
      cta: "Ver Oportunidades"
    },
    {
      title: "Arrendamento Seguro",
      subtitle: "Contratos transparentes e propriedades verificadas",
      gradient: "from-orange-600/90 to-red-600/90",
      cta: "Encontrar Arrendamento"
    },
    {
      title: "Compra Facilitada",
      subtitle: "Financiamento e condições especiais",
      gradient: "from-indigo-600/90 to-blue-600/90",
      cta: "Comprar Agora"
    }
  ];

  // Buscar dados iniciais
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        // Buscar estatísticas
        const statsRes = await fetch('/api/stats');
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        // Buscar imagens para background slider
        const bgRes = await fetch('/api/listing/get?limit=8&sort=-createdAt');
        const bgData = await bgRes.json();
        
        const slides = bgData
          .filter(listing => listing.imageUrls?.[0])
          .slice(0, 6)
          .map(listing => ({
            imageUrl: listing.imageUrls[0],
            listingId: listing._id,
            title: listing.name
          }));
        
        setBackgroundSlides(slides.length > 0 ? slides : [
          { fallback: 'bg-gradient-to-br from-blue-600 to-purple-600' },
          { fallback: 'bg-gradient-to-br from-green-600 to-teal-600' },
          { fallback: 'bg-gradient-to-br from-orange-600 to-red-600' }
        ]);

        // Buscar dados
        const [offerData, featuredData] = await Promise.all([
          fetch('/api/listing/get?offer=true&limit=4').then(res => res.json()),
          fetch('/api/listing/get?featured=true&limit=8').then(res => res.json())
        ]);

        setOfferListings(offerData);
        setFeaturedListings(featuredData);

        // Buscar por tipos de propriedade
        const typePromises = propertyTypes.map(type =>
          fetch(`/api/listing/get?type=${type.id}&limit=4&sort=-createdAt`)
            .then(res => res.json())
            .then(data => ({ [type.id]: data }))
            .catch(() => ({ [type.id]: [] }))
        );

        const typeResults = await Promise.all(typePromises);
        const typeData = typeResults.reduce((acc, curr) => ({ ...acc, ...curr }), {});
        setPropertyTypeListings(typeData);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          <p className="mt-4 text-gray-600 text-lg">Carregando as melhores propriedades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-screen">
        {/* Background Slider */}
        <div className="absolute inset-0">
          <Swiper
            modules={[Autoplay, EffectFade]}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            effect="fade"
            speed={1500}
            loop={true}
            className="h-full w-full"
          >
            {backgroundSlides.map((slide, index) => (
              <SwiperSlide key={index}>
                {slide.fallback ? (
                  <div className={`h-full w-full ${slide.fallback}`}></div>
                ) : (
                  <div 
                    className="h-full w-full bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${slide.imageUrl})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Conteúdo Hero */}
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <div className="relative z-10 text-center">
              <Swiper
                modules={[Autoplay]}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                speed={1000}
                loop={true}
                direction="vertical"
                className="h-72 mb-12"
              >
                {welcomeMessages.map((message, index) => (
                  <SwiperSlide key={index}>
                    <div className="text-white">
                      <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight drop-shadow-lg">
                        {message.title}
                      </h1>
                      <p className="text-2xl md:text-3xl text-gray-200 mb-8 drop-shadow">
                        {message.subtitle}
                      </p>
                      <Link
                        to="/search"
                        className={`inline-flex items-center gap-3 px-10 py-4 rounded-xl font-bold bg-gradient-to-r ${message.gradient} hover:opacity-90 transition-all duration-300 text-white text-lg shadow-xl hover:shadow-2xl`}
                      >
                        <span>{message.cta}</span>
                        <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                      </Link>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Estatísticas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
                {[
                  { 
                    label: 'Propriedades', 
                    value: `${stats.totalProperties}+`, 
                    icon: <FaHome />,
                    description: 'Listagens ativas'
                  },
                  { 
                    label: 'Clientes Satisfeitos', 
                    value: `${stats.satisfiedClients}+`, 
                    icon: <FaUsers />,
                    description: 'Transações concluídas'
                  },
                  { 
                    label: 'Cidades Atendidas', 
                    value: `${stats.citiesCovered}+`, 
                    icon: <FaMapMarkerAlt />,
                    description: 'Em todo o país'
                  },
                  { 
                    label: 'Usuários Ativos', 
                    value: `${stats.activeUsers}+`, 
                    icon: <FaChartLine />,
                    description: 'Na plataforma'
                  }
                ].map((stat, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="text-white/90 group-hover:scale-110 transition-transform">
                          {stat.icon}
                        </div>
                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                      </div>
                      <div className="text-white/80 text-sm text-center font-medium mb-1">{stat.label}</div>
                      <div className="text-white/60 text-xs text-center">{stat.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </div>
      </div>

      {/* Tipos de Propriedade */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Encontre por Categoria
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Explore nossa seleção de propriedades categorizadas para facilitar sua busca
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {propertyTypes.map((type) => {
              const count = propertyTypeListings[type.id]?.length || 0;
              return (
                <Link
                  key={type.id}
                  to={`/search?type=${type.id}`}
                  className="group text-center"
                >
                  <div className={`${type.color} p-8 rounded-2xl mb-4 transform group-hover:-translate-y-2 transition-all duration-300 group-hover:shadow-2xl relative overflow-hidden`}>
                    <div className="relative z-10 text-4xl">
                      {type.icon}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {count > 0 && (
                      <div className="absolute top-2 right-2 bg-white/90 text-gray-800 text-xs font-bold px-2 py-1 rounded-full">
                        {count}
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors text-lg">
                    {type.name}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {count} propriedade{count !== 1 ? 's' : ''}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ofertas Especiais */}
      {offerListings.length > 0 && (
        <section className="py-16 bg-gradient-to-r from-red-50 to-orange-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-red-100 text-red-600">
                  <FaTag className="text-xl" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">Ofertas Imperdíveis</h2>
                  <p className="text-gray-600">Propriedades com desconto exclusivo</p>
                </div>
              </div>
              <Link 
                to="/search?offer=true"
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2 group"
              >
                Ver todas as ofertas
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {offerListings.map((listing) => (
                <PropertyCard key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lançamentos Recentes */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Lançamentos Recentes
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Confira as propriedades mais recentes adicionadas à nossa plataforma
            </p>
          </div>

          <div className="space-y-16">
            {propertyTypes.map((type) => {
              const listings = propertyTypeListings[type.id] || [];
              if (listings.length === 0) return null;

              return (
                <div key={type.id} className="mb-12">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-full ${type.color}`}>
                        {type.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{type.name}</h3>
                        <p className="text-gray-600">Adicionadas recentemente</p>
                      </div>
                    </div>
                    <Link 
                      to={`/search?type=${type.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 group"
                    >
                      Ver mais
                      <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {listings.map((listing) => (
                      <PropertyCard key={listing._id} listing={listing} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Propriedades em Destaque */}
      {featuredListings.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-3">
                <FaStar className="text-yellow-500 text-2xl" />
                <h2 className="text-4xl font-bold text-gray-800">
                  Destaques da Semana
                </h2>
                <FaStar className="text-yellow-500 text-2xl" />
              </div>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                As propriedades mais populares e bem avaliadas
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredListings.map((listing) => (
                <PropertyCard key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Seção de Serviços (Componente Separado) */}
      <Service />

      {/* Footer CTA Simples */}
      <section className="py-12 bg-gradient-to-r from-blue-900 to-blue-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-white">
              <h3 className="text-2xl font-bold mb-2">Precisa de ajuda para encontrar o imóvel perfeito?</h3>
              <p className="text-blue-100">Nossos especialistas estão prontos para te auxiliar gratuitamente</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/search"
                className="bg-white text-blue-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <FaSearch />
                Explorar Propriedades
              </Link>
              <Link
                to="/servicos"
                className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <FaStar />
                Ver Serviços
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}