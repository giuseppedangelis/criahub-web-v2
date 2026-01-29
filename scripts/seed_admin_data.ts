
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Read .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars: Record<string, string> = {};

envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        envVars[match[1].trim()] = match[2].trim();
    }
});

const SUPABASE_URL = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const SUPABASE_KEY = envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const plans = ['Basic', 'Professional', 'Premium'];
const planValues = { 'Basic': 149.00, 'Professional': 299.00, 'Premium': 499.00 };
const names = ['Haras Estrela do Sul', 'Fazenda Rio Grande', 'Rancho Vitória', 'Haras Pégasus', 'Centro Equestre Imperial', 'Haras Monte Verde', 'Estância Cavalos de Ouro', 'Haras da Serra', 'Rancho Quarto de Milha', 'Haras Lusitano'];

async function seed() {
    console.log('Starting seed...');

    // 1. Insert Haras with distributed dates
    const harasIds: string[] = [];

    for (let i = 0; i < names.length; i++) {
        const monthsAgo = Math.floor(Math.random() * 6); // 0 to 5 months ago
        const date = new Date();
        date.setMonth(date.getMonth() - monthsAgo);

        // Random day
        date.setDate(Math.floor(Math.random() * 25) + 1);

        const plan = plans[Math.floor(Math.random() * plans.length)];

        const { data, error } = await supabase
            .from('haras')
            .insert({
                nome: names[i] + ' ' + Math.floor(Math.random() * 1000),
                proprietario: 'Proprietário ' + (i + 1),
                subscription_plan: plan,
                subscription_status: 'Ativa',
                subscription_value: planValues[plan as keyof typeof planValues],
                subscription_start_date: date.toISOString(),
                created_at: date.toISOString(),
            })
            .select('id')
            .single();

        if (error) {
            console.error('Error inserting haras:', error);
        } else if (data) {
            console.log(`Inserted Haras: ${names[i]} (created ${monthsAgo} months ago)`);
            harasIds.push(data.id);
        }
    }

    // 2. Insert Transactions (Revenue)
    console.log('Inserting transactions...');

    for (const harasId of harasIds) {
        // Determine start date (created_at)
        // We can't easily query it back, so let's just generate transactions for the last 6 months 
        // randomly, but ensuring at least one per month if we want to simulate monthly payments.
        // For simplicity, let's insert 1 'Assinatura' payment for each month from 5 months ago to now.

        for (let m = 5; m >= 0; m--) {
            const date = new Date();
            date.setMonth(date.getMonth() - m);
            date.setDate(10); // Pay on 10th

            // Randomly skip some (churn or not started yet)
            if (Math.random() > 0.8) continue;

            const plan = plans[Math.floor(Math.random() * plans.length)];
            const amount = planValues[plan as keyof typeof planValues];

            const { error } = await supabase.from('transactions').insert({
                haras_id: harasId,
                tipo: 'Receita',
                categoria: 'Assinatura',
                descricao: `Mensalidade Plano ${plan}`,
                valor: amount,
                data_transacao: date.toISOString(),
            });

            if (error) console.error('Error inserting transaction:', error);
        }
    }

    console.log('Seed completed!');
}

seed().catch(console.error);
