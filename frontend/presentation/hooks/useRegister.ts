import { useState, FormEvent } from "react";
import { registerUseCase } from "@/di";

export function useRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    setLoading(true);

    try {
      const data = await registerUseCase.execute(email, password);
      setIsError(false);
      setMessage(data.message);
      setEmail("");
      setPassword("");
    } catch (err: unknown) {
      setIsError(true);
      if (err instanceof Error) {
        setMessage(err.message);
      } else {
        setMessage("ไม่สามารถเชื่อมต่อ Server ได้");
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
    message,
    isError,
    loading,
    handleSubmit,
  };
}
