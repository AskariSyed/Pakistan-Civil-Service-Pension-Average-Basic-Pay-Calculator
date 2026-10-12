# 🇵🇰 Pakistan Civil Service Pension & 24-Month Average Basic Pay Calculator

A modern, high-precision web application built with **React** and **Vite** that faithfully implements the exact formulas, pay scale structures, and retirement rules from the official Excel spreadsheet (`Download-Average-Basic-Pay-Finding-Calculator-24-Months.xlsx`).

---

## 📋 Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Calculation Rules & Formulas](#calculation-rules--formulas)
  - [1. 24-Month Average Basic Pay Formula](#1-24-month-average-basic-pay-formula)
  - [2. Annual Increment Rule (1st December)](#2-annual-increment-rule-1st-december)
  - [3. Pay Scale Transition (2022 vs 2026)](#3-pay-scale-transition-2022-vs-2026)
  - [4. Personal Pay (PP) at Ceiling](#4-personal-pay-pp-at-ceiling)
  - [5. Full Pension & Commutation Benefit Estimation](#5-full-pension--commutation-benefit-estimation)
- [Project Architecture](#project-architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Running](#installation--running)
  - [Production Build](#production-build)
- [Print & PDF Export](#print--pdf-export)
- [Disclaimer](#disclaimer)

---

## 🌟 Overview

Under recent Federal and Provincial civil service pension reforms in Pakistan, pensions are calculated on the basis of the **Average of Last 24 Months Basic Pay** instead of solely the last drawn basic pay. 

This application allows government employees across **BPS-01 to BPS-22** to enter their retirement date, basic pay, and personal pay to instantly calculate their month-by-month earnings, 24-month average basic pay, and estimated commutation lump-sum and net monthly pension.

---

## ✨ Key Features

- **Exact Excel Replication**: Validated to match every cell in `Download-Average-Basic-Pay-Finding-Calculator-24-Months.xlsx`.
- **Complete Basic Pay Scales (BPS 1–22)**:
  - **2022 Pay Scale** (Initial, Increment, Maximum / Ceiling, Stages)
  - **2026 Revised Pay Scale** (Implemented from 1st July 2026)
- **Modern UI / UX**:
  - **Custom Dropdown Controls**: Sleek popover selectors with stage badges, increment values, and salary ranges.
  - **Custom Interactive Date Picker**: Fast month/year navigation, quick presets (Sample, Scale Cutoff, Increment Date), and visual scale-zone indicator.
  - **Pakistani Rupee (PKR)**: Explicit `PKR` and `Rs.` badges across all fields and calculations.
  - **Light & Dark Mode**: Seamless toggle with tailored high-contrast executive palettes.
- **24-Month Detailed Breakdown Table**:
  - Full itemized table showing Month, Applicable Pay Scale, Increment Stage, Basic Pay, Personal Pay, and Total Pay.
  - Summary footer for total 24-month sum and average.
- **Full Pension & Commutation Estimator**:
  - Sliders for **Qualifying Service** (10 to 30 years) and **Age Next Birthday** (40 to 65 years).
  - Accurate calculation of Gross Pension, 35% Commutation, Lump Sum Gratuity (using official Age-factor table), Net Monthly Pension, and Medical Allowance.
- **Print & PDF Optimization**:
  - Clean A4 print layout preventing row cuts across pages (`page-break-inside: avoid`).
  - Dedicated print statement including employee particulars, complete 24-month schedule, pension breakdown, signatures, and disclaimer.
- **Vercel Analytics & Speed Insights**:
  - Integrated `@vercel/analytics` and `@vercel/speed-insights` for real-time traffic analytics and Core Web Vitals performance monitoring.

---

## 📐 Calculation Rules & Formulas

### 1. 24-Month Average Basic Pay Formula
For an employee retiring on date $C_5$, the calculator evaluates the 24 months preceding and including the retirement month:

$$
F_k = \text{DATE}(\text{YEAR}(C_5), \text{MONTH}(C_5) - 24 + k, 1) \quad \text{for } k \in [1, 24]
$$

The Average Basic Pay ($ABP$) is calculated as:

$$
ABP = \text{ROUND}\left(\frac{\sum_{k=1}^{24} \text{Total Pay}_k}{24}, 0\right)
$$

### 2. Annual Increment Rule (1st December)
In the Pakistan civil service, regular annual increments are drawn on the **1st of December**. The formula dynamically adjusts the increment stage for any month $F_k$ relative to the retirement date $C_5$:

$$
\text{IncDiff} = (\text{YEAR}(C_5) - \text{YEAR}(F_k)) + [1 \text{ if } \text{MONTH}(C_5) = 12 \text{ else } 0] - [1 \text{ if } \text{MONTH}(F_k) = 12 \text{ else } 0]
$$

$$
\text{Stages}_k = \text{Total Stages at Retirement} - \text{IncDiff}
$$

### 3. Pay Scale Transition (2022 vs 2026)
- Months **before 1st July 2026** use the **2022 Pay Scale**.
- Months **on or after 1st July 2026** use the **2026 Revised Pay Scale**.

For each month $k$, the total emolument is calculated as:

$$
\text{Total Pay}_k = \text{Initial}_k + (\text{Stages}_k \times \text{Increment}_k)
$$

$$
\text{Basic Pay}_k = \min(\text{Total Pay}_k, \text{Maximum}_k)
$$

$$
\text{Personal Pay}_k = \max(\text{Total Pay}_k - \text{Basic Pay}_k, 0)
$$

### 4. Personal Pay (PP) at Ceiling
- Personal Pay is admissible only when the employee has reached the ceiling/maximum of the pay scale ($\text{Stage} = \text{Max Stages}$).
- Personal Pay must be an exact multiple of the annual increment.
- The formula converts Personal Pay into equivalent stages and applies it proportionally across past pay scales.

### 5. Full Pension & Commutation Benefit Estimation

**Gross Pension**:
$$
\text{Gross Pension} = \frac{ABP \times \text{Service Years (Max 30)} \times 7}{300}
$$

**Commutation (35%)**:
$$
\text{Commutation Portion} = \text{Gross Pension} \times 0.35
$$

**Lump Sum Gratuity**:
$$
\text{Commutation Lump Sum} = \text{Commutation Portion} \times 12 \times \text{Factor}(\text{Age Next Birthday})
$$

**Net Monthly Pension**:
$$
\text{Net Pension} = \text{Gross Pension} \times 0.65
$$

**Medical Allowance**:
- $25\%$ of Net Pension for BPS 1–15
- $20\%$ of Net Pension for BPS 16–22

---

## 📁 Project Architecture

```
pension-calculator/
├── Download-Average-Basic-Pay-Finding-Calculator-24-Months.xlsx  # Original Excel reference
├── index.html                                                    # App entry HTML with Google Fonts
├── package.json                                                  # Dependencies & scripts
├── vite.config.js                                                # Vite bundler config
└── src/
    ├── main.jsx                                                  # React root mount
    ├── App.jsx                                                   # Main application container
    ├── index.css                                                 # Complete Design System & Print CSS
    ├── data/
    │   └── payScales.js                                          # Official BPS 1-22 (2022 & 2026) scales
    ├── utils/
    │   └── calculator.js                                         # Formula logic & pension benefits
    └── components/
        ├── Header.jsx                                            # Header with theme toggle & actions
        ├── CalculatorForm.jsx                                    # Inputs (BPS, Date, Basic Pay, PP)
        ├── CustomSelect.jsx                                      # Modern styled dropdown selector
        ├── CustomDatePicker.jsx                                  # Custom interactive calendar popover
        ├── ResultsSummary.jsx                                    # Hero card & metric badges (PKR)
        ├── BreakdownTable.jsx                                    # 24-month itemized table
        ├── PensionEstimator.jsx                                  # Pension & commutation sliders
        ├── PayScaleModal.jsx                                     # Complete 2022 vs 2026 comparison chart
        ├── RulesExplainer.jsx                                    # Explanatory cards for rules
        ├── PrintStatement.jsx                                    # A4 print statement layout
        └── Footer.jsx                                            # Disclaimer & footer info
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) (v9.0.0 or higher)

### Installation & Running
1. Clone or open the repository folder:
   ```bash
   cd "pension calculator"
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the local URL (typically `http://localhost:5173` or `http://localhost:5174`).

### Production Build
To create an optimized production bundle:
```bash
npm run build
```
The output files will be generated in the `dist/` directory and can be deployed to any static host (Vercel, Netlify, GitHub Pages, Apache, Nginx).

---

## 🖨️ Print & PDF Export

Click the **Print / PDF** button in the header (or press `Ctrl + P` / `Cmd + P`) to generate a clean document:
- Designed specifically for **A4 Portrait** with optimized margins.
- Tables will **not cut mid-row** across pages (`page-break-inside: avoid`).
- Table header repeats automatically on multi-page printouts.
- Form controls and screen buttons are automatically hidden.
- Includes employee particulars, itemized 24-month schedule, commutation estimates, signature lines, and the personal use disclaimer.

---

## ⚠️ Disclaimer

> **IMPORTANT DISCLAIMER**: This application is built for personal calculation, planning, and informational reference only. It is **not** an official government calculator and is **not** affiliated with the Accountant General Pakistan Revenues (AGPR), Provincial Accountant General (AG) Offices, or the Ministry of Finance. Final pension sanctions, Last Pay Certificates (LPC), and entitlements are determined strictly by the competent government sanctioning authorities and respective Accounts Offices.