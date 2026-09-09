/**
 * tickets.js — Support form + Track Ticket pages.
 * No external dependencies.
 */

// ============================================================
//  SUPPORT FORM
// ============================================================

(function () {
    var form = document.getElementById("ticketSupportForm");
    if (!form) return;

    var subjectSelect = document.getElementById("subjectSelect");
    var responseEl = document.getElementById("formResponse");
    var submitBtn = document.getElementById("submitBtn");
    var btnText = submitBtn.querySelector(".btn-text");
    var btnSpinner = submitBtn.querySelector(".btn-spinner");

    // Bot protection elements
    var botWidget = document.getElementById("botProtectionWidget");
    var botCheckBtn = document.getElementById("botCheckBtn");
    var botLabel = document.getElementById("botLabel");
    var botSubLabel = document.getElementById("botSubLabel");
    var botTokenInput = document.getElementById("botToken");
    var botTsInput = document.getElementById("botTimestamp");
    var botErrorMsg = document.getElementById("botErrorMsg");
    var botHoneypot = document.getElementById("botHoneypot");
    var isBotVerified = false;
    var isBotVerifying = false;

    // ----- Fetch initial Bot Challenge Token -----
    function fetchBotChallenge() {
        fetch("/api/bot-challenge")
            .then(function (res) { return res.json(); })
            .then(function (data) {
                if (data.success && data.token) {
                    if (botTokenInput) botTokenInput.value = data.token;
                    if (botTsInput) botTsInput.value = data.ts;
                }
            })
            .catch(function () { /* fallback gracefully */ });
    }
    fetchBotChallenge();

    // ----- Bot Checkbox Click Handler -----
    if (botCheckBtn) {
        botCheckBtn.addEventListener("click", function (e) {
            e.preventDefault();
            if (isBotVerified || isBotVerifying) return;

            isBotVerifying = true;
            if (botWidget) {
                botWidget.classList.remove("shake");
                botWidget.classList.add("verifying");
            }
            if (botLabel) botLabel.textContent = "Verifying security...";
            if (botSubLabel) botSubLabel.textContent = "Please wait";
            if (botErrorMsg) botErrorMsg.classList.add("hidden");

            // Ensure challenge token exists
            if (!botTokenInput || !botTokenInput.value) {
                fetchBotChallenge();
            }

            // Realistic micro-verification animation
            setTimeout(function () {
                isBotVerifying = false;
                isBotVerified = true;
                if (botWidget) {
                    botWidget.classList.remove("verifying");
                    botWidget.classList.add("verified");
                }
                if (botLabel) botLabel.textContent = "I'm not a robot";
                if (botSubLabel) botSubLabel.textContent = "Verification complete";
            }, 750);
        });
    }

    function resetBotProtection() {
        isBotVerified = false;
        isBotVerifying = false;
        if (botWidget) {
            botWidget.classList.remove("verified", "verifying", "shake");
        }
        if (botLabel) botLabel.textContent = "I'm not a robot";
        if (botSubLabel) botSubLabel.textContent = "Click to verify";
        if (botTokenInput) botTokenInput.value = "";
        fetchBotChallenge();
    }

    // ----- Conditional fields via data-show -----
    function toggleFields() {
        var val = subjectSelect.value;
        var all = form.querySelectorAll(".conditional-field");
        for (var i = 0; i < all.length; i++) {
            var shows = (all[i].dataset.show || "").split(",");
            var match = false;
            for (var j = 0; j < shows.length; j++) {
                if (shows[j].trim() === val) { match = true; break; }
            }
            all[i].classList.toggle("visible", match);
        }
    }
    subjectSelect.addEventListener("change", toggleFields);

    // --- Autofill from URL params ---
    (function () {
        var params = new URLSearchParams(window.location.search);
        var subject = params.get("subject");
        var service = params.get("service");
        if (subject) {
            var decoded = decodeURIComponent(subject);
            for (var i = 0; i < subjectSelect.options.length; i++) {
                if (subjectSelect.options[i].value === decoded) {
                    subjectSelect.value = decoded;
                    toggleFields();
                    break;
                }
            }
        }
        if (service) {
            var sel = form.querySelector('[name="service"]');
            if (sel) sel.value = decodeURIComponent(service);
        }
    })();
    toggleFields();

    // ----- Loading state -----
    function setLoading(loading) {
        submitBtn.disabled = loading;
        btnText.style.display = loading ? "none" : "inline";
        btnSpinner.style.display = loading ? "inline" : "none";
    }

    // ----- Response -----
    function showResponse(type, title, detail, extraHtml) {
        responseEl.style.display = "block";
        responseEl.className = "form-response " + type;
        var icon = type === "success" ? "fa-check-circle" : "fa-exclamation-circle";
        responseEl.innerHTML =
            '<div class="resp-icon"><i class="fas ' + icon + '"></i></div>' +
            '<div class="resp-title">' + esc(title) + '</div>' +
            '<div class="resp-detail">' + detail + '</div>' +
            (extraHtml || "");
        responseEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    function hideResponse() {
        responseEl.style.display = "none";
        responseEl.innerHTML = "";
    }

    // ----- Submit -----
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        // 1. Bot check verification gate
        var cfTurnstileEl = form.querySelector(".cf-turnstile");
        if (cfTurnstileEl) {
            var turnstileResp = form.querySelector('[name="cf-turnstile-response"]');
            if (!turnstileResp || !turnstileResp.value) {
                if (botErrorMsg) {
                    botErrorMsg.textContent = "Please complete the Cloudflare verification challenge.";
                    botErrorMsg.classList.remove("hidden");
                }
                return;
            }
        } else if (!isBotVerified) {
            if (botErrorMsg) {
                botErrorMsg.textContent = "Please verify that you are not a robot before submitting.";
                botErrorMsg.classList.remove("hidden");
            }
            if (botWidget) {
                botWidget.classList.add("shake");
                setTimeout(function () {
                    botWidget.classList.remove("shake");
                }, 600);
                botWidget.scrollIntoView({ behavior: "smooth", block: "center" });
            }
            return;
        }

        hideResponse();
        setLoading(true);

        var subject = subjectSelect.value;
        var isSupport = subject === "Support";

        if (isSupport) {
            submitTicket();
        } else {
            submitGeneral();
        }
    });

    function submitTicket() {
        var cfTurnstile = form.querySelector('[name="cf-turnstile-response"]');
        var payload = {
            name: fieldVal("UserName"),
            email: fieldVal("Email"),
            phone: fieldVal("Number"),
            subject: "Support",
            category: fieldVal("support"),
            message: fieldVal("Message"),
            pageUrl: window.location.href,
            _bot_token: botTokenInput ? botTokenInput.value : "",
            _bot_hp: botHoneypot ? botHoneypot.value : "",
            _bot_ts: botTsInput ? botTsInput.value : "",
        };

        if (cfTurnstile && cfTurnstile.value) {
            payload["cf-turnstile-response"] = cfTurnstile.value;
        }

        fetch("/api/tickets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
        .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, data: d }; }); })
        .then(function (result) {
            setLoading(false);
            if (!result.ok || !result.data.success) {
                showResponse("error", "Something went wrong",
                    result.data.error || "Please try again.",
                    '<button class="btn-retry" onclick="document.getElementById(\'formResponse\').style.display=\'none\'">Try Again</button>');
                return;
            }
            var tn = result.data.data.ticketNumber;
            showResponse("success", "Ticket created!",
                "We've received your request and will get back to you soon.",
                '<div class="ticket-display">' +
                '<span class="ticket-code" onclick="copyTicketCode(this)">' + esc(tn) + '</span>' +
                '<button class="btn-copy" onclick="copyTicketCode(this.previousElementSibling)">Copy</button>' +
                '</div>' +
                '<a class="resp-link" href="/TrackTicket#' + tn + '">Track your ticket <i class="fas fa-arrow-right"></i></a>');
            form.reset();
            resetBotProtection();
            toggleFields();
        })
        .catch(function () {
            setLoading(false);
            showResponse("error", "Connection failed",
                "Could not reach the server. Check your connection.",
                '<button class="btn-retry" onclick="submitTicket()">Retry</button>');
        });
    }

    function submitGeneral() {
        var payload = {};
        var fd = new FormData(form);
        fd.forEach(function (v, k) { payload[k] = v; });
        payload.Timestamp = new Date().toISOString();
        payload.PageUrl = window.location.href;
        if (botTokenInput) payload._bot_token = botTokenInput.value;
        if (botHoneypot) payload._bot_hp = botHoneypot.value;
        if (botTsInput) payload._bot_ts = botTsInput.value;

        fetch("/post/SubmitForm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
        .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, data: d }; }); })
        .then(function (result) {
            setLoading(false);
            if (!result.ok || !result.data.success) {
                showResponse("error", "Something went wrong",
                    result.data.error || "Please try again.",
                    '<button class="btn-retry" onclick="document.getElementById(\'formResponse\').style.display=\'none\'">Try Again</button>');
                return;
            }
            showResponse("success", "Message sent!",
                result.data.data.message || "We'll get back to you soon.");
            form.reset();
            resetBotProtection();
            toggleFields();
        })
        .catch(function () {
            setLoading(false);
            showResponse("error", "Connection failed",
                "Could not reach the server. Check your connection.",
                '<button class="btn-retry" onclick="submitGeneral()">Retry</button>');
        });
    }

    // ----- Helpers -----
    function fieldVal(name) {
        var el = form.querySelector('[name="' + name + '"]');
        return el ? el.value.trim() : "";
    }
})();

// ----- Global helpers -----
function esc(str) {
    if (!str) return "";
    var d = document.createElement("div");
    d.appendChild(document.createTextNode(str));
    return d.innerHTML;
}

window.copyTicketCode = function (el) {
    var text = el.textContent || el.innerText;
    navigator.clipboard.writeText(text).then(function () {
        var orig = el.textContent;
        el.textContent = "Copied!";
        setTimeout(function () { el.textContent = orig; }, 1500);
    }).catch(function () { /* silent */ });
};


// ============================================================
//  TRACK TICKET PAGE
// ============================================================

(function () {
    const searchForm = document.getElementById("trackSearchForm");
    if (!searchForm) return; // Only run on track page

    const ticketInput = document.getElementById("ticketNumberInput");
    const resultCard = document.getElementById("ticketResult");
    const notFoundCard = document.getElementById("ticketNotFound");
    const statusEl = document.getElementById("trackStatus");

    function setStatus(text, isError) {
        if (!statusEl) return;
        statusEl.textContent = text;
        statusEl.className = "track-status" + (isError ? " error" : "");
    }

    function hideResults() {
        if (resultCard) resultCard.classList.remove("visible");
        if (notFoundCard) notFoundCard.classList.remove("visible");
    }

    // --- Fetch ticket ---
    async function searchTicket(ticketNumber) {
        ticketNumber = ticketNumber.trim().toUpperCase();

        if (!ticketNumber || !/^T\d{9}$/.test(ticketNumber)) {
            setStatus("Invalid format. Expected: T followed by 9 digits (e.g., T000123456)", true);
            hideResults();
            return;
        }

        hideResults();
        setStatus("Searching...", false);

        try {
            const res = await fetch("/api/tickets/" + ticketNumber);
            const data = await res.json();

            if (!res.ok || !data.success) {
                setStatus("", false);
                if (notFoundCard) notFoundCard.classList.add("visible");
                return;
            }

            setStatus("", false);
            renderTicket(data.data);
        } catch (err) {
            setStatus("Failed to connect. Please try again.", true);
            hideResults();
        }
    }

    function renderTicket(ticket) {
        if (!resultCard) return;

        var statusClass = (ticket.status || "unknown")
            .toLowerCase().replace(/\s+/g, "-").replace(/_/g, "-");

        resultCard.innerHTML =
            '<h2><i class="fas fa-ticket-alt"></i> Ticket ' + escapeHTML(ticket.ticketNumber) + "</h2>" +
            '<div class="detail-row"><span class="detail-label">Status</span><span class="detail-value"><span class="status-badge ' + statusClass + '">' + escapeHTML(ticket.status) + "</span></span></div>" +
            '<div class="detail-row"><span class="detail-label">Issue</span><span class="detail-value">' + escapeHTML(ticket.title) + "</span></div>" +
            '<div class="detail-row"><span class="detail-label">Priority</span><span class="detail-value">' + escapeHTML(ticket.priority) + "</span></div>" +
            '<div class="detail-row"><span class="detail-label">Submitted by</span><span class="detail-value">' + escapeHTML(ticket.name) + "</span></div>" +
            '<div class="detail-row"><span class="detail-label">Created</span><span class="detail-value">' + formatDate(ticket.createdAt) + "</span></div>" +
            '<div class="detail-row"><span class="detail-label">Last Updated</span><span class="detail-value">' + formatDate(ticket.updatedAt) + "</span></div>" +
            renderAuditTrail(ticket.auditTrail);

        resultCard.classList.add("visible");

        // Scroll to result
        resultCard.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function renderAuditTrail(trail) {
        if (!trail || !trail.length) return "";

        var items = trail.map(function (entry) {
            return '<li><span class="audit-action">' + escapeHTML(entry.action) +
                   '</span><span>' + formatDate(entry.timestamp) + "</span></li>";
        }).join("");

        return (
            '<div class="audit-section">' +
            '<div class="audit-toggle" id="auditToggle" onclick="toggleAudit()">' +
            '<i class="fas fa-history"></i> Audit Trail (' + trail.length + " entries)" +
            '<i class="arrow fas fa-chevron-down"></i>' +
            "</div>" +
            '<ul class="audit-list" id="auditList">' + items + "</ul>" +
            "</div>"
        );
    }

    // --- Audit toggle ---
    window.toggleAudit = function () {
        var list = document.getElementById("auditList");
        var toggle = document.getElementById("auditToggle");
        if (!list || !toggle) return;

        var isOpen = list.classList.contains("visible");
        if (isOpen) {
            list.classList.remove("visible");
            toggle.classList.remove("open");
        } else {
            list.classList.add("visible");
            toggle.classList.add("open");
        }
    };

    // --- Search form submit ---
    searchForm.addEventListener("submit", function (e) {
        e.preventDefault();
        searchTicket(ticketInput.value);
    });

    // --- Clear button ---
    var clearBtn = document.getElementById("clearSearch");
    if (clearBtn) {
        clearBtn.addEventListener("click", function () {
            ticketInput.value = "";
            hideResults();
            setStatus("", false);
        });
    }

    // --- Auto-search from URL hash ---
    var hash = window.location.hash.replace("#", "");
    if (hash && /^T\d{9}$/i.test(hash)) {
        ticketInput.value = hash.toUpperCase();
        searchTicket(hash);
    }

    // --- Helpers ---
    function escapeHTML(str) {
        if (!str) return "";
        var div = document.createElement("div");
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    function formatDate(iso) {
        if (!iso) return "—";
        try {
            return new Date(iso).toLocaleString();
        } catch (_) {
            return iso;
        }
    }
})();
