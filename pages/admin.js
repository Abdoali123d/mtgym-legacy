import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// إعدادات Supabase (تأكد إنها صحيحة)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// التحقق من وجود المتغيرات
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Key not found!');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AdminDashboard() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { data, error } = await supabase
          .from('members')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        setMembers(data || []);
      } catch (err) {
        console.error('Error fetching members:', err);
        setError('فشل تحميل البيانات. تأكد من إعدادات Supabase.');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  return (
    <div style={{ padding: '2rem', textAlign: 'center', direction: 'rtl', background: '#000', color: '#FFD700', minHeight: '100vh' }}>
      <h1>لوحة تحكم المالك</h1>
      <p>MTGym Legacy — جيم العجمي</p>
      <hr style={{ margin: '2rem 0', border: '1px solid #FFD700' }} />

      {loading && <p>جارٍ تحميل البيانات...</p>}
      {error && <p style={{ color: '#ff6b6b' }}>{error}</p>}

      {members.length === 0 && !loading && !error && (
        <div style={{ marginTop: '2rem' }}>
          <p>لا يوجد أعضاء بعد.</p>
          <p>اذهب إلى <a href="/add-member" style={{ color: '#FFD700', textDecoration: 'underline' }}>إضافة عضو</a> أو استخدم SQL في Supabase.</p>
        </div>
      )}

      {members.length > 0 && (
        <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', marginTop: '2rem' }}>
          {members.map((member) => (
            <div key={member.id} style={{ background: '#111', padding: '1.2rem', borderRadius: '12px', border: '1px solid #333' }}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#FFD700' }}>{member.name}</h3>
              <p><strong>الهاتف:</strong> {member.phone || 'غير متوفر'}</p>
              <p><strong>تاريخ التسجيل:</strong> {new Date(member.created_at).toLocaleDateString('ar-EG')}</p>
              <p><strong>آخر حضور:</strong> {member.last_attendance ? new Date(member.last_attendance).toLocaleString('ar-EG') : 'لم يحضر بعد'}</p>
              <p><strong>أيام الحضور:</strong> {member.attendance_days || 0}</p>
              <p><strong>الشارات:</strong> {member.legacy_badges?.length > 0 ? member.legacy_badges.join(', ') : 'لا يوجد'}</p>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '3rem' }}>
        <a href="/" style={{ color: '#FFD700', textDecoration: 'underline' }}>← العودة لشاشة الاستقبال</a>
      </div>
    </div>
  );
}
