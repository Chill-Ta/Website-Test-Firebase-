/**
 * แปลงข้อความ Error จาก API/Firebase กับผู้ใช้งานทั่วไป
 * แต่หากผู้ใช้งานมีบทบาทเป็น admin จะอนุญาตให้แสดงข้อความ Error ดิบเพื่อประโยชน์ในการตรวจสอบระบบ
 * 
 * @param err ข้อผิดพลาดที่ได้รับ
 * @param role บทบาทของผู้ใช้ปัจจุบัน ("admin" | "student")
 * @returns ข้อความภาษาไทยที่เป็นมิตรหรือข้อความดิบสำหรับแอดมิน
 */
export function sanitizeError(err: unknown, role?: string | null): string {
  if (!(err instanceof Error)) {
    return "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้";
  }

  const rawMessage = err.message;

  // หากเป็น Admin ให้แสดงข้อความ Error ดิบจาก API เสมอเพื่อสะดวกต่อการ Debug
  if (role === "admin") {
    return rawMessage;
  }

  // รายการข้อความที่เป็นมิตรกับผู้ใช้งานทั่วไปอยู่แล้ว (ภาษาไทย)
  const friendlyMessages = [
    "กรุณากรอก email และ password",
    "รูปแบบ email ไม่ถูกต้อง",
    "password ต้องมีอย่างน้อย 6 ตัวอักษร",
    "อีเมล์นี้มีบัญชีในระบบแล้ว",
    "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
    "ไม่พบบัญชีผู้ใช้นี้",
    "มีการพยายามเข้าสู่ระบบมากเกินไป กรุณารอสักครู่",
    "กรุณา login ก่อน",
    "คุณไม่มีสิทธิ์เข้าถึง",
    "สมัครสมาชิกสำเร็จ",
    "ไม่สามารถดึงข้อมูลได้"
  ];

  // ตรวจสอบคำสำคัญในข้อความ หากพบคีย์ภาษาไทยที่เป็นมิตร ให้ส่งกลับคำนั้นเลย
  for (const friendly of friendlyMessages) {
    if (rawMessage.includes(friendly)) {
      return friendly;
    }
  }

  // ตรวจสอบคีย์สากลของ Firebase Auth หรือ API Error ทั่วไปเพิ่มเติม
  if (rawMessage.includes("user-not-found")) {
    return "ไม่พบบัญชีผู้ใช้นี้";
  }
  if (rawMessage.includes("wrong-password") || rawMessage.includes("invalid-credential")) {
    return "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
  }
  if (rawMessage.includes("too-many-requests")) {
    return "มีการพยายามเข้าสู่ระบบมากเกินไป กรุณารอสักครู่";
  }
  if (rawMessage.includes("email-already-in-use") || rawMessage.includes("email-already-exists")) {
    return "อีเมล์นี้มีบัญชีในระบบแล้ว";
  }
  if (rawMessage.includes("network-request-failed") || rawMessage.includes("Failed to fetch")) {
    return "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาตรวจสอบอินเทอร์เน็ต";
  }

  // หากเป็นข้อความเทคนิค/ฐานข้อมูลอื่นๆ ให้แสดงข้อความทั่วไปเพื่อความปลอดภัย
  return "ระบบขัดข้อง กรุณาลองใหม่อีกครั้งในภายหลัง";
}
