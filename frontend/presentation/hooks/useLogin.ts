import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { loginUseCase } from "@/di";

export function useLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await loginUseCase.execute(email, password);

      // Redirect ตาม role ที่ได้จาก backend
      if (result.role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/home");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        const message = err.message;
        if (message.includes("user-not-found")) {
          setError("ไม่พบบัญชีผู้ใช้นี้");
        } else if (message.includes("wrong-password") || message.includes("invalid-credential")) {
          setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        } else if (message.includes("too-many-requests")) {
          setError("มีการพยายามเข้าสู่ระบบมากเกินไป กรุณารอสักครู่");
        } else {
          setError(message);
        }
      } else {
        setError("เกิดข้อผิดพลาดที่ไม่คาดคิด");
      }
    } finally {
      setLoading(false);
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    handleSubmit,
  };
}

