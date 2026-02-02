
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gwibmimaquoesgpbdojo.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3aWJtaW1hcXVvZXNncGJkb2pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5NTgyOTksImV4cCI6MjA3OTUzNDI5OX0.pQ0rZSxTXEiFhOo2PaLb6voLQSnCRqm2U5xd0lPV9dM';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testQuery() {
    console.log('Testing animals query...');

    // Exact query string from animalsService.ts
    const queryString = `
        id, haras_id, name:nome, registry_number:registro, chip_number:chip, brand:marca,
        sex:sexo, category:categoria, birth_date:data_nascimento, coat_color:pelagem,
        status, father_id:pai_id, mother_id:mae_id, location:localizacao, observations:observacoes,
        weight, height, father_name, mother_name,
        main_image_url:foto_url,
        created_at, updated_at,
        father:animals!animals_pai_id_fkey(id, name:nome), 
        mother:animals!animals_mae_id_fkey(id, name:nome)
    `;

    // Fetch user haras_id to simulate real usage
    // Using a known ID or fetch first
    console.log('Fetching any profile...');
    const { data: profile, error: profileError } = await supabase.from('profiles').select('haras_id').limit(1).single();
    if (profileError) {
        console.error('Profile fetch error:', profileError);
        return;
    }
    const harasId = profile.haras_id;
    console.log('Using haras_id:', harasId);

    const { data, error } = await supabase
        .from('animals')
        .select(queryString, { count: 'exact' })
        .eq('haras_id', harasId)
        .range(0, 10);

    if (error) {
        console.error('Query FAILED:', error);
    } else {
        console.log('Query SUCCESS!');
        console.log('Data:', JSON.stringify(data, null, 2));
    }
}

testQuery();
