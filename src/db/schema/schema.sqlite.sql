-- SQLite Schema for mbktech.org (mbkcore ecosystem standardized)

-- Table: mbkcore_blocked_entries
CREATE TABLE IF NOT EXISTS mbkcore_blocked_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    value TEXT NOT NULL,
    reason TEXT,
    created_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    created_by TEXT,
    is_active INTEGER DEFAULT 1,
    CONSTRAINT mbkcore_blocked_entries_type_value_key UNIQUE (type, value),
    CONSTRAINT chk_mbkcore_blocked_entries_type CHECK (((type) IN ('email', 'phone', 'keyword')))
);

CREATE INDEX IF NOT EXISTS idx_mbkcore_blocked_entries_is_active ON mbkcore_blocked_entries (is_active);
CREATE INDEX IF NOT EXISTS idx_mbkcore_blocked_entries_type_value ON mbkcore_blocked_entries (type, value);

-- Table: mbkcore_support_submissions
CREATE TABLE IF NOT EXISTS mbkcore_support_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_number TEXT,
    subject TEXT NOT NULL,
    support_type TEXT,
    project_category TEXT,
    blog_category TEXT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone_number TEXT,
    message TEXT NOT NULL,
    rating INTEGER,
    status TEXT DEFAULT 'pending',
    priority TEXT DEFAULT 'normal',
    page_url TEXT,
    submission_timestamp TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    last_updated TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    assigned_to TEXT,
    admin_notes TEXT,
    resolution_notes TEXT,
    audit_trail TEXT DEFAULT '[]',
    additional_fields TEXT DEFAULT '{}',
    CONSTRAINT mbkcore_support_submissions_rating_check CHECK (((rating >= 1) AND (rating <= 5))),
    CONSTRAINT chk_mbkcore_support_submissions_priority CHECK (((priority) IN ('low', 'normal', 'high', 'urgent'))),
    CONSTRAINT chk_mbkcore_support_submissions_status CHECK (((status) IN ('pending', 'in_progress', 'resolved', 'closed', 'on_hold'))),
    CONSTRAINT mbkcore_support_submissions_ticket_number_key UNIQUE (ticket_number)
);

CREATE INDEX IF NOT EXISTS idx_mbkcore_support_submissions_email ON mbkcore_support_submissions (email);
CREATE INDEX IF NOT EXISTS idx_mbkcore_support_submissions_status ON mbkcore_support_submissions (status);
CREATE INDEX IF NOT EXISTS idx_mbkcore_support_submissions_subject ON mbkcore_support_submissions (subject);
CREATE INDEX IF NOT EXISTS idx_mbkcore_support_submissions_timestamp ON mbkcore_support_submissions (submission_timestamp);

-- Backward-compatibility views for legacy queries
CREATE VIEW IF NOT EXISTS support_submissions AS SELECT * FROM mbkcore_support_submissions;
CREATE VIEW IF NOT EXISTS blocked_entries AS SELECT * FROM mbkcore_blocked_entries;
