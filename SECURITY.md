# Security and Data Privacy Architecture

This document outlines the privacy-conscious, secure lead generation and analytics architecture implemented for **Hasuwa Skills Academy** (Near Shivrinayaran, Chhattisgarh).

## 1. Separation of Anonymous Analytics vs Voluntarily Provided Leads

- **Anonymous Analytics**:
  - Anonymous visitors are **never** fingerprinted or cross-identified across third-party websites.
  - No scraping of Facebook, Instagram, WhatsApp, or private social profiles is conducted.
  - Sessions are tracked using a transient, privacy-friendly `sessionStorage` token that expires when the browser tab closes.
  - Analytics events store only minimum aggregated operational indicators:
    - Event action (`page_view`, `scroll_25`, `whatsapp_clicked`, etc.)
    - Timestamp
    - Non-identifying device category (`mobile`, `tablet`, `desktop`)
    - Generic browser category
    - Inbound campaign tags (`utm_source`, `utm_campaign`)

- **Voluntarily Provided Lead Information**:
  - Personal data (Name, Phone number, Email, Course Choice) is only collected when the visitor voluntarily enters it into the registration form.
  - Explicit affirmative consent checkbox is required before submission:
    > *"I agree to be contacted regarding courses, admission, fees and related educational information."*
  - No personal data is exposed in client-side bundles or public endpoints.

## 2. Anti-Spam and Input Sanitization

- **Honeypot Trap**: Invisible field traps automated web crawlers and silently drops junk submissions without affecting real students.
- **Strict Format Validation**:
  - Name: Minimum 2 characters, trimmed.
  - Phone: Cleaned of delimiters, verified against 10-digit mobile standards.
  - Email: RFC-compliant email validation when provided.
- **XSS & Injection Protection**: All input values are sanitized and properly escaped during persistence and CSV exports.

## 3. Administrative Access Control & RLS

- **Admin Authentication**:
  - Admin endpoints (`/api/leads`, `/api/admin/stats`, `/api/admin/export`) require authentication headers.
  - Public users cannot read other visitors' leads or private notes.
- **Row Level Security (Supabase Compatible)**:
  - Database schema enforces `ROW LEVEL SECURITY`.
  - Public role has `INSERT ONLY` permissions for leads and analytics.
  - `SELECT`, `UPDATE`, and `DELETE` permissions are strictly restricted to authenticated administrative accounts.

## 4. Zero False Guarantees / Ethical Compliance

In accordance with strict educational advertising ethics:
- No artificial job guarantee or income claims are made.
- No fabricated government affiliations, fake student counters, or fake testimonials are shown.
- All course curriculum and fee enquiries are directed to direct centre coordinators for genuine consultation.
