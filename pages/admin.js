import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Admin() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      const { data } = await supabase.from('members').select('*');
      setMembers(data || []);
    };
    fetchMembers();
  }, []);

  return (
    <div style={{ padding: '2rem', textAlign: 'center', direction: 'rtl', background: '#000', color: '#FFD700', minHeight: '100vh' }}>
      <h1>لوحة تحكم المالك</h1>
      <p>جيم العجمي — حيث يُبنى الإرث.</p>
      <hr style={{ margin: '2rem 0', border: '1px solid #FFD700' }} />

      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        {members.map((m) => (
          <div key={m.id} style={{ background: '#111', padding: '1rem', borderRadius: '8px' }}>
            <h3>{m.name}</h3>
            <p>الهاتف: {m.phone}</p>
            <p>آخر حضور: {m.last_attendance ? new Date(m.last_attendance).toLocaleString() : 'لم يحضر بعد'}</p>
            <p>عدد أيام الحضور: {m.attendance_days}</p>
            <p>الشارات: {m.legacy_badges?.join(', ') || 'لا يوجد'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
