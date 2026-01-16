import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const EMPLOYEES = [
  { id: 1, name: 'رائد الحربي', position: 'مشرف' },
  { id: 2, name: 'ياسر حمود الخيبري', position: 'م/مشرف' },
  { id: 3, name: 'سلطان طلال يونس', position: 'فرد' },
  { id: 4, name: 'إبراهيم محمد الهويسة', position: 'فرد' },
  { id: 5, name: 'عبد الله عبد السلام التميمي', position: 'فرد' },
  { id: 6, name: 'عبد الرحمن عبدالعلام الفريشي', position: 'فرد' },
  { id: 7, name: 'عبدالله الشريف', position: 'فرد' },
  { id: 8, name: 'إبراهيم محمد مسلمي', position: 'فرد' },
  { id: 9, name: 'فارس منصور الجهني', position: 'فرد' },
  { id: 10, name: 'محمد علي الرويلي', position: 'فرد' },
];

async function seedDatabase() {
  try {
    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    console.log('✓ تم الاتصال بقاعدة البيانات');

    // Clear existing employees
    await connection.execute('DELETE FROM employees');
    console.log('✓ تم حذف الموظفين السابقين');

    // Insert new employees
    for (const employee of EMPLOYEES) {
      await connection.execute(
        'INSERT INTO employees (id, name, position, isActive, createdAt, updatedAt) VALUES (?, ?, ?, 1, NOW(), NOW())',
        [employee.id, employee.name, employee.position]
      );
    }
    console.log(`✓ تم إضافة ${EMPLOYEES.length} موظف إلى قاعدة البيانات`);

    // Verify
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM employees');
    console.log(`✓ إجمالي الموظفين في قاعدة البيانات: ${rows[0].count}`);

    await connection.end();
    console.log('✓ تم إغلاق الاتصال بنجاح');
  } catch (error) {
    console.error('❌ خطأ في تحميل البيانات:', error.message);
    process.exit(1);
  }
}

seedDatabase();
