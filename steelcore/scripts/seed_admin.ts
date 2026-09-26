import { createClient } from '@supabase/supabase-js';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function seedAdmin() {
  const phone = '08047638090';
  const rawPassword = 'AR@laminator123';
  const shadowEmail = `${phone}@internal.steelcore`;

  console.log("Seeding admin user...");

  // 1. Create or get user in auth.users
  let userId: string;
  const { data: existingUser, error: authErr } = await supabase.auth.admin.createUser({
    email: shadowEmail,
    password: rawPassword,
    email_confirm: true
  });

  if (authErr) {
    if (authErr.message.includes('already registered')) {
      console.log("Shadow user already exists. Fetching...");
      // We'd normally use admin.getUserById, but let's just do a quick profile lookup
      const { data: profile } = await supabase.from('profiles').select('user_id').eq('email', shadowEmail).single();
      if (!profile) {
        console.error("User exists in auth but not in profiles. Clean up manually.");
        process.exit(1);
      }
      userId = profile.user_id;
    } else {
      console.error("Error creating auth user:", authErr);
      process.exit(1);
    }
  } else {
    userId = existingUser.user.id;
    console.log("Created auth.users record.");
  }

  // 2. Ensure profile exists (Triggers might have created it, but let's UPSERT)
  const { data: profileData, error: profileErr } = await supabase
    .from('profiles')
    .upsert({
      user_id: userId,
      full_name: 'Steelcore Admin',
      company_name: 'Steelcore Industries',
      email: shadowEmail,
      phone: phone,
      role: 'ADMIN'
    }, { onConflict: 'email' })
    .select('id')
    .single();

  if (profileErr) {
    console.error("Error creating profile:", profileErr);
    process.exit(1);
  }

  const profileId = profileData.id;
  console.log("Profile ensured. Profile ID:", profileId);

  // 3. Hash password and insert into admin_credentials
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(rawPassword, salt);

  const { error: credErr } = await supabase
    .from('admin_credentials')
    .upsert({
      profile_id: profileId,
      phone_number: phone,
      password_hash: passwordHash
    }, { onConflict: 'phone_number' });

  if (credErr) {
    console.error("Error creating admin credentials:", credErr);
    process.exit(1);
  }

  console.log(`Successfully seeded admin credentials for phone ${phone}`);
}

seedAdmin().catch(console.error);
