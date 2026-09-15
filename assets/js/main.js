/* ============================================================
   Aorila presale funnel — waitlist capture
   Integration point: WAITLIST_CONFIG.endpoint (see INTEGRATION.md)
   ============================================================ */

const WAITLIST_CONFIG = {
  // POST JSON to this URL on signup (see INTEGRATION.md).
  // Supabase PostgREST insert into robot_waitlist; anon key is public by
  // design — Row Level Security (INSERT-only for anon) protects the table.
  endpoint: "https://umpaqcpcvwpvlmvqptrp.supabase.co/rest/v1/robot_waitlist",
  headers: {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtcGFxY3BjdndwdmxtdnFwdHJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5MzEzMTUsImV4cCI6MjEwNDUwNzMxNX0.TUUcY0w0EJIxsVAubGvFKw5mNF292AbGQT2-SuJLAyI",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtcGFxY3BjdndwdmxtdnFwdHJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5MzEzMTUsImV4cCI6MjEwNDUwNzMxNX0.TUUcY0w0EJIxsVAubGvFKw5mNF292AbGQT2-SuJLAyI",
    "Prefer": "return=minimal"
  },
  method: "POST",
  timeoutMs: 10000,
  // localStorage key used as a durable outbox when no endpoint is set
  // or when the network request fails. Sync it to your waitlist store.
  outboxKey: "aorila_waitlist_outbox_v1",
};

(function () {
  "use strict";

  var form = document.getElementById("waitlist-form");
  var emailInput = document.getElementById("email");
  var msg = document.getElementById("form-msg");
  if (!form) return;

  /* ---- capture UTM + referrer into hidden fields ---- */
  function fillTracking() {
    try {
      var q = new URLSearchParams(window.location.search);
      var set = function (id, v) {
        var el = document.getElementById(id);
        if (el && v) el.value = v;
      };
      set("f_utm_source", q.get("utm_source"));
      set("f_utm_medium", q.get("utm_medium"));
      set("f_utm_campaign", q.get("utm_campaign"));
      set("f_referrer", document.referrer || "");
    } catch (e) { /* tracking is best-effort */ }
  }
  fillTracking();

  function payload() {
    return {
      email: emailInput.value.trim(),
      utm_source: document.getElementById("f_utm_source").value || null,
      utm_medium: document.getElementById("f_utm_medium").value || null,
      utm_campaign: document.getElementById("f_utm_campaign").value || null,
      referrer: document.getElementById("f_referrer").value || null,
      page_url: window.location.href,
      user_agent: navigator.userAgent,
      created_at: new Date().toISOString(),
    };
  }

  function saveToOutbox(p) {
    try {
      var key = WAITLIST_CONFIG.outboxKey;
      var box = JSON.parse(localStorage.getItem(key) || "[]");
      box.push(p);
      localStorage.setItem(key, JSON.stringify(box));
      return true;
    } catch (e) {
      return false;
    }
  }

  function postToEndpoint(p) {
    var ctrl = new AbortController();
    var t = setTimeout(function () { ctrl.abort(); }, WAITLIST_CONFIG.timeoutMs);
    var headers = { "Content-Type": "application/json" };
    var extra = WAITLIST_CONFIG.headers || {};
    for (var k in extra) { if (Object.prototype.hasOwnProperty.call(extra, k)) headers[k] = extra[k]; }
    return fetch(WAITLIST_CONFIG.endpoint, {
      method: WAITLIST_CONFIG.method,
      headers: headers,
      body: JSON.stringify(p),
      signal: ctrl.signal,
    }).then(function (res) {
      clearTimeout(t);
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res;
    }, function (err) {
      clearTimeout(t);
      throw err;
    });
  }

  function setMsg(text, kind) {
    msg.textContent = text;
    msg.className = "form-msg " + kind;
  }

  function validEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  }

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var email = emailInput.value.trim();

    if (!validEmail(email)) {
      setMsg("Please enter a valid email address.", "error");
      emailInput.focus();
      return;
    }

    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = "Joining…";
    setMsg("", "");

    var p = payload();
    var done = function (stored) {
      setMsg("You're on the waitlist. Watch your inbox — launch updates and demo announcements come first to waitlist members.", "success");
      form.reset();
      fillTracking();
      btn.disabled = false;
      btn.textContent = "Join the waitlist";
      if (stored === "outbox") {
        // eslint-disable-next-line no-console
        console.info("[waitlist] saved to local outbox; sync via INTEGRATION.md");
      }
    };

    if (WAITLIST_CONFIG.endpoint) {
      postToEndpoint(p).then(
        function () { done("endpoint"); },
        function () {
          saveToOutbox(p); // never lose a signup
          done("outbox");
        }
      );
    } else {
      // v1: no backend wired yet — durable local capture, documented in INTEGRATION.md
      saveToOutbox(p);
      done("outbox");
    }
  });

  /* ---- hero video placeholder note ---- */
  var playBtn = document.querySelector("[data-video-note]");
  if (playBtn) {
    playBtn.addEventListener("click", function () {
      setMsg("", "");
      var target = document.getElementById("waitlist");
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  }

  /* ---- FAQ accordion ---- */
  var items = document.querySelectorAll(".faq-item");
  items.forEach(function (item) {
    var q = item.querySelector(".faq-q");
    var a = item.querySelector(".faq-a");
    q.addEventListener("click", function () {
      var open = item.classList.contains("open");
      items.forEach(function (it) {
        it.classList.remove("open");
        it.querySelector(".faq-a").style.maxHeight = null;
        it.querySelector(".faq-q").setAttribute("aria-expanded", "false");
      });
      if (!open) {
        item.classList.add("open");
        a.style.maxHeight = a.scrollHeight + "px";
        q.setAttribute("aria-expanded", "true");
      }
    });
  });
})();
