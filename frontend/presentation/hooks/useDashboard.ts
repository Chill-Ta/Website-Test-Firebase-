import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/domain/entities/user.entity";
import { getCurrentUserUseCase, logoutUseCase, fetchProfileUseCase, fetchUsersUseCase } from "@/di";
import { sanitizeError } from "@/lib/error-helper";

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
      setFetchError(sanitizeError(err, "admin"));
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
      setUsersError(sanitizeError(err, "admin"));
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
