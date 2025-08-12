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
      features: ["Таможенное оформление", "Декларации", "Сертификаты"]
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
    "Протоколы испытаний"
  ]

  const stats = [
    { value: "1000+", label: "документов в 2024" },
    { value: "10+", label: "лет опыта" },
    { value: "98%", label: "заказов в срок" }
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 backdrop-blur-sm bg-white/95">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2 animate-fade-in-left">
            <img 
              src="https://cdn.poehali.dev/files/0a530161-0435-431a-a1e0-85e903d56514.jpg" 
              alt="ГК СертЭкоПром" 
              className="w-8 h-8 rounded-full"
            />
            <h1 className="text-2xl font-bold text-gray-900">ГК СертЭкоПром</h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#services" className="text-gray-700 hover:text-blue-600 transition-colors">Услуги</a>
            <a href="#benefits" className="text-gray-700 hover:text-blue-600 transition-colors">Преимущества</a>
            <a href="#faq" className="text-gray-700 hover:text-blue-600 transition-colors">FAQ</a>
          </nav>
          <div className="flex space-x-2 animate-fade-in-right">
            <Button 
              variant="outline"
              onClick={() => window.open('https://t.me/SertEcoPromBot', '_blank')}
            >
              <Icon name="Calculator" className="mr-2" size={16} />
              Калькулятор
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
            <Icon name="Phone" className="mr-2" size={16} />
            Позвонить
          </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-blue-100 text-blue-800 animate-scale-in">Сертификация ТР ТС и ГОСТ Р</Badge>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Сертификаты для запуска и масштабирования производства
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Подготовим все документы от 1 дня.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center scroll-animate" style={{ animationDelay: `${index * 0.2}s` }}>
                    <div className="text-3xl font-bold text-blue-600">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4 scroll-animate">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all">
                  Получить расчет
                </Button>
                <Button variant="outline" size="lg" onClick={() => setShowChat(true)} className="hover:scale-105 transition-all">
                  <Icon name="MessageCircle" className="mr-2" size={16} />
                  Онлайн-консультант
                </Button>
              </div>
            </div>
            <Card className="p-6 shadow-xl scroll-animate hover:shadow-2xl transition-shadow">
              <h3 className="text-2xl font-semibold mb-4">Получите расчет за 5 минут</h3>
              <form className="space-y-4" onSubmit={handleFormSubmit}>
                <Input 
                  placeholder="Ваше имя" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
                <Input 
                  placeholder="Телефон" 
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                />
                <Input 
                  placeholder="Email" 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
                <Textarea 
                  placeholder="Опишите вашу продукцию или вставьте ссылку"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all">
                  Получить расчет
                </Button>
              </form>
              <p className="text-xs text-gray-500 mt-4">
                Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 scroll-animate">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Для кого работаем</h2>
            <p className="text-xl text-gray-600">Решаем задачи разных категорий клиентов</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all hover:scale-105 scroll-animate" style={{ animationDelay: `${index * 0.2}s` }}>
                <CardContent className="p-0">
                  <Icon name={service.icon} className="text-blue-600 mb-4" size={48} />
                  <h3 className="text-2xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <Icon name="Check" className="text-green-500 mr-2" size={16} />
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
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Problems */}
            <div className="scroll-animate">
              <h2 className="text-3xl font-bold text-red-600 mb-8">Боли без сертификатов</h2>
              <div className="space-y-4">
                {[
                  "Партия готова, но нет сертификата — простаивает склад",
                  "Риски штрафов при проверках",
                  "Сложно понять, какой документ нужен",
                  "Долгие сроки оформления",
                  "Риск поддельных документов"
                ].map((problem, index) => (
                  <div key={index} className="flex items-start hover:translate-x-2 transition-transform">
                    <Icon name="X" className="text-red-500 mr-3 mt-1" size={16} />
                    <span className="text-gray-700">{problem}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="scroll-animate">
              <h2 className="text-3xl font-bold text-green-600 mb-8">Выгоды с нами</h2>
              <div className="space-y-4">
                {[
                  "Подбор правильного документа под продукцию",
                  "Минимальные сроки — от 1 дня",
                  "Сопровождение на всех этапах оформления",
                  "Полная юридическая значимость",
                  "Дистанционное оформление"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start hover:translate-x-2 transition-transform">
                    <Icon name="Check" className="text-green-500 mr-3 mt-1" size={16} />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="benefits" className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 scroll-animate">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Почему нам доверяют</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center scroll-animate hover:scale-105 transition-transform" style={{ animationDelay: `${index * 0.1}s` }}>
                <Icon name={benefit.icon} className="text-blue-600 mx-auto mb-4 hover:rotate-12 transition-transform" size={48} />
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documents */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 scroll-animate">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Документы, с которыми работаем</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {documents.map((doc, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg hover:scale-105 transition-all scroll-animate" style={{ animationDelay: `${index * 0.1}s` }}>
                <Icon name="FileText" className="text-blue-600 mx-auto mb-4 hover:bounce" size={40} />
                <h3 className="font-semibold">{doc}</h3>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 scroll-animate">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Часто задаваемые вопросы</h2>
          </div>
          <div className="max-w-3xl mx-auto scroll-animate">
            <Accordion type="single" collapsible>
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="hover:bg-white/50 transition-colors rounded-lg px-4">
                  <AccordionTrigger className="text-left hover:no-underline">{item.question}</AccordionTrigger>
                  <AccordionContent className="text-gray-600">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="scroll-animate">
              <div className="flex items-center space-x-2 mb-4">
                <Icon name="Shield" className="text-blue-400" size={32} />
                <h3 className="text-2xl font-bold">CertPro</h3>
              </div>
              <p className="text-gray-400">
                Запустите или расширьте производство без бюрократических задержек
              </p>
            </div>
            <div className="scroll-animate">
              <h4 className="text-lg font-semibold mb-4">Контакты</h4>
              <div className="space-y-2">
                <div className="flex items-center hover:text-blue-400 transition-colors cursor-pointer">
                  <Icon name="Phone" className="mr-2" size={16} />
                  <span>+7 (495) 123-45-67</span>
                </div>
                <div className="flex items-center hover:text-blue-400 transition-colors cursor-pointer">
                  <Icon name="Mail" className="mr-2" size={16} />
                  <span>info@certpro.ru</span>
                </div>
              </div>
            </div>
            <div className="scroll-animate">
              <h4 className="text-lg font-semibold mb-4">Гарантии</h4>
              <ul className="text-gray-400 space-y-1">
                <li>Официальные документы в реестре ФСА</li>
                <li>Работа по договору</li>
                <li>Конфиденциальность данных</li>
                <li>Возврат при невыполнении условий</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* Online Chat */}
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

      {/* Floating Chat Button */}
      <Button
        className="fixed bottom-6 right-6 rounded-full w-12 h-12 bg-blue-600 hover:bg-blue-700 shadow-lg z-40 hover:scale-110 transition-all animate-bounce"
        onClick={() => setShowChat(true)}
      >
        <Icon name="MessageCircle" size={24} />
      </Button>
    </div>
  )
}

export default Index