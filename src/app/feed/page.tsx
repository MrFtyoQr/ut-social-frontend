"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, MessageSquare, Heart, Upload, LogOut, Menu, X, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"

// Types
interface UserType {
  id: string
  username: string
  email: string
  profilePicture?: string
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

interface CommentType {
  id: string
  content: string
  user: UserType
  createdAt: string
}

// Career options
const CAREERS = ["All", "Software Development", "Business Development", "Industrial Maintenance", "Gastronomy"]

export default function FeedPage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [posts, setPosts] = useState<PostType[]>([])
  const [newPostContent, setNewPostContent] = useState("")
  const [selectedCareer, setSelectedCareer] = useState("All")
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  const [comments, setComments] = useState<CommentType[]>([])
  const [newComment, setNewComment] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
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

    setUser(JSON.parse(storedUser))

    // Fetch posts (simulated)
    setTimeout(() => {
      setPosts(generateMockPosts())
      setIsLoading(false)
    }, 1000)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return

    const newPost: PostType = {
      id: `post-${Date.now()}`,
      content: newPostContent,
      career: selectedCareer === "All" ? "Software Development" : selectedCareer,
      user: user!,
      attachments: [],
      createdAt: new Date().toISOString(),
      commentCount: 0,
      reactionCount: 0,
    }

    setPosts([newPost, ...posts])
    setNewPostContent("")

    toast({
      title: "Post created",
      description: "Your post has been published successfully.",
    })
  }

  const handleViewComments = (postId: string) => {
    setSelectedPostId(postId)
    // Simulate fetching comments
    setComments(generateMockComments())
  }

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedPostId) return

    const newCommentObj: CommentType = {
      id: `comment-${Date.now()}`,
      content: newComment,
      user: user!,
      createdAt: new Date().toISOString(),
    }

    setComments([...comments, newCommentObj])
    setNewComment("")

    // Update comment count on post
    setPosts(
      posts.map((post) => (post.id === selectedPostId ? { ...post, commentCount: post.commentCount + 1 } : post)),
    )
  }

  const handleReaction = (postId: string) => {
    // Update reaction count on post
    setPosts(posts.map((post) => (post.id === postId ? { ...post, reactionCount: post.reactionCount + 1 } : post)))
  }

  const handleFilterByCareer = (career: string) => {
    setSelectedCareer(career)
    // In a real app, this would fetch filtered posts from the API
  }

  const filteredPosts = selectedCareer === "All" ? posts : posts.filter((post) => post.career === selectedCareer)

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-black border-b border-green-500 sticky top-0 z-50 shadow-[0_0_10px_rgba(0,255,0,0.3)]">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-green-500 font-mono text-xl font-bold">UT_SOCIAL</h1>
          </div>

          {!isMobile && (
            <div className="flex space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-green-500 text-green-500">
                    <Filter className="w-4 h-4 mr-2" />
                    {selectedCareer}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {CAREERS.map((career) => (
                    <DropdownMenuItem
                      key={career}
                      onClick={() => handleFilterByCareer(career)}
                      className={selectedCareer === career ? "bg-green-900/30" : ""}
                    >
                      {career}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                className="border-green-500 text-green-500"
                onClick={() => router.push("/profile")}
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>

              <Button variant="outline" className="border-red-500 text-red-500" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          )}

          {isMobile && (
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(true)} className="text-green-500">
              <Menu className="w-6 h-6" />
            </Button>
          )}
        </div>
      </header>

      {/* Mobile menu */}
      {isMobile && isMenuOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col p-4">
          <div className="flex justify-end">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)} className="text-green-500">
              <X className="w-6 h-6" />
            </Button>
          </div>

          <div className="flex flex-col space-y-4 items-center justify-center flex-1">
            <div className="text-green-500 font-mono text-2xl font-bold mb-8">UT_SOCIAL</div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-full bg-green-900/30 border border-green-500 text-green-500">
                  <Filter className="w-4 h-4 mr-2" />
                  {selectedCareer}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {CAREERS.map((career) => (
                  <DropdownMenuItem
                    key={career}
                    onClick={() => {
                      handleFilterByCareer(career)
                      setIsMenuOpen(false)
                    }}
                  >
                    {career}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              className="w-full bg-green-900/30 border border-green-500 text-green-500"
              onClick={() => {
                router.push("/profile")
                setIsMenuOpen(false)
              }}
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>

            <Button className="w-full bg-red-900/30 border border-red-500 text-red-500" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left sidebar - only on desktop */}
        {!isMobile && (
          <div className="hidden lg:block">
            <div className="bg-black border border-green-500 rounded-lg p-4 sticky top-24">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-green-900/30 flex items-center justify-center border border-green-500">
                  <User className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <div className="font-mono text-green-500">{user?.username}</div>
                  <div className="text-xs text-gray-400">{user?.email}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs uppercase text-gray-500 font-mono mb-2">Navigation</div>

                <Button
                  variant="ghost"
                  className="w-full justify-start text-green-500 hover:bg-green-900/30"
                  onClick={() => router.push("/feed")}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Feed
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-start text-green-500 hover:bg-green-900/30"
                  onClick={() => router.push("/profile")}
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-500 hover:bg-red-900/30"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Create post */}
          <div className="bg-black border border-green-500 rounded-lg p-4 mb-6 shadow-[0_0_10px_rgba(0,255,0,0.2)]">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-green-900/30 flex items-center justify-center border border-green-500" />
              <User className="w-5 h-5 text-green-500" />
            </div>

            <div className="flex-1">
              <Textarea
                placeholder="Share something with the network..."
                className="bg-gray-900 border-green-500 text-gray-100 focus:ring-green-500 mb-3"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
              />

              <div className="flex justify-between items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="border-green-500 text-green-500">
                      <Filter className="w-4 h-4 mr-2" />
                      {selectedCareer === "All" ? "Select Career" : selectedCareer}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {CAREERS.filter((c) => c !== "All").map((career) => (
                      <DropdownMenuItem key={career} onClick={() => setSelectedCareer(career)}>
                        {career}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="border-green-500 text-green-500">
                    <Upload className="w-4 h-4 mr-2" />
                    Attach
                  </Button>

                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleCreatePost}
                    disabled={!newPostContent.trim()}
                  >
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Posts list */}
          {isLoading ? (
            <div className="text-center py-10">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-500 border-r-transparent"></div>
              <div className="mt-4 text-green-500 font-mono">Loading feed data...</div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="bg-black border border-green-500 rounded-lg p-6 text-center">
              <div className="text-green-500 font-mono mb-2">No posts found</div>
              <p className="text-gray-400 text-sm">
                {selectedCareer === "All"
                  ? "Be the first to post something!"
                  : `No posts found for ${selectedCareer}. Try another category or create a post.`}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredPosts.map((post) => (
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
                          <span className="text-blue-400">{post.career}</span>
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
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-green-500 hover:bg-green-900/30"
                        onClick={() => handleReaction(post.id)}
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        {post.reactionCount > 0 && post.reactionCount}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-green-500 hover:bg-green-900/30"
                        onClick={() => handleViewComments(post.id)}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        {post.commentCount > 0 && post.commentCount}
                      </Button>
                    </div>
                  </div>

                  {/* Comments section */}
                  {selectedPostId === post.id && (
                    <div className="bg-gray-900 border-t border-green-500/30 p-4">
                      <h3 className="text-sm font-mono text-green-500 mb-4">Comments</h3>

                      {/* Comments list */}
                      <div className="space-y-4 mb-4 max-h-60 overflow-y-auto">
                        {comments.length === 0 ? (
                          <div className="text-gray-400 text-sm text-center py-2">
                            No comments yet. Be the first to comment!
                          </div>
                        ) : (
                          comments.map((comment) => (
                            <div key={comment.id} className="flex space-x-3">
                              <div className="w-8 h-8 rounded-full bg-green-900/30 flex items-center justify-center border border-green-500 flex-shrink-0">
                                <User className="w-4 h-4 text-green-500" />
                              </div>
                              <div className="flex-1">
                                <div className="bg-black border border-green-500/30 rounded-lg p-3">
                                  <div className="font-mono text-green-500 text-xs mb-1">{comment.user.username}</div>
                                  <p className="text-sm">{comment.content}</p>
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                  {new Date(comment.createdAt).toLocaleString()}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Add comment */}
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Write a comment..."
                          className="bg-black border-green-500 text-gray-100 focus:ring-green-500"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                        />
                        <Button
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={handleAddComment}
                          disabled={!newComment.trim()}
                        >
                          Send
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

// Mock data generators
function generateMockPosts(): PostType[] {
  const mockUser: UserType = {
    id: "user123",
    username: "cyberhacker",
    email: "cyber@example.com",
  }

  return [
    {
      id: "post1",
      content:
        "Just finished implementing a new neural network algorithm for our cybersecurity project. The results are promising! #CyberUT #AI",
      career: "Software Development",
      user: mockUser,
      attachments: [
        {
          fileId: "file1",
          filename: "neural_network.pdf",
          contentType: "application/pdf",
        },
      ],
      createdAt: "2023-05-15T10:30:00Z",
      commentCount: 3,
      reactionCount: 5,
    },
    {
      id: "post2",
      content:
        "Our team is looking for students interested in joining the robotics competition next month. DM me if you're interested! #Robotics #UTEngineering",
      career: "Industrial Maintenance",
      user: {
        id: "user456",
        username: "robotmaster",
        email: "robot@example.com",
      },
      attachments: [],
      createdAt: "2023-05-14T15:45:00Z",
      commentCount: 7,
      reactionCount: 12,
    },
    {
      id: "post3",
      content:
        "Check out our new business model canvas for the startup incubator program. Feedback welcome! #BusinessDev #Entrepreneurship",
      career: "Business Development",
      user: {
        id: "user789",
        username: "bizwhiz",
        email: "business@example.com",
      },
      attachments: [
        {
          fileId: "file2",
          filename: "business_model.png",
          contentType: "image/png",
        },
      ],
      createdAt: "2023-05-13T09:15:00Z",
      commentCount: 4,
      reactionCount: 8,
    },
    {
      id: "post4",
      content:
        "Just created a fusion dish combining traditional Mexican cuisine with Japanese influences. Here's the recipe and presentation! #Gastronomy #FusionCuisine",
      career: "Gastronomy",
      user: {
        id: "user101",
        username: "chefcreative",
        email: "chef@example.com",
      },
      attachments: [
        {
          fileId: "file3",
          filename: "fusion_dish.jpg",
          contentType: "image/jpeg",
        },
        {
          fileId: "file4",
          filename: "recipe.pdf",
          contentType: "application/pdf",
        },
      ],
      createdAt: "2023-05-12T18:20:00Z",
      commentCount: 9,
      reactionCount: 15,
    },
  ]
}

function generateMockComments(): CommentType[] {
  return [
    {
      id: "comment1",
      content: "This is amazing! Can you share more details about the implementation?",
      user: {
        id: "user456",
        username: "techgeek",
        email: "tech@example.com",
      },
      createdAt: "2023-05-15T11:00:00Z",
    },
    {
      id: "comment2",
      content: "I've been working on something similar. Let's collaborate!",
      user: {
        id: "user789",
        username: "airesearcher",
        email: "ai@example.com",
      },
      createdAt: "2023-05-15T11:30:00Z",
    },
    {
      id: "comment3",
      content: "Great work! The university should feature this in the next tech showcase.",
      user: {
        id: "user101",
        username: "proftech",
        email: "professor@example.com",
      },
      createdAt: "2023-05-15T12:15:00Z",
    },
  ]
}

