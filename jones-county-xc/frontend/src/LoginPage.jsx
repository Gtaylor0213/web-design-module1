import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/useAuth"

function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const { login, loginError, loginPending } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      await login({ username, password })
      onLoginSuccess()
    } catch {
      // error captured in loginError
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white border border-gray-200 rounded-xl p-8 w-full max-w-sm shadow-lg animate-fade-in">
        <div className="text-center mb-6">
          <img src="/jc-logo.png" alt="Jones County logo" className="w-16 h-16 mx-auto mb-3" />
          <h1 className="text-2xl font-extrabold text-gray-900">Admin Login</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="mt-1"
            />
          </div>
          {loginError && (
            <p className="text-sm text-red-600 text-center">{loginError.message}</p>
          )}
          <Button type="submit" className="w-full cursor-pointer" disabled={loginPending}>
            {loginPending ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
