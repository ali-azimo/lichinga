import React from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade } from 'swiper/modules'
import { FaSearch, FaArrowRight } from 'react-icons/fa'
import 'swiper/css'
import 'swiper/css/effect-fade'

export default function HeroSection({ backgroundSlides, propertyTypes }) {
  const welcomeMessages = [
    {
      title: "Encontre seu lar perfeito",
      subtitle: "A melhor seleção de propriedades para você e sua família",
      cta: "Explorar Propriedades",
      color: "from-blue-600/80 to-purple-600/80"
    },
    {
      title: "Sonhos que cabem no seu bolso",
      subtitle: "Ofertas exclusivas e condições especiais de pagamento",
      cta: "Ver Ofertas",
      color: "from-green-600/80 to-teal-600/80"
    },
    {
      title: "Investimento inteligente",
      subtitle: "Propriedades com alto potencial de valorização",
      cta: "Investir Agora",
      color: "from-orange-600/80 to-red-600/80"
    },
    {
      title: "Sua propriedade, nossa missão",
      subtitle: "Conectamos você às melhores oportunidades do mercado",
      cta: "Começar Agora",
      color: "from-indigo-600/80 to-blue-600/80"
    }
  ]

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background Slider */}
      <div className="absolute inset-0">
        <Swiper
          modules={[Autoplay, EffectFade]}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          }}
          effect="fade"
          speed={1500}
          loop={true}
          className="h-full w-full"
        >
          {backgroundSlides.length > 0 ? (
            backgroundSlides.map((slide, index) => (
              <SwiperSlide key={`${slide.listingId}-${index}`}>
                <div 
                  className="h-full w-full bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${slide.imageUrl})` }}
                >
                  <div className="absolute inset-0 bg-black/40"></div>
                </div>
              </SwiperSlide>
            ))
          ) : (
            [...Array(4)].map((_, index) => (
              <SwiperSlide key={`fallback-${index}`}>
                <div className={`h-full w-full ${
                  index === 0 ? 'bg-gradient-to-br from-blue-600 to-purple-600' :
                  index === 1 ? 'bg-gradient-to-br from-green-600 to-teal-600' :
                  index === 2 ? 'bg-gradient-to-br from-orange-600 to-red-600' :
                  'bg-gradient-to-br from-indigo-600 to-blue-600'
                }`}></div>
              </SwiperSlide>
            ))
          )}
        </Swiper>
      </div>

      {/* Overlay com gradiente escuro na parte inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

      {/* Conteúdo sobreposto */}
      <div className="relative h-full flex items-center">
        <div className="max-w-6xl mx-auto px-4 w-full">
          <div className="relative z-10">
            <Swiper
              modules={[Autoplay]}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              speed={1000}
              loop={true}
              direction="vertical"
              className="h-64"
            >
              {welcomeMessages.map((message, index) => (
                <SwiperSlide key={index}>
                  <div className="text-white text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                      {message.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-200 mb-8">
                      {message.subtitle}
                    </p>
                    <div className={`inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold ${message.color.replace('/80', '')} backdrop-blur-sm hover:opacity-90 transition-opacity`}>
                      <span>{message.cta}</span>
                      <FaArrowRight />
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Barra de busca */}
            <div className="mt-12 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-2">
                <div className="flex items-center bg-white rounded-lg overflow-hidden">
                  <div className="flex-1 p-4">
                    <input
                      type="text"
                      placeholder="O que você está procurando? (casa, apartamento, terreno...)"
                      className="w-full outline-none text-gray-800 placeholder-gray-500"
                    />
                  </div>
                  <Link
                    to="/search"
                    className="bg-blue-600 text-white p-4 hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <FaSearch />
                    <span className="hidden sm:inline">Buscar</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Indicadores de slide */}
      <div className="absolute bottom-8 right-8 z-10">
        <div className="flex items-center gap-2">
          {welcomeMessages.map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full bg-white/60"
            />
          ))}
        </div>
      </div>
    </div>
  )
}