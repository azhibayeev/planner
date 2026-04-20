import { createClient } from '@supabase/supabase-js'

// Эти переменные подтянутся из твоего файла .env.local автоматически
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Мы создаем специальный "админский" клиент. 
// Он нужен для того, чтобы записывать данные в базу напрямую из API-роутов,
// не настраивая сложные правила доступа (RLS) в самой панели Supabase.
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)