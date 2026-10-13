# W.P Mastery: WordPress Learning & Preparation Portal

A production-grade, interactive, modern learning and interview preparation website designed for WordPress Developers, from beginner fundamentals to enterprise engineers.

---

## 🌟 What's Included

### 1. WordPress Development Core
- **Architecture & Directory Structure:** `wp-config.php`, salts, debug flags, `wp-content`, security configurations.
- **Database Schema:** Detailed breakdown of all 12 core tables (`wp_posts`, `wp_postmeta`, `wp_options`, `wp_terms`, etc.) and query optimization.
- **The Loop & Core APIs:** Standard loop patterns, `have_posts()`, `the_post()`, and custom template tags.
- **Hooks Engine:** Deep dive into Actions vs Filters, execution lifecycle order, priorities, and arguments.
- **OOP Plugin Architecture:** Namespaces, PSR-12, custom post types (`register_post_type`), custom taxonomies, and Settings API.
- **Security Engineering:** Nonces (`wp_create_nonce`, `wp_verify_nonce`), Data Sanitization, Output Escaping, and Parameterized SQL Queries (`$wpdb->prepare`).
- **REST API & Gutenberg:** Custom REST route registration, React block creation, and Full Site Editing (`theme.json`).

### 2. Preparation Tracks
- **WordPress Basics:** Setup, administration, permalinks, page vs post semantics, taxonomies, and user capabilities.
- **Theme Engineering:** Classic theme hierarchy, `functions.php`, child themes, `theme.json`, and Gutenberg block themes.
- **Plugin Engineering:** OOP plugin skeletons, activation/deactivation hooks, meta boxes, and transients.
- **Elementor Mastery:** Container flexbox layouts, dynamic tags, Theme Builder, and developing custom Elementor widgets in PHP.
- **WooCommerce Engineering:** Hook architecture, template overrides, custom checkout fields, HPOS (High-Performance Order Storage), and cart fees.
- **Practical Projects:** Full specifications for real-world projects.

### 3. Company Hiring Process & Interview Vault
- **Eligibility Benchmarks:** Experience levels (Junior 0-2 yrs, Mid 2-5 yrs, Senior 5+ yrs), target titles, and compensation benchmarks.
- **Skills Matrix:** Categorized checklist across Core PHP, WP APIs, Frontend, WooCommerce, Page Builders, Security, and DevOps.
- **Interview Question Bank:** Filterable Junior, Mid-Level, and Senior technical questions with executive answers, in-depth breakdowns, production code, and interview traps/gotchas.
- **Job Strategy & Scenarios:** Portfolio guidelines, live coding tests, client troubleshooting scenarios, and agency communication advice.

### 4. Dedicated WordPress Practice
- **Interactive Quizzes:** Real-time scoring, instant answer verification, and educational explanations.
- **Spot & Fix Bug Challenges:** Production-inspired flawed code snippets with hints, solutions, and explanations.
- **Real-World Project Blueprints:** Architecture trees, file hierarchies, and technical specifications for 4 portfolio projects:
  - Custom Digital Agency Theme (From scratch, ACF Flexible Content)
  - WooCommerce B2B Wholesale & Tiered Pricing Plugin
  - Interactive Real Estate Directory with Geolocation REST API
  - Custom Gutenberg Block Suite with React

### 5. Topic-Wise Learning Sheets & Cheatsheets
- **Hooks Lifecycle Sequence:** Chronological execution table from `plugins_loaded` to `shutdown`.
- **WP_Query Master Cheatsheet:** Meta queries, tax queries, pagination, and performance flags.
- **Security & Sanitization Matrix:** Input sanitizers vs output escapers.
- **WooCommerce Hooks Map:** Single product, cart, and checkout hook diagrams.
- **WP-CLI Essential Command Sheet:** Migrations, search-replace, database backups, and user management.
- **Print / PDF Ready:** Full CSS print stylesheet to generate physical cheatsheet handouts or PDFs.

---

## 🚀 Quick Start / How to Run

### Method 1: One-Click Local Server (Recommended)
Double-click `start-server.bat` or run:
```powershell
py -m http.server 8080
```
Then visit **`http://localhost:8080`** in your browser.

### Method 2: Direct File Launch
Simply double-click `index.html` in Windows Explorer to open it immediately in Google Chrome, Microsoft Edge, or any modern browser.

---

## 📂 Project Structure

```text
wordpress-learning-prep/
├── index.html          # Main application shell with tab routing & UI
├── styles.css          # Custom animations, glassmorphism & print stylesheet
├── app.js              # Application state, quizzes, debugger, localStorage
├── start-server.bat    # Convenient 1-click batch launcher
├── README.md           # Documentation & overview
└── data/
    ├── topics.js       # Core WordPress development modules & code
    ├── interviews.js   # Hiring criteria, skills matrix & interview Q&As
    ├── practice.js     # Quizzes, bug challenges & project blueprints
    └── sheets.js       # Topic-wise cheatsheets & reference tables
```
