import { NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import * as bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { phone_number, password } = await request.json();

    if (!phone_number || !password) {
      return NextResponse.json({ error: 'Phone number and password required' }, { status: 400 });
    }

    // Use service role to bypass RLS and read admin_credentials
    const supabaseServiceUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    if (!supabaseServiceUrl || !supabaseServiceKey) {
      console.error("Missing Service Role Key for Admin Login");
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const serviceClient = createSupabaseClient(supabaseServiceUrl, supabaseServiceKey);

    // Fetch credentials
    const { data: creds, error: credsErr } = await serviceClient
      .from('admin_credentials')
      .select('*, profiles!inner(role)')
      .eq('phone_number', phone_number)
      .single();

    if (credsErr || !creds) {
      // Avoid revealing if phone exists
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Simple brute force protection (lock for 15 mins after 5 attempts)
    if (creds.locked_until && new Date(creds.locked_until) > new Date()) {
      return NextResponse.json({ error: 'Account temporarily locked. Try again later.' }, { status: 429 });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, creds.password_hash);

    if (!isValid) {
      const newAttempts = (creds.failed_attempts || 0) + 1;
      const updates: any = { failed_attempts: newAttempts };
      
      if (newAttempts >= 5) {
        updates.locked_until = new Date(Date.now() + 15 * 60000).toISOString(); // 15 mins
      }
      
      await serviceClient.from('admin_credentials').update(updates).eq('id', creds.id);
      
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Password is valid. Reset attempts and set last_login.
    await serviceClient.from('admin_credentials').update({
      failed_attempts: 0,
      locked_until: null,
      last_login_at: new Date().toISOString()
    }).eq('id', creds.id);

    // Verify role
    if (creds.profiles.role !== 'ADMIN' && creds.profiles.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized role' }, { status: 403 });
    }

    // Sign in using Supabase Auth (Shadow email) to get the session cookie
    const supabaseServer = createClient();
    const shadowEmail = `${phone_number}@internal.steelcore`;
    
    const { error: signInErr } = await supabaseServer.auth.signInWithPassword({
      email: shadowEmail,
      password: password
    });

    if (signInErr) {
      console.error("Supabase Auth error during admin login:", signInErr);
      return NextResponse.json({ error: 'Error establishing session' }, { status: 500 });
    }

    return NextResponse.json({ success: true, redirectUrl: '/admin' });
    
  } catch (error) {
    console.error("Admin Login Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
