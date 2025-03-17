"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, ArrowLeft, Upload, Edit, Save, MessageSquare, Heart, Calendar, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"

// Types
interface UserType {
  id: string
  username: string
  email: string
  profilePicture?: string
  bio?: string
  joinDate?: string
}

interface PostType {
  id: string
  content: string
  career: string
  user: UserType
  attachments: Array<{
    fileId: string
    filename: string
    contentType: string
  }>
  createdAt: string
  commentCount: number
  reactionCount: number
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [posts, setPosts] = useState<PostType[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editedUsername, setEditedUsername] = useState("")
  const [editedBio, setEditedBio] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const router = useRouter()
  const { toast } = useToast()
  const isMobile = useMobile()

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/")
      return
    }

    const userData = JSON.parse(storedUser)
    // Add some mock profile data
    const enhancedUser = {
      ...userData,
      bio: "Cybersecurity specialist and AI enthusiast. Working on neural networks and machine learning algorithms for next-gen security systems.",
      joinDate: "2023-01-15T00:00:00Z",
    }

    setUser(enhancedUser)
    setEditedUsername(enhancedUser.username)
    setEditedBio(enhancedUser.bio || "")

    // Fetch user posts (simulated)
    setTimeout(() => {
      setPosts(generateMockUserPosts(enhancedUser))
      setIsLoading(false)
    }, 1000)
  }, [router])

  const handleSaveProfile = () => {
    if (!user) return

    const updatedUser = {
      ...user,
      username: editedUsername,
      bio: editedBio,
    }

    setUser(updatedUser)
    localStorage.setItem("user", JSON.stringify(updatedUser))
    setIsEditing(false)

    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    })
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-green-500 font-mono">Loading profile...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-black border-b border-green-500 sticky top-0 z-50 shadow-[0_0_10px_rgba(0,255,0,0.3)]">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => router.push("/feed")} className="mr-2 text-green-500">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-green-500 font-mono text-xl font-bold">PROFILE</h1>
          </div>

          {!isEditing ? (
            <Button variant="outline" className="border-green-500 text-green-500" onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleSaveProfile}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Profile header */}
        <div className="bg-black border border-green-500 rounded-lg overflow-hidden shadow-[0_0_10px_rgba(0,255,0,0.2)] mb-6">
          {/* Cover photo */}
          <div className="h-40 bg-gradient-to-r from-green-900/50 to-blue-900/50 relative">
            <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>

            {/* Profile picture */}
            <div className="absolute -bottom-12 left-6 w-24 h-24 rounded-full bg-green-900/50 border-4 border-black flex items-center justify-center">
              <User className="w-12 h-12 text-green-500" />

              {isEditing && (
                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center border-2 border-black">
                  <Upload className="w-4 h-4 text-white" />
                </button>
              )}
            </div>
          </div>

          {/* Profile info */}
          <div className="pt-16 pb-6 px-6">
            {!isEditing ? (
              <>
                <h2 className="text-2xl font-bold text-green-500 font-mono">{user.username}</h2>
                <p className="text-gray-400 mb-4">{user.email}</p>

                <div className="flex items-center text-sm text-gray-400 mb-4">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Joined {new Date(user.joinDate || "").toLocaleDateString()}</span>
                </div>

                <p className="text-gray-300 border-l-2 border-green-500 pl-4 py-1">{user.bio}</p>
              </>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-mono text-green-500 mb-1">Username</label>
                  <Input
                    value={editedUsername}
                    onChange={(e) => setEditedUsername(e.target.value)}
                    className="bg-gray-900 border-green-500 text-gray-100 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-mono text-green-500 mb-1">Bio</label>
                  <Textarea
                    value={editedBio}
                    onChange={(e) => setEditedBio(e.target.value)}
                    className="bg-gray-900 border-green-500 text-gray-100 focus:ring-green-500"
                    rows={4}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* User posts */}
        <div>
          <h3 className="text-xl font-mono text-green-500 mb-4">Your Posts</h3>

          {isLoading ? (
            <div className="text-center py-10">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-500 border-r-transparent"></div>
              <div className="mt-4 text-green-500 font-mono">Loading posts...</div>
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-black border border-green-500 rounded-lg p-6 text-center">
              <div className="text-green-500 font-mono mb-2">No posts yet</div>
              <p className="text-gray-400 text-sm">
                You haven't created any posts yet. Head to the feed to share something!
              </p>
              <Button className="mt-4 bg-green-600 hover:bg-green-700 text-white" onClick={() => router.push("/feed")}>
                Go to Feed
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-black border border-green-500 rounded-lg overflow-hidden shadow-[0_0_10px_rgba(0,255,0,0.2)]"
                >
                  {/* Post header */}
                  <div className="p-4 border-b border-green-500/30">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-green-900/30 flex items-center justify-center border border-green-500">
                        <User className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <div className="font-mono text-green-500">{post.user.username}</div>
                        <div className="text-xs text-gray-400 flex items-center">
                          <span>{new Date(post.createdAt).toLocaleString()}</span>
                          <span className="mx-1">•</span>
                          <div className="flex items-center text-blue-400">
                            <Briefcase className="w-3 h-3 mr-1" />
                            {post.career}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Post content */}
                  <div className="p-4">
                    <p className="whitespace-pre-line mb-4">{post.content}</p>

                    {post.attachments.length > 0 && (
                      <div className="border border-green-500/30 rounded bg-gray-900/50 p-2 mb-4">
                        {post.attachments.map((attachment) => (
                          <div key={attachment.fileId} className="flex items-center text-sm text-blue-400">
                            <Upload className="w-4 h-4 mr-2" />
                            {attachment.filename}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Post actions */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-green-500/30">
                      <div className="flex items-center text-green-500">
                        <Heart className="w-4 h-4 mr-1" />
                        <span className="text-sm">{post.reactionCount}</span>
                      </div>

                      <div className="flex items-center text-green-500">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        <span className="text-sm">{post.commentCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

// Mock data generator
function generateMockUserPosts(user: UserType): PostType[] {
  return [
    {
      id: "userpost1",
      content:
        "Just published my research on quantum-resistant encryption algorithms. Check out the paper! #Cybersecurity #QuantumComputing",
      career: "Software Development",
      user: user,
      attachments: [
        {
          fileId: "file1",
          filename: "quantum_encryption_paper.pdf",
          contentType: "application/pdf",
        },
      ],
      createdAt: "2023-05-10T14:30:00Z",
      commentCount: 8,
      reactionCount: 15,
    },
    {
      id: "userpost2",
      content:
        "Working on a new neural network architecture for real-time threat detection. Here's a preview of the results so far. #AI #MachineLearning #Security",
      career: "Software Development",
      user: user,
      attachments: [
        {
          fileId: "file2",
          filename: "neural_network_results.png",
          contentType: "image/png",
        },
        {
          fileId: "file3",
          filename: "code_sample.py",
          contentType: "text/plain",
        },
      ],
      createdAt: "2023-05-05T09:15:00Z",
      commentCount: 12,
      reactionCount: 23,
    },
    {
      id: "userpost3",
      content:
        "Gave a guest lecture today on ethical hacking and penetration testing. Thanks to everyone who attended! The slides are attached for those who missed it. #EthicalHacking #CyberSecurity #Education",
      career: "Software Development",
      user: user,
      attachments: [
        {
          fileId: "file4",
          filename: "ethical_hacking_slides.pdf",
          contentType: "application/pdf",
        },
      ],
      createdAt: "2023-04-28T16:45:00Z",
      commentCount: 5,
      reactionCount: 19,
    },
  ]
}

