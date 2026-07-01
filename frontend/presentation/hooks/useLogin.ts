import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { loginUseCase } from "@/di";
import { sanitizeError } from "@/lib/error-helper";

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

      // Redirect ไปหน้า home เสมอเมื่อ login สำเร็จ
      router.push("/home");
    } catch (err: unknown) {
      setError(sanitizeError(err));
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

