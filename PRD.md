# Product Requirements Document (PRD) - Refrigee

## 1. Product Overview
**Product Name:** Refrigee (Smart Fridge Manager)
**Target Audience:** Office workers and International Students.
**Core Value:** Reduce food waste and simplify meal planning through smart inventory tracking.

## 2. Core Features (MVP)

### 2.1 Smart Inventory Recording
- **User Story:** As a user, I want to quickly record groceries I bought so I know what I have.
- **Functionality:**
    - Manual input of Item Name, Quantity, and Weight.
    - **"AI" Auto-Classification (MVP Mock):** Automatically categorize items (e.g., "Apple" -> "Fruit") and assign a default shelf life based on category.
    - Manual override for expiration dates.

### 2.2 Expiration Reminders
- **User Story:** As a user, I want to be warned before food goes bad so I can eat it in time.
- **Functionality:**
    - Visual indicators for items nearing expiration (e.g., Green > Yellow > Red).
    - "Expiring Soon" dashboard section.

### 2.3 Recipe Suggestions
- **User Story:** As a user, I want to know what I can cook with what I have.
- **Functionality:**
    - Input: Number of people eating.
    - Logic: Match available ingredients to a pre-defined list of recipes (MVP).
    - Output: Suggested dishes.

## 3. User Flow
1.  **Onboarding/Home:** View current inventory summary (Total items, Expiring soon).
2.  **Add Item:** Click "+" -> Enter details -> System suggests Category/Date -> Confirm.
3.  **Inventory List:** View all items sorted by expiration date.
4.  **Recipe Tab:** Select "Cook for X people" -> View suggestions based on inventory.

## 4. Technical Constraints & Stack (MVP)
- **Platform:** Web Application (Responsive Mobile-First).
- **Tech Stack:**
    - Framework: React (Vite)
    - Styling: Tailwind CSS (for rapid, beautiful UI) + Framer Motion (for animations).
    - Data Persistence: `localStorage` (No backend for MVP to keep it simple and privacy-focused initially).
    - AI Simulation: Heuristic-based mapping for categories and shelf-life in the frontend code.

## 5. Future Roadmap (Post-MVP)
- OCR Receipt Scanning.
- Real Backend with User Auth.
- Integration with real LLM API for recipe generation.
