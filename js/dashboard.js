/*=========================================
Responsive Dashboard Sidebar
=========================================*/

const ppdThemeStateRoot = document.documentElement;
const ppdDarkModeStorageKey = "pixelpress-theme-mode";
const ppdDirectionStorageKey = "pixelpress-direction-mode";
const ppdDarkModeClass = "dark-mode";
const ppdRtlModeClass = "rtl-mode";
const ppdDarkModeEnabledPages = new Set([
    "dashboard.html",
    "upload-files.html",
    "print-orders.html",
    "track-orders.html",
    "order-history.html",
    "reorder-prints.html",
    "payments.html",
    "saved-files.html"
]);

function ppdGetCurrentPageName() {
    const ppdPathName = window.location.pathname.split("?")[0].split("#")[0];
    const ppdPageName = ppdPathName.substring(ppdPathName.lastIndexOf("/") + 1).toLowerCase();

    return ppdPageName || "index.html";
}

const ppdIsDarkModeEnabledPage = ppdDarkModeEnabledPages.has(ppdGetCurrentPageName());

function ppdGetStoredMode(storageKey, enabledValue) {
    try {
        return window.localStorage.getItem(storageKey) === enabledValue;
    } catch (error) {
        return false;
    }
}

function ppdSetStoredMode(storageKey, enabledValue, isEnabled) {
    try {
        if (isEnabled) {
            window.localStorage.setItem(storageKey, enabledValue);
        } else {
            window.localStorage.removeItem(storageKey);
        }
    } catch (error) {
        // Ignore storage failures so the mode toggles still work if storage is blocked.
    }
}

function ppdCreateUniqueToggleList(selectors) {
    const toggleButtons = new Set();

    selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(button => toggleButtons.add(button));
    });

    return Array.from(toggleButtons);
}

function ppdSyncToggleButtons(toggleButtons, isEnabled) {
    toggleButtons.forEach(toggleButton => {
        toggleButton.setAttribute("aria-pressed", isEnabled ? "true" : "false");
    });
}

function ppdApplyStoredMode(storageKey, modeValue, rootClass, toggleButtons) {
    const isEnabled = ppdGetStoredMode(storageKey, modeValue);

    ppdThemeStateRoot.classList.toggle(rootClass, ppdIsDarkModeEnabledPage && isEnabled);
    document.body.classList.toggle(rootClass, ppdIsDarkModeEnabledPage && isEnabled);
    ppdSyncToggleButtons(toggleButtons, isEnabled);
}

function ppdToggleStoredMode(storageKey, modeValue, rootClass, toggleButtons) {
    const isEnabled = !ppdThemeStateRoot.classList.contains(rootClass);

    ppdThemeStateRoot.classList.toggle(rootClass, ppdIsDarkModeEnabledPage && isEnabled);
    document.body.classList.toggle(rootClass, ppdIsDarkModeEnabledPage && isEnabled);
    ppdSetStoredMode(storageKey, modeValue, isEnabled);
    ppdSyncToggleButtons(toggleButtons, isEnabled);
}

const ppdThemeToggleButtons = ppdCreateUniqueToggleList([
    ".theme-toggle-button",
    ".ppd-header-mode-btn[aria-label='Dark mode toggle']"
]);

const ppdDirectionToggleButtons = ppdCreateUniqueToggleList([
    ".direction-toggle-button",
    ".ppd-header-mode-btn[aria-label='RTL mode toggle']"
]);

if (ppdIsDarkModeEnabledPage) {
    ppdApplyStoredMode(ppdDarkModeStorageKey, "dark", ppdDarkModeClass, ppdThemeToggleButtons);
}
ppdApplyStoredMode(ppdDirectionStorageKey, "rtl", ppdRtlModeClass, ppdDirectionToggleButtons);

ppdThemeToggleButtons.forEach(toggleButton => {
    toggleButton.addEventListener("click", () => {
        if (!ppdIsDarkModeEnabledPage) {
            return;
        }

        ppdToggleStoredMode(ppdDarkModeStorageKey, "dark", ppdDarkModeClass, ppdThemeToggleButtons);
    });
});

ppdDirectionToggleButtons.forEach(toggleButton => {
    toggleButton.addEventListener("click", () => {
        ppdToggleStoredMode(ppdDirectionStorageKey, "rtl", ppdRtlModeClass, ppdDirectionToggleButtons);
    });
});

window.addEventListener("storage", event => {
    if (event.storageArea !== window.localStorage) {
        return;
    }

    if (event.key === ppdDarkModeStorageKey && ppdIsDarkModeEnabledPage) {
        ppdApplyStoredMode(ppdDarkModeStorageKey, "dark", ppdDarkModeClass, ppdThemeToggleButtons);
    } else if (event.key === ppdDirectionStorageKey) {
        ppdApplyStoredMode(ppdDirectionStorageKey, "rtl", ppdRtlModeClass, ppdDirectionToggleButtons);
    }
});

const ppdDashboardMenuToggle = document.getElementById("ppdDashboardMenuToggle");
const ppdDashboardMobileSidebar = document.getElementById("ppdDashboardMobileSidebar");
const ppdDashboardSidebarOverlay = document.getElementById("ppdDashboardSidebarOverlay");
const ppdDashboardSidebarClose = document.getElementById("ppdDashboardSidebarClose");
const ppdDashboardMobileLinks = ppdDashboardMobileSidebar
    ? ppdDashboardMobileSidebar.querySelectorAll("a")
    : [];
const ppdDashboardDesktopBreakpoint = window.matchMedia("(min-width: 1200px)");
const ppdLogoutLinks = document.querySelectorAll(".ppd-logout-link");
const ppdLogoutLoginUrl = "login.html";

if (ppdDashboardMobileSidebar) {
    ppdDashboardMobileSidebar.inert = true;
}

function ppdCloseDashboardSidebar() {
    if (!ppdDashboardMenuToggle || !ppdDashboardMobileSidebar || !ppdDashboardSidebarOverlay) {
        return;
    }

    ppdDashboardMenuToggle.setAttribute("aria-expanded", "false");
    ppdDashboardMobileSidebar.classList.remove("is-open");
    ppdDashboardSidebarOverlay.classList.remove("is-open");
    ppdDashboardMobileSidebar.setAttribute("aria-hidden", "true");
    ppdDashboardSidebarOverlay.setAttribute("aria-hidden", "true");
    ppdDashboardMobileSidebar.inert = true;
    document.body.classList.remove("ppd-sidebar-open");
}

function ppdOpenDashboardSidebar() {
    if (!ppdDashboardMenuToggle || !ppdDashboardMobileSidebar || !ppdDashboardSidebarOverlay) {
        return;
    }

    ppdDashboardMenuToggle.setAttribute("aria-expanded", "true");
    ppdDashboardMobileSidebar.classList.add("is-open");
    ppdDashboardSidebarOverlay.classList.add("is-open");
    ppdDashboardMobileSidebar.setAttribute("aria-hidden", "false");
    ppdDashboardSidebarOverlay.setAttribute("aria-hidden", "false");
    ppdDashboardMobileSidebar.inert = false;
    document.body.classList.add("ppd-sidebar-open");
}

if (ppdDashboardMenuToggle && ppdDashboardMobileSidebar && ppdDashboardSidebarOverlay && ppdDashboardSidebarClose) {
    ppdDashboardMenuToggle.addEventListener("click", () => {
        if (ppdDashboardMobileSidebar.classList.contains("is-open")) {
            ppdCloseDashboardSidebar();
            return;
        }

        ppdOpenDashboardSidebar();
    });

    ppdDashboardSidebarClose.addEventListener("click", ppdCloseDashboardSidebar);
    ppdDashboardSidebarOverlay.addEventListener("click", ppdCloseDashboardSidebar);

    ppdDashboardMobileLinks.forEach(ppdDashboardMobileLink => {
        ppdDashboardMobileLink.addEventListener("click", ppdCloseDashboardSidebar);
    });

    window.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            ppdCloseDashboardSidebar();
        }
    });

    const ppdHandleDesktopBreakpointChange = event => {
        if (event.matches) {
            ppdCloseDashboardSidebar();
        }
    };

    if (typeof ppdDashboardDesktopBreakpoint.addEventListener === "function") {
        ppdDashboardDesktopBreakpoint.addEventListener("change", ppdHandleDesktopBreakpointChange);
    } else if (typeof ppdDashboardDesktopBreakpoint.addListener === "function") {
        ppdDashboardDesktopBreakpoint.addListener(ppdHandleDesktopBreakpointChange);
    }
}

if (ppdLogoutLinks.length > 0) {
    const ppdLogoutModal = document.createElement("div");
    ppdLogoutModal.className = "ppd-logout-modal";
    ppdLogoutModal.hidden = true;
    ppdLogoutModal.setAttribute("aria-hidden", "true");
    ppdLogoutModal.innerHTML = `
        <div class="ppd-logout-modal__backdrop" data-logout-close></div>
        <div class="ppd-logout-modal__dialog" role="dialog" aria-modal="true"
            aria-labelledby="ppdLogoutModalTitle" aria-describedby="ppdLogoutModalDescription">
            <div class="ppd-logout-modal__icon" aria-hidden="true">
                <i class="fa-solid fa-right-from-bracket"></i>
            </div>
            <h2 class="ppd-logout-modal__title" id="ppdLogoutModalTitle">Logout?</h2>
            <p class="ppd-logout-modal__description" id="ppdLogoutModalDescription">
                Do you want to logout?
            </p>
            <div class="ppd-logout-modal__actions">
                <button class="ppd-logout-modal__button ppd-logout-modal__button--ghost" type="button"
                    data-logout-close>No</button>
                <button class="ppd-logout-modal__button ppd-logout-modal__button--danger" type="button"
                    data-logout-confirm>Yes</button>
            </div>
        </div>
    `;
    document.body.appendChild(ppdLogoutModal);

    const ppdLogoutConfirmButton = ppdLogoutModal.querySelector("[data-logout-confirm]");
    const ppdLogoutCloseTargets = ppdLogoutModal.querySelectorAll("[data-logout-close]");
    let ppdLogoutTargetUrl = ppdLogoutLoginUrl;
    let ppdLogoutPreviousFocus = null;

    function ppdCloseLogoutModal() {
        ppdLogoutModal.classList.remove("is-open");
        ppdLogoutModal.hidden = true;
        ppdLogoutModal.setAttribute("aria-hidden", "true");

        if (ppdLogoutPreviousFocus && typeof ppdLogoutPreviousFocus.focus === "function") {
            ppdLogoutPreviousFocus.focus();
        }
    }

    function ppdOpenLogoutModal(targetUrl, triggerElement) {
        ppdLogoutTargetUrl = targetUrl || ppdLogoutLoginUrl;
        ppdLogoutPreviousFocus = triggerElement || document.activeElement;
        ppdLogoutModal.hidden = false;
        ppdLogoutModal.setAttribute("aria-hidden", "false");
        requestAnimationFrame(() => {
            ppdLogoutModal.classList.add("is-open");
            if (ppdLogoutConfirmButton) {
                ppdLogoutConfirmButton.focus();
            }
        });
    }

    ppdLogoutLinks.forEach(ppdLogoutLink => {
        ppdLogoutLink.addEventListener("click", event => {
            event.preventDefault();
            ppdOpenLogoutModal(ppdLogoutLink.getAttribute("href"), ppdLogoutLink);
        });
    });

    ppdLogoutCloseTargets.forEach(ppdLogoutCloseTarget => {
        ppdLogoutCloseTarget.addEventListener("click", ppdCloseLogoutModal);
    });

    if (ppdLogoutConfirmButton) {
        ppdLogoutConfirmButton.addEventListener("click", () => {
            window.location.href = ppdLogoutTargetUrl;
        });
    }

    ppdLogoutModal.addEventListener("click", event => {
        if (event.target === ppdLogoutModal || event.target.hasAttribute("data-logout-close")) {
            ppdCloseLogoutModal();
        }
    });

    window.addEventListener("keydown", event => {
        if (event.key === "Escape" && !ppdLogoutModal.hidden) {
            ppdCloseLogoutModal();
        }
    });
}

/*=========================================
Premium Reveal Animations
=========================================*/

const ppdMotionReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const ppdRevealSelectors = [
    { selector: ".ppd-dashboard-header", effect: "up" },
    { selector: ".ppd-hero-panel, .ppd-section-card, .ppd-to-overview-panel, .ppd-to-timeline-card, .ppd-to-details-grid, .ppd-to-activity-card, .ppd-pm-current-card, .ppd-pm-method-card, .ppd-pm-history-card, .ppd-pm-billing-card, .ppd-sf-files-card, .ppd-sf-preview-card, .ppd-sf-recent-card, .ppd-sf-storage-card, .ppd-rp-orders-card, .ppd-rp-templates-card, .ppd-rp-custom-card, .ppd-rp-summary-card, .ppd-oh-filter-card, .ppd-oh-orders-card, .ppd-oh-details-card, .ppd-oh-activity-card, .ppd-po-form-card, .ppd-po-summary-card, .ppd-po-preview-card, .ppd-po-confirm-card, .ppd-po-payment-card, .ppd-upload-hero-card, .ppd-upload-spec-card, .ppd-upload-summary-card, .ppd-upload-file-card", effect: "scale" },
    { selector: ".ppd-hero-copy, .ppd-to-overview-copy, .ppd-pm-current-grid, .ppd-pm-history-grid, .ppd-sf-files-grid, .ppd-rp-orders-grid, .ppd-rp-templates-grid, .ppd-oh-orders-grid, .ppd-oh-details-grid, .ppd-upload-form, .ppd-po-form, .ppd-po-preview", effect: "up" },
    { selector: ".ppd-hero-visual, .ppd-to-overview-side, .ppd-to-delivery-card, .ppd-pm-billing-card, .ppd-sf-preview-card, .ppd-sf-storage-card, .ppd-po-summary-card, .ppd-upload-hero-visual, .ppd-upload-summary-card", effect: "right" },
    { selector: ".ppd-metric-card, .ppd-order-card, .ppd-file-card, .ppd-quick-card, .ppd-to-stage, .ppd-to-activity-item, .ppd-pm-overview-card, .ppd-pm-method-item, .ppd-pm-history-item, .ppd-sf-overview-card, .ppd-sf-file-card, .ppd-rp-overview-card, .ppd-rp-order-card, .ppd-rp-template-card, .ppd-oh-summary-card, .ppd-oh-order-card, .ppd-po-method-card, .ppd-upload-step-card", effect: "up", stagger: 80 }
];
const ppdRevealTargets = new WeakSet();

function ppdBuildRevealObserver() {

    if (ppdMotionReduced || !("IntersectionObserver" in window)) {

        return null;

    }

    return new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) {

                return;

            }

            entry.target.classList.add("is-visible");
            ppdRevealTargets.delete(entry.target);

            if (ppdRevealObserver) {

                ppdRevealObserver.unobserve(entry.target);

            }

        });

    }, {
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px"
    });

}

const ppdRevealObserver = ppdBuildRevealObserver();

function ppdRegisterRevealTarget(element, effect, delay = 0) {

    if (!element || ppdRevealTargets.has(element)) {

        return;

    }

    ppdRevealTargets.add(element);
    element.classList.add("pp-reveal", `pp-reveal--${effect}`);

    if (delay > 0) {

        element.style.setProperty("--pp-reveal-delay", `${delay}ms`);

    }

    if (ppdMotionReduced || !ppdRevealObserver) {

        element.classList.add("is-visible");
        return;

    }

    ppdRevealObserver.observe(element);

}

ppdRevealSelectors.forEach(group => {

    document.querySelectorAll(group.selector).forEach((element, index) => {

        ppdRegisterRevealTarget(element, group.effect, group.stagger ? index * group.stagger : 0);

    });

});

const ppdCounterSelectors = [
    ".ppd-metric-value",
    ".ppd-hero-stat strong",
    ".ppd-to-overview-stat strong",
    "strong[class*='-value']",
    "h2[class*='-value']"
];
const ppdCounterTargets = new WeakSet();

function ppdParseCounterText(text) {

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

function ppdFormatCounterValue(value, meta) {

    const normalizedValue = meta.decimals > 0 ? Number(value.toFixed(meta.decimals)) : Math.round(value);
    const formattedNumber = meta.useGrouping
        ? new Intl.NumberFormat("en-US", {
            minimumFractionDigits: meta.decimals,
            maximumFractionDigits: meta.decimals
        }).format(normalizedValue)
        : (meta.decimals > 0 ? normalizedValue.toFixed(meta.decimals) : String(normalizedValue));

    return `${meta.prefix}${formattedNumber}${meta.suffix}`.trim();

}

function ppdAnimateCounter(counterElement) {

    if (!counterElement || ppdCounterTargets.has(counterElement)) {

        return;

    }

    const counterMeta = ppdParseCounterText(counterElement.textContent);

    if (!counterMeta) {

        return;

    }

    ppdCounterTargets.add(counterElement);

    if (ppdMotionReduced || !("requestAnimationFrame" in window)) {

        counterElement.textContent = ppdFormatCounterValue(counterMeta.targetValue, counterMeta);
        return;

    }

    const animationDuration = 800;
    const animationStart = performance.now();

    const animateFrame = currentTime => {

        const animationProgress = Math.min((currentTime - animationStart) / animationDuration, 1);
        const easedProgress = 1 - Math.pow(1 - animationProgress, 3);
        const animatedValue = counterMeta.targetValue * easedProgress;

        counterElement.textContent = ppdFormatCounterValue(animatedValue, counterMeta);

        if (animationProgress < 1) {

            requestAnimationFrame(animateFrame);
        } else {

            counterElement.textContent = ppdFormatCounterValue(counterMeta.targetValue, counterMeta);

        }

    };

    requestAnimationFrame(animateFrame);

}

const ppdCounterObserver = ppdMotionReduced || !("IntersectionObserver" in window)
    ? null
    : new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) {

                return;

            }

            const counterGroup = entry.target;
            counterGroup.querySelectorAll(ppdCounterSelectors.join(", ")).forEach(ppdAnimateCounter);

            if (ppdCounterObserver) {

                ppdCounterObserver.unobserve(counterGroup);

            }

        });

    }, {
        threshold: 0.2,
        rootMargin: "0px 0px -10% 0px"
    });

[
    ".ppd-hero-panel",
    ".ppd-stats-grid",
    ".ppd-to-overview-panel",
    ".ppd-pm-overview-grid",
    ".ppd-sf-overview-grid",
    ".ppd-rp-overview-grid",
    ".ppd-oh-summary-grid",
    ".ppd-dashboard-main"
].forEach(counterGroupSelector => {

    document.querySelectorAll(counterGroupSelector).forEach(counterGroup => {

        if (ppdCounterObserver) {

            ppdCounterObserver.observe(counterGroup);
        } else {

            counterGroup.querySelectorAll(ppdCounterSelectors.join(", ")).forEach(ppdAnimateCounter);

        }

    });

});
