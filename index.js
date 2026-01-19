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
    
    const { data, error } = await supabase
      .from('attendance')
      .insert([{ member_id: memberId }]);

    if (error) setMessage('خطأ: ' + error.message);
    else setMessage('تم تسجيل الحضور!');
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center', direction: 'rtl' }}>
      <h1>MTGym Legacy</h1>
      <h2>شاشة الاستقبال</h2>
      <input
        value={memberId}
        onChange={(e) => setMemberId(e.target.value)}
        placeholder="اكتب كود العضو (UUID)"
        style={{ padding: '0.5rem', fontSize: '1.2rem', margin: '1rem' }}
      />
      <br />
      <button
        onClick={handleAttendance}
        style={{
          padding: '0.7rem 2rem',
          fontSize: '1.2rem',
          background: '#000',
          color: '#FFD700',
          border: '2px solid #FFD700',
          cursor: 'pointer'
        }}
      >
        تسجيل حضور
      </button>
      <p>{message}</p>
    </div>
  );
}