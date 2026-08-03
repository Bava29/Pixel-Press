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
