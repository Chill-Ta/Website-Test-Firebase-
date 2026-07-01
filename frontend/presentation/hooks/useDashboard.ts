import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/domain/entities/user.entity";
import {
	getCurrentUserUseCase,
	logoutUseCase,
	fetchProfileUseCase,
	fetchUsersUseCase,
	fetchContactsUseCase,
	replyContactUseCase,
	authRepository,
} from "@/di";
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

  // States for fetching contact submissions
  const [contactsList, setContactsList] = useState<any[]>([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [contactsError, setContactsError] = useState("");

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

  async function fetchContactsList() {
    setContactsError("");
    setContactsLoading(true);
    try {
      const idToken = await authRepository.getIdToken();
      const list = await fetchContactsUseCase.execute(idToken);
      setContactsList(list);
    } catch (err: unknown) {
      setContactsError(sanitizeError(err, "admin"));
    } finally {
      setContactsLoading(false);
    }
  }

  async function replyToContact(id: string, status: string, reply: string) {
    try {
      const idToken = await authRepository.getIdToken();
      await replyContactUseCase.execute(idToken, id, status, reply);
      await fetchContactsList();
    } catch (err: unknown) {
      throw new Error(sanitizeError(err, "admin"));
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
    contactsList,
    contactsLoading,
    contactsError,
    fetchContactsList,
    replyToContact,
  };
}
