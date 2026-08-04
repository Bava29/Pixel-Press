/*=========================================
Scroll To Top
=========================================*/

const ppThemeStateRoot = document.documentElement;
const ppDarkModeStorageKey = "pixelpress-theme-mode";
const ppDirectionStorageKey = "pixelpress-direction-mode";
const ppDarkModeClass = "dark-mode";
const ppRtlModeClass = "rtl-mode";

function ppGetStoredMode(storageKey, enabledValue) {

    try {

        return window.localStorage.getItem(storageKey) === enabledValue;

    } catch (error) {

        return false;

    }

}

function ppSetStoredMode(storageKey, enabledValue, isEnabled) {

    try {

        if (isEnabled) {

            window.localStorage.setItem(storageKey, enabledValue);

        } else {

            window.localStorage.removeItem(storageKey);

        }

    } catch (error) {

        // Ignore storage failures so the toggle still works in restricted contexts.

    }

}

function ppCreateUniqueToggleList(selectors) {

    const toggleButtons = new Set();

    selectors.forEach(selector => {

        document.querySelectorAll(selector).forEach(button => toggleButtons.add(button));

    });

    return Array.from(toggleButtons);

}

function ppSyncToggleButtons(toggleButtons, isEnabled) {

    toggleButtons.forEach(toggleButton => {

        toggleButton.setAttribute("aria-pressed", isEnabled ? "true" : "false");

    });

}

function ppApplyStoredMode(storageKey, modeValue, rootClass, toggleButtons) {

    const isEnabled = ppGetStoredMode(storageKey, modeValue);

    ppThemeStateRoot.classList.toggle(rootClass, isEnabled);
    ppSyncToggleButtons(toggleButtons, isEnabled);

}

function ppToggleStoredMode(storageKey, modeValue, rootClass, toggleButtons) {

    const isEnabled = !ppThemeStateRoot.classList.contains(rootClass);

    ppThemeStateRoot.classList.toggle(rootClass, isEnabled);
    ppSetStoredMode(storageKey, modeValue, isEnabled);
    ppSyncToggleButtons(toggleButtons, isEnabled);

}

const ppThemeToggleButtons = ppCreateUniqueToggleList([
    ".theme-toggle-button",
    ".ppd-header-mode-btn[aria-label='Dark mode toggle']"
]);

const ppDirectionToggleButtons = ppCreateUniqueToggleList([
    ".direction-toggle-button",
    ".ppd-header-mode-btn[aria-label='RTL mode toggle']"
]);

ppApplyStoredMode(ppDarkModeStorageKey, "dark", ppDarkModeClass, ppThemeToggleButtons);
ppApplyStoredMode(ppDirectionStorageKey, "rtl", ppRtlModeClass, ppDirectionToggleButtons);

ppThemeToggleButtons.forEach(toggleButton => {

    toggleButton.addEventListener("click", () => {

        ppToggleStoredMode(ppDarkModeStorageKey, "dark", ppDarkModeClass, ppThemeToggleButtons);

    });

});

ppDirectionToggleButtons.forEach(toggleButton => {

    toggleButton.addEventListener("click", () => {

        ppToggleStoredMode(ppDirectionStorageKey, "rtl", ppRtlModeClass, ppDirectionToggleButtons);

    });

});

window.addEventListener("storage", event => {

    if (event.storageArea !== window.localStorage) {

        return;

    }

    if (event.key === ppDarkModeStorageKey) {

        ppApplyStoredMode(ppDarkModeStorageKey, "dark", ppDarkModeClass, ppThemeToggleButtons);

    } else if (event.key === ppDirectionStorageKey) {

        ppApplyStoredMode(ppDirectionStorageKey, "rtl", ppRtlModeClass, ppDirectionToggleButtons);

    }

});

const backToTopButton = document.getElementById("backToTopButton");

if (backToTopButton) {

    window.addEventListener("scroll", () => {

        if (window.scrollY > 300) {

            backToTopButton.classList.add("is-active");

        } else {

            backToTopButton.classList.remove("is-active");

        }

    });

    backToTopButton.addEventListener("click", () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

}

/*=========================================
Mobile Navigation
=========================================*/

const mobileMenuToggle = document.getElementById("mobileMenuToggle");
const mobileNavSidebar = document.getElementById("mobileNavSidebar");
const mobileNavOverlay = document.getElementById("mobileNavOverlay");
const mobileNavClose = document.getElementById("mobileNavClose");
const desktopBreakpoint = window.matchMedia("(min-width: 1200px)");
const mobileNavDropdowns = mobileNavSidebar
    ? mobileNavSidebar.querySelectorAll(".mobile-nav-dropdown")
    : [];
const mobileNavDropdownToggles = mobileNavSidebar
    ? mobileNavSidebar.querySelectorAll(".mobile-nav-dropdown-toggle")
    : [];

const mobileNavLinks = mobileNavSidebar
    ? mobileNavSidebar.querySelectorAll("a")
    : [];

if (mobileNavSidebar) {

    mobileNavSidebar.inert = true;

}

function closeMobileDropdowns() {

    mobileNavDropdowns.forEach(mobileNavDropdown => {

        mobileNavDropdown.classList.remove("is-open");

    });

    mobileNavDropdownToggles.forEach(mobileNavDropdownToggle => {

        mobileNavDropdownToggle.setAttribute("aria-expanded", "false");

    });

}

function closeMobileNav() {

    if (!mobileMenuToggle || !mobileNavSidebar || !mobileNavOverlay) {

        return;

    }

    mobileMenuToggle.setAttribute("aria-expanded", "false");
    mobileNavSidebar.classList.remove("is-open");
    mobileNavOverlay.classList.remove("is-open");
    mobileNavSidebar.setAttribute("aria-hidden", "true");
    mobileNavOverlay.setAttribute("aria-hidden", "true");
    mobileNavSidebar.inert = true;
    closeMobileDropdowns();
    document.body.classList.remove("sidebar-open");

}

function openMobileNav() {

    if (!mobileMenuToggle || !mobileNavSidebar || !mobileNavOverlay) {

        return;

    }

    mobileMenuToggle.setAttribute("aria-expanded", "true");
    mobileNavSidebar.classList.add("is-open");
    mobileNavOverlay.classList.add("is-open");
    mobileNavSidebar.setAttribute("aria-hidden", "false");
    mobileNavOverlay.setAttribute("aria-hidden", "false");
    mobileNavSidebar.inert = false;
    closeMobileDropdowns();
    document.body.classList.add("sidebar-open");

}

if (mobileMenuToggle && mobileNavSidebar && mobileNavOverlay && mobileNavClose) {

    mobileMenuToggle.addEventListener("click", () => {

        const isOpen = mobileNavSidebar.classList.contains("is-open");

        if (isOpen) {

            closeMobileNav();

        } else {

            openMobileNav();

        }

    });

    mobileNavClose.addEventListener("click", closeMobileNav);

    mobileNavOverlay.addEventListener("click", closeMobileNav);

    mobileNavDropdownToggles.forEach(mobileNavDropdownToggle => {

        mobileNavDropdownToggle.addEventListener("click", event => {

            event.preventDefault();
            event.stopPropagation();

            const mobileNavDropdown = mobileNavDropdownToggle.closest(".mobile-nav-dropdown");

            if (!mobileNavDropdown) {

                return;

            }

            const isOpen = mobileNavDropdown.classList.contains("is-open");

            closeMobileDropdowns();

            if (!isOpen) {

                mobileNavDropdown.classList.add("is-open");
                mobileNavDropdownToggle.setAttribute("aria-expanded", "true");

            }

        });

    });

    mobileNavLinks.forEach(mobileNavLink => {

        mobileNavLink.addEventListener("click", () => {

            closeMobileNav();

        });

    });

    window.addEventListener("keydown", event => {

        if (event.key === "Escape") {

            closeMobileNav();

        }

    });

    const handleDesktopBreakpointChange = event => {

        if (event.matches) {

            closeMobileNav();

        }

    };

    if (typeof desktopBreakpoint.addEventListener === "function") {

        desktopBreakpoint.addEventListener("change", handleDesktopBreakpointChange);

    } else if (typeof desktopBreakpoint.addListener === "function") {

        desktopBreakpoint.addListener(handleDesktopBreakpointChange);

    }

}

/*=========================================
Interactive Product Showcase
=========================================*/

const showcaseTabButtons = document.querySelectorAll(".showcase-tab-button");

const showcasePreviewImage = document.getElementById("showcasePreviewImage");
const showcasePreviewTitle = document.getElementById("showcasePreviewTitle");
const showcasePreviewText = document.getElementById("showcasePreviewText");

showcaseTabButtons.forEach(showcaseTabButton => {

    showcaseTabButton.addEventListener("click", () => {

        showcaseTabButtons.forEach(showcaseTabItem => showcaseTabItem.classList.remove("is-active"));

        showcaseTabButton.classList.add("is-active");

        showcasePreviewImage.src = showcaseTabButton.dataset.image;

        showcasePreviewTitle.textContent = showcaseTabButton.dataset.title;

        showcasePreviewText.textContent = showcaseTabButton.dataset.text;

    });

});

/*=========================================
FAQ
=========================================*/

const faqAccordionItems = document.querySelectorAll(".faq-accordion-item");

faqAccordionItems.forEach(faqAccordionItem => {

    const faqQuestionButton = faqAccordionItem.querySelector(".faq-accordion-question");

    faqQuestionButton.addEventListener("click", () => {

        faqAccordionItems.forEach(otherFaqAccordionItem => {

            if (otherFaqAccordionItem !== faqAccordionItem) {

                otherFaqAccordionItem.classList.remove("is-active");

            }

        });

        faqAccordionItem.classList.toggle("is-active");

    });

});

/*=========================================
Premium Reveal Animations
=========================================*/

const ppMotionReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const ppRevealSelectors = [
    { selector: ".page-banner-content", effect: "up" },
    { selector: ".section-heading", effect: "up" },
    { selector: ".hero-content, .home1-cta-content, .about-cta-content, .business-card-cta-wrapper, .contact-form-box, .auth-card, .premium-cta .cta-card", effect: "up" },
    { selector: ".hero-image, .hero-two-image, .about-company-image, .business-card-overview-image, .gallery-main, .map-card", effect: "right" },
    { selector: ".hero-two-content, .about-company-content, .business-card-overview-content, .contact-box", effect: "left" },
    { selector: ".hero-features, .about-features, .cta-features, .footer-grid-layout", effect: "up" },
    { selector: ".hero-stat, .why-card, .industry-card, .service-card, .feature-box, .testimonial-card, .journey-card, .achievement-card, .gallery-item, .contact-card, .business-card-feature-item, .business-card-spec-item, .business-card-process-item, .pricing-card, .price-card", effect: "up", stagger: 90 },
    { selector: ".footer-column", effect: "up", stagger: 90 },
    { selector: ".footer-brand", effect: "up" }
];
const ppRevealTargets = new WeakSet();

function ppBuildRevealObserver() {

    if (ppMotionReduced || !("IntersectionObserver" in window)) {

        return null;

    }

    return new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) {

                return;

            }

            entry.target.classList.add("is-visible");
            ppRevealTargets.delete(entry.target);

            if (ppRevealObserver) {

                ppRevealObserver.unobserve(entry.target);

            }

        });

    }, {
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px"
    });

}

const ppRevealObserver = ppBuildRevealObserver();

function ppRegisterRevealTarget(element, effect, delay = 0) {

    if (!element || ppRevealTargets.has(element)) {

        return;

    }

    ppRevealTargets.add(element);
    element.classList.add("pp-reveal", `pp-reveal--${effect}`);

    if (delay > 0) {

        element.style.setProperty("--pp-reveal-delay", `${delay}ms`);

    }

    if (ppMotionReduced || !ppRevealObserver) {

        element.classList.add("is-visible");
        return;

    }

    ppRevealObserver.observe(element);

}

ppRevealSelectors.forEach(group => {

    const revealElements = document.querySelectorAll(group.selector);

    revealElements.forEach((element, index) => {

        ppRegisterRevealTarget(element, group.effect, group.stagger ? index * group.stagger : 0);

    });

});

const ppCounterSelectors = [
    ".hero-two .hero-stat h3",
    ".hero-two .hero-stat strong",
    ".achievements .achievement-card h3"
];
const ppCounterTargets = new WeakSet();

function ppParseCounterText(text) {

    const cleanedText = String(text || "").replace(/\u00A0/g, " ").trim();

    if (!cleanedText) {

        return null;

    }

    const match = cleanedText.match(/^([^0-9+\-]*)(-?\d[\d,]*(?:\.\d+)?)(.*)$/);

    if (!match) {

        return null;

    }

    const prefix = match[1];
    const numberText = match[2].replace(/,/g, "");
    const suffix = match[3];

    if (/[a-z]/i.test(prefix)) {

        return null;

    }

    const targetValue = Number(numberText);

    if (!Number.isFinite(targetValue)) {

        return null;

    }

    const hasThousandsSeparator = /,/.test(match[2]);
    const hasCurrencyPrefix = prefix.startsWith("$");
    const decimals = numberText.includes(".") ? numberText.split(".")[1].length : 0;

    return {
        prefix,
        suffix,
        targetValue,
        decimals,
        useGrouping: hasThousandsSeparator || hasCurrencyPrefix || (!suffix.trim() && Math.abs(targetValue) >= 1000)
    };

}

function ppFormatCounterValue(value, meta) {

    const normalizedValue = meta.decimals > 0 ? Number(value.toFixed(meta.decimals)) : Math.round(value);
    const formattedNumber = meta.useGrouping
        ? new Intl.NumberFormat("en-US", {
            minimumFractionDigits: meta.decimals,
            maximumFractionDigits: meta.decimals
        }).format(normalizedValue)
        : (meta.decimals > 0 ? normalizedValue.toFixed(meta.decimals) : String(normalizedValue));

    return `${meta.prefix}${formattedNumber}${meta.suffix}`.trim();

}

function ppAnimateCounter(counterElement) {

    if (!counterElement || ppCounterTargets.has(counterElement)) {

        return;

    }

    const counterMeta = ppParseCounterText(counterElement.textContent);

    if (!counterMeta) {

        return;

    }

    ppCounterTargets.add(counterElement);

    if (ppMotionReduced || !("requestAnimationFrame" in window)) {

        counterElement.textContent = ppFormatCounterValue(counterMeta.targetValue, counterMeta);
        return;

    }

    const animationDuration = 800;
    const animationStart = performance.now();

    const animateFrame = currentTime => {

        const animationProgress = Math.min((currentTime - animationStart) / animationDuration, 1);
        const easedProgress = 1 - Math.pow(1 - animationProgress, 3);
        const animatedValue = counterMeta.targetValue * easedProgress;

        counterElement.textContent = ppFormatCounterValue(animatedValue, counterMeta);

        if (animationProgress < 1) {

            requestAnimationFrame(animateFrame);
        } else {

            counterElement.textContent = ppFormatCounterValue(counterMeta.targetValue, counterMeta);

        }

    };

    requestAnimationFrame(animateFrame);

}

const ppCounterObserver = ppMotionReduced || !("IntersectionObserver" in window)
    ? null
    : new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) {

                return;

            }

            const counterGroup = entry.target;
            counterGroup.querySelectorAll(ppCounterSelectors.join(", ")).forEach(ppAnimateCounter);

            if (ppCounterObserver) {

                ppCounterObserver.unobserve(counterGroup);

            }

        });

    }, {
        threshold: 0.2,
        rootMargin: "0px 0px -10% 0px"
    });

[
    ".hero-two",
    ".achievements"
].forEach(counterGroupSelector => {

    document.querySelectorAll(counterGroupSelector).forEach(counterGroup => {

        if (ppCounterObserver) {

            ppCounterObserver.observe(counterGroup);
        } else {

            counterGroup.querySelectorAll(ppCounterSelectors.join(", ")).forEach(ppAnimateCounter);

        }

    });

});
