import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://icyxpuffgrekgrgfmuce.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljeXhwdWZmZ3Jla2dyZ2ZtdWNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzMTAxMjQsImV4cCI6MjA5Mzg4NjEyNH0.RibgYrtW37Otf7pzFwtrRuU5_oZ_RNxneGb6TeKRICE";

export const supabase = createClient(supabaseUrl, supabaseKey);