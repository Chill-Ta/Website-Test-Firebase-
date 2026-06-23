import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/domain/entities/user.entity";
import { getCurrentUserUseCase, logoutUseCase, fetchProfileUseCase, fetchUsersUseCase } from "@/di";

export function useDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [protectedData, setProtectedData] = useState<string>("");
  const [fetchError, setFetchError] = useState("");
  const [fetchLoading, setFetchLoading] = useState(false);

  // States for fetching all users
  const [usersList, setUsersList] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState("");

  useEffect(() => {
    const unsubscribe = getCurrentUserUseCase.subscribe((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  async function handleLogout() {
    try {
      await logoutUseCase.execute();
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  }

  async function fetchProtectedData() {
    if (!user) return;

    setFetchError("");
    setFetchLoading(true);
    setProtectedData("");

    try {
      const data = await fetchProfileUseCase.execute();
      setProtectedData(JSON.stringify(data, null, 2));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFetchError(err.message);
      } else {
        setFetchError("ไม่สามารถเชื่อมต่อ Server ได้");
      }
    } finally {
      setFetchLoading(false);
    }
  }

  async function fetchUsersList() {
    setUsersError("");
    setUsersLoading(true);
    try {
      const list = await fetchUsersUseCase.execute();
      setUsersList(list);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setUsersError(err.message);
      } else {
        setUsersError("ไม่สามารถดึงข้อมูลรายชื่อผู้ใช้ได้");
      }
    } finally {
      setUsersLoading(false);
    }
  }

  return {
    user,
    loading,
    protectedData,
    fetchError,
    fetchLoading,
    handleLogout,
    fetchProtectedData,
    usersList,
    usersLoading,
    usersError,
    fetchUsersList,
  };
}
