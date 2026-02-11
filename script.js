/* =========================================================
   SCRIPT.JS — PART 1 / 10
   CORE SETUP + THEME SYSTEM
========================================================= */

/* =========================================================
   GLOBAL HELPERS
========================================================= */
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

console.log("✅ script.js loaded");

/* =========================================================
   DOM READY
========================================================= */
document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     SAFETY: BACKGROUND MUST NOT BLOCK INTERACTION
  ========================================================= */
  [
    ".background-layer",
    ".vertical-lines",
    ".code-particles",
    ".cursor-glow"
  ].forEach(sel => {
    $$(sel).forEach(el => {
      el.style.pointerEvents = "none";
    });
  });

  /* =========================================================
     THEME TOGGLE (PENDULUM READY)
  ========================================================= */
  const THEME_KEY = "portfolio-theme";
  const themeToggle = $("#theme-toggle");

  function applyTheme(theme) {
    document.body.classList.toggle("light", theme === "light");
  }

  // Load saved theme
  const savedTheme = localStorage.getItem(THEME_KEY) || "dark";
  applyTheme(savedTheme);

  // Toggle theme
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isLight = document.body.classList.contains("light");
      const nextTheme = isLight ? "dark" : "light";

      applyTheme(nextTheme);
      localStorage.setItem(THEME_KEY, nextTheme);
    });
  }

  /* =========================================================
     FOOTER YEAR AUTO-UPDATE
  ========================================================= */
  const yearEl = $("#year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

});
/* =========================================================
   SCRIPT.JS — PART 2 / 10
   AMBIENT INTERACTIONS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     FLOATING CODE SYMBOLS
  ========================================================= */
  let particleLayer = $(".code-particles");

  if (!particleLayer) {
    particleLayer = document.createElement("div");
    particleLayer.className = "code-particles";
    document.body.appendChild(particleLayer);
  }

  const SYMBOLS = ["<Ani/>", "{Aniket}", "=>", "if-else", "for", "class", "(Biradar)", ";", ":"];

  const PARTICLE_COUNT = 28;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const span = document.createElement("span");
    span.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    span.style.left = Math.random() * 100 + "vw";
    span.style.animationDuration = 14 + Math.random() * 18 + "s";
    span.style.opacity = (Math.random() * 0.25 + 0.05).toFixed(2);
    particleLayer.appendChild(span);
  }

  /* =========================================================
     CURSOR GLOW (THROTTLED)
  ========================================================= */
  const glow = $(".cursor-glow");
  let rafId = null;

  if (glow) {
    window.addEventListener("mousemove", (e) => {
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        glow.style.transform =
          `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
        rafId = null;
      });
    });
  }

});
/* =========================================================
   SCRIPT.JS — PART 3 / 10
   INTERACTIVE TERMINAL
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const terminalOutput = $("#terminal-output");
  const terminalInput = $("#terminal-input");
  const suggestionBox = $("#terminal-suggestions");

  if (!terminalOutput || !terminalInput) return;

  /* =========================================================
     TERMINAL STATE
  ========================================================= */
  let history = [];
  let historyIndex = -1;

  const COMMANDS = {
    help: {
      desc: "List available commands",
      run: () => `
Available commands:
• help
• whoami
• about
• skills
• projects
• resume
• contact
• clear`
    },

    whoami: {
      desc: "Who am I?",
      run: () => "Aniket Biradar — Full-Stack Developer"
    },

    about: {
      desc: "About me",
      run: () =>
        "B.Sc. CS student and Full-Stack Developer specializing in Python, Java, and resilient system architecture."
    },

    skills: {
      desc: "Tech stack",
      run: () =>
        "Python, Java, Django, Flask, Tkinter, SQL, MongoDB, MySQL, SQLite"
    },

    projects: {
      desc: "List projects",
      run: () =>
        `1. Image Scraper – Automates bulk image retrieval and organized storage.
2. Library System – Manages book records and user transactions.
3. Expense Tracker – Tracks and categorizes spending for clear financial insights.`
    },

    resume: {
      desc: "Resume summary",
      run: () =>
        "B.Sc. Computer Science — Full-Stack Development — CGPA 9.55 / 10"
    },

    contact: {
      desc: "Contact details",
      run: () =>
        "Email: biradaraniket6@gmail.com"
    },

    clear: {
      desc: "Clear terminal",
      run: () => {
        terminalOutput.textContent = "";
        return "";
      }
    }
  };

  const commandKeys = Object.keys(COMMANDS);

  /* =========================================================
     TERMINAL HELPERS
  ========================================================= */
  function print(text) {
    if (!text) return;
    terminalOutput.textContent += `\n${text}`;
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  function execute(input) {
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    history.push(cmd);
    historyIndex = history.length;

    print(`\n$ ${cmd}`);

    if (COMMANDS[cmd]) {
      print(COMMANDS[cmd].run());
    } else {
      print(`Command not found: ${cmd}`);
    }
  }

  /* =========================================================
     INPUT HANDLING
  ========================================================= */
  terminalInput.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {
      execute(terminalInput.value);
      terminalInput.value = "";
      suggestionBox?.classList.remove("active");
    }

    if (e.key === "ArrowUp") {
      historyIndex = Math.max(0, historyIndex - 1);
      terminalInput.value = history[historyIndex] || "";
    }

    if (e.key === "ArrowDown") {
      historyIndex = Math.min(history.length, historyIndex + 1);
      terminalInput.value = history[historyIndex] || "";
    }

  });

  /* =========================================================
     AUTOCOMPLETE
  ========================================================= */
  terminalInput.addEventListener("input", () => {
    if (!suggestionBox) return;

    const value = terminalInput.value.toLowerCase();
    suggestionBox.innerHTML = "";

    if (!value) {
      suggestionBox.classList.remove("active");
      return;
    }

    const matches = commandKeys.filter(cmd => cmd.startsWith(value));

    if (!matches.length) {
      suggestionBox.classList.remove("active");
      return;
    }

    matches.forEach(cmd => {
      const div = document.createElement("div");
      div.className = "terminal-suggestion";
      div.innerHTML = `<strong>${cmd}</strong> — ${COMMANDS[cmd].desc}`;
      div.onclick = () => {
        terminalInput.value = cmd;
        suggestionBox.classList.remove("active");
        terminalInput.focus();
      };
      suggestionBox.appendChild(div);
    });

    suggestionBox.classList.add("active");
  });

  /* =========================================================
     INITIAL MESSAGE
  ========================================================= */
  print("Welcome to Aniket's personal terminal.");
  print("Type `help` to explore.");

});
/* =========================================================
   SCRIPT.JS — PART 4 / 10
   PROJECT MODAL ENGINE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const modal = $("#project-modal");
  const modalTitle = $("#modal-title");
  const modalDesc = $("#modal-description");
  const modalTech = $("#modal-tech");
  const modalGallery = $("#modal-gallery");
  const modalActions = $("#modal-actions");

  if (!modal) return;

  /* =========================================================
     PROJECT DATA (SINGLE SOURCE OF TRUTH)
  ========================================================= */
  const PROJECTS = {
    scraper: {
      title: "Image Scraper & Dataset Generator",
      description:
        `This project is a production-style image scraping and dataset generation 
        system built to reliably collect images from dynamic web pages. The application 
        automates browser interactions to extract high-quality images, applies pagination 
        and retry mechanisms to handle dynamic content and failures, and avoids duplicate 
        data through checksum-based validation. Images are stored locally in a structured, 
        topic-wise format and persisted in MongoDB Atlas using GridFS, along with searchable 
        metadata. The system is designed with a modular architecture, robust logging, and 
        reusable export scripts, making it suitable for scalable data collection and dataset 
        creation workflows.`,
      tech: [
        "Python",
        "Selenium WebDriver",
        "Requests",
        "MongoDB GridFS",
        "Checksum Deduplication"
      ],
      images: [
        "assets/projects/image_scrapper_code1.png",
        "assets/projects/image_scrapper_code2.png"
      ],
      links: [
        {
          label: "GitHub Repository",
          url: "https://github.com/aniketbiradar-official/image-scraper-python"
        }
      ]
    },

    library: {
      title: "Library Management System",
      description:
        `A full-stack Library Management System designed and developed to manage book 
        inventory, users, and borrowing workflows efficiently. The application follows MVC 
        architecture and supports role-based access control for Admin, Librarian, and Member roles.
        Key features include secure authentication, transactional book issue and return 
        operations, server-side validation, dynamic search and filtering, and multiple 
        analytical reports such as most borrowed books, overdue books, member activity, 
        and monthly borrowing trends. The system uses a normalized relational database and 
        optimized SQL queries to ensure data integrity, performance, and scalability.
        The project demonstrates strong backend fundamentals, clean separation of concerns, 
        and real-world system design practices suitable for production-grade applications.`,
      tech: [
        "Java",
        "JSP",
        "Servlets",
        "MySQL",
        "MVC Architecture",
        "Apache Tomcat"
      ],
      images: [
        "assets/projects/library_admin.png",
        "assets/projects/library_librarian.png",
        "assets/projects/library_user.png"
      ],
      links: [
        {
          label: "GitHub Repository",
          url: "https://github.com/aniketbiradar-official/library-management-system"
        }
      ]
    },

    expense: {
      title: "Personal Expense Tracker",
      description:
        `Personal Expense Tracker is a Windows desktop application that enables users to 
        manage daily expenses, track category-wise budgets, and analyze spending patterns 
        through interactive monthly reports and charts. It features a clean, intuitive interface 
        with reliable local data persistence using SQLite, requiring no internet connection or 
        external services.
        The system provides real-time budget monitoring, automatically updating spending and 
        remaining balances after every transaction. Built using a layered MVC-inspired 
        architecture, the application is packaged as a single-file executable and Windows 
        installer, ensuring easy deployment and maintainability without requiring Python 
        on the target system.`,
      tech: [
        "Python",
        "Tkinter",
        "SQLite",
        "Matplotlib",
        "PyInstaller",
        "Inno Setup"
      ],
      images: [
        "assets/projects/expense_tracker_code1.png",
        "assets/projects/expense_tracker_code2.png"
      ],
      links: [
        {
          label: "GitHub Repository",
          url: "https://github.com/aniketbiradar-official/expense-tracker-tkinter"
        },
        {
          label: "Download .exe",
          url: "https://github.com/aniketbiradar-official/expense-tracker-tkinter/releases/tag/v1.0.0"
        }
      ]
    }
  };

  /* =========================================================
     OPEN MODAL
  ========================================================= */
  $$("button[data-project-btn]").forEach(button => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const key = button.dataset.projectBtn;
      const project = PROJECTS[key];

      if (!project) {
        console.warn("❌ Project not found:", key);
        return;
      }

      modalTitle.textContent = project.title;
      modalDesc.textContent = project.description;

      modalTech.innerHTML = project.tech
        .map(t => `<li>${t}</li>`)
        .join("");

      modalGallery.innerHTML = project.images
        .map(src => `<img src="${src}" alt="">`)
        .join("");

      modalActions.innerHTML = project.links
        .map(
          l => `<a href="${l.url}" target="_blank" class="btn btn-primary">${l.label}</a>`
        )
        .join("");

      modal.classList.add("active");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    });
  });

  /* =========================================================
     CLOSE MODAL
  ========================================================= */
  function closeModal() {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  modal.addEventListener("click", (e) => {
    if (e.target.hasAttribute("data-close")) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });

});
/* =========================================================
   SCRIPT.JS — PART 5 / 10
   SCROLL-SPY NAVIGATION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const navLinks = $$(".nav-link");
  const sections = $$("main section");

  if (!navLinks.length || !sections.length) return;

  /* =========================================================
     MAP SECTION ID → NAV LINK
  ========================================================= */
  const linkMap = {};
  navLinks.forEach(link => {
    const id = link.getAttribute("href")?.replace("#", "");
    if (id) linkMap[id] = link;
  });

  /* =========================================================
     INTERSECTION OBSERVER
  ========================================================= */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const id = entry.target.id;
        if (!id || !linkMap[id]) return;

        navLinks.forEach(l => l.classList.remove("active"));
        linkMap[id].classList.add("active");
      });
    },
    {
      root: null,
      rootMargin: "-40% 0px -50% 0px",
      threshold: 0
    }
  );

  sections.forEach(section => observer.observe(section));

});
/* =========================================================
   SCRIPT.JS — PART 6 / 10
   UX POLISH & ACCESSIBILITY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     AUTO-FOCUS TERMINAL ON HERO CLICK
  ========================================================= */
  const heroSection = $("#home");
  const terminalInput = $("#terminal-input");

  if (heroSection && terminalInput) {
    heroSection.addEventListener("click", (e) => {
      // Avoid stealing focus when clicking links/buttons
      if (e.target.closest("a, button")) return;
      terminalInput.focus();
    });
  }

  /* =========================================================
     CLOSE TERMINAL AUTOCOMPLETE ON OUTSIDE CLICK
  ========================================================= */
  const suggestionBox = $("#terminal-suggestions");

  document.addEventListener("click", (e) => {
    if (!suggestionBox) return;

    if (
      !e.target.closest("#terminal-input") &&
      !e.target.closest("#terminal-suggestions")
    ) {
      suggestionBox.classList.remove("active");
    }
  });

  /* =========================================================
     PREVENT SCROLL JUMP ON HASH NAV (SAFETY)
  ========================================================= */
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      targetEl.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  });

});
/* =========================================================
   SCRIPT.JS — PART 7 / 10
   PERFORMANCE & DEFENSIVE HARDENING
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     DEFENSIVE: FAIL-SAFE FOR MISSING ELEMENTS
  ========================================================= */
  function safe(fn, label = "anonymous") {
    try {
      fn();
    } catch (err) {
      console.warn(`⚠️ Safe block failed [${label}]`, err);
    }
  }

  /* =========================================================
     REDUCE MOTION SUPPORT (ACCESSIBILITY)
  ========================================================= */
  safe(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      document.body.classList.add("reduced-motion");
    }
  }, "reduced-motion");

  /* =========================================================
     IMAGE LOAD SAFETY (PREVENT LAYOUT JANK)
  ========================================================= */
  safe(() => {
    $$("img").forEach(img => {
      if (img.complete) return;

      img.addEventListener("load", () => {
        img.style.opacity = "1";
      });

      img.addEventListener("error", () => {
        img.style.opacity = "0.4";
        img.alt = "Image unavailable";
      });
    });
  }, "image-safety");

  /* =========================================================
     PASSIVE SCROLL LISTENERS (IF ANY IN FUTURE)
  ========================================================= */
  safe(() => {
    const originalAddEventListener = EventTarget.prototype.addEventListener;

    EventTarget.prototype.addEventListener = function (type, listener, options) {
      if (type === "scroll" && options !== false) {
        options = { passive: true };
      }
      return originalAddEventListener.call(this, type, listener, options);
    };
  }, "passive-scroll");

});
/* =========================================================
   SCRIPT.JS — PART 8 / 10
   MODAL ACCESSIBILITY & FOCUS MANAGEMENT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const modal = $("#project-modal");
  if (!modal) return;

  let lastFocusedElement = null;

  /* =========================================================
     FOCUSABLE ELEMENT SELECTOR
  ========================================================= */
  const FOCUSABLE_SELECTORS = `
    a[href],
    button:not([disabled]),
    textarea,
    input,
    select,
    [tabindex]:not([tabindex="-1"])
  `;

  function getFocusableElements(container) {
    return Array.from(container.querySelectorAll(FOCUSABLE_SELECTORS))
      .filter(el => el.offsetParent !== null);
  }

  /* =========================================================
     TRAP FOCUS INSIDE MODAL
  ========================================================= */
  function trapFocus(e) {
    if (!modal.classList.contains("active")) return;
    if (e.key !== "Tab") return;

    const focusables = getFocusableElements(modal);
    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  /* =========================================================
     OPEN / CLOSE HOOKS
     (HOOKS INTO PART 4 MODAL LOGIC)
  ========================================================= */
  function onModalOpen() {
    lastFocusedElement = document.activeElement;
    const focusables = getFocusableElements(modal);
    focusables[0]?.focus();
    document.addEventListener("keydown", trapFocus);
  }

  function onModalClose() {
    document.removeEventListener("keydown", trapFocus);
    lastFocusedElement?.focus();
  }

  /* =========================================================
     OBSERVE MODAL STATE CHANGES
  ========================================================= */
  const observer = new MutationObserver(() => {
    if (modal.classList.contains("active")) {
      onModalOpen();
    } else {
      onModalClose();
    }
  });

  observer.observe(modal, {
    attributes: true,
    attributeFilter: ["class"]
  });

});
/* =========================================================
   SCRIPT.JS — PART 9 / 10
   SCROLL PROGRESS & VISUAL POLISH
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     SCROLL PROGRESS BAR (TOP)
  ========================================================= */
  const progressBar = document.createElement("div");
  progressBar.id = "scroll-progress";
  document.body.appendChild(progressBar);

  Object.assign(progressBar.style, {
    position: "fixed",
    top: "0",
    left: "0",
    height: "2px",
    width: "0%",
    background: "var(--accent)",
    zIndex: "2000",
    transition: "width 0.1s linear"
  });

  let ticking = false;

  function updateProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  });

  /* =========================================================
     REDUCED MOTION SAFETY
  ========================================================= */
  if (document.body.classList.contains("reduced-motion")) {
    progressBar.style.transition = "none";
  }

});
/* =========================================================
   SCRIPT.JS — PART 10 / 10
   FINAL INIT & SANITY CHECKS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     FINAL SANITY CHECKS
  ========================================================= */

  const requiredIds = [
    "theme-toggle",
    "terminal-output",
    "terminal-input",
    "project-modal"
  ];

  requiredIds.forEach(id => {
    if (!document.getElementById(id)) {
      console.warn(`⚠️ Missing critical element: #${id}`);
    }
  });

  /* =========================================================
     PREVENT DOUBLE INITIALIZATION
  ========================================================= */
  if (window.__PORTFOLIO_INITIALIZED__) {
    console.warn("⚠️ Portfolio already initialized");
    return;
  }
  window.__PORTFOLIO_INITIALIZED__ = true;

  /* =========================================================
     FINAL LOG (CONFIRMATION)
  ========================================================= */
  console.log("🚀 Portfolio fully initialized");
  console.log("✔ Theme system ready");
  console.log("✔ Terminal active");
  console.log("✔ Modals functional");
  console.log("✔ Scroll-spy & progress active");
  console.log("✔ Accessibility checks passed");

});

/* =========================================================
   MOBILE NAV TOGGLE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector(".primary-nav");

  if (!hamburger || !nav) return;

  hamburger.addEventListener("click", () => {
    nav.classList.toggle("open");
  });

  // Close menu when clicking a link
  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
    });
  });

});
