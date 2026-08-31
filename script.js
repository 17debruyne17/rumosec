(function () {
    "use strict";

    var waNumber = "5541997746862";
    var baseWaUrl = "https://wa.me/" + waNumber + "?text=";

    /* ============ Header Scroll & Instant-Response Scroll Spy ============ */
    var header = document.getElementById('siteHeader');
    var navLinksList = document.querySelectorAll('.nav-link');

    var sectionIds = ['inicio', 'recursos', 'diferenciais', 'sobre-contato'];
    var trackedSections = [];

    function cacheSectionPositions() {
        trackedSections = [];
        sectionIds.forEach(function (id) {
            var el = document.getElementById(id);
            if (el) {
                var top = 0;
                var curr = el;
                while (curr) {
                    top += curr.offsetTop;
                    curr = curr.offsetParent;
                }
                trackedSections.push({
                    id: id,
                    el: el,
                    top: top,
                    height: el.offsetHeight
                });
            }
        });
    }

    cacheSectionPositions();
    window.addEventListener('resize', cacheSectionPositions, { passive: true });
    window.addEventListener('load', cacheSectionPositions, { passive: true });

    var clickScrollTargetId = null;
    var clickScrollTimeout = null;

    function updateActiveNav(activeId) {
        navLinksList.forEach(function (link) {
            var href = link.getAttribute('href');
            if (href === '#' + activeId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    var ticking = false;

    function onScroll() {
        var scrollY = window.scrollY;

        if (header) {
            header.classList.toggle('scrolled', scrollY > 20);
        }

        // If user clicked a link and smooth scrolling is underway, keep the clicked link active
        if (clickScrollTargetId) {
            ticking = false;
            return;
        }

        var scrollBottom = scrollY + window.innerHeight;
        var docHeight = document.documentElement.scrollHeight;

        // Bottom of page check (activates last section)
        if (scrollBottom >= docHeight - 40) {
            updateActiveNav('sobre-contato');
            ticking = false;
            return;
        }

        var currentActiveId = 'inicio';
        var checkPos = scrollY + (window.innerHeight * 0.35);

        for (var i = 0; i < trackedSections.length; i++) {
            var sec = trackedSections[i];
            if (checkPos >= sec.top) {
                currentActiveId = sec.id;
            }
        }

        updateActiveNav(currentActiveId);
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(onScroll);
            ticking = true;
        }
    }, { passive: true });

    /* ============ Smooth Scroll for Anchors with Instant Active Feedback ============ */
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();

                var navId = targetId.replace('#', '');
                
                // 1. INSTANTLY set active class on clicked link without any delay
                updateActiveNav(navId);

                clickScrollTargetId = navId;
                if (clickScrollTimeout) clearTimeout(clickScrollTimeout);

                // Calculate exact target top with header offset
                var targetTop = 0;
                var curr = target;
                while (curr) {
                    targetTop += curr.offsetTop;
                    curr = curr.offsetParent;
                }
                var headerOffset = 70;
                var finalPosition = Math.max(0, targetTop - headerOffset);

                // Smooth scroll directly to exact position
                window.scrollTo({
                    top: finalPosition,
                    behavior: 'smooth'
                });

                // Clear click lock after 600ms
                clickScrollTimeout = setTimeout(function () {
                    clickScrollTargetId = null;
                }, 600);

                var navLinks = document.getElementById('navLinks');
                var hamburger = document.getElementById('hamburger');
                if (navLinks && navLinks.classList.contains('open')) {
                    navLinks.classList.remove('open');
                    hamburger.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            }
        });
    });

    /* ============ Mobile Hamburger Menu ============ */
    var hamburger = document.getElementById('hamburger');
    var navLinks = document.getElementById('navLinks');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function () {
            var isOpen = navLinks.classList.toggle('open');
            hamburger.classList.toggle('active', isOpen);
            hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });
    }

    /* ============ Quick Lead Capture Form -> Redirect to WhatsApp ============ */
    var quickLeadForm = document.getElementById('quickLeadForm');
    if (quickLeadForm) {
        quickLeadForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var emailInput = document.getElementById('leadEmail');
            var emailVal = emailInput ? emailInput.value.trim() : '';
            var msg = encodeURIComponent("Olá! Tenho interesse no RUMOSEC DLP. Meu e-mail de contato: " + emailVal);
            window.open("https://wa.me/" + waNumber + "?text=" + msg, "_blank");
            if (emailInput) emailInput.value = '';
        });
    }

    /* ============ Full Contact Form -> Redirect to WhatsApp ============ */
    var fullContactForm = document.getElementById('fullContactForm');
    if (fullContactForm) {
        fullContactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var nome = document.getElementById('cNome') ? document.getElementById('cNome').value.trim() : '';
            var email = document.getElementById('cEmail') ? document.getElementById('cEmail').value.trim() : '';
            var empresa = document.getElementById('cEmpresa') ? document.getElementById('cEmpresa').value.trim() : '';
            var mensagem = document.getElementById('cMensagem') ? document.getElementById('cMensagem').value.trim() : '';

            var text = "Olá! Tenho interesse no RUMOSEC DLP.\n\n" +
                "*Nome:* " + nome + "\n" +
                "*E-mail:* " + email + "\n" +
                "*Empresa:* " + empresa;
            
            if (mensagem) {
                text += "\n*Mensagem:* " + mensagem;
            }

            window.open("https://wa.me/" + waNumber + "?text=" + encodeURIComponent(text), "_blank");
        });
    }

    /* ============ Modal Schedule Form -> Redirect to WhatsApp ============ */
    var scheduleForm = document.getElementById('scheduleForm');
    if (scheduleForm) {
        scheduleForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var nome = document.getElementById('fNome') ? document.getElementById('fNome').value.trim() : '';
            var email = document.getElementById('fEmail') ? document.getElementById('fEmail').value.trim() : '';
            var empresa = document.getElementById('fEmpresa') ? document.getElementById('fEmpresa').value.trim() : '';

            var text = "Olá! Tenho interesse no RUMOSEC DLP e gostaria de agendar uma demonstração.\n\n" +
                "*Nome:* " + nome + "\n" +
                "*E-mail:* " + email + "\n" +
                "*Empresa:* " + empresa;

            window.open("https://wa.me/" + waNumber + "?text=" + encodeURIComponent(text), "_blank");

            var overlay = document.getElementById('modalOverlay');
            if (overlay) overlay.classList.remove('open');
            document.body.style.overflow = '';
            scheduleForm.reset();
        });
    }

    /* ============ FAQ Accordion ============ */
    var faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(function (item) {
        item.addEventListener('click', function () {
            var isOpen = item.classList.contains('open');
            faqItems.forEach(function (i) { i.classList.remove('open'); });
            if (!isOpen) item.classList.add('open');
        });
    });

})();