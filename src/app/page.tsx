"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"; // ✅ Asegúrate de que exista


export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [terminalLines, setTerminalLines] = useState<string[]>([
    "UT Social System v1.0.0",
    "Cybernetic Interface Initialized...",
    "Enter credentials to access the network...",
  ])

  const router = useRouter()
  const { toast } = useToast()

  const addTerminalLine = (line: string) => {
    setTerminalLines((prev) => [...prev, line])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      addTerminalLine(`> Attempting ${isLogin ? "login" : "registration"}...`);
  
      const endpoint = isLogin
        ? "http://localhost:8000/api/users/login"
        : "http://localhost:8000/api/users/register";
  
      let body;
  
      if (isLogin) {
        const formData = new URLSearchParams();
        formData.append("username", email); // FastAPI espera "username"
        formData.append("password", password);
        body = formData;
      } else {
        body = JSON.stringify({ email, username, password });
      }
  
      const headers = isLogin
        ? { "Content-Type": "application/x-www-form-urlencoded" }
        : { "Content-Type": "application/json" };
  
      const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body,
      });
  
      const data = await response.json();
  
      if (response.ok) {
        if (isLogin) {
          addTerminalLine("> Authentication successful");
          addTerminalLine("> Redirecting to secure network...");
  
          localStorage.setItem("user", JSON.stringify(data));
  
          setTimeout(() => {
            router.push("/feed");
          }, 1000);
        } else {
          addTerminalLine("> Registration successful");
          addTerminalLine("> Please login with your new credentials");
          setIsLogin(true);
        }
      } else {
        throw new Error(data.detail || "Authentication failed");
      }
    } catch (error) {
      addTerminalLine(`> ERROR: ${(error as Error).message}`);
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-black text-green-500 flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="ut-logo text-[40rem] font-bold text-green-900/10 absolute -top-40 -left-20 select-none">UT</div>
      </div>

      <div className="w-full max-w-md z-10">
        <div className="bg-black border-2 border-green-500 rounded-lg overflow-hidden shadow-[0_0_15px_rgba(0,255,0,0.5)]">
          <div className="bg-green-900/30 p-2 border-b border-green-500 flex items-center">
            <Terminal className="w-4 h-4 mr-2" />
            <div className="text-xs font-mono">UT_SOCIAL_TERMINAL</div>
          </div>

          <div className="p-4 font-mono text-sm">
            <div className="terminal-output h-60 overflow-y-auto mb-4">
              {terminalLines.map((line, i) => (
                <div key={i} className="mb-1">
                  {line.startsWith(">") ? <span className="text-blue-400">{line}</span> : line}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {!isLogin && (
                <div className="space-y-1">
                  <label className="text-xs block">USERNAME:</label>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-black border-green-500 text-green-500 focus:ring-green-500"
                    required
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs block">EMAIL:</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-black border-green-500 text-green-500 focus:ring-green-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs block">PASSWORD:</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-black border-green-500 text-green-500 focus:ring-green-500"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-green-900 hover:bg-green-800 text-green-500 border border-green-500"
                disabled={loading}
              >
                {loading ? "PROCESSING..." : isLogin ? "LOGIN" : "REGISTER"}
              </Button>

              <div className="text-center text-xs mt-2">
                <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-blue-400 hover:underline">
                  {isLogin ? "CREATE NEW ACCOUNT" : "BACK TO LOGIN"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

