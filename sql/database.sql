-- =====================================================
-- Military Directory Database
-- PostgreSQL / Supabase
-- Version 2.0
-- =====================================================

-- ============================================
-- DROP TABLE (สำหรับติดตั้งใหม่)
-- ============================================

DROP TABLE IF EXISTS wives CASCADE;
DROP TABLE IF EXISTS commanders CASCADE;
DROP TABLE IF EXISTS personnel CASCADE;

-- ============================================
-- PERSONNEL
-- ============================================

CREATE TABLE personnel (

    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    auth_user_id UUID UNIQUE,

    email VARCHAR(255) UNIQUE NOT NULL,

    role VARCHAR(20) NOT NULL DEFAULT 'user'
        CHECK (role IN ('admin','commander','user')),

    rank VARCHAR(30) NOT NULL,

    firstname VARCHAR(100) NOT NULL,

    lastname VARCHAR(100) NOT NULL,

    nickname VARCHAR(100),

    position TEXT,

    class VARCHAR(20),

    phone VARCHAR(30),

    image TEXT,

    remark TEXT,

    status BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT NOW(),

    updated_at TIMESTAMP DEFAULT NOW()

);

-- ============================================
-- COMMANDERS
-- ============================================

CREATE TABLE commanders (

    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    personnel_id BIGINT NOT NULL UNIQUE,

    start_date DATE,

    end_date DATE,

    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_commander_personnel
        FOREIGN KEY(personnel_id)
        REFERENCES personnel(id)
        ON DELETE CASCADE

);

-- ============================================
-- WIVES
-- ============================================

CREATE TABLE wives (

    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    personnel_id BIGINT NOT NULL,

    wife_name VARCHAR(200) NOT NULL,

    phone VARCHAR(30),

    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_wife_personnel
        FOREIGN KEY(personnel_id)
        REFERENCES personnel(id)
        ON DELETE CASCADE

);

-- ============================================
-- INDEX
-- ============================================

CREATE INDEX idx_personnel_email
ON personnel(email);

CREATE INDEX idx_personnel_auth
ON personnel(auth_user_id);

CREATE INDEX idx_personnel_role
ON personnel(role);

CREATE INDEX idx_personnel_name
ON personnel(lastname, firstname);

CREATE INDEX idx_wife_personnel
ON wives(personnel_id);

CREATE INDEX idx_commander_personnel
ON commanders(personnel_id);

-- ============================================
-- UPDATE TIMESTAMP
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()

RETURNS TRIGGER

LANGUAGE plpgsql

AS
$$
BEGIN

    NEW.updated_at = NOW();

    RETURN NEW;

END;
$$;

CREATE TRIGGER trg_personnel_updated

BEFORE UPDATE

ON personnel

FOR EACH ROW

EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE personnel ENABLE ROW LEVEL SECURITY;
ALTER TABLE commanders ENABLE ROW LEVEL SECURITY;
ALTER TABLE wives ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLICY : PERSONNEL
-- ============================================

CREATE POLICY personnel_select_self

ON personnel

FOR SELECT

USING (

    auth.uid() = auth_user_id

);

CREATE POLICY personnel_update_self

ON personnel

FOR UPDATE

USING (

    auth.uid() = auth_user_id

);

CREATE POLICY personnel_insert_self

ON personnel

FOR INSERT

WITH CHECK (

    auth.uid() = auth_user_id

);

CREATE POLICY personnel_delete_admin

ON personnel

FOR DELETE

USING (

EXISTS(

SELECT 1

FROM personnel p

WHERE p.auth_user_id = auth.uid()

AND p.role='admin'

)

);

CREATE POLICY personnel_admin_all

ON personnel

FOR ALL

USING (

EXISTS(

SELECT 1

FROM personnel p

WHERE p.auth_user_id = auth.uid()

AND p.role='admin'

)

);

-- ============================================
-- POLICY : COMMANDERS
-- ============================================

CREATE POLICY commander_admin

ON commanders

FOR ALL

USING (

EXISTS(

SELECT 1

FROM personnel p

WHERE p.auth_user_id = auth.uid()

AND p.role='admin'

)

);

-- ============================================
-- POLICY : WIVES
-- ============================================

CREATE POLICY wife_select

ON wives

FOR SELECT

USING (

EXISTS(

SELECT 1

FROM personnel p

WHERE

p.id = wives.personnel_id

AND p.auth_user_id = auth.uid()

)

);

CREATE POLICY wife_admin

ON wives

FOR ALL

USING (

EXISTS(

SELECT 1

FROM personnel p

WHERE

p.auth_user_id = auth.uid()

AND p.role='admin'

)

);

-- ============================================
-- DEFAULT ADMIN
-- ============================================

INSERT INTO personnel (

    auth_user_id,
    email,
    role,
    rank,
    firstname,
    lastname,
    nickname,
    position,
    class,
    phone

)

VALUES (

    NULL,
    'admin@example.com',
    'admin',
    'พ.อ.',
    'ผู้ดูแล',
    'ระบบ',
    'Admin',
    'ผู้ดูแลระบบ',
    'นายทหาร',
    '-'

);
