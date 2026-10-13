import initSqlJs, { Database } from 'sql.js';
import {
  INITIAL_CATEGORIES,
  INITIAL_WORKERS,
  INITIAL_ORDERS,
  INITIAL_BIDS,
  INITIAL_COMMISSION,
  INITIAL_WALLET_TRANSACTIONS,
  INITIAL_CUSTOMIZATION,
} from '../data/initialData';
import { AppCustomizationSettings } from '../types';

export interface SqlQueryResult {
  columns: string[];
  values: any[][];
}

export interface SqlExecutionResponse {
  success: boolean;
  query?: string;
  results?: SqlQueryResult[];
  rowsAffected?: number;
  tables?: { name: string; count: number }[];
  error?: string;
  executionTimeMs?: number;
}

class ManualSqlDatabase {
  private db: Database | null = null;
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;

  constructor() {
    this.initPromise = this.init();
  }

  public async init(): Promise<void> {
    if (this.isInitialized && this.db) return;

    try {
      const SQL = await initSqlJs({
        locateFile: (file) => {
          if (typeof window !== 'undefined') {
            return `https://sql.js.org/dist/${file}`;
          }
          return `./node_modules/sql.js/dist/${file}`;
        },
      });
      this.db = new SQL.Database();
      this.setupSchema();
      this.seedData();
      this.isInitialized = true;
      console.log('✅ Manual SQL Database (SQLite relational engine) initialized with tables & schema.');
    } catch (err) {
      console.error('❌ Failed to initialize manual SQL database:', err);
    }
  }

  public async ready(): Promise<void> {
    if (this.initPromise) {
      await this.initPromise;
    }
  }

  private setupSchema(): void {
    if (!this.db) return;

    this.db.run(`
      -- Application Customization & Logo Branding Table
      CREATE TABLE IF NOT EXISTS app_customization (
        id TEXT PRIMARY KEY,
        app_name TEXT NOT NULL,
        tagline TEXT,
        logo_type TEXT DEFAULT 'icon',
        logo_icon TEXT DEFAULT 'users',
        logo_image_url TEXT,
        logo_shape TEXT DEFAULT 'squircle',
        logo_gradient TEXT DEFAULT 'red-yellow',
        primary_color TEXT DEFAULT '#dc2626',
        accent_color TEXT DEFAULT '#eab308',
        admin_sidebar_theme TEXT DEFAULT 'slate-900',
        admin_panel_title TEXT DEFAULT 'Admin Web Panel',
        customer_app_title TEXT DEFAULT 'Customer / Employer App',
        employee_app_title TEXT DEFAULT 'Employee / Worker App',
        customer_welcome_heading TEXT,
        customer_welcome_subheading TEXT,
        worker_greeting TEXT,
        currency_symbol TEXT DEFAULT '₹',
        support_phone TEXT,
        support_email TEXT,
        support_city TEXT,
        support_hours TEXT,
        show_announcement_banner INTEGER DEFAULT 0,
        announcement_text TEXT,
        announcement_type TEXT DEFAULT 'offer',
        announcement_target TEXT DEFAULT 'all',
        updated_at TEXT
      );

      -- Service Categories Table
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        icon TEXT NOT NULL,
        description TEXT,
        base_rate_per_hour REAL DEFAULT 200,
        min_price_per_head REAL DEFAULT 400,
        active INTEGER DEFAULT 1,
        total_workers INTEGER DEFAULT 0
      );

      -- Registered Workforce Partners Table
      CREATE TABLE IF NOT EXISTS workers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        avatar TEXT,
        rating REAL DEFAULT 5.0,
        total_reviews INTEGER DEFAULT 0,
        category TEXT NOT NULL,
        skills TEXT,
        hourly_rate REAL DEFAULT 250,
        wallet_balance REAL DEFAULT 500,
        min_balance_override REAL DEFAULT 200,
        is_available INTEGER DEFAULT 1,
        jobs_completed INTEGER DEFAULT 0,
        location TEXT,
        is_verified INTEGER DEFAULT 1,
        aadhaar_no TEXT
      );

      -- Temporary Job Orders Table
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        order_number TEXT NOT NULL,
        customer_name TEXT NOT NULL,
        customer_phone TEXT,
        category TEXT NOT NULL,
        workers_needed INTEGER DEFAULT 1,
        allocated_worker_ids TEXT,
        amount_per_head REAL NOT NULL,
        total_estimated_amount REAL NOT NULL,
        status TEXT NOT NULL,
        work_status TEXT,
        location TEXT NOT NULL,
        start_otp TEXT,
        end_otp TEXT,
        is_overtime_applied INTEGER DEFAULT 0,
        created_at TEXT
      );

      -- Bids Table
      CREATE TABLE IF NOT EXISTS bids (
        id TEXT PRIMARY KEY,
        job_id TEXT NOT NULL,
        worker_id TEXT NOT NULL,
        worker_name TEXT NOT NULL,
        amount REAL NOT NULL,
        status TEXT NOT NULL,
        rating REAL DEFAULT 5.0,
        distance_km REAL DEFAULT 1.5,
        timestamp TEXT
      );

      -- Worker Prepaid Wallet Transactions Ledger
      CREATE TABLE IF NOT EXISTS wallet_transactions (
        id TEXT PRIMARY KEY,
        worker_id TEXT NOT NULL,
        worker_name TEXT NOT NULL,
        type TEXT NOT NULL,
        category TEXT NOT NULL,
        amount REAL NOT NULL,
        balance_after REAL NOT NULL,
        order_id TEXT,
        order_number TEXT,
        description TEXT,
        payment_method TEXT,
        status TEXT DEFAULT 'completed',
        timestamp TEXT
      );

      -- Platform Commission Monetization Configuration
      CREATE TABLE IF NOT EXISTS commission_settings (
        id TEXT PRIMARY KEY,
        type TEXT DEFAULT 'percentage',
        percentage REAL DEFAULT 10,
        fixed_amount REAL DEFAULT 50,
        minimum_order_fee REAL DEFAULT 30,
        min_wallet_balance REAL DEFAULT 200,
        commission_debited_on_accept INTEGER DEFAULT 1,
        low_balance_alert_threshold REAL DEFAULT 200,
        start_otp_required INTEGER DEFAULT 1,
        end_otp_required INTEGER DEFAULT 1,
        overtime_hourly_rate_multiplier REAL DEFAULT 1.5,
        updated_at TEXT
      );
    `);
  }

  private seedData(): void {
    if (!this.db) return;

    // 1. Seed Customization
    const c = INITIAL_CUSTOMIZATION;
    this.db.run(
      `INSERT OR REPLACE INTO app_customization (
        id, app_name, tagline, logo_type, logo_icon, logo_image_url, logo_shape, logo_gradient,
        primary_color, accent_color, admin_sidebar_theme, admin_panel_title, customer_app_title,
        employee_app_title, customer_welcome_heading, customer_welcome_subheading, worker_greeting,
        currency_symbol, support_phone, support_email, support_city, support_hours,
        show_announcement_banner, announcement_text, announcement_type, announcement_target, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'current_brand_config',
        c.appName,
        c.tagline,
        c.logoType,
        c.logoIcon,
        c.logoImageUrl || '',
        c.logoShape,
        c.logoGradient,
        c.primaryColor,
        c.accentColor,
        c.adminSidebarTheme,
        c.adminPanelTitle,
        c.customerAppTitle,
        c.employeeAppTitle,
        c.customerWelcomeHeading,
        c.customerWelcomeSubheading,
        c.workerGreeting,
        c.currencySymbol,
        c.supportPhone,
        c.supportEmail,
        c.supportCity,
        c.supportHours,
        c.showAnnouncementBanner ? 1 : 0,
        c.announcementText,
        c.announcementType,
        c.announcementTarget,
        c.updatedAt,
      ]
    );

    // 2. Seed Categories
    for (const cat of INITIAL_CATEGORIES) {
      this.db.run(
        `INSERT OR REPLACE INTO categories (id, name, icon, description, base_rate_per_hour, min_price_per_head, active, total_workers)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          cat.id,
          cat.name,
          cat.icon,
          cat.description,
          cat.baseRatePerHour,
          cat.minPricePerHead,
          cat.active ? 1 : 0,
          cat.totalWorkers,
        ]
      );
    }

    // 3. Seed Workers
    for (const w of INITIAL_WORKERS) {
      this.db.run(
        `INSERT OR REPLACE INTO workers (
          id, name, phone, avatar, rating, total_reviews, category, skills, hourly_rate,
          wallet_balance, min_balance_override, is_available, jobs_completed, location, is_verified, aadhaar_no
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          w.id,
          w.name,
          w.phone,
          w.avatar,
          w.rating,
          w.totalReviews,
          w.category,
          w.skills.join(', '),
          w.hourlyRate,
          w.walletBalance,
          w.minBalanceOverride ?? 200,
          w.isAvailable ? 1 : 0,
          w.jobsCompleted,
          w.location,
          w.isVerified ? 1 : 0,
          w.aadhaarNo || '',
        ]
      );
    }

    // 4. Seed Orders
    for (const o of INITIAL_ORDERS) {
      this.db.run(
        `INSERT OR REPLACE INTO orders (
          id, order_number, customer_name, customer_phone, category, workers_needed,
          allocated_worker_ids, amount_per_head, total_estimated_amount, status,
          work_status, location, start_otp, end_otp, is_overtime_applied, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          o.id,
          o.orderNumber,
          o.customerName,
          o.customerPhone,
          o.category,
          o.requiredWorkers,
          JSON.stringify(o.acceptedEmployees || []),
          o.amountPerHead,
          o.finalTotalAmount || o.estimatedManpowerCost,
          o.status,
          o.startOtpVerified ? 'in_progress' : 'pending_start',
          o.location,
          o.startOtp || '',
          o.endOtp || '',
          o.overtimeHours ? 1 : 0,
          o.scheduledDateFrom || new Date().toISOString(),
        ]
      );
    }

    // 5. Seed Bids
    for (const b of INITIAL_BIDS) {
      this.db.run(
        `INSERT OR REPLACE INTO bids (id, job_id, worker_id, worker_name, amount, status, rating, distance_km, timestamp)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [b.id, b.jobId, b.workerId, b.workerName, b.amount, b.status, b.workerRating || 5.0, 2.5, b.createdAt]
      );
    }

    // 6. Seed Wallet Transactions
    for (const tx of INITIAL_WALLET_TRANSACTIONS) {
      this.db.run(
        `INSERT OR REPLACE INTO wallet_transactions (
          id, worker_id, worker_name, type, category, amount, balance_after,
          order_id, order_number, description, payment_method, status, timestamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          tx.id,
          tx.workerId,
          tx.workerName || 'Worker Partner',
          tx.type,
          tx.category,
          tx.amount,
          tx.balanceAfter,
          tx.orderId || '',
          tx.orderNumber || '',
          tx.description,
          tx.paymentMethod || 'system_deduct',
          tx.status,
          tx.timestamp,
        ]
      );
    }

    // 7. Seed Commission Settings
    const comm = INITIAL_COMMISSION;
    this.db.run(
      `INSERT OR REPLACE INTO commission_settings (
        id, type, percentage, fixed_amount, minimum_order_fee, min_wallet_balance,
        commission_debited_on_accept, low_balance_alert_threshold, start_otp_required,
        end_otp_required, overtime_hourly_rate_multiplier, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'global_commission_rules',
        comm.type,
        comm.percentage,
        comm.fixedAmount,
        comm.minimumOrderFee,
        comm.minWalletBalance,
        comm.commissionDebitedOnAccept ? 1 : 0,
        comm.lowBalanceAlertThreshold,
        comm.startOtpRequired ? 1 : 0,
        comm.endOtpRequired ? 1 : 0,
        comm.overtimeHourlyRateMultiplier,
        comm.updatedAt,
      ]
    );
  }

  // Execute raw SQL query and return structured results
  public executeSql(sql: string, params: any[] = []): SqlExecutionResponse {
    if (!this.db) {
      return { success: false, error: 'SQL Database not initialized' };
    }

    const start = performance.now();
    try {
      const trimmed = sql.trim();
      const isSelect = /^(SELECT|PRAGMA|EXPLAIN)/i.test(trimmed);

      if (isSelect) {
        const results = this.db.exec(trimmed, params);
        const duration = Math.round(performance.now() - start);
        return {
          success: true,
          query: sql,
          results,
          executionTimeMs: duration,
        };
      } else {
        this.db.run(trimmed, params);
        const rowsModified = this.db.getRowsModified();
        const duration = Math.round(performance.now() - start);
        return {
          success: true,
          query: sql,
          rowsAffected: rowsModified,
          executionTimeMs: duration,
        };
      }
    } catch (err: any) {
      return {
        success: false,
        query: sql,
        error: err?.message || String(err),
        executionTimeMs: Math.round(performance.now() - start),
      };
    }
  }

  // Get table statistics
  public getTableStats(): { name: string; count: number }[] {
    if (!this.db) return [];
    const tables = [
      'app_customization',
      'categories',
      'workers',
      'orders',
      'bids',
      'wallet_transactions',
      'commission_settings',
    ];

    return tables.map((t) => {
      try {
        const res = this.db!.exec(`SELECT COUNT(*) as count FROM ${t}`);
        const count = res[0]?.values[0]?.[0] as number || 0;
        return { name: t, count };
      } catch (e) {
        return { name: t, count: 0 };
      }
    });
  }

  // Fetch customization from SQL
  public getCustomization(): AppCustomizationSettings | null {
    if (!this.db) return null;
    try {
      const res = this.db.exec('SELECT * FROM app_customization WHERE id = "current_brand_config"');
      if (!res.length || !res[0].values.length) return null;

      const row = res[0].values[0];
      const cols = res[0].columns;
      const getVal = (col: string) => row[cols.indexOf(col)];

      return {
        appName: (getVal('app_name') as string) || INITIAL_CUSTOMIZATION.appName,
        tagline: (getVal('tagline') as string) || INITIAL_CUSTOMIZATION.tagline,
        logoType: (getVal('logo_type') as any) || 'icon',
        logoIcon: (getVal('logo_icon') as any) || 'users',
        logoImageUrl: (getVal('logo_image_url') as string) || '',
        logoShape: (getVal('logo_shape') as any) || 'squircle',
        logoGradient: (getVal('logo_gradient') as any) || 'red-yellow',
        primaryColor: (getVal('primary_color') as string) || '#dc2626',
        accentColor: (getVal('accent_color') as string) || '#eab308',
        adminSidebarTheme: (getVal('admin_sidebar_theme') as any) || 'slate-900',
        adminPanelTitle: (getVal('admin_panel_title') as string) || 'Admin Web Panel',
        customerAppTitle: (getVal('customer_app_title') as string) || 'Customer / Employer App',
        employeeAppTitle: (getVal('employee_app_title') as string) || 'Employee / Worker App',
        customerWelcomeHeading: (getVal('customer_welcome_heading') as string) || '',
        customerWelcomeSubheading: (getVal('customer_welcome_subheading') as string) || '',
        workerGreeting: (getVal('worker_greeting') as string) || '',
        currencySymbol: (getVal('currency_symbol') as string) || '₹',
        supportPhone: (getVal('support_phone') as string) || '',
        supportEmail: (getVal('support_email') as string) || '',
        supportCity: (getVal('support_city') as string) || '',
        supportHours: (getVal('support_hours') as string) || '',
        showAnnouncementBanner: Boolean(getVal('show_announcement_banner')),
        announcementText: (getVal('announcement_text') as string) || '',
        announcementType: (getVal('announcement_type') as any) || 'offer',
        announcementTarget: (getVal('announcement_target') as any) || 'all',
        showPushSimulatorFloating: true,
        enableSoundChimes: true,
        updatedAt: (getVal('updated_at') as string) || new Date().toISOString(),
      };
    } catch (e) {
      console.error('Error fetching customization from SQL:', e);
      return null;
    }
  }

  // Update customization in SQL
  public saveCustomization(c: AppCustomizationSettings): boolean {
    if (!this.db) return false;
    try {
      this.db.run(
        `INSERT OR REPLACE INTO app_customization (
          id, app_name, tagline, logo_type, logo_icon, logo_image_url,
          logo_shape, logo_gradient, primary_color, accent_color,
          admin_sidebar_theme, admin_panel_title, customer_app_title,
          employee_app_title, customer_welcome_heading, customer_welcome_subheading,
          worker_greeting, currency_symbol, support_phone, support_email,
          support_city, support_hours, show_announcement_banner,
          announcement_text, announcement_type, announcement_target, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          'current_brand_config',
          c.appName,
          c.tagline,
          c.logoType,
          c.logoIcon,
          c.logoImageUrl || '',
          c.logoShape,
          c.logoGradient,
          c.primaryColor,
          c.accentColor,
          c.adminSidebarTheme,
          c.adminPanelTitle,
          c.customerAppTitle,
          c.employeeAppTitle,
          c.customerWelcomeHeading,
          c.customerWelcomeSubheading,
          c.workerGreeting,
          c.currencySymbol,
          c.supportPhone,
          c.supportEmail,
          c.supportCity,
          c.supportHours,
          c.showAnnouncementBanner ? 1 : 0,
          c.announcementText,
          c.announcementType,
          c.announcementTarget,
          c.updatedAt || new Date().toISOString(),
        ]
      );
      return true;
    } catch (e) {
      console.error('Error saving customization to SQL:', e);
      return false;
    }
  }
}

export const manualSqlDb = new ManualSqlDatabase();
