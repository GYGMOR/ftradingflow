-- =========================================================
-- TradeFlow Master Production Database Schema & Seed
-- Full Stack Version 1.0 (Idempotent / Re-runnable)
-- =========================================================

-- CLEANUP (Drop existing tables/types if they exist)
DROP TABLE IF EXISTS audit_logs, analytics_snapshots, journal_entries, trade_history, bot_nodes, user_settings, user_active_widgets, user_dashboard_layouts, dashboard_layout_templates, purchase_items, user_purchases, user_entitlements, product_entitlements, entitlements, bundle_items, store_products, users CASCADE;
DROP TYPE IF EXISTS user_role, product_type, order_status, bot_status, notification_type CASCADE;

-- ENUMS
CREATE TYPE user_role AS ENUM ('TRIAL', 'STANDARD', 'PREMIUM', 'PUBLISHER', 'ADMIN');
CREATE TYPE product_type AS ENUM ('STRATEGY', 'BUNDLE', 'DASHBOARD_PACK', 'RISK_PACK', 'LAYOUT_PACK', 'WIDGET_PACK');
CREATE TYPE order_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED');
CREATE TYPE bot_status AS ENUM ('IDLE', 'RUNNING', 'PAUSED', 'ERROR', 'MAINTENANCE');
CREATE TYPE notification_type AS ENUM ('TRADE', 'WARNING', 'INFO', 'SYSTEM', 'AI');

-- USERS
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    password_hash TEXT NOT NULL,
    role user_role DEFAULT 'TRIAL',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- PRE-INSTALLED ADMIN
-- Login: admin@tradeflow.io
-- Passwort: Admin1234!
INSERT INTO users (email, full_name, password_hash, role) 
VALUES ('admin@tradeflow.io', 'System Admin', '$2b$12$yhxuyYLO2mvWHIhjBuaYkOh4Jee87o6rztB3Q2xrR4wv9dXkMccyu', 'ADMIN');

-- STORE & PRODUCTS
CREATE TABLE store_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    type product_type NOT NULL,
    description TEXT,
    price_chf DECIMAL(10, 2) NOT NULL,
    old_price_chf DECIMAL(10, 2),
    badge TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bundle_items (
    bundle_id UUID REFERENCES store_products(id),
    product_id UUID REFERENCES store_products(id),
    PRIMARY KEY (bundle_id, product_id)
);

-- ENTITLEMENTS (Freischaltungen)
CREATE TABLE entitlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT
);

CREATE TABLE product_entitlements (
    product_id UUID REFERENCES store_products(id),
    entitlement_id UUID REFERENCES entitlements(id),
    PRIMARY KEY (product_id, entitlement_id)
);

CREATE TABLE user_entitlements (
    user_id UUID REFERENCES users(id),
    entitlement_id UUID REFERENCES entitlements(id),
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (user_id, entitlement_id)
);

-- PURCHASES
CREATE TABLE user_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    total_amount DECIMAL(10, 2) NOT NULL,
    status order_status DEFAULT 'PENDING',
    payment_provider_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE purchase_items (
    purchase_id UUID REFERENCES user_purchases(id),
    product_id UUID REFERENCES store_products(id),
    price_at_purchase DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (purchase_id, product_id)
);

-- DASHBOARD & LAYOUTS
CREATE TABLE dashboard_layout_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    is_premium BOOLEAN DEFAULT FALSE,
    required_tier user_role DEFAULT 'TRIAL'
);

CREATE TABLE user_dashboard_layouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    scene_name TEXT NOT NULL,
    layout_data JSONB NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_active_widgets (
    user_id UUID REFERENCES users(id),
    widget_id TEXT NOT NULL,
    scene_name TEXT NOT NULL,
    PRIMARY KEY (user_id, widget_id, scene_name)
);

-- SETTINGS
CREATE TABLE user_settings (
    user_id UUID PRIMARY KEY REFERENCES users(id),
    theme TEXT DEFAULT 'dark',
    timezone TEXT DEFAULT 'Europe/Zurich',
    language TEXT DEFAULT 'de',
    risk_max_daily_loss DECIMAL(10, 2),
    risk_max_trade_percent DECIMAL(5, 2),
    notifications_telegram_id TEXT,
    notifications_discord_webhook TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- BOT & NODES
CREATE TABLE bot_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    node_name TEXT NOT NULL,
    status bot_status DEFAULT 'IDLE',
    runtime_version TEXT,
    ip_address TEXT,
    last_heartbeat TIMESTAMP WITH TIME ZONE
);

CREATE TABLE trade_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    node_id UUID REFERENCES bot_nodes(id),
    symbol TEXT NOT NULL,
    side TEXT NOT NULL,
    entry_price DECIMAL(20, 8),
    exit_price DECIMAL(20, 8),
    quantity DECIMAL(20, 8),
    pnl_chf DECIMAL(15, 2),
    pnl_percent DECIMAL(10, 4),
    opened_at TIMESTAMP WITH TIME ZONE,
    closed_at TIMESTAMP WITH TIME ZONE,
    strategy_id TEXT
);

CREATE TABLE journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trade_id UUID UNIQUE REFERENCES trade_history(id),
    user_id UUID REFERENCES users(id),
    note TEXT,
    mood TEXT,
    screenshot_url TEXT,
    ai_decision_log TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ANALYTICS & LOGS
CREATE TABLE analytics_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    snapshot_date DATE NOT NULL,
    total_balance DECIMAL(15, 2),
    daily_pnl DECIMAL(15, 2),
    max_drawdown DECIMAL(10, 4),
    win_rate DECIMAL(5, 2),
    UNIQUE (user_id, snapshot_date)
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
