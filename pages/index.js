import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import QRCode from 'qrcode.react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const [memberId, setMemberId] = useState('');
  const [message, setMessage] = useState('');
  const [members, setMembers] = useState([]);

  // جلب الأعضاء عند التحميل
  useEffect(() => {
    const fetchMembers = async () => {
      const { data } = await supabase.from('members').select('id, name');
      setMembers(data || []);
    };
    fetchMembers();
  }, []);

  const handleAttendance = async () => {
    if (!memberId) return setMessage('اختر عضو من القائمة');

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
      setMemberId('');
    } catch (err) {
      setMessage('❌ خطأ: ' + err.message);
    }
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center', direction: 'rtl', background: '#000', color: '#FFD700', minHeight: '100vh' }}>
      <h1>MTGym Legacy</h1>
<p><a href="/admin" style={{ color: '#FFD700', textDecoration: 'underline' }}>لوحة تحكم المالك</a></p>
      <p>شاشة الاستقبال</p>
      <hr style={{ margin: '2rem 0', border: '1px solid #FFD700' }} />

      {/* اختيار العضو */}
      <select
        value={memberId}
        onChange={(e) => setMemberId(e.target.value)}
        style={{
          padding: '0.5rem',
          fontSize: '1.2rem',
          margin: '1rem',
          width: '300px',
          background: '#111',
          color: '#fff',
          border: '2px solid #FFD700'
        }}
      >
        <option value="">اختر عضو...</option>
        {members.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>

      <br />
      <button
        onClick={handleAttendance}
        disabled={!memberId}
        style={{
          padding: '0.7rem 2rem',
          fontSize: '1.2rem',
          background: memberId ? '#FFD700' : '#333',
          color: '#000',
          border: 'none',
          cursor: memberId ? 'pointer' : 'not-allowed',
          fontWeight: 'bold'
        }}
      >
        تسجيل حضور
      </button>

      <p style={{ marginTop: '2rem', fontSize: '1.1rem' }}>{message}</p>

      {/* QR Codes للأعضاء */}
      <div style={{ marginTop: '3rem' }}>
        <h2>QR Codes للأعضاء</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem', marginTop: '1rem' }}>
          {members.map((m) => (
            <div key={m.id} style={{ textAlign: 'center' }}>
              <div>{m.name}</div>
              <QRCode value={m.id} size={120} bgColor="#000" fgColor="#FFD700" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
