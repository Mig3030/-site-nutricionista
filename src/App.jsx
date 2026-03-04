import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useScrollAnimation, useParallax, useHoverAnimation } from './hooks/useScrollAnimation.js'
import { Button } from './components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card.jsx'
import { Badge } from './components/ui/badge.jsx'
import { Input } from './components/ui/input.jsx'
import { Textarea } from './components/ui/textarea.jsx'
import { Label } from './components/ui/label.jsx'
import {
  Heart,
  Users,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
  CheckCircle,
  Target,
  Award
} from 'lucide-react'
import { Facebook, Instagram } from 'lucide-react'
import Logo from '../public/images/logo.jpeg'
import GiovannaPhoto from '../public/images/giovanna.png'
import AgendamentoConsulta from './components/AgendamentoConsulta.jsx'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

function App() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    mensagem: ''
  })
  
  const [isAgendamentoOpen, setIsAgendamentoOpen] = useState(false)
  
  // Refs para animações
  const heroRef = useRef(null)
  const heroImageRef = useRef(null)
  const sobreRef = useRef(null)
  const servicosRef = useRef(null)
  const depoimentosRef = useRef(null)
  const contatoRef = useRef(null)

  // Animações de scroll
  const heroTitleRef = useScrollAnimation({ duration: 0.8, y: 50, delay: 0.2 })
  const heroDescRef = useScrollAnimation({ duration: 0.8, y: 30, delay: 0.4 })
  const heroButtonRef = useScrollAnimation({ duration: 0.8, y: 40, delay: 0.6 })

  // Animação de parallax para imagem do hero
  useEffect(() => {
    if (!heroImageRef.current) return
    
    gsap.to(heroImageRef.current, {
      y: (i, target) => {
        return gsap.getProperty(target, 'offsetHeight') * 0.1
      },
      scrollTrigger: {
        trigger: heroImageRef.current,
        scrub: 1,
      },
    })
  }, [])

  // Animação do header ao scroll
  

  // Animação das seções ao entrar na viewport
  useEffect(() => {
    const sections = [sobreRef, servicosRef, depoimentosRef, contatoRef]
    
    sections.forEach((ref) => {
      if (!ref.current) return
      
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  // Animação dos cards de serviço
  useEffect(() => {
    const cards = document.querySelectorAll('[data-service-card]')
    
    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: index * 0.1,
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      // Hover animation
      card.addEventListener('mouseenter', () => {
        gsap.to(card, { y: -10, duration: 0.3, ease: 'power2.out' })
      })

      card.addEventListener('mouseleave', () => {
        gsap.to(card, { y: 0, duration: 0.3, ease: 'power2.out' })
      })
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  // Animação dos depoimentos
  useEffect(() => {
    const testimonials = document.querySelectorAll('[data-testimonial]')
    
    testimonials.forEach((testimonial, index) => {
      gsap.fromTo(
        testimonial,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          delay: index * 0.1,
          scrollTrigger: {
            trigger: testimonial,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.nome)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('phone', formData.telefone)
      formDataToSend.append('message', formData.mensagem)

      const response = await fetch('https://formspree.io/f/xjkryqrp', {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Accept': 'application/json'
        }
      })

      if (response.ok) {
        alert('Mensagem enviada com sucesso! Entraremos em contato em breve.')
        setFormData({ nome: '', email: '', telefone: '', mensagem: '' })
      } else {
        alert('Erro ao enviar mensagem. Tente novamente.')
      }
    } catch (error) {
      alert('Erro ao conectar ao servidor.')
      console.error('Erro:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 w-full">
            <div className="flex items-center">
              <img src={Logo} alt="NUTRI PEQUENOS PASSOS Logo" className="h-10 w-auto mr-2" />
              <span className="text-xl font-bold text-gray-900 hidden sm:inline">NUTRI PEQUENOS PASSOS</span>
              <div className="flex items-center space-x-3 ml-4">
                <a href="https://www.instagram.com/nutripequenospassos/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="transform hover:scale-110 transition-transform duration-300">
                  <Instagram className="h-6 w-6 text-pink-500 hover:text-pink-700 transition-colors" />
                </a>
                <a href="https://www.facebook.com/people/Nutri-pequenos-passos/61572299105703/#" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="transform hover:scale-110 transition-transform duration-300">
                  <Facebook className="h-6 w-6 text-pink-500 hover:text-pink-700 transition-colors" />
                </a>
              </div>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#inicio" className="text-gray-700 hover:text-pink-500 transition-colors duration-300">Início</a>
              <a href="#sobre" className="text-gray-700 hover:text-pink-500 transition-colors duration-300">Sobre</a>
              <a href="#servicos" className="text-gray-700 hover:text-pink-500 transition-colors duration-300">Serviços</a>
              <a href="#depoimentos" className="text-gray-700 hover:text-pink-500 transition-colors duration-300">Depoimentos</a>
              <a href="#contato" className="text-gray-700 hover:text-pink-500 transition-colors duration-300">Contato</a>
            </div>
            <Button 
              className="bg-pink-500 hover:bg-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              onClick={() => setIsAgendamentoOpen(true)}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Agendar Consulta
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="py-20 px-4 sm:px-6 lg:px-8 overflow-hidden" ref={heroRef}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 ref={heroTitleRef} className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Invista na sua 
                <span className="text-pink-500"> saúde</span> através da alimentação
              </h1>
              <p ref={heroDescRef} className="mt-4 text-lg text-gray-700">
                A Nutri Pequenos Passos é um conjunto de ideias, especializada em nutrição materno infantil, que tem como objetivo tratar do público infantojuvenil, ou seja, especialidade em gestantes, crianças e adolescentes, e também cuidamos da reeducação alimentar familiar.
              </p>
              <div ref={heroButtonRef} className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button 
                  size="lg" 
                  className="bg-pink-500 hover:bg-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                  onClick={() => setIsAgendamentoOpen(true)}
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Agendar Primeira Consulta
                </Button>
                <Button size="lg" variant="outline" className="border-pink-500 text-pink-500 hover:bg-pink-50 transition-all duration-300">
                  Saiba Mais
                </Button>
              </div>
            </div>
            <div ref={heroImageRef} className="relative">
              <div className="bg-pink-100 rounded-full w-96 h-96 mx-auto flex items-center justify-center shadow-2xl">
                <div className="bg-pink-200 rounded-full w-80 h-80 flex items-center justify-center p-8 overflow-hidden">
                  <img src={Logo} alt="NUTRI PEQUENOS PASSOS Logo" className="w-full h-full object-cover rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre Section */}
      <section id="sobre" className="py-20 bg-white px-4 sm:px-6 lg:px-8" ref={sobreRef}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img src={GiovannaPhoto} alt="Giovanna - Nutricionista" className="rounded-lg shadow-2xl w-full h-auto object-cover hover:shadow-3xl transition-shadow duration-300" />
            </div>
            <div>
              <Badge className="bg-pink-100 text-pink-800 mb-4">Sobre a Profissional</Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Olá! Sou Giovanna</h2>
              <p className="mt-4 text-lg text-gray-700 leading-relaxed">
                Sou nutricionista formada pela <strong>PUCPR</strong>, especializada em <strong>Nutrição Materno Infantil</strong> e em <strong>Hebiatria</strong>, abrangendo desde a tentativa de gravidez até a adolescência.
              </p>
              <p className="mt-4 text-lg text-gray-700 leading-relaxed">
                Minha missão é ajudá-lo a conquistar seus objetivos de saúde e bem-estar com acompanhamento individualizado e técnicas que realmente funcionam para seu corpo e rotina.
              </p>
              <p className="mt-4 text-lg text-gray-700 leading-relaxed">
                Com anos de experiência e atualizações constantes, estou aqui para guiar você em uma jornada transformadora.
              </p>
              <div className="space-y-4 mt-6">
                <div className="flex items-center transform hover:translate-x-2 transition-transform duration-300">
                  <Award className="h-5 w-5 text-pink-500 mr-3" />
                  <span>Graduação em Nutrição - PUC-PR</span>
                </div>
                <div className="flex items-center transform hover:translate-x-2 transition-transform duration-300">
                  <Award className="h-5 w-5 text-pink-500 mr-3" />
                  <span>Especialização em Nutrição Materno Infantil</span>
                </div>
                <div className="flex items-center transform hover:translate-x-2 transition-transform duration-300">
                  <Award className="h-5 w-5 text-pink-500 mr-3" />
                  <span>Especialização em Nutrição Pediátrica e Hebiatria</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Serviços Section */}
      <section id="servicos" className="py-20 bg-pink-50 px-4 sm:px-6 lg:px-8" ref={servicosRef}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-pink-100 text-pink-800 mb-4">Serviços</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Como posso te ajudar
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ofereço atendimento personalizado e humanizado, com foco nos seus objetivos e necessidades específicas.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card data-service-card className="hover:shadow-2xl transition-all duration-300 border-pink-100">
              <CardHeader>
                <Users className="h-12 w-12 text-pink-500 mb-4" />
                <CardTitle>Nutrição para Adultos</CardTitle>
                <CardDescription>
                  R$ 240,00 - Inclui 1 consulta + 1 retorno. Foco em acompanhamento nutricional e demandas personalizadas.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-pink-500 mr-2" />Acompanhamento nutricional</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-pink-500 mr-2" />Exames bioquímicos</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-pink-500 mr-2" />Acompanhamento em tempo real via WhatsApp</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-pink-500 mr-2" />Demandas personalizadas</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-pink-500 mr-2" />Opcional: Cardápio mensal</li>
                </ul>
              </CardContent>
            </Card>

            <Card data-service-card className="hover:shadow-2xl transition-all duration-300 border-pink-100">
              <CardHeader>
                <Heart className="h-12 w-12 text-pink-500 mb-4" />
                <CardTitle>Nutrição Materno-Infantil (0 a 12 anos)</CardTitle>
                <CardDescription>
                  R$ 220,00 - Inclui 1 consulta + 1 retorno. Foco em educação alimentar e acompanhamento nutricional.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-pink-500 mr-2" />Acompanhamento nutricional</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-pink-500 mr-2" />Educação alimentar nutricional</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-pink-500 mr-2" />Exames bioquímicos</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-pink-500 mr-2" />Acompanhamento em tempo real via WhatsApp</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-pink-500 mr-2" />Opcional: Cardápio mensal</li>
                </ul>
              </CardContent>
            </Card>

            <Card data-service-card className="hover:shadow-2xl transition-all duration-300 border-pink-100">
              <CardHeader>
                <Target className="h-12 w-12 text-pink-500 mb-4" />
                <CardTitle>Nutrição em Família</CardTitle>
                <CardDescription>
                  R$ 799,90 - Inclui 1 consulta + 1 retorno. Foco em reeducação alimentar familiar completa.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-pink-500 mr-2" />Acompanhamento familiar completo</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-pink-500 mr-2" />Cardápios individuais e coletivo</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-pink-500 mr-2" />Exames laboratoriais</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-pink-500 mr-2" />Acompanhamento de 2 adultos + 2 crianças</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-pink-500 mr-2" />Reeducação alimentar eficaz em família</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Depoimentos Section */}
      <section id="depoimentos" className="py-20 bg-white px-4 sm:px-6 lg:px-8" ref={depoimentosRef}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-pink-100 text-pink-800 mb-4">Depoimentos</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              O que nossos pacientes dizem
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card data-testimonial className="hover:shadow-xl transition-all duration-300">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "A NUTRI PEQUENOS PASSOS transformou completamente minha relação com a comida. Perdi 15kg de forma saudável e sustentável. Recomendo para todos!"
                </p>
                <div className="flex items-center">
                  <div className="bg-pink-100 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                    <span className="text-pink-500 font-semibold">M</span>
                  </div>
                  <div>
                    <p className="font-semibold">Maria Santos</p>
                    <p className="text-sm text-gray-500">Paciente há 8 meses</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testimonial className="hover:shadow-xl transition-all duration-300">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "Como atleta, precisava de uma nutrição específica. A NUTRI PEQUENOS PASSOS me ajudou a melhorar minha performance e recuperação. Excelente profissional!"
                </p>
                <div className="flex items-center">
                  <div className="bg-pink-100 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                    <span className="text-pink-500 font-semibold">J</span>
                  </div>
                  <div>
                    <p className="font-semibold">João Silva</p>
                    <p className="text-sm text-gray-500">Triatleta</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testimonial className="hover:shadow-xl transition-all duration-300">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "Consegui controlar minha diabetes através das orientações da NUTRI PEQUENOS PASSOS. Ela é muito atenciosa e sempre disponível para esclarecer dúvidas."
                </p>
                <div className="flex items-center">
                  <div className="bg-pink-100 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                    <span className="text-pink-500 font-semibold">C</span>
                  </div>
                  <div>
                    <p className="font-semibold">Carlos Oliveira</p>
                    <p className="text-sm text-gray-500">Paciente há 1 ano</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contato Section */}
      <section id="contato" className="py-20 bg-pink-50 px-4 sm:px-6 lg:px-8" ref={contatoRef}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-pink-100 text-pink-800 mb-4">Contato</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Vamos conversar?
            </h2>
            <p className="text-xl text-gray-600">
              Entre em contato para agendar sua consulta ou esclarecer dúvidas
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Informações de Contato</h3>
              <div className="space-y-6">
                <div className="flex items-center transform hover:translate-x-2 transition-transform duration-300">
                  <Phone className="h-6 w-6 text-pink-500 mr-4" />
                  <div>
                    <p className="font-semibold">Telefone</p>
                    <p className="text-gray-600">(41) 98707-8320</p>
                  </div>
                </div>
                <div className="flex items-center transform hover:translate-x-2 transition-transform duration-300">
                  <Mail className="h-6 w-6 text-pink-500 mr-4" />
                  <div>
                    <p className="font-semibold">E-mail</p>
                    <p className="text-gray-600">nutripequenospassos@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center transform hover:translate-x-2 transition-transform duration-300">
                  <MapPin className="h-6 w-6 text-pink-500 mr-4" />
                  <div>
                    <p className="font-semibold">Endereço</p>
                    <p className="text-gray-600">Rua Georgi Elias Dayoub Wassouf, 28 - Sala 14 - Novo Mundo, Curitiba - PR</p>
                  </div>
                </div>
                <div className="flex items-center transform hover:translate-x-2 transition-transform duration-300">
                  <Clock className="h-6 w-6 text-pink-500 mr-4" />
                  <div>
                    <p className="font-semibold">Horário de Atendimento</p>
                    <p className="text-gray-600">Segunda a Sexta: 8h às 18h<br />Sábado: 8h às 12h</p>
                  </div>
                </div>
                <div className="mt-6">
                  <h4 className="font-semibold mb-2">Localização no Mapa</h4>
                  <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden border border-gray-200">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3602.483933392394!2d-49.29750298552937!3d-25.45555888377728!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94dce38d3b2b636f%3A0x3a5b9e5d3e4f2d3!2sR.%20Georgi%20Elias%20Dayoub%20Wassouf%2C%2028%20-%20Novo%20Mundo%2C%20Curitiba%20-%20PR%2C%2081050-410!5e0!3m2!1spt-BR!2sbr!4v1678886400000!5m2!1spt-BR!2sbr"
                      width="100%"
                      height="200"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </div>
                <div className="flex space-x-4 mt-6">
                  <a href="https://www.facebook.com/profile.php?id=61572299105703" target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-700 transition-colors duration-300 transform hover:scale-110">
                    <Facebook className="h-8 w-8" />
                  </a>
                  <a href="https://www.instagram.com/nutripequenospassos/" target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-700 transition-colors duration-300 transform hover:scale-110">
                    <Instagram className="h-8 w-8" />
                  </a>
                </div>
              </div>
            </div>
            
            <Card className="border-pink-100">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-4">Envie uma Mensagem</CardTitle>
                <CardDescription>Preencha o formulário abaixo e entraremos em contato em breve</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="nome" className="text-gray-700">Nome Completo</Label>
                    <Input id="nome" name="nome" value={formData.nome} onChange={handleInputChange} required className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-gray-700">E-mail</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="telefone" className="text-gray-700">Telefone</Label>
                    <Input id="telefone" name="telefone" value={formData.telefone} onChange={handleInputChange} className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="mensagem" className="text-gray-700">Mensagem</Label>
                    <Textarea id="mensagem" name="mensagem" value={formData.mensagem} onChange={handleInputChange} rows={4} required className="mt-2" />
                  </div>
                  <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 transition-all duration-300">
                    Enviar Mensagem
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">NUTRI PEQUENOS PASSOS</h3>
              <p className="text-gray-400">
                Transformando vidas através de uma alimentação saudável e personalizada.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Links Rápidos</h3>
              <ul className="space-y-2">
                <li><a href="#inicio" className="text-gray-400 hover:text-white transition-colors duration-300">Início</a></li>
                <li><a href="#sobre" className="text-gray-400 hover:text-white transition-colors duration-300">Sobre</a></li>
                <li><a href="#servicos" className="text-gray-400 hover:text-white transition-colors duration-300">Serviços</a></li>
                <li><a href="#depoimentos" className="text-gray-400 hover:text-white transition-colors duration-300">Depoimentos</a></li>
                <li><a href="#contato" className="text-gray-400 hover:text-white transition-colors duration-300">Contato</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contato</h3>
              <ul className="space-y-2 text-gray-400">
                <li>(41) 98707-8320</li>
                <li>nutripequenospassos@gmail.com</li>
                <li>Rua Georgi Elias Dayoub Wassouf, 28 - Sala 14 - Novo Mundo, Curitiba - PR</li>
              </ul>
            </div>
          </div>
          
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 NUTRI PEQUENOS PASSOS. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Modal de Agendamento */}
      <AgendamentoConsulta 
        isOpen={isAgendamentoOpen} 
        onClose={() => setIsAgendamentoOpen(false)} 
      />
    </div>
  )
}

export default App

