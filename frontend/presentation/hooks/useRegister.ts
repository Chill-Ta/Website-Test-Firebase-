import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { registerUseCase } from "@/di";
import { sanitizeError } from "@/lib/error-helper";

export function useRegister() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    setLoading(true);

    try {
      const data = await registerUseCase.execute(email, password, role);
      setIsError(false);
      setMessage(data.message);
      setEmail("");
      setPassword("");
      setRole("student");
      
      // Redirect ไปหน้า home หลังสมัครสมาชิกสำเร็จ (หน่วงเวลา 1.5 วินาทีเพื่อให้ผู้ใช้เห็นข้อความสำเร็จ)
      setTimeout(() => {
        router.push("/home");
      }, 1500);
    } catch (err: unknown) {
      setIsError(true);
      setMessage(sanitizeError(err));
    } finally {
      setLoading(false);
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    role,
    setRole,
    message,
    isError,
    loading,
    handleSubmit,
  };
}
