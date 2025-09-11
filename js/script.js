// Efectos de scroll y animaciones
document.addEventListener('DOMContentLoaded', function() {
    
    // Configuración de elementos
    const productItems = document.querySelectorAll('.product-item');
    const productImages = document.querySelectorAll('.product-image');
    const productContents = document.querySelectorAll('.product-content');
    const sectionTitle = document.querySelector('.section-title');
    const brandDescription = document.querySelector('.brand-description');
    const features = document.querySelectorAll('.feature');
    
    // Intersection Observer para animaciones al hacer scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observar elementos para animaciones
    if (sectionTitle) observer.observe(sectionTitle);
    if (brandDescription) observer.observe(brandDescription);
    features.forEach(feature => observer.observe(feature));
    productContents.forEach(content => observer.observe(content));
    
    // Efecto de movimiento de productos con scroll
    let ticking = false;
    
    function updateProductPositions() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        productItems.forEach((item, index) => {
            const rect = item.getBoundingClientRect();
            const productImage = item.querySelector('.product-image');
            const productBottle = item.querySelector('.product-bottle');
            
            // Calcular la posición relativa del elemento en la ventana
            const elementTop = rect.top;
            const elementHeight = rect.height;
            const scrollProgress = Math.max(0, Math.min(1, 
                (windowHeight - elementTop) / (windowHeight + elementHeight)
            ));
            
            // Efecto de movimiento horizontal basado en scroll
            if (productImage && productBottle) {
                const moveAmount = (scrollProgress - 0.5) * 80;
                const rotation = (scrollProgress - 0.5) * 8;
                const scale = 1 + (scrollProgress - 0.5) * 0.08;
                
                // Aplicar transformaciones
                productBottle.style.transform = `
                    translateX(${moveAmount}px) 
                    rotateY(${rotation}deg) 
                    scale(${scale})
                `;
                
                // Efecto de opacidad
                const opacity = Math.max(0.4, Math.min(1, scrollProgress * 2));
                productBottle.style.opacity = opacity;
            }
            
            // Efecto de parallax para el contenido
            const productContent = item.querySelector('.product-content');
            if (productContent) {
                const contentMove = (scrollProgress - 0.5) * 50;
                productContent.style.transform = `translateY(${contentMove}px)`;
            }
        });
        
        ticking = false;
    }
    
    // Función optimizada para scroll
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateProductPositions);
            ticking = true;
        }
    }
    
    // Event listener para scroll
    window.addEventListener('scroll', requestTick);
    
    // Efecto de scroll infinito simulado
    let scrollDirection = 1;
    let autoScrollSpeed = 0.5;
    let isAutoScrolling = false;
    
    function autoScroll() {
        if (isAutoScrolling) {
            window.scrollBy(0, scrollDirection * autoScrollSpeed);
            
            // Cambiar dirección cuando llegue a los extremos
            if (window.scrollY <= 0) {
                scrollDirection = 1;
            } else if (window.scrollY >= document.documentElement.scrollHeight - window.innerHeight) {
                scrollDirection = -1;
            }
        }
        requestAnimationFrame(autoScroll);
    }
    
    // Iniciar auto-scroll después de 3 segundos de inactividad
    let inactivityTimer;
    let lastScrollTime = Date.now();
    
    function resetInactivityTimer() {
        clearTimeout(inactivityTimer);
        isAutoScrolling = false;
        
        inactivityTimer = setTimeout(() => {
            isAutoScrolling = true;
            autoScroll();
        }, 3000);
    }
    
    // Detectar actividad del usuario
    window.addEventListener('scroll', () => {
        lastScrollTime = Date.now();
        isAutoScrolling = false;
        resetInactivityTimer();
    });
    
    window.addEventListener('mousemove', () => {
        lastScrollTime = Date.now();
        isAutoScrolling = false;
        resetInactivityTimer();
    });
    
    // Iniciar timer de inactividad
    resetInactivityTimer();
    
    // Efectos adicionales de hover y interacción
    productItems.forEach(item => {
        const productBottle = item.querySelector('.product-bottle');
        
        if (productBottle) {
            // Efecto de hover 3D
            productBottle.addEventListener('mouseenter', function() {
                this.style.transition = 'transform 0.3s ease';
            });
            
            productBottle.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                this.style.transform = `
                    translateX(0) 
                    translateY(-10px)
                    rotateX(${rotateX}deg) 
                    rotateY(${rotateY}deg) 
                    scale(1.05)
                `;
                this.style.animationPlayState = 'paused';
            });
            
            productBottle.addEventListener('mouseleave', function() {
                this.style.transform = 'translateX(0) rotateX(0) rotateY(0) scale(1)';
                this.style.animationPlayState = 'running';
            });
        }
    });
    
    // Animación de entrada suave para elementos
    function animateOnScroll() {
        const elements = document.querySelectorAll('.product-item, .brand-section');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Configurar animaciones iniciales
    productItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(50px)';
        item.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
    
    // Ejecutar animación inicial
    setTimeout(() => {
        animateOnScroll();
    }, 100);
    
    window.addEventListener('scroll', animateOnScroll);
    
    // Efecto de partículas flotantes en el hero
    function createFloatingParticles() {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                pointer-events: none;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${5 + Math.random() * 10}s ease-in-out infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            hero.appendChild(particle);
        }
    }
    
    // Crear partículas flotantes
    createFloatingParticles();
    
    // Smooth scroll para navegación interna (si se agrega)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Efecto de cursor personalizado (opcional)
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: rgba(102, 126, 234, 0.5);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        display: none;
    `;
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
        cursor.style.display = 'block';
    });
    
    document.addEventListener('mouseleave', () => {
        cursor.style.display = 'none';
    });
    
    // Efecto de cursor en productos
    productItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
            cursor.style.background = 'rgba(102, 126, 234, 0.8)';
        });
        
        item.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.background = 'rgba(102, 126, 234, 0.5)';
        });
    });
    
    console.log('🎨 Página de cremas cargada con efectos de scroll infinito y animaciones');
});
