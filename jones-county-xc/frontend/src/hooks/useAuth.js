import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"

export function useAuth() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      const res = await fetch("/api/auth/check")
      if (!res.ok) return { authenticated: false }
      return res.json()
    },
    staleTime: 5 * 60 * 1000,
  })

  const loginMutation = useMutation({
    mutationFn: async ({ username, password }) => {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
      if (!res.ok) throw new Error("Invalid credentials")
      return res.json()
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["auth"] }),
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await fetch("/api/logout", { method: "POST" })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] })
    },
  })

  return {
    isAuthenticated: data?.authenticated ?? false,
    isLoading,
    login: loginMutation.mutateAsync,
    loginError: loginMutation.error,
    loginPending: loginMutation.isPending,
    logout: logoutMutation.mutateAsync,
  }
}
