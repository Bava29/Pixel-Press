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
