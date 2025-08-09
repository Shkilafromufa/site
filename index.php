<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ПрессФорм - Изготовление и ремонт пресс-форм</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style-2.css">
    
</head>
<body>
    <!-- Header -->
    <header class="site-header">
        <div class="container flex-between">
            <div class="logo">Альтернатива</div>
            <nav class="site-nav" id="nav">
                <a href="#" data-page="services" class="nav-link active">Главная страница</a>
                <a href="#" data-page="about" class="nav-link">О компании</a>
<!--                <a href="#" data-page="contacts" class="nav-link">Контакты</a>-->
                <a href="#" data-page="admin" class="nav-link">Личный кабинет</a>
            </nav>
            <div class="burger" onclick="toggleNav()">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
        <!-- Services Page -->
        <section id="services" class="page-section active">
            <!-- Hero Section -->
            <div class="hero">
                <img src="assets/1.jpg" alt="Производственное помещение" class="hero-bg">
                <div class="overlay"></div>
                <div class="container">
                    <div class="hero-content">
                        <h1>Профессиональное изготовление и ремонт пресс-форм</h1>
                        <p>Более 10 лет опыта, 98% форм запускаются без доработок, расчет за 24 часа</p>
                        <a href="#" class="btn accent" onclick="openPopup()">Связаться с нами</a>
                    </div>
                </div>
            </div>

         
            <!-- Services -->
            <div class="services">
                <div class="container">
                    <h2 class="section-title">Наши услуги</h2>
                    <div class="cards" id="services-container">
                        <!-- Services will be loaded here -->
                    </div>
                </div>
            </div>

            <!-- Process -->
            <div class="process">
                <div class="container">
                    <h2 class="section-title">Пошаговый процесс работы</h2>
                    <ul class="steps">
                        <li>
                            <div class="step-title">Получение ТЗ</div>
                            <p>Анализ чертежей, требований к материалу и объему производства</p>
                        </li>
                        <li>
                            <div class="step-title">3D-моделирование</div>
                            <p>Создание детальной модели в CAD/CAM-среде с расчетом литевых каналов</p>
                        </li>
                        <li>
                            <div class="step-title">Производство</div>
                            <p>Обработка на CNC-станках с многоуровневым контролем качества</p>
                        </li>
                        <li>
                            <div class="step-title">Сборка и тестирование</div>
                            <p>Финишная сборка, полировка и пробные прессования</p>
                        </li>
                        <li>
                            <div class="step-title">Запуск на производстве</div>
                            <p>Установка и наладка формы на оборудовании клиента</p>
                        </li>
                        <li>
                            <div class="step-title">Сопровождение</div>
                            <p>Техническая поддержка в течение всего срока эксплуатации</p>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="gallery">
                <div class="container">
                    <h2 class="section-title">Цикл производства</h2>

                    <div class="inf-carousel" id="workCarousel" aria-label="Галерея работ" tabindex="0">
                        <button class="ic-btn prev" aria-label="Назад">‹</button>

                        <div class="ic-track">
                            <!-- ОРИГИНАЛЬНЫЕ СЛАЙДЫ (без клонов; клоны добавит JS) -->
                            <article class="ic-card">

                                <img src="assets/2.jpg" alt="Подготовка заготовок и оснастки для пресс-формы">
                                <h4>Этап 1 — Подготовка заготовок</h4>
                                <p>Отбор материала, подготовка баз и оснастки под дальнейшую обработку.</p>
                            </article>

                            <article class="ic-card">

                                <img src="assets/4.jpg" alt="Фрезерование на 5-осевом ЧПУ">
                                <h4>Этап 2 — ЧПУ-фрезерование</h4>
                                <p>Черновая и чистовая обработка геометрии на многоосевых станках.</p>
                            </article>

                            <article class="ic-card">

                                <img src="assets/6.jpg" alt="Высокоскоростная обработка деталей">
                                <h4>Этап 3 — Высокоскоростная обработка</h4>
                                <p>Повышение точности и качества поверхности на скоростных режимах.</p>
                            </article>

                            <article class="ic-card">

                                <img src="assets/5.jpg" alt="Точная обработка и доведение размеров">
                                <h4>Этап 4 — Точная обработка</h4>
                                <p>Доведение критических посадок и переходов до требуемых допусков.</p>
                            </article>

                            <article class="ic-card">

                                <img src="assets/11.jpg" alt="Ручная доводка пресс-формы">
                                <h4>Этап 5 — Ручная доводка</h4>
                                <p>Полировка, притирка и устранение микронных несоосностей вручную.</p>
                            </article>

                            <article class="ic-card">

                                <img src="assets/3.jpg" alt="Сборка и подгонка узлов пресс-формы">
                                <h4>Этап 6 — Сборка узлов</h4>
                                <p>Комплектация, подгонка сопряжений, проверка кинематики формы.</p>
                            </article>

                            <article class="ic-card">

                                <img src="assets/8.jpg" alt="Готовая пресс-форма после приемки">
                                <h4>Этап 7 — Приёмка</h4>
                                <p>Контроль геометрии и поверхности, подготовка к запуску у клиента.</p>
                            </article>

                            <article class="ic-card">

                                <img src="assets/9.jpg" alt="Запуск пресс-формы в серийное производство">
                                <h4>Этап 8 — Запуск в серию</h4>
                                <p>Пуско-наладка на площадке, стабилизация параметров литья.</p>
                            </article>

                            <article class="ic-card">

                                <img src="assets/10.jpg" alt="Расширение парка оборудования для поддержки проектов">
                                <h4>Этап 9 — Поддержка и развитие</h4>
                                <p>Сервис и модернизация форм, расширение парка под новые задачи.</p>
                            </article>
                        </div>

                        <button class="ic-btn next" aria-label="Вперёд">›</button>
                        <div class="ic-dots" id="workDots" aria-label="Навигация"></div>
                    </div>
                </div>
            </div>

            <!-- CTA Band -->
            <!-- <div class="cta-band">
                <div class="container">
                    <h3>-------------------------</h3>
                    <p>------------------------------</p>
                    <a href="#" class="btn secondary" onclick="openPopup()">Отправить заявку</a>
                </div>
            </div> -->
        </section>
        <section id="service" class="page-section">
            <div class="container">
                <a href="#" id="backToServices" class="btn ghost">← Назад к услугам</a>
                <div id="service-view" style="margin-top:1rem"></div>
            </div>
        </section>
        <!-- About Page -->
        <section id="about" class="page-section">
            <div class="about">
                <div class="container">
                    <h2 class="section-title">Наша компания</h2>
                    <div class="about-grid">
  <div class="about-col">
    <h3>Кто мы и чем сильны</h3>

    <p class="lead">Мы — команда инженеров-технологов, конструкторов и операторов ЧПУ, которая более десяти лет помогает производителям перейти от эскиза к серийному изделию.</p>
    <p>Берём на себя полный цикл: проектируем, производим, запускаем форму на площадке клиента, обучаем персонал и сопровождаем изделие весь жизненный цикл.</p><br>
    <ul class="about-facts">
      <li>Сокращаем путь «идея → серия», поддерживаем формы весь срок службы.</li>
      <li>Собственное КБ и производство: от разработки до запуска и сервиса.</li>
      <li>42 единицы металлообрабатывающего оборудования, из них 14 — ЧПУ.</li>
      <li>Опыт изделий до 21 тонны; >2 500 отремонтированных форм.</li>
      <li>Логистика: 50 грузовых машин, склады 20 000 м².</li>
    </ul>
  </div>

  <figure class="about-media">
    <img src="assets/7.jpg" alt="Станок с сотрудником" class="about-photo">
    <figcaption class="about-caption"></figcaption>
  </figure>
</div>
                </div>
            </div>
            <div class="resources">
                <div class="container">
                    <h2 class="section-title">Наши ресурсы</h2>
                    <div class="resources-grid">
                        <div class="resource-item">
                            <h4>Технологический парк</h4>
                            <p>5-осевые обрабатывающие центры (X = 1000 мм) и проволочно-вырезные станки до 0,005 мм точности</p>
                        </div>
                        <div class="resource-item">
                            <h4>Лазерные системы</h4>
                            <p>Парк шлифовальных и лазерных систем с ЧПУ для высокоточной обработки</p>
                        </div>
                        <div class="resource-item">
                            <h4>Контроль качества</h4>
                            <p>Отдел контроля качества с координатно-измерительной машиной (CMM) и рентгеноскопией</p>
                        </div>
                        <div class="resource-item">
                            <h4>Материалы</h4>
                            <p>Склад европейских инструментальных сталей и порошковых составов</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="resources">
            <div class="container">
    <div class="stats-grid">
      <div class="stat">
        <div class="top">
          <div class="icon">🏭</div>
          <span class="number" data-target="33">0</span>
        </div>
        <div class="label">года опыта</div>
      </div>

      <div class="stat">
        <div class="top">
          <div class="icon">👥</div>
          <span class="number" data-target="2100">0</span>
        </div>
        <div class="label">сотрудников</div>
      </div>

      <div class="stat">
        <div class="top">
          <div class="icon">⚙️</div>
          <span class="number" data-target="196">0</span>
        </div>
        <div class="label">единиц оборудования</div>
      </div>

      <div class="stat">
        <div class="top">
          <div class="icon">📏</div>
          <span class="number" data-target="98116" data-suffix="">0</span>
        </div>
        <div class="label">общая площадь в м²</div>
      </div>

      <div class="stat">
        <div class="top">
          <div class="icon">🚚</div>
          <span class="number" data-target="50">0</span>
        </div>
        <div class="label">грузовых машин</div>
      </div>
    </div>
  </div>
</div>

<div class="container" style="padding: 1rem 0;">
      <h2 class="section-title">Портфолио</h2>
      <div class="portfolio-grid">
        <div class="portfolio-item">
          <img src="./a80bcfb4-a8cc-45ac-b103-c4f16c928741.png" alt="Проект 1" class="portfolio-img">
          <div class="portfolio-content">
            <h3>Литье пластикового корпуса</h3>
            <p>Проект по изготовлению пресс‑формы для пластикового корпуса электронного устройства. Включал разработку 3D‑модели, производство и запуск на площадке клиента.</p>
          </div>
        </div>
        <div class="portfolio-item">
          <img src="./184f7034-807c-4d00-83cb-59153e048008.png" alt="Проект 2" class="portfolio-img">
          <div class="portfolio-content">
            <h3>Ремонт пресс‑формы</h3>
            <p>Комплексный ремонт существующей пресс‑формы, включающий устранение износа рабочих поверхностей и модернизацию системы охлаждения для увеличения ресурса.</p>
          </div>
        </div>
        <div class="portfolio-item">
          <img src="./552f98b3-3ded-4519-8b29-6e6654729ead.png" alt="Проект 3" class="portfolio-img">
          <div class="portfolio-content">
            <h3>Проектирование формы для авто</h3>
            <p>Разработка и изготовление пресс‑формы для крупногабаритной детали автомобильного интерьера. Использовались 5‑осевые станки и высокоточный контроль качества.</p>
          </div>
        </div>
      </div>
    </div>
        </section>

    <section id="admin" class="page-section">
      <div class="container">
        <div class="admin-hero">
          <h2>Личный кабинет администратора</h2>
        </div>
        <div id="adminRoot"></div>
      </div>
    </section>
    </main>

    <!-- Footer -->
    <footer class="site-footer">
        <div class="container">
            <div class="footer-flex">
                <div>
                    <p>&copy; 2025. Все права защищены.</p>
                </div>
                <div>
                <a href="#" class="btn accent-footer" onclick="openPopup()">Связаться с нами</a>
                </div>
            </div>
        </div>
    </footer>

    <!-- Admin Toggle Button -->
    <!-- Floating Action Button (замена старой admin-toggle) -->
    <button class="fab-contact" id="contactToggle" aria-controls="contactDrawer" aria-expanded="false" aria-label="Открыть форму связи">
        <!-- иконка-конверт -->
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z" stroke="currentColor" stroke-width="1.5"/>
            <path d="m4 7 8 6 8-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="fab-label">Сделать заказ</span>
    </button>

    <!-- Бэкдроп -->
    <div class="drawer-backdrop" id="drawerBackdrop"></div>

    <!-- Современный drawer -->
    <aside class="contact-drawer v2" id="contactDrawer" aria-hidden="true" role="dialog" aria-modal="true">
        <header class="drawer-header">
            <div class="drawer-title">
                <h3>Оставить заявку</h3>
                <p>Ответим в течение рабочего дня</p>
            </div>
            <button class="icon-btn" id="drawerClose" aria-label="Закрыть">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                </svg>
            </button>
        </header>

        <form class="drawer-form" id="drawerContactForm">
            <div class="fld"><input class="ui-input" type="text" name="name" placeholder="Ваше имя" required></div>
            <div class="fld"><input class="ui-input" type="tel" name="phone" placeholder="Телефон" required></div>
            <div class="fld"><input class="ui-input" type="email" name="email" placeholder="Email" required></div>
            <div class="fld"><textarea class="ui-input" name="message" rows="5" placeholder="Сообщение" required></textarea></div>

            <!-- дропзона -->
            <label class="file-drop" id="fileDrop">
                <input type="file" name="file" accept=".dwg,.step,.igs,.stp,.dxf,.zip,.rar,.7z,.pdf" hidden>
                <div class="file-drop-inner">
                    <div class="file-ic">📎</div>
                    <div>
                        <div class="file-main">Перетащите файл сюда</div>
                        <div class="file-sub">или нажмите, чтобы выбрать (3D-модель, чертежи)</div>
                    </div>
                </div>
                <div class="file-name" id="fileName"></div>
            </label>

            <button type="submit" class="btn-primary">Отправить</button>
        </form>

        <div class="drawer-meta">
            <div><strong>Телефон:</strong> +7 ___ --_</div>
            <div><strong>Telegram:</strong> @_______</div>
            <div><strong>WhatsApp:</strong> +7 ___ --_</div>
        </div>
    </aside>



    <!-- Popup -->
    <div class="popup" id="popup">
        <div class="popup-content">
            <button class="popup-close" onclick="closePopup()">×</button>
            <h3>Связаться с нами</h3>
            <div class="social-links">
                <a class="social-link social-link--vk" href="https://vk.com/yourpage" target="_blank" rel="noopener">
  <span class="brand-ic">
    <!-- VK SVG -->
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path fill="currentColor" d="M12.87 17h-1.55c-3.36 0-5.2-2.29-5.27-6.11V8.99h2.13c.09 2.64 1.21 4.08 2.05 4.08.4 0 .43-.29.43-.82V9h2.05v2.06c0 .78.12 1.02.4 1.02.66 0 1.83-1.7 2-3.09h2.07c-.14 1.03-.85 2.22-1.6 3l-.63.65.69.78c.8.93 1.72 2.43 1.72 2.43h-2.33s-.6-1.12-1.25-1.83c-.4-.43-.67-.54-.92-.54-.32 0-.43.22-.43.7V17Z"/>
    </svg>
  </span>
                    ВКонтакте
                </a>

                <a class="social-link social-link--tg" href="https://t.me/yourhandle" target="_blank" rel="noopener">
  <span class="brand-ic">
    <!-- Telegram SVG -->
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path fill="currentColor" d="M21.5 4.5 2.9 11.7c-1 .39-.98 1.8.05 2.11l4.6 1.5 1.78 5.19c.31.91 1.55 1.01 2.05.16l2.57-4.33 4.69 3.5c.82.62 1.99.16 2.22-.86l2.7-12.2c.25-1.14-.77-2.1-1.96-1.67Z"/>
    </svg>
  </span>
                    Telegram
                </a>

                <a class="social-link social-link--wa" href="https://wa.me/71234567890" target="_blank" rel="noopener">
  <span class="brand-ic">
    <!-- WhatsApp SVG -->
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path fill="currentColor" d="M20 12.07c0 4.43-3.67 8.02-8.2 8.02-1.44 0-2.8-.36-3.97-.99L4 20l.93-3.64a7.92 7.92 0 0 1-1.13-4.29C3.8 7.64 7.47 4.05 12 4.05s8 3.59 8 8.02Zm-4.03 2.37c.13.08.22.24.26.39.06.22.06.4-.03.55-.15.27-.57.51-1.21.56-.7.06-1.58-.1-2.6-.57-2.31-1.06-3.84-3-4.2-3.54-.35-.54-.93-1.6-.93-2.69 0-1.08.57-1.61.81-1.83.1-.09.24-.13.38-.13h.27c.12.01.2.01.29.23.11.27.38.93.41 1 .06.15.1.3.02.47-.08.17-.12.27-.25.42-.13.15-.27.33-.38.45-.12.12-.24.25-.1.51.14.27.63 1.04 1.36 1.68.94.82 1.74 1.08 2.02 1.2.28.12.45.1.61-.06.16-.17.7-.76.89-1.02.19-.27.38-.23.63-.14.25.1 1.58.74 1.85.87Z"/>
    </svg>
  </span>
                    WhatsApp
                </a>
            </div>
        </div>
    </div>
    <script src="js/app.js"></script>
</body>
</html>