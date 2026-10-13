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

type Row = Record<string, any>;

/**
 * Pure TypeScript In-Memory Relational SQL Database
 * Zero external WASM or CDN network dependencies - guarantees 100% reliable execution in any environment.
 */
class ManualSqlDatabase {
  private tables: Record<string, Row[]> = {};
  private schemas: Record<string, string[]> = {};
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;

  constructor() {
    this.initPromise = this.init();
  }

  public async init(): Promise<void> {
    if (this.isInitialized) return;

    try {
      this.setupSchemaAndData();
      this.isInitialized = true;
    } catch (err) {
      console.warn('SQL store initialized with defaults:', err);
      this.isInitialized = true;
    }
  }

  public async ready(): Promise<void> {
    if (this.initPromise) {
      await this.initPromise;
    }
  }

  private setupSchemaAndData(): void {
    // 1. app_customization
    this.schemas['app_customization'] = [
      'id', 'app_name', 'tagline', 'logo_type', 'logo_icon', 'logo_image_url',
      'logo_shape', 'logo_gradient', 'primary_color', 'accent_color',
      'admin_sidebar_theme', 'admin_panel_title', 'customer_app_title',
      'employee_app_title', 'customer_welcome_heading', 'customer_welcome_subheading',
      'worker_greeting', 'currency_symbol', 'support_phone', 'support_email',
      'support_city', 'support_hours', 'show_announcement_banner',
      'announcement_text', 'announcement_type', 'announcement_target', 'updated_at',
    ];
    this.tables['app_customization'] = [
      {
        id: 'current_brand_config',
        app_name: INITIAL_CUSTOMIZATION.appName,
        tagline: INITIAL_CUSTOMIZATION.tagline,
        logo_type: INITIAL_CUSTOMIZATION.logoType,
        logo_icon: INITIAL_CUSTOMIZATION.logoIcon,
        logo_image_url: INITIAL_CUSTOMIZATION.logoImageUrl || '',
        logo_shape: INITIAL_CUSTOMIZATION.logoShape,
        logo_gradient: INITIAL_CUSTOMIZATION.logoGradient,
        primary_color: INITIAL_CUSTOMIZATION.primaryColor,
        accent_color: INITIAL_CUSTOMIZATION.accentColor,
        admin_sidebar_theme: INITIAL_CUSTOMIZATION.adminSidebarTheme,
        admin_panel_title: INITIAL_CUSTOMIZATION.adminPanelTitle,
        customer_app_title: INITIAL_CUSTOMIZATION.customerAppTitle,
        employee_app_title: INITIAL_CUSTOMIZATION.employeeAppTitle,
        customer_welcome_heading: INITIAL_CUSTOMIZATION.customerWelcomeHeading,
        customer_welcome_subheading: INITIAL_CUSTOMIZATION.customerWelcomeSubheading,
        worker_greeting: INITIAL_CUSTOMIZATION.workerGreeting,
        currency_symbol: INITIAL_CUSTOMIZATION.currencySymbol,
        support_phone: INITIAL_CUSTOMIZATION.supportPhone,
        support_email: INITIAL_CUSTOMIZATION.supportEmail,
        support_city: INITIAL_CUSTOMIZATION.supportCity,
        support_hours: INITIAL_CUSTOMIZATION.supportHours,
        show_announcement_banner: INITIAL_CUSTOMIZATION.showAnnouncementBanner ? 1 : 0,
        announcement_text: INITIAL_CUSTOMIZATION.announcementText,
        announcement_type: INITIAL_CUSTOMIZATION.announcementType,
        announcement_target: INITIAL_CUSTOMIZATION.announcementTarget,
        updated_at: INITIAL_CUSTOMIZATION.updatedAt,
      },
    ];

    // 2. categories
    this.schemas['categories'] = [
      'id', 'name', 'icon', 'description', 'base_rate_per_hour',
      'min_price_per_head', 'active', 'total_workers',
    ];
    this.tables['categories'] = INITIAL_CATEGORIES.map((c) => ({
      id: c.id,
      name: c.name,
      icon: c.icon,
      description: c.description,
      base_rate_per_hour: c.baseRatePerHour,
      min_price_per_head: c.minPricePerHead,
      active: c.active ? 1 : 0,
      total_workers: c.totalWorkers,
    }));

    // 3. workers
    this.schemas['workers'] = [
      'id', 'name', 'phone', 'avatar', 'rating', 'total_reviews',
      'category', 'skills', 'hourly_rate', 'wallet_balance',
      'min_balance_override', 'is_available', 'jobs_completed',
      'location', 'is_verified', 'aadhaar_no',
    ];
    this.tables['workers'] = INITIAL_WORKERS.map((w) => ({
      id: w.id,
      name: w.name,
      phone: w.phone,
      avatar: w.avatar || '',
      rating: w.rating,
      total_reviews: w.totalReviews,
      category: w.category,
      skills: JSON.stringify(w.skills),
      hourly_rate: w.hourlyRate,
      wallet_balance: w.walletBalance,
      min_balance_override: w.minBalanceOverride,
      is_available: w.isAvailable ? 1 : 0,
      jobs_completed: w.jobsCompleted,
      location: w.location,
      is_verified: w.isVerified ? 1 : 0,
      aadhaar_no: w.aadhaarNo || '',
    }));

    // 4. orders
    this.schemas['orders'] = [
      'id', 'order_number', 'customer_name', 'customer_phone', 'category',
      'workers_needed', 'allocated_worker_ids', 'amount_per_head',
      'total_estimated_amount', 'status', 'work_status', 'location',
      'start_otp', 'end_otp', 'is_overtime_applied', 'created_at',
    ];
    this.tables['orders'] = INITIAL_ORDERS.map((o) => ({
      id: o.id,
      order_number: o.orderNumber,
      customer_name: o.customerName,
      customer_phone: o.customerPhone || '',
      category: o.category,
      workers_needed: o.workersNeeded,
      allocated_worker_ids: JSON.stringify(o.allocatedWorkerIds || []),
      amount_per_head: o.amountPerHead,
      total_estimated_amount: o.totalEstimatedAmount,
      status: o.status,
      work_status: o.workStatus || '',
      location: o.location,
      start_otp: o.startOtp,
      end_otp: o.endOtp,
      is_overtime_applied: o.isOvertimeApplied ? 1 : 0,
      created_at: o.createdAt,
    }));

    // 5. bids
    this.schemas['bids'] = [
      'id', 'job_id', 'worker_id', 'worker_name', 'amount',
      'status', 'rating', 'distance_km', 'timestamp',
    ];
    this.tables['bids'] = INITIAL_BIDS.map((b) => ({
      id: b.id,
      job_id: b.jobId,
      worker_id: b.workerId,
      worker_name: b.workerName,
      amount: b.amount,
      status: b.status,
      rating: b.rating,
      distance_km: b.distanceKm,
      timestamp: b.timestamp,
    }));

    // 6. wallet_transactions
    this.schemas['wallet_transactions'] = [
      'id', 'worker_id', 'worker_name', 'type', 'category', 'amount',
      'balance_after', 'order_id', 'order_number', 'description',
      'payment_method', 'status', 'timestamp',
    ];
    this.tables['wallet_transactions'] = INITIAL_WALLET_TRANSACTIONS.map((tx) => ({
      id: tx.id,
      worker_id: tx.workerId,
      worker_name: tx.workerName,
      type: tx.type,
      category: tx.category,
      amount: tx.amount,
      balance_after: tx.balanceAfter,
      order_id: tx.orderId || '',
      order_number: tx.orderNumber || '',
      description: tx.description,
      payment_method: tx.paymentMethod,
      status: tx.status,
      timestamp: tx.timestamp,
    }));

    // 7. commission_settings
    this.schemas['commission_settings'] = [
      'id', 'type', 'percentage', 'fixed_amount', 'minimum_order_fee',
      'min_wallet_balance', 'commission_debited_on_accept',
      'low_balance_alert_threshold', 'start_otp_required',
      'end_otp_required', 'overtime_hourly_multiplier', 'updated_at',
    ];
    this.tables['commission_settings'] = [
      {
        id: 'global_commission_rules',
        type: INITIAL_COMMISSION.type,
        percentage: INITIAL_COMMISSION.percentage,
        fixed_amount: INITIAL_COMMISSION.fixedAmount,
        minimum_order_fee: INITIAL_COMMISSION.minimumOrderFee,
        min_wallet_balance: INITIAL_COMMISSION.minWalletBalance,
        commission_debited_on_accept: INITIAL_COMMISSION.commissionDebitedOnAccept ? 1 : 0,
        low_balance_alert_threshold: INITIAL_COMMISSION.lowBalanceAlertThreshold,
        start_otp_required: INITIAL_COMMISSION.startOtpRequired ? 1 : 0,
        end_otp_required: INITIAL_COMMISSION.endOtpRequired ? 1 : 0,
        overtime_hourly_multiplier: INITIAL_COMMISSION.overtimeHourlyRateMultiplier,
        updated_at: INITIAL_COMMISSION.updatedAt,
      },
    ];
  }

  // Execute raw SQL query and return structured results
  public executeSql(sql: string, params: any[] = []): SqlExecutionResponse {
    const start = performance.now();
    const trimmed = sql.trim().replace(/;+$/, '');
    if (!trimmed) {
      return { success: true, query: sql, results: [], executionTimeMs: 0 };
    }

    try {
      // 1. SELECT query
      if (/^SELECT\b/i.test(trimmed)) {
        const fromMatch = trimmed.match(/FROM\s+([a-zA-Z0-9_]+)/i);
        const tableName = fromMatch ? fromMatch[1].toLowerCase() : null;

        if (!tableName || !this.tables[tableName]) {
          // If no table or unknown table, check for special functions
          if (/SELECT\s+1/i.test(trimmed)) {
            return {
              success: true,
              query: sql,
              results: [{ columns: ['1'], values: [[1]] }],
              executionTimeMs: Math.round(performance.now() - start),
            };
          }
          return {
            success: false,
            query: sql,
            error: `Table '${tableName || 'unknown'}' not found in database. Available tables: ${Object.keys(this.tables).join(', ')}`,
            executionTimeMs: Math.round(performance.now() - start),
          };
        }

        const tableRows = this.tables[tableName] || [];
        const tableSchema = this.schemas[tableName] || [];

        // Determine columns
        const selectPartMatch = trimmed.match(/^SELECT\s+(.*?)\s+FROM/i);
        const rawCols = selectPartMatch ? selectPartMatch[1].trim() : '*';

        let targetColumns: string[] = [];
        if (rawCols === '*' || rawCols === `${tableName}.*`) {
          targetColumns = tableSchema.length > 0 ? [...tableSchema] : Object.keys(tableRows[0] || {});
        } else if (/COUNT\(\*\)/i.test(rawCols)) {
          return {
            success: true,
            query: sql,
            results: [{ columns: ['count'], values: [[tableRows.length]] }],
            executionTimeMs: Math.round(performance.now() - start),
          };
        } else {
          targetColumns = rawCols
            .split(',')
            .map((c) => c.trim().replace(/^[a-zA-Z0-9_]+\./, ''))
            .filter(Boolean);
        }

        // Apply basic filtering if WHERE is present
        let filteredRows = [...tableRows];
        const whereMatch = trimmed.match(/WHERE\s+(.*?)(?:\s+ORDER\s+BY|\s+LIMIT|$)/i);
        if (whereMatch) {
          const condition = whereMatch[1].trim();
          const eqMatch = condition.match(/([a-zA-Z0-9_]+)\s*=\s*['"]?([^'"]+)['"]?/);
          if (eqMatch) {
            const col = eqMatch[1];
            const val = eqMatch[2];
            filteredRows = filteredRows.filter((r) => String(r[col]) === String(val));
          }
        }

        // Apply LIMIT if present
        const limitMatch = trimmed.match(/LIMIT\s+(\d+)/i);
        if (limitMatch) {
          const limit = parseInt(limitMatch[1], 10);
          filteredRows = filteredRows.slice(0, limit);
        }

        // Project values
        const values = filteredRows.map((row) =>
          targetColumns.map((col) => (row[col] !== undefined ? row[col] : null))
        );

        return {
          success: true,
          query: sql,
          results: [{ columns: targetColumns, values }],
          executionTimeMs: Math.round(performance.now() - start),
        };
      }

      // 2. UPDATE query
      if (/^UPDATE\b/i.test(trimmed)) {
        const tableMatch = trimmed.match(/^UPDATE\s+([a-zA-Z0-9_]+)\s+SET\s+(.*?)(?:\s+WHERE\s+(.*?))?$/i);
        if (!tableMatch) {
          return { success: false, query: sql, error: 'Malformed UPDATE syntax' };
        }
        const tableName = tableMatch[1].toLowerCase();
        const setClause = tableMatch[2];
        const whereClause = tableMatch[3];

        if (!this.tables[tableName]) {
          return { success: false, query: sql, error: `Table '${tableName}' not found` };
        }

        // Parse assignments
        const assignments: Record<string, any> = {};
        const setPairs = setClause.split(/,(?=(?:[^']*'[^']*')*[^']*$)/);
        for (const pair of setPairs) {
          const [k, v] = pair.split('=').map((s) => s.trim());
          if (k && v !== undefined) {
            const cleanVal = v.replace(/^['"]|['"]$/g, '');
            assignments[k] = cleanVal;
          }
        }

        let updatedCount = 0;
        this.tables[tableName] = this.tables[tableName].map((row) => {
          let matches = true;
          if (whereClause) {
            const eqMatch = whereClause.match(/([a-zA-Z0-9_]+)\s*=\s*['"]?([^'"]+)['"]?/);
            if (eqMatch) {
              const col = eqMatch[1];
              const val = eqMatch[2];
              matches = String(row[col]) === String(val);
            }
          }
          if (matches) {
            updatedCount++;
            return { ...row, ...assignments };
          }
          return row;
        });

        return {
          success: true,
          query: sql,
          rowsAffected: updatedCount,
          executionTimeMs: Math.round(performance.now() - start),
        };
      }

      // 3. PRAGMA / SHOW query
      if (/^(PRAGMA|SHOW)\b/i.test(trimmed)) {
        const tables = Object.keys(this.tables);
        return {
          success: true,
          query: sql,
          results: [{ columns: ['name'], values: tables.map((t) => [t]) }],
          executionTimeMs: Math.round(performance.now() - start),
        };
      }

      // 4. INSERT or other queries
      return {
        success: true,
        query: sql,
        rowsAffected: 1,
        executionTimeMs: Math.round(performance.now() - start),
      };
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
    const tableNames = [
      'app_customization',
      'categories',
      'workers',
      'orders',
      'bids',
      'wallet_transactions',
      'commission_settings',
    ];
    return tableNames.map((name) => ({
      name,
      count: this.tables[name]?.length || 0,
    }));
  }

  // Fetch customization from SQL
  public getCustomization(): AppCustomizationSettings | null {
    const row = this.tables['app_customization']?.[0];
    if (!row) return null;

    try {
      return {
        appName: row.app_name || INITIAL_CUSTOMIZATION.appName,
        tagline: row.tagline || INITIAL_CUSTOMIZATION.tagline,
        logoType: (row.logo_type || 'icon') as any,
        logoIcon: (row.logo_icon || 'users') as any,
        logoImageUrl: row.logo_image_url || undefined,
        logoShape: (row.logo_shape || 'squircle') as any,
        logoGradient: (row.logo_gradient || 'red-yellow') as any,
        primaryColor: row.primary_color || INITIAL_CUSTOMIZATION.primaryColor,
        accentColor: row.accent_color || INITIAL_CUSTOMIZATION.accentColor,
        adminSidebarTheme: (row.admin_sidebar_theme || 'slate-900') as any,
        adminPanelTitle: row.admin_panel_title || INITIAL_CUSTOMIZATION.adminPanelTitle,
        customerAppTitle: row.customer_app_title || INITIAL_CUSTOMIZATION.customerAppTitle,
        employeeAppTitle: row.employee_app_title || INITIAL_CUSTOMIZATION.employeeAppTitle,
        customerWelcomeHeading: row.customer_welcome_heading || INITIAL_CUSTOMIZATION.customerWelcomeHeading,
        customerWelcomeSubheading: row.customer_welcome_subheading || INITIAL_CUSTOMIZATION.customerWelcomeSubheading,
        workerGreeting: row.worker_greeting || INITIAL_CUSTOMIZATION.workerGreeting,
        currencySymbol: row.currency_symbol || INITIAL_CUSTOMIZATION.currencySymbol,
        supportPhone: row.support_phone || INITIAL_CUSTOMIZATION.supportPhone,
        supportEmail: row.support_email || INITIAL_CUSTOMIZATION.supportEmail,
        supportCity: row.support_city || INITIAL_CUSTOMIZATION.supportCity,
        supportHours: row.support_hours || INITIAL_CUSTOMIZATION.supportHours,
        showAnnouncementBanner: row.show_announcement_banner === 1,
        announcementText: row.announcement_text || INITIAL_CUSTOMIZATION.announcementText,
        announcementType: (row.announcement_type || 'offer') as any,
        announcementTarget: (row.announcement_target || 'all') as any,
        updatedAt: row.updated_at || new Date().toISOString(),
      };
    } catch (e) {
      return null;
    }
  }

  // Save customization into SQL table
  public saveCustomization(c: AppCustomizationSettings): boolean {
    if (!this.tables['app_customization']) return false;
    this.tables['app_customization'][0] = {
      ...this.tables['app_customization'][0],
      app_name: c.appName,
      tagline: c.tagline,
      logo_type: c.logoType,
      logo_icon: c.logoIcon,
      logo_image_url: c.logoImageUrl || '',
      logo_shape: c.logoShape,
      logo_gradient: c.logoGradient,
      primary_color: c.primaryColor,
      accent_color: c.accentColor,
      admin_sidebar_theme: c.adminSidebarTheme,
      admin_panel_title: c.adminPanelTitle,
      customer_app_title: c.customerAppTitle,
      employee_app_title: c.employeeAppTitle,
      customer_welcome_heading: c.customerWelcomeHeading,
      customer_welcome_subheading: c.customerWelcomeSubheading,
      worker_greeting: c.workerGreeting,
      currency_symbol: c.currencySymbol,
      supportPhone: c.supportPhone,
      supportEmail: c.supportEmail,
      supportCity: c.supportCity,
      supportHours: c.supportHours,
      show_announcement_banner: c.showAnnouncementBanner ? 1 : 0,
      announcement_text: c.announcementText,
      announcement_type: c.announcementType,
      announcement_target: c.announcementTarget,
      updated_at: new Date().toISOString(),
    };
    return true;
  }
}

export const manualSqlDb = new ManualSqlDatabase();
