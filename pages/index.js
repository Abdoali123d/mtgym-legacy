import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const [memberId, setMemberId] = useState('');
  const [message, setMessage] = useState('');

  const handleAttendance = async () => {
    if (!memberId) return setMessage('اكتب كود العضو');

    try {
      const { error } = await supabase
        .from('attendance')
        .insert([{ member_id: memberId }]);

      if (error) throw error;

      await supabase
        .from('members')
        .update({ last_attendance: new Date().toISOString() })
        .eq('id', memberId);

      setMessage('✅ تم تسجيل الحضور!');
    } catch (err) {
      setMessage('❌ خطأ: ' + err.message);
    }
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center', direction: 'rtl', background: '#000', color: '#FFD700', minHeight: '100vh' }}>
      <h1>MTGym Legacy</h1>
      <p>جيم العجمي — حيث يُبنى الإرث.</p>
      <hr style={{ margin: '2rem 0', border: '1px solid #FFD700' }} />
      <input
        value={memberId}
        onChange={(e) => setMemberId(e.target.value)}
        placeholder="اكتب كود العضو (UUID)"
        style={{
          padding: '0.5rem',
          fontSize: '1.2rem',
          margin: '1rem',
          width: '300px',
          background: '#111',
          color: '#fff',
          border: '2px solid #FFD700'
        }}
      />
      <br />
      <button
        onClick={handleAttendance}
        style={{
          padding: '0.7rem 2rem',
          fontSize: '1.2rem',
          background: '#FFD700',
          color: '#000',
          border: 'none',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        تسجيل حضور
      </button>
      <p style={{ marginTop: '2rem', fontSize: '1.1rem' }}>{message}</p>
    </div>
  );
}
