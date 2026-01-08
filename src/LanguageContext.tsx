
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'th';

interface Translations {
  [key: string]: {
    en: string;
    th: string;
  };
}

const translations: Translations = {
  // Navigation & General
  home: { en: 'Home', th: 'หน้าแรก' },
  project: { en: 'Project', th: 'โปรเจกต์' },
  template: { en: 'Template', th: 'เทมเพลต' },
  summary: { en: 'Summary', th: 'สรุป' },
  results: { en: 'Results', th: 'ผลลัพธ์' },
  result_detail: { en: 'Result Detail', th: 'รายละเอียดผลลัพธ์' },
  upgrade_plan: { en: 'Upgrade Plan', th: 'อัปเกรดแพ็กเกจ' },
  upgrade_desc: { en: 'Get unlimited summaries and advanced AI features.', th: 'รับสรุปไม่จำกัดและฟีเจอร์ AI ขั้นสูง' },
  upgrade_now: { en: 'Upgrade Now', th: 'อัปเกรดเลย' },
  search_placeholder: { en: 'Search...', th: 'ค้นหา...' },
  login_signin: { en: 'Login / Sign in', th: 'เข้าสู่ระบบ / ลงชื่อเข้าใช้' },
  
  // Home Page
  welcome_user: { en: 'Welcome back, User!', th: 'ยินดีต้อนรับกลับมา, คุณผู้ใช้!' },
  home_desc: { en: 'Capture and summarize your meetings with AI power.', th: 'บันทึกและสรุปการประชุมของคุณด้วยพลังของ AI' },
  video: { en: 'Video', th: 'วิดีโอ' },
  audio: { en: 'Audio', th: 'เสียง' },
  recent_work: { en: 'Recent Work', th: 'งานล่าสุด' },
  recent_work_desc: { en: 'Review your past summaries and notes.', th: 'ตรวจสอบสรุปและบันทึกย้อนหลังของคุณ' },
  view_all: { en: 'View All', th: 'ดูทั้งหมด' },
  uploading: { en: 'Uploading...', th: 'กำลังอัปโหลด...' },

  // Login Page
  welcome_back: { en: 'Welcome Back', th: 'ยินดีต้อนรับกลับมา' },
  login_desc: { en: 'Enter your credentials to access your meetings.', th: 'กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบ' },
  email: { en: 'Email', th: 'อีเมล' },
  password: { en: 'Password', th: 'รหัสผ่าน' },
  forgot_pass: { en: 'Forgot password?', th: 'ลืมรหัสผ่าน?' },
  login_btn: { en: 'Log in', th: 'เข้าสู่ระบบ' },
  or_continue: { en: 'Or continue with', th: 'หรือเข้าใช้ด้วย' },
  no_account: { en: "Don't have an account?", th: 'ยังไม่มีบัญชีใช่ไหม?' },
  signup_free: { en: 'Sign up for free', th: 'สมัครสมาชิกฟรี' },
  privacy: { en: 'Privacy Policy', th: 'นโยบายความเป็นส่วนตัว' },
  terms: { en: 'Terms of Service', th: 'ข้อกำหนดการใช้งาน' },
  help: { en: 'Help Center', th: 'ศูนย์ช่วยเหลือ' },

  // Template Gallery
  template_gallery: { en: 'Template Gallery', th: 'คลังเทมเพลต' },
  template_page_desc: { en: 'Choose from our professionally designed templates to get started quickly.', th: 'เลือกจากเทมเพลตที่ออกแบบโดยมืออาชีพเพื่อเริ่มต้นอย่างรวดเร็ว' },
  filter_all: { en: 'All Templates', th: 'เทมเพลตทั้งหมด' },
  filter_brainstorming: { en: 'Brainstorming', th: 'ระดมสมอง' },
  filter_weekly: { en: 'Weekly Sync', th: 'ประชุมประจำสัปดาห์' },
  filter_strategy: { en: 'Strategy', th: 'กลยุทธ์' },
  filter_client: { en: 'Client Meeting', th: 'ประชุมลูกค้า' },
  filter_agile: { en: 'Agile/Scrum', th: 'อะไจล์/สครัม' },
  use_template: { en: 'Use Template', th: 'ใช้เทมเพลต' },
  uses: { en: 'uses', th: 'ครั้ง' },
  popular: { en: 'Popular', th: 'ยอดนิยม' },
  new_badge: { en: 'New', th: 'ใหม่' },

  // Template Items
  tpl_mindmap: { en: 'Visual Mind Map', th: 'แผนผังความคิด' },
  tpl_mindmap_desc: { en: 'Organize complex ideas visually.', th: 'จัดระเบียบความคิดที่ซับซ้อนให้เห็นภาพ' },
  tpl_kanban: { en: 'Agile Kanban Board', th: 'กระดานคัมบัง' },
  tpl_kanban_desc: { en: 'Track progress and tasks.', th: 'ติดตามความคืบหน้าและงาน' },
  tpl_swot: { en: 'SWOT Analysis', th: 'การวิเคราะห์ SWOT' },
  tpl_swot_desc: { en: 'Analyze strengths and weaknesses.', th: 'วิเคราะห์จุดแข็งและจุดอ่อน' },
  tpl_timeline: { en: 'Project Timeline', th: 'ลำดับเวลาโครงการ' },
  tpl_timeline_desc: { en: 'Map out project milestones.', th: 'กำหนดเหตุการณ์สำคัญของโครงการ' },
  tpl_executive: { en: 'Executive Summary', th: 'บทสรุปผู้บริหาร' },
  tpl_executive_desc: { en: 'Professional summaries for stakeholders.', th: 'สรุปแบบมืออาชีพสำหรับผู้มีส่วนได้ส่วนเสีย' },
  tpl_roadmap: { en: 'Product Roadmap', th: 'แผนงานผลิตภัณฑ์' },
  tpl_roadmap_desc: { en: 'Plan your future product features.', th: 'วางแผนฟีเจอร์ผลิตภัณฑ์ในอนาคต' },

  // Canvas Editor
  canvas_title: { en: 'Creative Canvas', th: 'แคนวาสสร้างสรรค์' },
  canvas_desc: { en: 'Your visual playground. Select a tool from the left to start drawing, or use the Gemini AI bar below to generate concepts instantly.', th: 'พื้นที่สร้างสรรค์ของคุณ เลือกเครื่องมือด้านซ้ายเพื่อเริ่มวาด หรือใช้ Gemini AI เพื่อสร้างแนวคิดทันที' },
  properties: { en: 'Properties', th: 'คุณสมบัติ' },
  dimensions: { en: 'Dimensions', th: 'ขนาด' },
  width_short: { en: 'W', th: 'กว้าง' },
  height_short: { en: 'H', th: 'สูง' },
  appearance: { en: 'Appearance', th: 'ลักษณะ' },
  fill: { en: 'Fill', th: 'เติมสี' },
  stroke: { en: 'Stroke', th: 'เส้นขอบ' },
  typography: { en: 'Typography', th: 'ตัวอักษร' },
  regular: { en: 'Regular', th: 'ปกติ' },
  bold: { en: 'Bold', th: 'ตัวหนา' },
  need_help: { en: 'Need Help?', th: 'ต้องการความช่วยเหลือ?' },
  export: { en: 'Export', th: 'ส่งออก' },
  untitled: { en: 'Untitled Project', th: 'โปรเจกต์ไม่มีชื่อ' },
  
  // Tools
  select_title: { en: 'Select', th: 'เลือก' },
  shapes_title: { en: 'Shapes', th: 'รูปทรง' },
  connect_title: { en: 'Connect', th: 'เชื่อมต่อ' },
  pencil_title: { en: 'Pencil', th: 'ดินสอ' },
  text_title: { en: 'Text', th: 'ข้อความ' },
  icons_title: { en: 'Icons', th: 'ไอคอน' },
  images_title: { en: 'Images', th: 'รูปภาพ' },
  templates_title: { en: 'Templates', th: 'เทมเพลต' },

  // Projects Page
  all_projects: { en: 'All Projects', th: 'โปรเจกต์ทั้งหมด' },
  projects_desc: { en: 'Manage and organize your meeting summaries', th: 'จัดการและจัดระเบียบสรุปการประชุมของคุณ' },
  new_project: { en: 'New Project', th: 'สร้างโปรเจกต์ใหม่' },
  create_new_project: { en: 'Create New Project', th: 'สร้างโปรเจกต์ใหม่' },
  project_name_label: { en: 'Project Name', th: 'ชื่อโปรเจกต์' },
  project_name_placeholder: { en: 'e.g., Q4 Marketing Sync', th: 'เช่น ประชุมการตลาด Q4' },
  description_label: { en: 'Description (Optional)', th: 'รายละเอียด (ไม่บังคับ)' },
  cancel: { en: 'Cancel', th: 'ยกเลิก' },
  create: { en: 'Create Project', th: 'สร้างโปรเจกต์' },
  upload_title: { en: 'Upload file for AI Summary', th: 'อัปโหลดไฟล์สำหรับสรุปด้วย AI' },
  drag_drop: { en: 'Drag & drop or browse files', th: 'ลากและวาง หรือ เลือกไฟล์' },
  no_projects: { en: 'No Projects Yet', th: 'ยังไม่มีโปรเจกต์' },
  no_projects_desc: { en: 'Create your first project to start summarizing meetings.', th: 'สร้างโปรเจกต์แรกของคุณเพื่อเริ่มสรุปการประชุม' },
  get_started: { en: 'Get Started', th: 'เริ่มต้นใช้งาน' },
  sort_by: { en: 'Sort by', th: 'เรียงโดย' },
  view_mode: { en: 'View', th: 'มุมมอง' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
