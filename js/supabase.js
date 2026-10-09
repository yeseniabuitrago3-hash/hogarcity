// js/supabase.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://hgvxnpsbnrawetlmvnzn.supabase.co';
// 👇 PEGA AQUÍ LA CLAVE LARGA QUE EMPIEZA CON eyJ...
const supabaseKey = 'sb_publishable_vraOcNAyAbS7vX7D5NjwFg_uMEdZxjB';

export const supabase = createClient(supabaseUrl, supabaseKey);

console.log('✅ Cliente de Supabase inicializado correctamente');