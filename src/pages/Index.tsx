import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import Icon from "@/components/ui/icon"

const Index = () => {
  const [showChat, setShowChat] = useState(false)
  const [chatMessage, setChatMessage] = useState('')
  const [visibleStats, setVisibleStats] = useState<boolean[]>([false, false, false])
  const statsRef = useRef<HTMLDivElement>(null)
  const [currentReview, setCurrentReview] = useState(0)

  // Анимированный счетчик
  const useCountUp = (end: number, duration: number = 2000, isVisible: boolean = false) => {
    const [count, setCount] = useState(0)
    
    useEffect(() => {
      if (!isVisible) return
      
      let startTime: number
      const startValue = 0
      
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / duration, 1)
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        setCount(Math.floor(startValue + (end - startValue) * easeOutQuart))
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      
      requestAnimationFrame(animate)
    }, [end, duration, isVisible])
    
    return count
  }
  const [showCalculator, setShowCalculator] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    description: ''
  })
  const [calculatorData, setCalculatorData] = useState({
    documentType: '',
    productCategory: '',
    quantity: '',
    urgency: ''
  })
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null)

  // Intersection Observer для анимации статистики
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleStats([true, true, true])
          }
        })
      },
      { threshold: 0.3 }
    )

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Animation on scroll
  const observerRef = useRef<IntersectionObserver>()

  // Telegram Bot integration
  const sendToTelegram = () => {
    const docTypeNames = {
      'cert-tr-ts': 'Сертификат ТР ТС',
      'declaration-tr-ts': 'Декларация ТР ТС', 
      'cert-gost': 'Сертификат ГОСТ Р',
      'protocol': 'Протокол испытаний'
    }
    
    const categoryNames = {
      'food': 'Пищевые продукты',
      'electronics': 'Электроника',
      'textile': 'Текстиль',
      'toys': 'Игрушки',
      'construction': 'Стройматериалы'
    }
    
    const urgencyNames = {
      '1-day': '1 день',
      '3-days': '3 дня', 
      '7-days': '7 дней',
      '14-days': '14 дней'
    }

    const message = `🧮 Расчет стоимости сертификации

📋 Тип документа: ${docTypeNames[calculatorData.documentType as keyof typeof docTypeNames]}
🏷️ Категория: ${categoryNames[calculatorData.productCategory as keyof typeof categoryNames]}  
⏰ Срочность: ${urgencyNames[calculatorData.urgency as keyof typeof urgencyNames]}
💰 Стоимость: ${calculatedPrice?.toLocaleString()} ₽

Для получения точного расчета свяжитесь с нами!`

    const telegramUrl = `https://t.me/SertEcoPromBot?start=${encodeURIComponent(message)}`
    window.open(telegramUrl, '_blank')
  }
  
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up')
          }
        })
      },
      { threshold: 0.1 }
    )

    const elements = document.querySelectorAll('.scroll-animate')
    elements.forEach((el) => observerRef.current?.observe(el))

    return () => observerRef.current?.disconnect()
  }, [])

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate form submission
    alert('Заявка отправлена! Мы свяжемся с вами в течение часа.')
    setFormData({ name: '', phone: '', email: '', description: '' })
  }

  const calculatePrice = () => {
    if (!calculatorData.documentType || !calculatorData.productCategory) return

    const basePrices = {
      'cert-tr-ts': 15000,
      'declaration-tr-ts': 8000,
      'cert-gost': 12000,
      'protocol': 5000
    }

    const categoryMultipliers = {
      'food': 1.2,
      'electronics': 1.5,
      'textile': 1.0,
      'toys': 1.3,
      'construction': 1.1
    }

    const urgencyMultipliers = {
      '1-day': 2.0,
      '3-days': 1.5,
      '7-days': 1.2,
      '14-days': 1.0
    }

    const basePrice = basePrices[calculatorData.documentType as keyof typeof basePrices] || 10000
    const categoryMult = categoryMultipliers[calculatorData.productCategory as keyof typeof categoryMultipliers] || 1.0
    const urgencyMult = urgencyMultipliers[calculatorData.urgency as keyof typeof urgencyMultipliers] || 1.0

    const finalPrice = Math.round(basePrice * categoryMult * urgencyMult)
    setCalculatedPrice(finalPrice)
  }

  useEffect(() => {
    calculatePrice()
  }, [calculatorData])

  const services = [
    {
      title: "Селлеры",
      description: "Быстрая сертификация для маркетплейсов",
      icon: "Store",
      features: ["Без отказов и блокировок", "Гарантия принятия маркетплейсом", "Для любых категорий товаров", "Под ключ"]
    },
    {
      title: "Производители", 
      description: "Полный цикл сертификации продукции",
      icon: "Factory",
      features: ["ТР ТС", "ГОСТ Р", "Протоколы испытаний", "Разработка технической документации"]
    },
    {
      title: "Импортеры",
      description: "Документы для ввоза и продажи",
      icon: "Ship",
      features: ["Документы для прохождения таможни", "Декларации", "Сертификаты", "Подбор кодов ТН ВЭД"]
    }
  ]

  const benefits = [
    { icon: "Clock", title: "Сроки от 1 дня", description: "Минимальное время оформления" },
    { icon: "Shield", title: "Только аккредитованные органы", description: "Гарантия законности" },
    { icon: "FileCheck", title: "Работа по договору", description: "Полная юридическая защита" },
    { icon: "Zap", title: "Дистанционное оформление", description: "Не нужно приезжать в офис" }
  ]

  const documents = [
    "Сертификат соответствия ТР ТС",
    "Декларация ТР ТС", 
    "Сертификат ГОСТ Р",
    "Декларация ГОСТ Р",
    "Протоколы испытаний",
    "Свидетельство о государственной регистрации",
    "Отказные письма"
  ]

  const stats = [
    { value: 1000, label: "документов в 2024", suffix: "+" },
    { value: 10, label: "лет опыта", suffix: "+" },
    { value: 98, label: "заказов в срок", suffix: "%" }
  ]

  const reviews = [
    {
      text: "Карточки на Wildberries заблокировали, потому что не было сертификата. Нашла эту компанию по совету коллеги, оформили за два дня. Всё удалённо, без лишних бумаг, товар снова в продаже.",
      author: "Анна К.",
      location: "Москва",
      type: "Селлер (Wildberries)"
    },
    {
      text: "Загрузил новый товар на Ozon, и сразу запросили декларацию. Ребята сами подобрали нужную, сделали быстро, а я даже не отвлекался от работы. Удобно, что всё онлайн.",
      author: "Игорь Л.",
      location: "Санкт-Петербург",
      type: "Селлер (Ozon)"
    },
    {
      text: "Запускали линию по производству соусов, нужен был полный пакет документов: ТР ТС, протоколы испытаний, техдокументация. Всё сделали в срок, помогли пройти проверку без замечаний.",
      author: "ООО «Продукт-Сервис»",
      location: "Нижний Новгород",
      type: "Производитель (пищевая продукция)"
    },
    {
      text: "Везли партию электроники из Китая, на таможне попросили дополнительные сертификаты. Здесь оформили всё за три дня, подобрали правильный код ТН ВЭД. Груз забрали без задержек.",
      author: "Алексей М.",
      location: "Владивосток",
      type: "Импортер (электроника)"
    },
    {
      text: "Для участия в тендере требовался ГОСТ Р и протокол испытаний. Сделали всё под ключ, внесли в реестр, прислали оригиналы. Чётко, без затягивания сроков.",
      author: "ИП Ковалев",
      location: "Екатеринбург",
      type: "Производитель (строительные материалы)"
    },
    {
      text: "Пришлось оформить СГР на нашу линейку красок. Обратился сюда по совету знакомого — помогли с образцами, сами всё согласовали, а мне оставалось только подписать бумаги. Работать с ними оказалось проще, чем ожидал.",
      author: "Сергей Л.",
      location: "Самара",
      type: "Производитель (лакокрасочная продукция)"
    }
  ]

  const faqItems = [
    {
      question: "Чем отличается сертификат от декларации?",
      answer: "Выбор зависит от категории продукции и требований регламента. Мы подберем документ по ТН ВЭД/ОКПД2 и назначению товара."
    },
    {
      question: "Какие документы нужны для оформления?",
      answer: "Минимально: карточка товара/описание, ИНН/ОГРН, договор поставки/изготовления, образцы при необходимости. Список уточняем по продукту."
    },
    {
      question: "Сколько действует сертификат?",
      answer: "Срок действия зависит от схемы и регламента. Как правило, 1–5 лет. Подберем оптимальную схему под вашу задачу."
    },
    {
      question: "Можно ли оформить дистанционно?",
      answer: "Да, большинство документов можно оформить полностью дистанционно. Приезжать в офис не нужно."
    }
  ]

  // Автопрокрутка отзывов
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length)
    }, 4000) // Каждые 4 секунды
    
    return () => clearInterval(interval)
  }, [reviews.length])

  // Анимация при скролле
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate')
          }
        })
      },
      { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    const animateElements = document.querySelectorAll('.scroll-animate')
    animateElements.forEach((el) => observer.observe(el))

    return () => {
      animateElements.forEach((el) => observer.unobserve(el))
    }
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/95 border-b border-gray-100 sticky top-0 z-30 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3 animate-fade-in-left">
            <img 
              src="https://cdn.poehali.dev/files/0a530161-0435-431a-a1e0-85e903d56514.jpg" 
              alt="ГК СертЭкоПром" 
              className="w-10 h-10 rounded-full ring-2 ring-blue-100"
            />
            <div className="flex flex-col">
              <span className="text-lg font-800 text-gray-900 leading-tight font-extrabold tracking-tight">ГК СертЭкоПром</span>
              <span className="text-xs text-gray-400 font-medium">работаем с 2015 года</span>
            </div>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#services" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">Услуги</a>
            <a href="#benefits" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">Преимущества</a>
            <a href="#faq" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">FAQ</a>
          </nav>
          <div className="flex space-x-2 animate-fade-in-right">
            <Button 
              variant="outline"
              size="sm"
              className="border-gray-200 text-gray-700 font-semibold hover:border-blue-300 hover:text-blue-600"
              onClick={() => window.open('https://t.me/SertEcoPromBot', '_blank')}
            >
              <Icon name="Calculator" className="mr-2" size={15} />
              Калькулятор
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 font-semibold shadow-sm">
            <Icon name="Phone" className="mr-2" size={15} />
            Позвонить
          </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 py-24 overflow-hidden">
        {/* Декоративный фон */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50 rounded-full opacity-50 blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-50 rounded-full opacity-40 blur-2xl translate-y-1/2 -translate-x-1/4"></div>
          <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-blue-100 rounded-full opacity-20 blur-2xl"></div>
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-5 bg-blue-100 text-blue-700 font-semibold px-3 py-1 text-sm animate-scale-in border-0">
                <Icon name="Shield" size={13} className="mr-1.5 inline" />
                Сертификация ТР ТС и ГОСТ Р
              </Badge>
              <h1 className="text-5xl lg:text-6xl font-black text-gray-900 mb-5 leading-[1.05] tracking-tight">
                Сертификаты для запуска и масштабирования&nbsp;бизнеса
              </h1>
              <p className="text-xl text-gray-500 mb-10 leading-relaxed font-medium">
                Подготовим все документы от&nbsp;<span className="text-blue-600 font-bold">1 дня</span>. Официально. Дистанционно.
              </p>
              <div ref={statsRef} className="flex flex-wrap gap-10 mb-10">
                {stats.map((stat, index) => {
                  const AnimatedStat = () => {
                    const count = useCountUp(stat.value, 2000, visibleStats[index])
                    return (
                      <div key={index} className="scroll-animate" style={{ animationDelay: `${index * 0.2}s` }}>
                        <div className="stat-number text-4xl font-black text-blue-600 tabular-nums leading-none">
                          {count}<span className="text-blue-400">{stat.suffix}</span>
                        </div>
                        <div className="text-xs text-gray-500 uppercase tracking-widest mt-1.5 font-semibold">{stat.label}</div>
                      </div>
                    )
                  }
                  return <AnimatedStat key={index} />
                })}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 scroll-animate">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 font-bold text-base px-8 shadow-md hover:shadow-lg transition-all">
                  Получить расчёт
                </Button>
                <Button variant="outline" size="lg" onClick={() => setShowChat(true)} className="font-semibold text-base border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-all">
                  <Icon name="MessageCircle" className="mr-2" size={18} />
                  Онлайн-консультант
                </Button>
              </div>
            </div>
            <Card className="p-7 shadow-2xl scroll-animate border-0 ring-1 ring-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-1">Получите расчёт за 5 минут</h3>
              <p className="text-sm text-gray-400 mb-5 font-medium">Менеджер перезвонит в течение часа</p>
              <form className="space-y-3" onSubmit={handleFormSubmit}>
                <Input 
                  placeholder="Ваше имя" 
                  className="h-11 font-medium"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
                <Input 
                  placeholder="Телефон" 
                  type="tel"
                  className="h-11 font-medium"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                />
                <Input 
                  placeholder="Email" 
                  type="email"
                  className="h-11 font-medium"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
                <Textarea 
                  placeholder="Опишите вашу продукцию или вставьте ссылку"
                  className="font-medium resize-none"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
                <Button type="submit" size="lg" className="w-full bg-blue-600 hover:bg-blue-700 font-bold shadow-md">
                  Получить расчёт →
                </Button>
              </form>
              <p className="text-xs text-gray-400 mt-4 text-center">
                Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14 scroll-animate">
            <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">Наши клиенты</p>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4 tracking-tight">Для кого работаем</h2>
            <p className="text-lg text-gray-500 font-medium max-w-lg mx-auto">Решаем задачи разных категорий клиентов</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="p-7 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 scroll-animate border-0 ring-1 ring-gray-100 bg-white" style={{ animationDelay: `${index * 0.15}s` }}>
                <CardContent className="p-0">
                  <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-5">
                    <Icon name={service.icon} className="text-blue-600" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1.5">{service.title}</h3>
                  <p className="text-gray-500 mb-5 text-sm font-medium">{service.description}</p>
                  <ul className="space-y-2.5">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm font-medium text-gray-700">
                        <span className="w-5 h-5 bg-green-50 rounded-full flex items-center justify-center mr-2.5 flex-shrink-0">
                          <Icon name="Check" className="text-green-600" size={12} />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Problems & Benefits */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Problems */}
            <div className="scroll-animate bg-red-50 rounded-2xl p-8 border border-red-100">
              <div className="flex items-center gap-3 mb-7">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <Icon name="AlertTriangle" className="text-red-500" size={20} />
                </div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Без сертификатов</h2>
              </div>
              <div className="space-y-3.5">
                {[
                  "Партия готова, но нет сертификата — простаивает склад",
                  "Риски штрафов при проверках",
                  "Сложно понять, какой документ нужен",
                  "Долгие сроки оформления",
                  "Риск поддельных документов"
                ].map((problem, index) => (
                  <div key={index} className="flex items-start gap-3 bg-white rounded-xl px-4 py-3 shadow-sm">
                    <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon name="X" className="text-red-500" size={11} />
                    </span>
                    <span className="text-gray-700 text-sm font-medium leading-snug">{problem}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="scroll-animate bg-green-50 rounded-2xl p-8 border border-green-100">
              <div className="flex items-center gap-3 mb-7">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Icon name="CheckCircle" className="text-green-600" size={20} />
                </div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">С нами</h2>
              </div>
              <div className="space-y-3.5">
                {[
                  "Подбор правильного документа под продукцию",
                  "Минимальные сроки — от 1 дня",
                  "Сопровождение на всех этапах оформления",
                  "Полная юридическая значимость",
                  "Дистанционное оформление"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 bg-white rounded-xl px-4 py-3 shadow-sm">
                    <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon name="Check" className="text-green-600" size={11} />
                    </span>
                    <span className="text-gray-700 text-sm font-medium leading-snug">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="benefits" className="py-24 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14 scroll-animate">
            <p className="text-sm font-bold text-blue-200 uppercase tracking-widest mb-3">Наши преимущества</p>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">Почему нам доверяют</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white/10 backdrop-blur rounded-2xl p-6 scroll-animate hover:bg-white/20 transition-all duration-300 border border-white/10" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center mb-4">
                  <Icon name={benefit.icon} className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-1.5 leading-tight">{benefit.title}</h3>
                <p className="text-blue-200 text-sm font-medium leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documents */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14 scroll-animate">
            <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">Что оформляем</p>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4 tracking-tight">Документы, с которыми работаем</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto">
            {documents.map((doc, index) => (
              <div key={index} className="bg-white rounded-xl px-5 py-3.5 shadow-sm hover:shadow-md transition-all duration-200 scroll-animate flex items-center gap-3 border border-gray-100 hover:border-blue-200 hover:-translate-y-0.5" style={{ animationDelay: `${index * 0.08}s` }}>
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="FileText" className="text-blue-600" size={16} />
                </div>
                <span className="font-semibold text-gray-800 whitespace-nowrap text-sm">{doc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14 scroll-animate">
            <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">Отзывы</p>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4 tracking-tight">Клиенты о нас</h2>
            <p className="text-gray-500 max-w-xl mx-auto font-medium">Реальные истории о том, как мы помогли решить задачи с сертификацией</p>
          </div>
          {/* Слайдер отзывов */}
          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden rounded-2xl">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentReview * 100}%)` }}
              >
                {reviews.map((review, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-2">
                    <Card className="p-10 text-center bg-white shadow-xl border-0 ring-1 ring-gray-100">
                      <div className="mb-8">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                          <Icon name="Quote" className="text-blue-500" size={22} />
                        </div>
                        <p className="text-lg text-gray-700 leading-relaxed font-medium max-w-2xl mx-auto">"{review.text}"</p>
                      </div>
                      <div className="border-t border-gray-100 pt-6">
                        <p className="font-bold text-gray-900 text-lg mb-0.5">{review.author}</p>
                        <p className="text-sm text-gray-400 font-medium mb-3">{review.location}</p>
                        <span className="inline-block bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                          {review.type}
                        </span>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Индикаторы */}
            <div className="flex justify-center space-x-2 mt-6">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentReview(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentReview === index ? 'bg-blue-600 scale-125' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            {/* Стрелки навигации */}
            <button
              onClick={() => setCurrentReview((prev) => prev === 0 ? reviews.length - 1 : prev - 1)}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-lg rounded-full w-12 h-12 flex items-center justify-center hover:bg-gray-50 transition-all duration-300 hover:scale-110"
            >
              <Icon name="ChevronLeft" size={20} className="text-gray-600" />
            </button>
            
            <button
              onClick={() => setCurrentReview((prev) => (prev + 1) % reviews.length)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-lg rounded-full w-12 h-12 flex items-center justify-center hover:bg-gray-50 transition-all duration-300 hover:scale-110"
            >
              <Icon name="ChevronRight" size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14 scroll-animate">
            <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4 tracking-tight">Частые вопросы</h2>
          </div>
          <div className="max-w-3xl mx-auto scroll-animate space-y-3">
            <Accordion type="single" collapsible>
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-xl border border-gray-100 px-5 shadow-sm data-[state=open]:shadow-md transition-shadow">
                  <AccordionTrigger className="text-left hover:no-underline font-semibold text-gray-900 py-5">{item.question}</AccordionTrigger>
                  <AccordionContent className="text-gray-500 font-medium pb-5 leading-relaxed">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-white py-14">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            <div className="scroll-animate">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="https://cdn.poehali.dev/files/0659d6da-acf0-4dd3-9b84-ee6832ab2b4f.jpg" 
                  alt="ГК СертЭкоПром Logo" 
                  className="w-10 h-10 rounded-full ring-2 ring-white/10"
                />
                <span className="text-xl font-extrabold tracking-tight">ГК СертЭкоПром</span>
              </div>
              <p className="text-gray-400 text-sm font-medium leading-relaxed">
                Запустите или расширьте производство без бюрократических задержек
              </p>
            </div>
            <div className="scroll-animate">
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Контакты</h4>
              <div className="space-y-3">
                <a href="tel:+79889888559" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors font-medium text-sm">
                  <Icon name="Phone" size={15} />
                  <span>+7 988 988-85-59</span>
                </a>
                <a href="mailto:sertecoprom@yandex.ru" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors font-medium text-sm">
                  <Icon name="Mail" size={15} />
                  <span>sertecoprom@yandex.ru</span>
                </a>
              </div>
            </div>
            <div className="scroll-animate">
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Гарантии</h4>
              <ul className="text-gray-400 space-y-2 text-sm font-medium">
                <li className="flex items-center gap-2"><Icon name="Check" size={13} className="text-green-500" />Официальные документы в реестре ФСА</li>
                <li className="flex items-center gap-2"><Icon name="Check" size={13} className="text-green-500" />Работа по договору</li>
                <li className="flex items-center gap-2"><Icon name="Check" size={13} className="text-green-500" />Конфиденциальность данных</li>
                <li className="flex items-center gap-2"><Icon name="Check" size={13} className="text-green-500" />Возврат при невыполнении условий</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 text-center">
            <p className="text-gray-500 text-xs font-medium">
              © 2024 ГК СертЭкоПром. Все права защищены.{' '}·{' '}
              <a 
                href="https://docs.google.com/document/d/19RKw5BdlbItv9b-OctCKNYx3yX6e2GNeH80mRmHY_mM/edit?usp=sharing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Политика конфиденциальности
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-24 right-6 z-50">
        <Button 
          className="rounded-full w-14 h-14 shadow-xl bg-green-500 hover:bg-green-600 transition-all duration-300 transform hover:scale-110"
          onClick={() => window.open('https://wa.me/79889888559?text=Здравствуйте! Хочу узнать про сертификацию', '_blank')}
        >
          <Icon name="MessageCircle" size={20} className="text-white" />
        </Button>
      </div>

      {/* Floating Contact Button */}
      <div className="fixed bottom-6 right-6 z-50 group">
        <Button 
          className="rounded-full w-14 h-14 shadow-xl hover:shadow-2xl transition-all duration-300 bg-blue-600 hover:bg-blue-700 transform hover:scale-110"
          onClick={() => window.open('tel:+79889888559')}
        >
          <Icon name="Phone" size={20} className="text-white" />
        </Button>
        <div className="absolute -top-10 right-0 bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
          Позвонить сейчас
        </div>
      </div>

      {/* Calculator Dialog */}
      <Dialog open={showCalculator} onOpenChange={setShowCalculator}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Icon name="Calculator" className="mr-2" size={20} />
              Калькулятор стоимости
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Тип документа</Label>
              <Select value={calculatorData.documentType} onValueChange={(value) => setCalculatorData({...calculatorData, documentType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип документа" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cert-tr-ts">Сертификат ТР ТС</SelectItem>
                  <SelectItem value="declaration-tr-ts">Декларация ТР ТС</SelectItem>
                  <SelectItem value="cert-gost">Сертификат ГОСТ Р</SelectItem>
                  <SelectItem value="protocol">Протокол испытаний</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Категория продукции</Label>
              <Select value={calculatorData.productCategory} onValueChange={(value) => setCalculatorData({...calculatorData, productCategory: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="food">Пищевые продукты</SelectItem>
                  <SelectItem value="electronics">Электроника</SelectItem>
                  <SelectItem value="textile">Текстиль</SelectItem>
                  <SelectItem value="toys">Игрушки</SelectItem>
                  <SelectItem value="construction">Стройматериалы</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Срочность</Label>
              <Select value={calculatorData.urgency} onValueChange={(value) => setCalculatorData({...calculatorData, urgency: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите срок" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-day">1 день</SelectItem>
                  <SelectItem value="3-days">3 дня</SelectItem>
                  <SelectItem value="7-days">7 дней</SelectItem>
                  <SelectItem value="14-days">14 дней</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {calculatedPrice && (
              <Card className="p-4 bg-blue-50 border-blue-200">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {calculatedPrice.toLocaleString()} ₽
                  </div>
                  <p className="text-sm text-gray-600">Ориентировочная стоимость</p>
                </div>
              </Card>
            )}

            <div className="space-y-2">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700" 
                onClick={() => {
                  sendToTelegram()
                  setShowCalculator(false)
                }}
                disabled={!calculatedPrice}
              >
                <Icon name="Send" className="mr-2" size={16} />
                Отправить в Telegram
              </Button>
              
              <Button 
                variant="outline"
                className="w-full" 
                onClick={() => {
                  setShowCalculator(false)
                  alert('Расчет сохранен! Наш менеджер свяжется с вами для уточнения деталей.')
                }}
                disabled={!calculatedPrice}
              >
                Получить точный расчет
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Online Chat */}
      {showChat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in-up">
          <Card className="w-full max-w-md animate-scale-in">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-semibold">Онлайн-консультант</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowChat(false)}>
                <Icon name="X" size={16} />
              </Button>
            </div>
            <div className="p-4 h-64 overflow-y-auto bg-gray-50">
              <div className="bg-white p-3 rounded-lg mb-3 shadow-sm animate-fade-in-left">
                <p className="text-sm">👋 Здравствуйте! Я помогу с выбором документов для вашей продукции. Расскажите, что нужно сертифицировать?</p>
              </div>
              {chatMessage && (
                <div className="bg-blue-100 p-3 rounded-lg mb-3 ml-8 animate-fade-in-right">
                  <p className="text-sm">{chatMessage}</p>
                </div>
              )}
            </div>
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input 
                  placeholder="Напишите ваш вопрос..." 
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && setChatMessage('')}
                />
                <Button size="sm" onClick={() => setChatMessage('')}>
                  <Icon name="Send" size={16} />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}


    </div>
  )
}

export default Index