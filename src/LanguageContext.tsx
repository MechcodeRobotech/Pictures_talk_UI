import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';

type Language = 'en' | 'th';

interface Translations {
  [key: string]: {
    en: string;
    th: string;
  };
}

const translations: Translations = {
  home: { en: 'Home', th: 'หน้าหลัก' },
  project: { en: 'Projects', th: 'โปรเจกต์' },
  template: { en: 'Templates', th: 'เทมเพลต' },
  summary: { en: 'Summary', th: 'สรุปผล' },
  canvas: { en: 'Canvas', th: 'แคนวาส' },
  results: { en: 'Results', th: 'ผลลัพธ์' },
  result_detail: { en: 'Result Detail', th: 'รายละเอียดผลลัพธ์' },
  upgrade_plan: { en: 'Upgrade Plan', th: 'อัปเกรดแพ็กเกจ' },
  upgrade_desc: { en: 'Get unlimited summaries and advanced AI features.', th: 'ปลดล็อกการสรุปไม่จำกัดและความสามารถ AI ขั้นสูง' },
  upgrade_now: { en: 'Upgrade Now', th: 'อัปเกรดตอนนี้' },
  search_placeholder: { en: 'Search...', th: 'ค้นหา...' },
  login_signin: { en: 'Login / Sign in', th: 'เข้าสู่ระบบ' },
  logout: { en: 'Log out', th: 'ออกจากระบบ' },

  welcome_user: { en: 'Turn every meeting into something usable.', th: 'เปลี่ยนทุกการประชุมให้พร้อมนำไปใช้ต่อได้ทันที' },
  home_desc: { en: 'Upload your recordings, generate AI summaries, and turn key ideas into shareable visuals in one workflow.', th: 'อัปโหลดไฟล์ประชุม สร้างสรุปด้วย AI และต่อยอดเป็นงานภาพที่พร้อมแชร์ได้ในเวิร์กโฟลว์เดียว' },
  home_badge: { en: 'AI meeting workspace', th: 'เวิร์กสเปซสรุปประชุมด้วย AI' },
  home_metric_speed: { en: 'Fast summary pipeline', th: 'สรุปผลได้รวดเร็ว' },
  home_metric_canvas: { en: 'Visual canvas included', th: 'มีแคนวาสสำหรับต่อยอดงานภาพ' },
  home_metric_bilingual: { en: 'English and Thai ready', th: 'พร้อมใช้งานทั้งไทยและอังกฤษ' },
  video: { en: 'Video', th: 'วิดีโอ' },
  audio: { en: 'Audio', th: 'เสียง' },
  recent_work: { en: 'Recent Work', th: 'งานล่าสุด' },
  recent_work_desc: { en: 'Open the latest summaries and continue where you left off.', th: 'เปิดสรุปล่าสุดและทำงานต่อจากจุดที่ค้างไว้' },
  view_all: { en: 'View All', th: 'ดูทั้งหมด' },
  uploading: { en: 'Uploading...', th: 'กำลังอัปโหลด...' },
  not_ready: { en: 'Not Ready', th: 'ยังไม่พร้อม' },
  ready: { en: 'Ready', th: 'พร้อมแล้ว' },
  summary_processing: { en: 'Generating summary. This can take a moment.', th: 'กำลังสร้างสรุป อาจใช้เวลาสักครู่' },
  summary_failed: { en: 'Failed to check summary status. Please try again.', th: 'ตรวจสอบสถานะสรุปไม่สำเร็จ กรุณาลองใหม่อีกครั้ง' },
  summary_not_found: { en: 'Meeting not found for this summary.', th: 'ไม่พบข้อมูลการประชุมสำหรับสรุปนี้' },

  welcome_back: { en: 'Welcome back', th: 'ยินดีต้อนรับกลับ' },
  login_desc: { en: 'Access your summaries, projects, and visual canvases from one secure workspace.', th: 'เข้าถึงสรุป โปรเจกต์ และงานแคนวาสของคุณจากเวิร์กสเปซเดียวที่ปลอดภัย' },
  login_feature_one: { en: 'Secure sign-in with Clerk and social auth', th: 'เข้าสู่ระบบอย่างปลอดภัยด้วย Clerk และ Social Auth' },
  login_feature_two: { en: 'Upload audio or video and track summary progress', th: 'อัปโหลดเสียงหรือวิดีโอและติดตามสถานะการสรุปได้ทันที' },
  login_feature_three: { en: 'Continue editing insights in the visual canvas', th: 'ต่อยอดอินไซต์ของคุณในแคนวาสได้ต่อเนื่อง' },
  email: { en: 'Email', th: 'อีเมล' },
  password: { en: 'Password', th: 'รหัสผ่าน' },
  forgot_pass: { en: 'Forgot password?', th: 'ลืมรหัสผ่าน?' },
  login_btn: { en: 'Log in', th: 'เข้าสู่ระบบ' },
  or_continue: { en: 'Or continue with', th: 'หรือเข้าสู่ระบบด้วย' },
  no_account: { en: "Don't have an account?", th: 'ยังไม่มีบัญชีใช่ไหม?' },
  signup_free: { en: 'Sign up for free', th: 'สมัครฟรี' },
  privacy: { en: 'Privacy Policy', th: 'นโยบายความเป็นส่วนตัว' },
  terms: { en: 'Terms of Service', th: 'ข้อกำหนดการใช้งาน' },
  help: { en: 'Help Center', th: 'ศูนย์ช่วยเหลือ' },
  footer_note: { en: 'Pictures Talk AI. All rights reserved.', th: 'Pictures Talk AI สงวนลิขสิทธิ์' },
  redirecting: { en: 'Redirecting...', th: 'กำลังเปลี่ยนเส้นทาง...' },

  signup_title: { en: 'Create your account', th: 'สร้างบัญชีของคุณ' },
  signup_desc: { en: 'Start turning recordings into AI summaries and presentation-ready visuals.', th: 'เริ่มเปลี่ยนไฟล์บันทึกให้เป็นสรุปด้วย AI และงานภาพที่พร้อมใช้งานจริง' },
  signup_verify_title: { en: 'Verify your email', th: 'ยืนยันอีเมลของคุณ' },
  signup_verify_desc: { en: 'Enter the verification code we sent to your email.', th: 'กรอกรหัสยืนยันที่ส่งไปยังอีเมลของคุณ' },
  signup_first_name: { en: 'First name', th: 'ชื่อ' },
  signup_last_name: { en: 'Last name', th: 'นามสกุล' },
  signup_terms_copy: { en: 'I agree to the Terms of Service and Privacy Policy.', th: 'ฉันยอมรับข้อกำหนดการใช้งานและนโยบายความเป็นส่วนตัว' },
  signup_terms_intro: { en: 'I agree to the', th: 'ฉันยอมรับ' },
  signup_terms_joiner: { en: 'and', th: 'และ' },
  signup_have_account: { en: 'Already have an account?', th: 'มีบัญชีอยู่แล้ว?' },
  signup_login: { en: 'Log in', th: 'เข้าสู่ระบบ' },
  signup_create_btn: { en: 'Create account', th: 'สร้างบัญชี' },
  signup_verify_btn: { en: 'Verify email', th: 'ยืนยันอีเมล' },
  signup_creating: { en: 'Creating account...', th: 'กำลังสร้างบัญชี...' },
  signup_verifying: { en: 'Verifying...', th: 'กำลังยืนยัน...' },
  signup_show_password: { en: 'Show password', th: 'แสดงรหัสผ่าน' },
  signup_hide_password: { en: 'Hide password', th: 'ซ่อนรหัสผ่าน' },
  signup_existing_account: { en: 'Already have an account?', th: 'มีบัญชีอยู่แล้ว?' },
  signup_forgot_password: { en: 'Forgot password?', th: 'ลืมรหัสผ่าน?' },

  forgot_title: { en: 'Forgot password?', th: 'ลืมรหัสผ่าน?' },
  forgot_request_desc: { en: 'Enter your email address and we will send you a verification code.', th: 'กรอกอีเมลของคุณ แล้วเราจะส่งรหัสยืนยันให้' },
  forgot_reset_desc: { en: 'Enter the code from your email and choose a new password.', th: 'กรอกรหัสจากอีเมล แล้วตั้งรหัสผ่านใหม่ของคุณ' },
  forgot_send_code: { en: 'Send reset code', th: 'ส่งรหัสรีเซ็ต' },
  forgot_sending: { en: 'Sending...', th: 'กำลังส่ง...' },
  forgot_reset_btn: { en: 'Reset password', th: 'รีเซ็ตรหัสผ่าน' },
  forgot_resetting: { en: 'Resetting...', th: 'กำลังรีเซ็ต...' },
  forgot_back_login: { en: 'Back to log in', th: 'กลับไปเข้าสู่ระบบ' },
  forgot_code: { en: 'Verification code', th: 'รหัสยืนยัน' },
  forgot_new_password: { en: 'New password', th: 'รหัสผ่านใหม่' },
  forgot_confirm_password: { en: 'Confirm password', th: 'ยืนยันรหัสผ่าน' },
  forgot_use_different_email: { en: 'Use a different email', th: 'ใช้อีเมลอื่น' },
  forgot_email_sent: { en: 'We sent a verification code to your email.', th: 'เราได้ส่งรหัสยืนยันไปยังอีเมลของคุณแล้ว' },

  template_gallery: { en: 'Template Gallery', th: 'คลังเทมเพลต' },
  template_page_desc: { en: 'Choose from our professionally designed templates to get started quickly.', th: 'เลือกใช้เทมเพลตที่ออกแบบอย่างเป็นระบบเพื่อเริ่มงานได้เร็วขึ้น' },
  filter_all: { en: 'All Templates', th: 'เทมเพลตทั้งหมด' },
  filter_brainstorming: { en: 'Brainstorming', th: 'ระดมความคิด' },
  filter_weekly: { en: 'Weekly Sync', th: 'ประชุมประจำสัปดาห์' },
  filter_strategy: { en: 'Strategy', th: 'กลยุทธ์' },
  filter_client: { en: 'Client Meeting', th: 'ประชุมลูกค้า' },
  filter_agile: { en: 'Agile/Scrum', th: 'Agile/Scrum' },
  use_template: { en: 'Use Template', th: 'ใช้เทมเพลต' },
  uses: { en: 'uses', th: 'ครั้ง' },
  popular: { en: 'Popular', th: 'ยอดนิยม' },
  new_badge: { en: 'New', th: 'ใหม่' },

  tpl_mindmap: { en: 'Visual Mind Map', th: 'แผนผังความคิด' },
  tpl_mindmap_desc: { en: 'Organize complex ideas visually.', th: 'จัดระเบียบแนวคิดที่ซับซ้อนให้เห็นภาพชัดเจน' },
  tpl_kanban: { en: 'Agile Kanban Board', th: 'บอร์ดงานแบบคัมบัง' },
  tpl_kanban_desc: { en: 'Track progress and tasks.', th: 'ติดตามงานและความคืบหน้าได้ชัดเจน' },
  tpl_swot: { en: 'SWOT Analysis', th: 'การวิเคราะห์ SWOT' },
  tpl_swot_desc: { en: 'Analyze strengths and weaknesses.', th: 'วิเคราะห์จุดแข็ง จุดอ่อน โอกาส และความเสี่ยง' },
  tpl_timeline: { en: 'Project Timeline', th: 'ไทม์ไลน์โปรเจกต์' },
  tpl_timeline_desc: { en: 'Map out project milestones.', th: 'จัดลำดับเหตุการณ์สำคัญของโปรเจกต์' },
  tpl_executive: { en: 'Executive Summary', th: 'บทสรุปผู้บริหาร' },
  tpl_executive_desc: { en: 'Professional summaries for stakeholders.', th: 'สรุปแบบมืออาชีพสำหรับผู้มีส่วนเกี่ยวข้อง' },
  tpl_roadmap: { en: 'Product Roadmap', th: 'โรดแมปผลิตภัณฑ์' },
  tpl_roadmap_desc: { en: 'Plan your future product features.', th: 'วางแผนฟีเจอร์ในอนาคตอย่างเป็นระบบ' },

  need_help: { en: 'Need help?', th: 'ต้องการความช่วยเหลือ?' },
  background: { en: 'Background', th: 'พื้นหลัง' },
  text_color: { en: 'Text Color', th: 'สีตัวอักษร' },
  stroke_color: { en: 'Stroke Color', th: 'สีเส้นขอบ' },
  custom: { en: 'Custom', th: 'กำหนดเอง' },
  apply: { en: 'Apply', th: 'นำไปใช้' },
  changing_text_color: { en: 'Changing text color', th: 'กำลังเปลี่ยนสีตัวอักษร' },
  changing_shape_stroke_color: { en: 'Changing shape fill color', th: 'กำลังเปลี่ยนสีของรูปทรง' },

  all_projects: { en: 'All Projects', th: 'โปรเจกต์ทั้งหมด' },
  projects_desc: { en: 'Manage and organize your meeting summaries', th: 'จัดการและจัดระเบียบสรุปการประชุมของคุณ' },
  new_project: { en: 'New Project', th: 'สร้างโปรเจกต์ใหม่' },
  create_new_project: { en: 'Create New Project', th: 'สร้างโปรเจกต์ใหม่' },
  project_name_label: { en: 'Project Name', th: 'ชื่อโปรเจกต์' },
  project_name_placeholder: { en: 'e.g., Q4 Marketing Sync', th: 'เช่น ประชุมการตลาด Q4' },
  description_label: { en: 'Description (Optional)', th: 'รายละเอียด (ไม่บังคับ)' },
  cancel: { en: 'Cancel', th: 'ยกเลิก' },
  create: { en: 'Create Project', th: 'สร้างโปรเจกต์' },
  upload_title: { en: 'Upload file for AI Summary', th: 'อัปโหลดไฟล์เพื่อสร้างสรุปด้วย AI' },
  drag_drop: { en: 'Drag and drop or browse files', th: 'ลากและวาง หรือเลือกไฟล์จากเครื่อง' },
  no_projects: { en: 'No projects yet', th: 'ยังไม่มีโปรเจกต์' },
  no_projects_desc: { en: 'Create your first project to start summarizing meetings.', th: 'สร้างโปรเจกต์แรกเพื่อเริ่มสรุปการประชุมของคุณ' },
  get_started: { en: 'Get Started', th: 'เริ่มต้นใช้งาน' },
  sort_by: { en: 'Sort by', th: 'เรียงตาม' },
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

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: (key: string) => translations[key]?.[language] || key,
    }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
