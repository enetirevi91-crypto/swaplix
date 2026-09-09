import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import {
  ShieldCheck,
  Clock,
  MapPin,
  Lock,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Globe,
  Send,
  TrendingUp,
  TrendingDown,
  ArrowUp,
} from 'lucide-react';
import { SiBitcoin, SiEthereum, SiTether } from 'react-icons/si';
import { FaMoneyBillWave } from 'react-icons/fa';

const TELEGRAM_URL = "https://t.me/+2ktARr9AH1Q4YjI0";

function TelegramIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M21.5 3.5L2.5 11l5.5 2 2 6 3-3.5 5 4 3.5-16zM10 14l8-7-10 6.5z" />
    </svg>
  );
}

function CoinIcon({ type }) {
  switch(type) {
    case 'BTC':
      return <div className="coin-icon btc"><SiBitcoin /></div>;
    case 'ETH':
      return <div className="coin-icon eth"><SiEthereum /></div>;
    case 'USDT':
      return <div className="coin-icon usdt"><SiTether /></div>;
    case 'PLN':
      return <div className="coin-icon pln"><FaMoneyBillWave /></div>;
    default:
      return null;
  }
}

function Sparkline({ data, positive }) {
  const points = data.map((v, i) => `${i * 10},${20 - v}`).join(' ');
  return (
    <svg viewBox="0 0 60 20" className="sparkline">
      <polyline points={points} fill="none" stroke={positive ? '#00d4aa' : '#ff6b6b'} strokeWidth="1.5" />
    </svg>
  );
}

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !started.current) {
        started.current = true;
        const target = parseInt(value.replace(/\D/g, ''));
        const duration = 1500;
        const start = performance.now();
        const animate = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          setDisplay(Math.floor(progress * target));
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref}>{display.toLocaleString()}{value.includes('+') ? '+' : ''}</span>;
}

function Reveal({ children }) {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className="reveal">{children}</div>;
}

function ExchangeCard({ from, to, fromName, toName }) {
  const [showToast, setShowToast] = useState(false);
  
  const handleExchange = (e) => {
    e.preventDefault();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
    setTimeout(() => window.open(TELEGRAM_URL, '_blank'), 500);
  };

  return (
    <div className="exchange-card">
      <div className="exchange-icons">
        <CoinIcon type={from} />
        <span className="exchange-arrow">→</span>
        <CoinIcon type={to} />
      </div>
      <div className="exchange-pair">{from} → {to}</div>
      <div className="exchange-names">{fromName} → {toName}</div>
      <a href={TELEGRAM_URL} onClick={handleExchange} className="exchange-btn">
        ОБМЕНЯТЬ <TelegramIcon className="btn-tg" />
      </a>
      {showToast && <div className="toast">Перенаправляем в Telegram...</div>}
    </div>
  );
}

function App() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [usefulDropdown, setUsefulDropdown] = useState(false);
  const [businessDropdown, setBusinessDropdown] = useState(false);
  const [mobileUseful, setMobileUseful] = useState(false);
  const [mobileBusiness, setMobileBusiness] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [faqSearch, setFaqSearch] = useState('');
  const [marketFilter, setMarketFilter] = useState('ALL');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFaq = (index) => setOpenFaq(openFaq === index ? null : index);

  const faqItems = [
    { q: "Почему стоит выбрать SWAP LIX?", a: "Мы предлагаем физический обмен криптовалют с личной встречей. Это гарантирует безопасность, конфиденциальность и лучшие курсы." },
    { q: "Какие криптовалюты вы поддерживаете?", a: "BTC, ETH, USDT. Обмен производим на польские злотые и обратно." },
    { q: "Какие способы оплаты?", a: "Наличные при личной встрече. Мы не работаем с картами и онлайн-переводами." },
    { q: "Как происходит наличный обмен?", a: "Вы связываетесь с менеджером, согласовываете детали и приезжаете в офис. Обмен производится на месте." },
    { q: "Какой курс обмена?", a: "Актуальный курс узнавайте у менеджера в Telegram. Курс фиксируется до сделки." },
    { q: "Какие комиссии?", a: "Минимальные. Точную комиссию согласовываем до сделки, без скрытых платежей." },
    { q: "Нужна ли верификация KYC?", a: "Нет. Мы не требуем верификацию или регистрацию." },
    { q: "Вы работаете 24/7?", a: "Служба поддержки 24/7. Обмен по предварительной записи ежедневно с 09:00 до 20:00." },
    { q: "Есть ли реферальная программа?", a: "На данный момент нет. Но мы ценим постоянных клиентов." },
    { q: "Можно ли обменять крупные суммы?", a: "Да. Детали крупных сумм обсуждаются с менеджером индивидуально." }
  ];

  const filteredFaq = faqItems.filter(item => item.q.toLowerCase().includes(faqSearch.toLowerCase()));

  const marketData = [
    { name: "Bitcoin", ticker: "BTC", price: "$67,420", change: "+2.3%", positive: true, min: "$66,100", max: "$68,200", vol: "$32.5B", spark: [5,8,6,10,9,12,15] },
    { name: "Ethereum", ticker: "ETH", price: "$3,520", change: "+1.8%", positive: true, min: "$3,410", max: "$3,580", vol: "$15.2B", spark: [8,6,9,7,11,10,14] },
    { name: "Tether", ticker: "USDT", price: "$1.00", change: "0.0%", positive: true, min: "$0.999", max: "$1.001", vol: "$45.8B", spark: [10,10,10,10,10,10,10] }
  ];

  const filteredMarket = marketFilter === 'ALL' ? marketData : marketData.filter(m => m.ticker === marketFilter);

  const polandCities = ["Варшава", "Вроцлав", "Гданьск", "Гдыня", "Краков", "Лодзь", "Познань", "Щецин"];

  return (
    <div className="page">
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-inner">
          <img src="/logo.png" alt="SWAP LIX" className="header-logo" />
          
          <nav className="nav">
            <a href="#exchange" className="nav-link">Обмен</a>
            <a href="#directions" className="nav-link">Курсы</a>
            <a href="#footer" className="nav-link">Контакты</a>
            <div className="nav-dropdown" onMouseEnter={() => setUsefulDropdown(true)} onMouseLeave={() => setUsefulDropdown(false)}>
              <button className="nav-link">Полезное <ChevronDown className="chevron-sm" /></button>
              {usefulDropdown && (
                <div className="dropdown">
                  <a href="#why" className="dropdown-item">О Нас</a>
                  <a href="#faq" className="dropdown-item">FAQ</a>
                  <a href="#locations" className="dropdown-item">Города</a>
                  <a href="#how" className="dropdown-item">Как проходит обмен</a>
                </div>
              )}
            </div>
            <div className="nav-dropdown" onMouseEnter={() => setBusinessDropdown(true)} onMouseLeave={() => setBusinessDropdown(false)}>
              <button className="nav-link">Бизнесу <ChevronDown className="chevron-sm" /></button>
              {businessDropdown && (
                <div className="dropdown">
                  <a href="#exchange" className="dropdown-item">Виртуальные карты</a>
                  <a href="#exchange" className="dropdown-item">OTC биржа</a>
                  <a href="#exchange" className="dropdown-item">Свой обменник</a>
                </div>
              )}
            </div>
          </nav>

          <div className="header-right">
            <button className="lang-btn"><Globe className="lang-icon" /> PL</button>
            <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="header-tg">
              Написать в Telegram <TelegramIcon className="header-tg-icon" />
            </a>
          </div>

          <button className="mobile-menu-btn" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X /> : <Menu />}
          </button>
        </div>

        {mobileMenu && (
          <div className="mobile-menu">
            <a href="#exchange" className="mobile-link" onClick={() => setMobileMenu(false)}>Обмен</a>
            <a href="#directions" className="mobile-link" onClick={() => setMobileMenu(false)}>Курсы</a>
            <a href="#footer" className="mobile-link" onClick={() => setMobileMenu(false)}>Контакты</a>
            <button className="mobile-link" onClick={() => setMobileUseful(!mobileUseful)}>
              Полезное <ChevronDown className="chevron-sm" />
            </button>
            {mobileUseful && (
              <div className="mobile-sublinks">
                <a href="#why" className="mobile-link" onClick={() => setMobileMenu(false)}>О Нас</a>
                <a href="#faq" className="mobile-link" onClick={() => setMobileMenu(false)}>FAQ</a>
                <a href="#locations" className="mobile-link" onClick={() => setMobileMenu(false)}>Города</a>
              </div>
            )}
            <button className="mobile-link" onClick={() => setMobileBusiness(!mobileBusiness)}>
              Бизнесу <ChevronDown className="chevron-sm" />
            </button>
            {mobileBusiness && (
              <div className="mobile-sublinks">
                <a href="#exchange" className="mobile-link" onClick={() => setMobileMenu(false)}>Виртуальные карты</a>
                <a href="#exchange" className="mobile-link" onClick={() => setMobileMenu(false)}>OTC биржа</a>
              </div>
            )}
          </div>
        )}
      </header>

      <main>
        <section className="hero">
          <div className="hero-inner">
            <div className="hero-left">
              <div className="hero-trust">
                <span className="trust-item"><ShieldCheck className="trust-icon" /> Безопасно</span>
                <span className="trust-item"><Clock className="trust-icon" /> Быстро</span>
                <span className="trust-item"><Lock className="trust-icon" /> Конфиденциально</span>
              </div>
              <h1 className="hero-title">
                Обмен криптовалюты –<br />
                <span className="hero-accent">быстро, выгодно и легко</span>
              </h1>
              <p className="hero-desc">
                SWAP LIX — физический обмен криптовалют в Польше.
                Назначаем время и место встречи. Вы приходите и совершаете обмен лично.
              </p>
              <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-primary pulse">
                <TelegramIcon className="btn-icon" />
                НАПИСАТЬ МЕНЕДЖЕРУ
              </a>
            </div>
            <div className="hero-right">
              <div className="hero-glow" />
              <img src="/mogo.png" alt="SWAP LIX" className="hero-graphic" />
            </div>
          </div>
        </section>

        <Reveal>
        <section className="stats">
          <div className="stats-inner">
            <div className="stat-block"><div className="stat-num"><AnimatedNumber value="300+" /></div><div className="stat-label">Обменных операций в день</div></div>
            <div className="stat-block"><div className="stat-num"><AnimatedNumber value="14" /></div><div className="stat-label">Лет на рынке</div></div>
            <div className="stat-block"><div className="stat-num"><AnimatedNumber value="20000+" /></div><div className="stat-label">Довольных клиентов</div></div>
            <div className="stat-block"><div className="stat-num"><AnimatedNumber value="50+" /></div><div className="stat-label">Поддерживаемых валют</div></div>
          </div>
        </section>
        </Reveal>

        <Reveal>
        <section className="why" id="why">
          <div className="section-inner">
            <div className="eyebrow">ТОРГУЙТЕ ВЫГОДНО И БЕЗОПАСНО</div>
            <h2 className="section-title">Почему SWAP LIX – это №1 криптообменник</h2>
            <div className="why-grid">
              <div className="why-card">
                <div className="why-icon-wrap"><ShieldCheck className="why-icon" /></div>
                <h3>Лучшие рейтинги</h3>
                <p>Проверенный обменный пункт с безупречной репутацией</p>
              </div>
              <div className="why-card">
                <div className="why-icon-wrap"><MapPin className="why-icon" /></div>
                <h3>Местный опыт</h3>
                <p>Работаем в Польше, знаем рынок и потребности клиентов</p>
              </div>
              <div className="why-card">
                <div className="why-icon-wrap"><Lock className="why-icon" /></div>
                <h3>Безопасность превыше всего</h3>
                <p>Все сделки только при личной встрече</p>
              </div>
              <div className="why-card">
                <div className="why-icon-wrap"><ShieldCheck className="why-icon" /></div>
                <h3>Максимальная защита</h3>
                <p>Гарантия конфиденциальности и анонимности</p>
              </div>
            </div>
          </div>
        </section>
        </Reveal>

        <Reveal>
        <section className="market" id="exchange">
          <div className="section-inner">
            <div className="eyebrow">БУДЬТЕ В ТРЕНДЕ</div>
            <div className="market-header">
              <h2 className="section-title">Рынок криптовалют</h2>
              <div className="market-filters">
                {['ALL', 'BTC', 'ETH', 'USDT'].map(f => (
                  <button key={f} className={`market-filter ${marketFilter === f ? 'active' : ''}`} onClick={() => setMarketFilter(f)}>
                    {f === 'ALL' ? 'Все' : f}
                  </button>
                ))}
              </div>
            </div>
            <div className="market-table-wrap">
              <table className="market-table">
                <thead>
                  <tr>
                    <th>Название</th>
                    <th>Цена</th>
                    <th>Изменение (24ч)</th>
                    <th>Мин (24ч)</th>
                    <th>Макс (24ч)</th>
                    <th>Объем (24ч)</th>
                    <th>График</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMarket.map((item, i) => (
                    <tr key={i}>
                      <td><div className="market-name"><CoinIcon type={item.ticker} /><span>{item.name}</span></div></td>
                      <td>{item.price}</td>
                      <td className={item.positive ? 'positive' : 'negative'}>
                        {item.positive ? <TrendingUp className="trend-icon up" /> : <TrendingDown className="trend-icon down" />}
                        {item.change}
                      </td>
                      <td>{item.min}</td>
                      <td>{item.max}</td>
                      <td>{item.vol}</td>
                      <td><Sparkline data={item.spark} positive={item.positive} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
        </Reveal>

        <Reveal>
        <section className="locations" id="locations">
          <div className="section-inner">
            <div className="eyebrow">ПРОВЕРЬТЕ ДОСТУПНОСТЬ</div>
            <h2 className="section-title">Доступно в городах Польши</h2>
            <div className="locations-grid">
              {polandCities.map((city, i) => (
                <div className="location-card" key={i}>
                  <div className="location-icon-wrap"><MapPin className="location-icon" /></div>
                  <span>{city}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
        </Reveal>

        <Reveal>
        <section className="cash-exchange">
          <div className="section-inner">
            <div className="cash-banner">
              <div className="cash-left">
                <div className="cash-icon-wrap">
                  <ShieldCheck className="cash-icon" />
                </div>
                <div>
                  <div className="eyebrow">КОНТРОЛИРУЙТЕ СВОИ ФИНАНСЫ</div>
                  <h2 className="cash-title">Обналичивайте BTC, ETH, USDT в удобном для вас месте</h2>
                  <p className="cash-desc">Легко конвертируйте криптовалюту в реальные деньги при личной встрече.</p>
                </div>
              </div>
              <div className="cash-right">
                <div className="cash-coins">
                  <CoinIcon type="BTC" />
                  <CoinIcon type="ETH" />
                  <CoinIcon type="USDT" />
                </div>
                <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  <TelegramIcon className="btn-icon" /> Связаться с менеджером
                </a>
              </div>
            </div>
          </div>
        </section>
        </Reveal>

        <Reveal>
        <section className="directions" id="directions">
          <div className="section-inner">
            <div className="eyebrow">ОБМЕНЯЙТЕ БЕЗ ОГРАНИЧЕНИЙ</div>
            <h2 className="section-title">Доступные направления обмена</h2>
            <div className="directions-grid">
              <ExchangeCard from="BTC" to="PLN" fromName="Bitcoin" toName="Польские злотые" />
              <ExchangeCard from="ETH" to="PLN" fromName="Ethereum" toName="Польские злотые" />
              <ExchangeCard from="USDT" to="PLN" fromName="Tether" toName="Польские злотые" />
              <ExchangeCard from="PLN" to="BTC" fromName="Польские злотые" toName="Bitcoin" />
              <ExchangeCard from="PLN" to="ETH" fromName="Польские злотые" toName="Ethereum" />
              <ExchangeCard from="PLN" to="USDT" fromName="Польские злотые" toName="Tether" />
            </div>
          </div>
        </section>
        </Reveal>

        <Reveal>
        <section className="how" id="how">
          <div className="section-inner">
            <div className="eyebrow">ПРОСТОЙ ПРОЦЕСС</div>
            <h2 className="section-title">Как проходит обмен</h2>
            <div className="how-timeline">
              <div className="how-step-card">
                <div className="how-step-header">
                  <div className="how-num">1</div>
                  <div className="how-step-icon"><Send className="how-icon-svg" /></div>
                </div>
                <h3>Связь</h3>
                <p>Напишите нам в Telegram</p>
              </div>
              <div className="how-connector"><ChevronRight className="connector-arrow" /></div>
              <div className="how-step-card">
                <div className="how-step-header">
                  <div className="how-num">2</div>
                  <div className="how-step-icon"><Clock className="how-icon-svg" /></div>
                </div>
                <h3>Согласование</h3>
                <p>Курс, сумма, место, время</p>
              </div>
              <div className="how-connector"><ChevronRight className="connector-arrow" /></div>
              <div className="how-step-card">
                <div className="how-step-header">
                  <div className="how-num">3</div>
                  <div className="how-step-icon"><MapPin className="how-icon-svg" /></div>
                </div>
                <h3>Встреча</h3>
                <p>Личный визит в офис</p>
              </div>
              <div className="how-connector"><ChevronRight className="connector-arrow" /></div>
              <div className="how-step-card">
                <div className="how-step-header">
                  <div className="how-num">4</div>
                  <div className="how-step-icon"><ShieldCheck className="how-icon-svg" /></div>
                </div>
                <h3>Обмен</h3>
                <p>Физический обмен на месте</p>
              </div>
            </div>
          </div>
        </section>
        </Reveal>

        <Reveal>
        <section className="benefits">
          <div className="section-inner">
            <div className="eyebrow">ПОЧЕМУ МЫ</div>
            <h2 className="section-title">Лучший обменник криптовалют с минимальными комиссиями!</h2>
            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="benefit-icon-wrap"><Lock className="benefit-icon" /></div>
                <h3>Безопасность</h3>
                <p>Только личные встречи</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon-wrap"><Clock className="benefit-icon" /></div>
                <h3>Автоматизация</h3>
                <p>Быстрое согласование</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon-wrap"><ShieldCheck className="benefit-icon" /></div>
                <h3>Выгода</h3>
                <p>Лучшие курсы</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon-wrap"><MapPin className="benefit-icon" /></div>
                <h3>Гибкость</h3>
                <p>Под ваш график</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon-wrap"><ShieldCheck className="benefit-icon" /></div>
                <h3>Комфорт</h3>
                <p>Без бюрократии</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon-wrap"><ShieldCheck className="benefit-icon" /></div>
                <h3>Доверие</h3>
                <p>Проверенная репутация</p>
              </div>
            </div>
          </div>
        </section>
        </Reveal>

        <Reveal>
        <section className="faq" id="faq">
          <div className="section-inner">
            <div className="eyebrow">ЕСТЬ ВОПРОСЫ?</div>
            <h2 className="section-title">Часто задаваемые вопросы (FAQ)</h2>
            <input
              type="text"
              className="faq-search"
              placeholder="Поиск по вопросам..."
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
            />
            <div className="faq-list">
              {filteredFaq.map((item, i) => (
                <div className="faq-item" key={i}>
                  <button className="faq-question" onClick={() => toggleFaq(i)}>
                    {item.q}
                    <span className={`faq-chevron ${openFaq === i ? 'open' : ''}`}>+</span>
                  </button>
                  <div className={`faq-answer-wrapper ${openFaq === i ? 'open' : ''}`}>
                    <div className="faq-answer">{item.a}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        </Reveal>

        <Reveal>
        <section className="cta">
          <div className="cta-inner">
            <h2>Готовы к обмену?</h2>
            <p>Напишите нам в Telegram и получите лучший курс прямо сейчас!</p>
            <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-primary pulse">
              <TelegramIcon className="btn-icon" /> НАПИСАТЬ МЕНЕДЖЕРУ
            </a>
          </div>
        </section>
        </Reveal>
      </main>

      <footer className="footer" id="footer">
        <div className="footer-inner">
          <div className="footer-col footer-brand">
            <img src="/logo.png" alt="SWAP LIX" className="footer-logo" />
            <p>Физический обмен криптовалют в Польше. Безопасно, быстро, конфиденциально.</p>
          </div>
          <div className="footer-col">
            <h4>О криптовалюте</h4>
            <a href="#directions">Направления обменов</a>
            <a href="#exchange">Курсы криптовалют</a>
            <a href="#directions">Обмен USDT</a>
            <a href="#directions">Обмен BTC</a>
            <a href="#directions">Обмен ETH</a>
          </div>
          <div className="footer-col">
            <h4>Полезное</h4>
            <a href="#why">О Нас</a>
            <a href="#faq">FAQ</a>
            <a href="#locations">Города</a>
            <a href="#how">Как проходит обмен</a>
          </div>
          <div className="footer-col">
            <h4>Контакты</h4>
            <a href={TELEGRAM_URL}><TelegramIcon className="footer-icon" /> Telegram</a>
            <span><Clock className="footer-icon" /> 08:00–24:00 UTC+2</span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2024 SWAP LIX. Физический обмен криптовалют в Польше.</span>
        </div>
      </footer>

      {showBackToTop && (
        <button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <ArrowUp />
        </button>
      )}
    </div>
  );
}

export default App;