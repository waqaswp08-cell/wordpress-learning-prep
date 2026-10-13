// WordPress Learning & Preparation Portal - Core Application Logic

document.addEventListener("DOMContentLoaded", () => {
  // State
  const state = {
    activeTab: "overview",
    searchQuery: "",
    interviewFilter: "All",
    completedTopics: JSON.parse(localStorage.getItem("wp_completed_topics") || "[]"),
    completedQuestions: JSON.parse(localStorage.getItem("wp_completed_questions") || "[]"),
    quizScores: JSON.parse(localStorage.getItem("wp_quiz_scores") || "{}"),
    bookmarkedItems: JSON.parse(localStorage.getItem("wp_bookmarks") || "[]")
  };

  // DOM Elements
  const tabButtons = document.querySelectorAll(".nav-tab-btn");
  const tabSections = document.querySelectorAll(".tab-content-section");
  const globalSearchInput = document.getElementById("global-search");
  const modalContainer = document.getElementById("detail-modal");
  const modalContent = document.getElementById("modal-body-content");
  const modalClose = document.getElementById("modal-close-btn");
  const toastContainer = document.getElementById("toast-container");

  // Initialize
  initTheme();
  initNavigation();
  initStats();
  renderAllSections();
  setupEventListeners();

  // Navigation Logic
  function initNavigation() {
    tabButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const tabTarget = btn.getAttribute("data-tab");
        switchTab(tabTarget);
      });
    });

    // Hash navigation
    if (window.location.hash) {
      const hashTab = window.location.hash.replace("#", "");
      if (document.getElementById(`tab-${hashTab}`)) {
        switchTab(hashTab);
      }
    }
  }

  function switchTab(tabId) {
    state.activeTab = tabId;
    window.location.hash = tabId;

    tabButtons.forEach(btn => {
      if (btn.getAttribute("data-tab") === tabId) {
        btn.classList.add("tab-active", "text-indigo-400", "font-bold");
        btn.classList.remove("text-slate-400");
      } else {
        btn.classList.remove("tab-active", "text-indigo-400", "font-bold");
        btn.classList.add("text-slate-400");
      }
    });

    tabSections.forEach(sec => {
      if (sec.id === `tab-${tabId}`) {
        sec.classList.remove("hidden");
      } else {
        sec.classList.add("hidden");
      }
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Toast notification
  function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `px-4 py-3 rounded-lg shadow-xl text-sm flex items-center gap-2 transition-all transform duration-300 ${
      type === "success" ? "bg-emerald-600 text-white" : "bg-indigo-600 text-white"
    }`;
    toast.innerHTML = `<i class="fas ${type === "success" ? "fa-check-circle" : "fa-info-circle"}"></i> <span>${message}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  // Copy to clipboard helper
  window.copyCode = function(button, text) {
    navigator.clipboard.writeText(text).then(() => {
      const originalText = button.innerHTML;
      button.innerHTML = '<i class="fas fa-check text-emerald-400"></i> Copied!';
      showToast("Code snippet copied to clipboard!", "success");
      setTimeout(() => {
        button.innerHTML = originalText;
      }, 2000);
    });
  };

  // Toggle completion
  window.toggleTopicCompletion = function(topicId) {
    const index = state.completedTopics.indexOf(topicId);
    if (index > -1) {
      state.completedTopics.splice(index, 1);
      showToast("Topic marked as incomplete", "info");
    } else {
      state.completedTopics.push(topicId);
      showToast("Topic completed! Progress updated.", "success");
    }
    localStorage.setItem("wp_completed_topics", JSON.stringify(state.completedTopics));
    initStats();
    renderTopics();
  };

  window.toggleQuestionComplete = function(qId) {
    const index = state.completedQuestions.indexOf(qId);
    if (index > -1) {
      state.completedQuestions.splice(index, 1);
    } else {
      state.completedQuestions.push(qId);
      showToast("Question marked as mastered!", "success");
    }
    localStorage.setItem("wp_completed_questions", JSON.stringify(state.completedQuestions));
    initStats();
    renderInterviewQuestions();
  };

  // Stats calculation
  function initStats() {
    const totalTopics = (window.WP_TOPICS || []).length;
    const completedCount = state.completedTopics.length;
    const percent = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

    const totalQuestions = (window.WP_INTERVIEWS?.interviewQuestions || []).length;
    const answeredCount = state.completedQuestions.length;

    const progressEl = document.getElementById("stat-overall-progress");
    const progressBar = document.getElementById("stat-progress-bar");
    const countEl = document.getElementById("stat-completed-count");
    const questionsCountEl = document.getElementById("stat-mastered-questions");

    if (progressEl) progressEl.innerText = `${percent}%`;
    if (progressBar) progressBar.style.width = `${percent}%`;
    if (countEl) countEl.innerText = `${completedCount} / ${totalTopics}`;
    if (questionsCountEl) questionsCountEl.innerText = `${answeredCount} / ${totalQuestions}`;
  }

  // Render All Sections
  function renderAllSections() {
    renderTopics();
    renderPreparationTracks();
    renderInterviewSection();
    renderPracticeSection();
    renderProjectsSection();
    renderSheetsSection();
  }

  // 1. Render Topics (WordPress Development & Core)
  function renderTopics() {
    const container = document.getElementById("topics-grid-container");
    if (!container) return;

    const filterQuery = state.searchQuery.toLowerCase();
    const filtered = (window.WP_TOPICS || []).filter(topic => {
      const matchSearch = topic.title.toLowerCase().includes(filterQuery) ||
                          topic.summary.toLowerCase().includes(filterQuery);
      return matchSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = `<div class="col-span-3 text-center py-12 text-slate-400">No WordPress modules match your search filter.</div>`;
      return;
    }

    container.innerHTML = filtered.map(topic => {
      const isCompleted = state.completedTopics.includes(topic.id);
      return `
        <div class="glass-panel glass-panel-hover rounded-xl p-6 flex flex-col justify-between border ${isCompleted ? 'border-emerald-500/50 bg-emerald-950/20' : 'border-slate-800'}">
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-900/60 text-indigo-300 border border-indigo-700/50">
                ${topic.badge}
              </span>
              <span class="text-xs text-slate-400 flex items-center gap-1">
                <i class="far fa-clock"></i> ${topic.duration}
              </span>
            </div>
            
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-lg">
                <i class="fas ${topic.icon}"></i>
              </div>
              <h3 class="font-bold text-lg text-white hover:text-indigo-300 transition-colors cursor-pointer" onclick="openTopicModal('${topic.id}')">
                ${topic.title}
              </h3>
            </div>

            <p class="text-sm text-slate-300 mb-4 line-clamp-2">
              ${topic.summary}
            </p>

            <div class="space-y-2 mb-6">
              ${topic.modules.map(mod => `
                <div class="text-xs text-slate-400 flex items-start gap-2">
                  <i class="fas fa-check-circle text-indigo-500 mt-0.5"></i>
                  <span>${mod.title}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button onclick="openTopicModal('${topic.id}')" class="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors">
              Study Modules <i class="fas fa-arrow-right"></i>
            </button>
            <button onclick="toggleTopicCompletion('${topic.id}')" class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isCompleted 
                ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/50' 
                : 'bg-slate-800 text-slate-300 hover:bg-indigo-600 hover:text-white border border-slate-700'
            }">
              <i class="fas ${isCompleted ? 'fa-check' : 'fa-plus'} mr-1"></i>
              ${isCompleted ? 'Completed' : 'Mark Done'}
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // 2. Render Preparation Tracks
  function renderPreparationTracks() {
    const container = document.getElementById("prep-tracks-container");
    if (!container) return;

    const tracks = [
      {
        id: "prep-basics",
        title: "Track 1: WordPress Core Basics",
        icon: "fa-graduation-cap",
        color: "from-blue-600 to-cyan-600",
        desc: "Dashboard, Post Types vs Pages, Taxonomies, Permalinks, Settings & Capabilities.",
        linkTopic: "wp-basics"
      },
      {
        id: "prep-themes",
        title: "Track 2: Theme Engineering & FSE",
        icon: "fa-brush",
        color: "from-purple-600 to-indigo-600",
        desc: "Classic hierarchy, child themes, functions.php, theme.json, and block templates.",
        linkTopic: "wp-themes"
      },
      {
        id: "prep-plugins",
        title: "Track 3: Plugin Development & Security",
        icon: "fa-puzzle-piece",
        color: "from-emerald-600 to-teal-600",
        desc: "Hooks engine, OOP plugin architectures, Nonces, Sanitization, and CPTs.",
        linkTopic: "wp-plugins"
      },
      {
        id: "prep-elementor",
        title: "Track 4: Elementor Page Building & Widgets",
        icon: "fa-cubes",
        color: "from-pink-600 to-rose-600",
        desc: "Container layouts, Dynamic tags, Theme Builder, and PHP widget creation.",
        linkTopic: "wp-elementor"
      },
      {
        id: "prep-woo",
        title: "Track 5: WooCommerce & High-Volume E-Com",
        icon: "fa-store",
        color: "from-amber-600 to-orange-600",
        desc: "Checkout hooks, HPOS custom order tables, custom cart rules, and gateways.",
        linkTopic: "wp-woocommerce"
      },
      {
        id: "prep-projects",
        title: "Track 6: Real-World Portfolio Projects",
        icon: "fa-laptop-code",
        color: "from-sky-600 to-blue-700",
        desc: "Production-ready architectures, code blueprints, and portfolio proof projects.",
        targetTab: "projects"
      }
    ];

    container.innerHTML = tracks.map(t => `
      <div class="glass-panel glass-panel-hover rounded-xl p-5 border border-slate-800 flex flex-col justify-between">
        <div>
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xl mb-4 shadow-lg">
            <i class="fas ${t.icon}"></i>
          </div>
          <h4 class="font-bold text-white text-base mb-2">${t.title}</h4>
          <p class="text-xs text-slate-300 mb-4">${t.desc}</p>
        </div>
        ${t.linkTopic ? `
          <button onclick="openTopicModal('${t.linkTopic}')" class="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2">
            <span>Explore Track</span> <i class="fas fa-arrow-right"></i>
          </button>
        ` : `
          <button onclick="window.switchTabTo('${t.targetTab}')" class="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2">
            <span>View Projects</span> <i class="fas fa-arrow-right"></i>
          </button>
        `}
      </div>
    `).join('');
  }

  // 3. Render Company Hiring Process & Interview Questions
  function renderInterviewSection() {
    renderEligibilityTiers();
    renderSkillsChecklist();
    renderInterviewQuestions();
    renderJobPrepStrategy();
  }

  function renderEligibilityTiers() {
    const container = document.getElementById("eligibility-container");
    if (!container || !window.WP_INTERVIEWS) return;

    const tiers = window.WP_INTERVIEWS.eligibility;
    container.innerHTML = Object.keys(tiers).map(key => {
      const tier = tiers[key];
      const badgeColors = {
        junior: "bg-sky-900/60 text-sky-300 border-sky-700",
        mid: "bg-indigo-900/60 text-indigo-300 border-indigo-700",
        senior: "bg-purple-900/60 text-purple-300 border-purple-700"
      };

      return `
        <div class="glass-panel rounded-xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="px-2.5 py-1 rounded text-xs font-semibold border ${badgeColors[key]}">${tier.exp}</span>
              <span class="text-xs text-emerald-400 font-mono">${tier.expectedSalary}</span>
            </div>
            <h3 class="font-bold text-lg text-white mb-1">${tier.title}</h3>
            <p class="text-xs text-slate-400 mb-4 italic">${tier.targetRoles}</p>
            
            <h5 class="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Hiring Criteria:</h5>
            <ul class="space-y-2 mb-4">
              ${tier.criteria.map(item => `
                <li class="text-xs text-slate-300 flex items-start gap-2">
                  <i class="fas fa-check text-indigo-400 mt-0.5"></i>
                  <span>${item}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderSkillsChecklist() {
    const container = document.getElementById("skills-matrix-container");
    if (!container || !window.WP_INTERVIEWS) return;

    const matrix = window.WP_INTERVIEWS.skillsMatrix;
    container.innerHTML = matrix.map(cat => `
      <div class="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        <div class="flex items-center justify-between mb-3">
          <h4 class="font-bold text-sm text-slate-200">${cat.category}</h4>
          <span class="px-2 py-0.5 rounded text-[11px] font-semibold ${
            cat.weight === 'Critical' ? 'bg-rose-900/50 text-rose-300 border border-rose-800' :
            cat.weight === 'Essential' ? 'bg-amber-900/50 text-amber-300 border border-amber-800' :
            'bg-indigo-900/50 text-indigo-300 border border-indigo-800'
          }">${cat.weight}</span>
        </div>
        <div class="flex flex-wrap gap-1.5">
          ${cat.skills.map(s => `
            <span class="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-xs border border-slate-700/60 hover:border-indigo-500/50 transition-colors">
              ${s}
            </span>
          `).join('')}
        </div>
      </div>
    `).join('');
  }

  function renderInterviewQuestions() {
    const container = document.getElementById("interview-questions-list");
    if (!container || !window.WP_INTERVIEWS) return;

    const questions = window.WP_INTERVIEWS.interviewQuestions;
    const filter = state.interviewFilter;
    const search = state.searchQuery.toLowerCase();

    const filtered = questions.filter(q => {
      const matchLevel = filter === "All" || q.level === filter;
      const matchSearch = q.question.toLowerCase().includes(search) ||
                          q.shortAnswer.toLowerCase().includes(search) ||
                          q.category.toLowerCase().includes(search);
      return matchLevel && matchSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = `<div class="text-center py-8 text-slate-400">No interview questions found matching criteria.</div>`;
      return;
    }

    container.innerHTML = filtered.map(q => {
      const isMastered = state.completedQuestions.includes(q.id);
      return `
        <div class="glass-panel rounded-xl p-5 border ${isMastered ? 'border-emerald-500/40 bg-emerald-950/20' : 'border-slate-800'} transition-all">
          <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded text-xs font-semibold ${
                q.level === 'Junior' ? 'bg-sky-900/60 text-sky-300 border border-sky-700' :
                q.level === 'Mid-Level' ? 'bg-indigo-900/60 text-indigo-300 border border-indigo-700' :
                'bg-purple-900/60 text-purple-300 border border-purple-700'
              }">${q.level}</span>
              <span class="text-xs text-slate-400 font-mono">#${q.category}</span>
            </div>

            <button onclick="toggleQuestionComplete('${q.id}')" class="px-3 py-1 rounded text-xs font-medium transition-colors ${
              isMastered ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }">
              <i class="fas ${isMastered ? 'fa-check' : 'fa-bookmark'} mr-1"></i>
              ${isMastered ? 'Mastered' : 'Mark as Mastered'}
            </button>
          </div>

          <h4 class="font-bold text-white text-base mb-2">Q: ${q.question}</h4>
          
          <div class="p-3 bg-slate-900/90 rounded-lg border border-slate-800 mb-3">
            <p class="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">Quick Executive Answer:</p>
            <p class="text-sm text-slate-200">${q.shortAnswer}</p>
          </div>

          <details class="text-xs text-slate-300 group">
            <summary class="cursor-pointer font-semibold text-indigo-400 hover:text-indigo-300 select-none py-1 flex items-center gap-1.5">
              <span>View Comprehensive Answer, Code & Gotchas</span>
              <i class="fas fa-chevron-down transition-transform group-open:rotate-180"></i>
            </summary>
            
            <div class="mt-4 pt-4 border-t border-slate-800/80 space-y-3">
              <div class="prose prose-invert prose-xs text-slate-300">
                ${q.inDepth.replace(/\n/g, '<br/>')}
              </div>

              ${q.codeSample ? `
                <div class="relative mt-2">
                  <div class="flex items-center justify-between bg-slate-950 px-3 py-1.5 rounded-t-lg border-t border-l border-r border-slate-800 text-[11px] text-slate-400">
                    <span>PHP / Implementation</span>
                    <button onclick="copyCode(this, \`${q.codeSample.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`)" class="copy-btn text-indigo-400 hover:text-indigo-300">
                      <i class="far fa-copy mr-1"></i> Copy
                    </button>
                  </div>
                  <pre class="bg-slate-950 p-4 rounded-b-lg border-b border-l border-r border-slate-800 text-emerald-400 font-mono text-xs overflow-x-auto"><code>${q.codeSample}</code></pre>
                </div>
              ` : ''}

              ${q.gotcha ? `
                <div class="p-3 rounded-lg bg-rose-950/30 border border-rose-800/50 text-rose-300 text-xs flex items-start gap-2">
                  <i class="fas fa-exclamation-triangle mt-0.5 text-rose-400"></i>
                  <div><strong class="font-bold">Interview Gotcha / Trap:</strong> ${q.gotcha}</div>
                </div>
              ` : ''}

              <div class="flex items-center gap-2 text-[11px] text-slate-400 pt-2">
                <i class="fas fa-building text-slate-500"></i>
                <span>Frequently asked at: ${q.frequentlyAskedAt.join(', ')}</span>
              </div>
            </div>
          </details>
        </div>
      `;
    }).join('');
  }

  function renderJobPrepStrategy() {
    const container = document.getElementById("job-strategy-container");
    if (!container || !window.WP_INTERVIEWS) return;

    const strategies = window.WP_INTERVIEWS.jobStrategy;
    container.innerHTML = strategies.map(s => `
      <div class="glass-panel rounded-xl p-5 border border-slate-800">
        <h4 class="font-bold text-indigo-400 text-sm mb-1">${s.stage}</h4>
        <h5 class="font-semibold text-white text-base mb-3">${s.headline}</h5>
        <ul class="space-y-2">
          ${s.tips.map(t => `
            <li class="text-xs text-slate-300 flex items-start gap-2">
              <i class="fas fa-arrow-right text-indigo-500 mt-0.5"></i>
              <span>${t}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    `).join('');
  }

  // 4. Dedicated Practice & Exercises
  function renderPracticeSection() {
    renderQuizzes();
    renderDebugChallenges();
  }

  function renderQuizzes() {
    const container = document.getElementById("quiz-engine-container");
    if (!container || !window.WP_PRACTICE) return;

    const quizzes = window.WP_PRACTICE.quizzes;
    container.innerHTML = quizzes.map((q, qIndex) => {
      return `
        <div class="glass-panel rounded-xl p-5 border border-slate-800" id="quiz-card-${q.id}">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-mono text-indigo-400">Quiz Challenge #${qIndex + 1}</span>
            <span id="quiz-status-${q.id}" class="text-xs text-slate-400">Not Answered</span>
          </div>

          <h4 class="font-bold text-white text-base mb-4">${q.question}</h4>

          <div class="space-y-2 mb-4" id="quiz-options-${q.id}">
            ${q.options.map((opt, optIndex) => `
              <button 
                onclick="handleQuizAnswer('${q.id}', ${optIndex}, ${q.correctIndex})" 
                class="quiz-opt-btn w-full text-left p-3 rounded-lg text-xs font-medium bg-slate-900 border border-slate-800 text-slate-200 hover:border-indigo-500 transition-all flex items-center justify-between group"
                id="quiz-btn-${q.id}-${optIndex}"
              >
                <span>${opt}</span>
                <i class="far fa-circle text-slate-600 group-hover:text-indigo-400"></i>
              </button>
            `).join('')}
          </div>

          <div id="quiz-explanation-${q.id}" class="hidden p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">
            <p class="font-bold text-indigo-400 mb-1">Explanation:</p>
            <p>${q.explanation}</p>
          </div>
        </div>
      `;
    }).join('');
  }

  window.handleQuizAnswer = function(quizId, selectedIdx, correctIdx) {
    const explanationEl = document.getElementById(`quiz-explanation-${quizId}`);
    const statusEl = document.getElementById(`quiz-status-${quizId}`);
    const cardEl = document.getElementById(`quiz-card-${quizId}`);

    // Disable all options for this quiz
    const buttons = cardEl.querySelectorAll(".quiz-opt-btn");
    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      btn.classList.remove("hover:border-indigo-500");
      if (idx === correctIdx) {
        btn.classList.add("bg-emerald-950/60", "border-emerald-500", "text-emerald-200");
        btn.querySelector("i").className = "fas fa-check-circle text-emerald-400";
      } else if (idx === selectedIdx && selectedIdx !== correctIdx) {
        btn.classList.add("bg-rose-950/60", "border-rose-500", "text-rose-200");
        btn.querySelector("i").className = "fas fa-times-circle text-rose-400";
      }
    });

    if (selectedIdx === correctIdx) {
      statusEl.innerHTML = '<span class="text-emerald-400 font-bold"><i class="fas fa-check"></i> Correct</span>';
      showToast("Correct answer! Great job.", "success");
    } else {
      statusEl.innerHTML = '<span class="text-rose-400 font-bold"><i class="fas fa-times"></i> Incorrect</span>';
      showToast("Not quite! Read the explanation below.", "info");
    }

    if (explanationEl) {
      explanationEl.classList.remove("hidden");
    }
  };

  function renderDebugChallenges() {
    const container = document.getElementById("debug-challenges-container");
    if (!container || !window.WP_PRACTICE) return;

    const challenges = window.WP_PRACTICE.debugChallenges;
    container.innerHTML = challenges.map(c => `
      <div class="glass-panel rounded-xl p-5 border border-slate-800">
        <div class="flex items-center justify-between mb-2">
          <span class="px-2.5 py-0.5 rounded text-xs font-semibold bg-rose-900/50 text-rose-300 border border-rose-800">
            <i class="fas fa-bug mr-1"></i> Live Code Bug Challenge
          </span>
          <span class="text-xs text-slate-400">Hands-on Debugging</span>
        </div>

        <h4 class="font-bold text-white text-base mb-1">${c.title}</h4>
        <p class="text-xs text-slate-300 mb-3">${c.scenario}</p>

        <div class="mb-3">
          <div class="bg-rose-950/30 px-3 py-1.5 rounded-t-lg border-t border-l border-r border-rose-900/60 text-xs font-mono text-rose-300 flex items-center justify-between">
            <span>Flawed Code Snippet (Find the bug)</span>
            <span class="text-[10px] text-rose-400">BUGGY CODE</span>
          </div>
          <pre class="bg-slate-950 p-4 rounded-b-lg border-b border-l border-r border-slate-800 text-rose-200 font-mono text-xs overflow-x-auto"><code>${c.flawedCode}</code></pre>
        </div>

        <div class="flex items-center gap-2 mb-3">
          <button onclick="toggleHint('${c.id}')" class="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors flex items-center gap-1.5">
            <i class="far fa-lightbulb text-amber-400"></i> Show Hint
          </button>
          <button onclick="toggleSolution('${c.id}')" class="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5">
            <i class="fas fa-code"></i> Reveal Fixed Solution
          </button>
        </div>

        <div id="hint-box-${c.id}" class="hidden p-3 rounded-lg bg-amber-950/20 border border-amber-800/40 text-amber-200 text-xs mb-3">
          <strong class="font-bold">Hint:</strong> ${c.hint}
        </div>

        <div id="solution-box-${c.id}" class="hidden space-y-2">
          <div class="bg-emerald-950/30 px-3 py-1.5 rounded-t-lg border-t border-l border-r border-emerald-900/60 text-xs font-mono text-emerald-300 flex items-center justify-between">
            <span>Production Fixed Code</span>
            <button onclick="copyCode(this, \`${c.solution.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`)" class="copy-btn text-emerald-400 hover:text-emerald-300">
              <i class="far fa-copy mr-1"></i> Copy
            </button>
          </div>
          <pre class="bg-slate-950 p-4 rounded-b-lg border-b border-l border-r border-slate-800 text-emerald-300 font-mono text-xs overflow-x-auto"><code>${c.solution}</code></pre>
          <div class="p-3 bg-slate-900 rounded-lg text-xs text-slate-300">
            <strong class="text-indigo-400">Why this fix works:</strong> ${c.explanation}
          </div>
        </div>
      </div>
    `).join('');
  }

  window.toggleHint = function(id) {
    const el = document.getElementById(`hint-box-${id}`);
    if (el) el.classList.toggle("hidden");
  };

  window.toggleSolution = function(id) {
    const el = document.getElementById(`solution-box-${id}`);
    if (el) el.classList.toggle("hidden");
  };

  // 5. Render Real-World Projects
  function renderProjectsSection() {
    const container = document.getElementById("projects-grid-container");
    if (!container || !window.WP_PRACTICE) return;

    const projects = window.WP_PRACTICE.realWorldProjects;
    container.innerHTML = projects.map(p => `
      <div class="glass-panel rounded-xl p-6 border border-slate-800 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="px-2.5 py-1 rounded text-xs font-semibold ${
              p.difficulty === 'Intermediate' ? 'bg-indigo-900/60 text-indigo-300 border border-indigo-700' :
              'bg-purple-900/60 text-purple-300 border border-purple-700'
            }">${p.difficulty}</span>
            <span class="text-xs text-slate-400 flex items-center gap-1 font-mono">
              <i class="far fa-clock"></i> ${p.duration}
            </span>
          </div>

          <h3 class="font-bold text-lg text-white mb-2">${p.title}</h3>
          <p class="text-xs text-slate-300 mb-4">${p.overview}</p>

          <div class="flex flex-wrap gap-1.5 mb-4">
            ${p.techStack.map(t => `
              <span class="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300 border border-slate-700">${t}</span>
            `).join('')}
          </div>

          <h5 class="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Key Deliverables:</h5>
          <ul class="space-y-1.5 mb-4">
            ${p.features.map(f => `
              <li class="text-xs text-slate-300 flex items-start gap-2">
                <i class="fas fa-check text-emerald-400 mt-0.5"></i>
                <span>${f}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <div class="pt-4 border-t border-slate-800">
          <details class="text-xs text-slate-300 group">
            <summary class="cursor-pointer font-semibold text-indigo-400 hover:text-indigo-300 py-1 flex items-center justify-between">
              <span>View Architecture Blueprint & File Tree</span>
              <i class="fas fa-chevron-down transition-transform group-open:rotate-180"></i>
            </summary>
            <div class="mt-3">
              <pre class="bg-slate-950 p-4 rounded-lg border border-slate-800 text-sky-300 font-mono text-xs overflow-x-auto"><code>${p.blueprint}</code></pre>
            </div>
          </details>
        </div>
      </div>
    `).join('');
  }

  // 6. Render Topic-wise Learning Sheets
  function renderSheetsSection() {
    const container = document.getElementById("sheets-container");
    if (!container || !window.WP_SHEETS) return;

    const sheets = window.WP_SHEETS;
    container.innerHTML = sheets.map(s => `
      <div class="sheet-card glass-panel rounded-xl p-6 border border-slate-800 mb-6">
        <div class="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
          <div>
            <span class="px-2.5 py-0.5 rounded text-xs font-semibold bg-indigo-900/60 text-indigo-300 border border-indigo-700 mb-2 inline-block">
              ${s.category}
            </span>
            <h3 class="font-bold text-xl text-white">${s.title}</h3>
            <p class="text-xs text-slate-400">${s.description}</p>
          </div>
          <button onclick="window.print()" class="no-print px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors">
            <i class="fas fa-print"></i> Print / Save PDF
          </button>
        </div>

        <div>
          ${s.contentHtml}
        </div>
      </div>
    `).join('');
  }

  // Topic Detail Modal
  window.openTopicModal = function(topicId) {
    const topic = (window.WP_TOPICS || []).find(t => t.id === topicId);
    if (!topic) return;

    const isDone = state.completedTopics.includes(topic.id);

    modalContent.innerHTML = `
      <div class="space-y-6">
        <div class="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-900/60 text-indigo-300 border border-indigo-700">
              ${topic.badge} • ${topic.level}
            </span>
            <h2 class="text-2xl font-bold text-white mt-2">${topic.title}</h2>
            <p class="text-sm text-slate-300 mt-1">${topic.summary}</p>
          </div>
          <button onclick="toggleTopicCompletion('${topic.id}'); openTopicModal('${topic.id}');" class="px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            isDone 
              ? 'bg-emerald-600 text-white' 
              : 'bg-indigo-600 hover:bg-indigo-500 text-white'
          }">
            <i class="fas ${isDone ? 'fa-check' : 'fa-check-circle'} mr-1.5"></i>
            ${isDone ? 'Topic Completed!' : 'Mark as Completed'}
          </button>
        </div>

        <div class="space-y-6">
          ${topic.modules.map((m, idx) => `
            <div class="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
              <h3 class="text-base font-bold text-indigo-400">
                Module ${idx + 1}: ${m.title}
              </h3>
              <p class="text-xs text-slate-300">${m.description}</p>
              
              <div class="space-y-1.5">
                <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Key Architectural Takeaways:</p>
                ${m.keyPoints.map(kp => `
                  <div class="text-xs text-slate-300 flex items-start gap-2">
                    <i class="fas fa-angle-right text-indigo-400 mt-0.5"></i>
                    <span>${kp}</span>
                  </div>
                `).join('')}
              </div>

              ${m.codeSample ? `
                <div class="mt-4">
                  <div class="flex items-center justify-between bg-slate-950 px-3 py-1.5 rounded-t-lg border-t border-l border-r border-slate-800 text-[11px] text-slate-400 font-mono">
                    <span>Code Blueprint</span>
                    <button onclick="copyCode(this, \`${m.codeSample.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`)" class="copy-btn text-indigo-400 hover:text-indigo-300">
                      <i class="far fa-copy mr-1"></i> Copy Snippet
                    </button>
                  </div>
                  <pre class="bg-slate-950 p-4 rounded-b-lg border-b border-l border-r border-slate-800 text-emerald-400 font-mono text-xs overflow-x-auto"><code>${m.codeSample}</code></pre>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;

    modalContainer.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  };

  function closeModal() {
    modalContainer.classList.add("hidden");
    document.body.style.overflow = "auto";
  }

  if (modalClose) modalClose.addEventListener("click", closeModal);
  modalContainer.addEventListener("click", (e) => {
    if (e.target === modalContainer) closeModal();
  });

  // Event Listeners for Filters & Search
  function setupEventListeners() {
    if (globalSearchInput) {
      globalSearchInput.addEventListener("input", (e) => {
        state.searchQuery = e.target.value.trim();
        renderTopics();
        renderInterviewQuestions();
      });
    }

    // Interview level filters
    const levelBtns = document.querySelectorAll(".interview-filter-btn");
    levelBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        levelBtns.forEach(b => {
          b.classList.remove("bg-indigo-600", "text-white");
          b.classList.add("bg-slate-800", "text-slate-300");
        });
        btn.classList.add("bg-indigo-600", "text-white");
        btn.classList.remove("bg-slate-800", "text-slate-300");
        state.interviewFilter = btn.getAttribute("data-level");
        renderInterviewQuestions();
      });
    });
  }

  // Theme Toggle Logic
  function initTheme() {
    const savedTheme = localStorage.getItem("wp_theme") || "dark";
    applyTheme(savedTheme);

    const themeToggleBtn = document.getElementById("theme-toggle-btn");
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener("click", () => {
        const isCurrentlyDark = document.documentElement.classList.contains("dark");
        const targetTheme = isCurrentlyDark ? "light" : "dark";
        applyTheme(targetTheme);
        localStorage.setItem("wp_theme", targetTheme);
        showToast(`Switched to ${targetTheme === "dark" ? "Dark Mode 🌙" : "Light Mode ☀️"}`, "info");
      });
    }
  }

  function applyTheme(theme) {
    const icon = document.getElementById("theme-toggle-icon");
    const text = document.getElementById("theme-toggle-text");

    if (theme === "light") {
      document.documentElement.classList.remove("dark");
      if (icon) {
        icon.className = "fas fa-moon text-indigo-500";
      }
      if (text) {
        text.innerText = "Dark Mode";
      }
    } else {
      document.documentElement.classList.add("dark");
      if (icon) {
        icon.className = "fas fa-sun text-amber-400";
      }
      if (text) {
        text.innerText = "Light Mode";
      }
    }
  }

  // Global helper for tab navigation from buttons
  window.switchTabTo = function(tabId) {
    switchTab(tabId);
  };
});
