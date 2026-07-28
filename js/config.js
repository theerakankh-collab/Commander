// =======================================
// config.js
// =======================================

const SUPABASE_URL = "https://sftbzmwrrymlgbsmuima.supabase.co/rest/v1/";
const SUPABASE_KEY = "sb_publishable_J3UrucI0x66JEbHUQQHlXA_QFQf-ioz";

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
