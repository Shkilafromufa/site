<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ПрессФорм - Изготовление и ремонт пресс-форм</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
    
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

            <!-- Stats -->
            <div class="stats">
                <div class="container">
                    <div class="stats-grid">
                        <div class="stat">
                            <span class="number">10+</span>
                            <div class="label">лет опыта</div>
                        </div>
                        <div class="stat">
                            <span class="number">98%</span>
                            <div class="label">форм запускаются без доработок</div>
                        </div>
                        <div class="stat">
                            <span class="number">24</span>
                            <div class="label">часа на калькуляцию</div>
                        </div>
                        <div class="stat">
                            <span class="number">500K+</span>
                            <div class="label">циклов гарантии</div>
                        </div>
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
                    <h2 class="section-title">Наши работы</h2>

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
                    <h2 class="section-title">О компании</h2>
                    <div class="about-grid">
                        <div>
                            <h3>Кто мы и чем сильны</h3>
                            <p>Мы — команда инженеров-технологов, конструкторов и операторов ЧПУ, которые более десяти лет помогают производителям перейти от эскиза к серийному изделию. Берём на себя полный цикл: проектируем, производим, запускаем форму на площадке клиента, обучаем персонал и сопровождаем изделие весь жизненный цикл.</p>
                            
                            <p>Наша философия — минимизировать время «идея → серия» и поддерживать форму в рабочем состоянии весь срок службы.</p>
                        </div>
                        <img src="assets/7.jpg" alt="Станок с сотрудником" class="about-photo">
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

            <div class="stats">
                <div class="container">
                    <h2 class="section-title">Наши достижения</h2>
                    <div class="stats-grid">
                        <div class="stat">
                            <span class="number">150+</span>
                            <div class="label">выполненных проектов</div>
                        </div>
                        <div class="stat">
                            <span class="number">50+</span>
                            <div class="label">постоянных клиентов</div>
                        </div>
                        <div class="stat">
                            <span class="number">24/7</span>
                            <div class="label">техническая поддержка</div>
                        </div>
                        <div class="stat">
                            <span class="number">5</span>
                            <div class="label">недель срок изготовления</div>
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
                    <a href="#" class="btn footer-call">Быстрый звонок</a>
                </div>
            </div>
        </div>
    </footer>

    <!-- Admin Toggle Button -->
    <button class="admin-toggle" id="contactToggle" aria-controls="contactDrawer" aria-expanded="false">✉️</button>
    <!-- Backdrop -->
    <div class="drawer-backdrop" id="drawerBackdrop" hidden></div>

    <!-- Contact Drawer -->
    <aside class="contact-drawer" id="contactDrawer" aria-hidden="true">
        <header class="drawer-header">
            <h3>Оставить заявку</h3>
            <button class="drawer-close" id="drawerClose" aria-label="Закрыть">×</button>
        </header>

        <form class="contact-form drawer-form" id="drawerContactForm">
            <input type="text" name="name" placeholder="Ваше имя" required>
            <input type="tel" name="phone" placeholder="Телефон" required>
            <input type="email" name="email" placeholder="Email" required>
            <textarea name="message" rows="5" placeholder="Сообщение" required></textarea>

            <label class="file-label">
                📎 Прикрепить файл (3D-модель, чертежи)
                <input type="file" name="file" accept=".dwg,.step,.igs,.pdf,.stp,.dxf,.zip,.rar,.7z,.pdf">
            </label>

            <button type="submit" class="btn accent">Отправить</button>
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
                <a href="https://t.me/" target="_blank" class="social-link">Telegram</a>
                <a href="https://wa.me/" target="_blank" class="social-link">WhatsApp</a>
                <a href="https://vk.com/" target="_blank" class="social-link">VK</a>
            </div>
        </div>
    </div>

    
    <script src="js/app.js"></script>
</body>
</html>