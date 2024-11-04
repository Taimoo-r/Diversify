import React, { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  ThumbsUp,
  MessageCircle,
  Share2,
  X,
  MoreVertical,
  UserPlus,
  UserMinus,
  Bell,
  Bookmark,
  AlertTriangle,
  AlertOctagonIcon,
  Heart,
  Send,
  Home,
  Search,
  PlusSquare,
  PlaySquare,
  User,
} from "lucide-react";
import { useUserContext } from "@/userContext";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@radix-ui/react-dropdown-menu";
import { Link } from "react-router-dom";

export default function Component() {
  const { userData } = useUserContext();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ content: "", media: null });
  const [newComments, setNewComments] = useState({});
  const fileInputRef = useRef(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleNewPostChange = (e) => {
    setNewPost({ ...newPost, content: e.target.value });
  };

  const handleMediaUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const mediaType = file.type.startsWith("image/") ? "image" : "video";
        setNewPost({
          ...newPost,
          media: {
            type: mediaType,
            url: reader.result,
          },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveMedia = () => {
    setNewPost({ ...newPost, media: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePost = async () => {
    if (newPost.content.trim() || newPost.media) {
      const formData = new FormData();
      formData.append("text", newPost.content);

      if (newPost.media) {
        const blob = await fetch(newPost.media.url).then((r) => r.blob());
        formData.append("file", blob, "media-file");
      }

      try {
        const response = await fetch(
          "https://engineers-verse-back.vercel.app/api/v1/post/create",
          {
            method: "POST",
            body: formData,
            headers: {
              authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        const data = await response.json();
        console.log(data.post);

        if (response.ok) {
          toast.success("Post Created Successfully", {
            autoClose: 3000,
          });

          setPosts((prevPosts) => [data.post, ...prevPosts]);
        } else {
          throw new Error(data.message || "Failed to create post");
        }
      } catch (error) {
        toast.error("Error creating post", {
          autoClose: 3000,
        });
      }

      setNewPost({ content: "", media: null });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleLike = (postId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              isLiked: !post.isLiked,
            }
          : post
      )
    );
  };

  const handleCommentChange = (postId, content) => {
    setNewComments({ ...newComments, [postId]: content });
  };

  const handleAddComment = (postId) => {
    const commentContent = newComments[postId];
    if (commentContent?.trim()) {
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: [
                  ...post.comments,
                  {
                    id: post.comments.length + 1,
                    user: userData.fullName,
                    content: commentContent.trim(),
                  },
                ],
              }
            : post
        )
      );
      setNewComments({ ...newComments, [postId]: "" });
    }
  };

  const handleShare = (postId) => {
    console.log(`Sharing post ${postId}`);
    alert(`Sharing post ${postId}`);
  };

  useEffect(() => {
    const getAllPostsForFeed = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const id = localStorage.getItem("_id");
        const response = await axios.get(
          `https://engineers-verse-back.vercel.app/api/v1/post/feed/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const sortedPosts = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setPosts(sortedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    getAllPostsForFeed();

    const intervalId = setInterval(() => {
      getAllPostsForFeed();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const handleImageClick = (src) => {
    setModalImageSrc(src);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setZoomLevel(1);
  };

  return (
    <main className="flex w-full flex-col overflow-hidden">
      <ToastContainer />
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
          <div className="relative p-4">
            <Button
              onClick={closeModal}
              className="absolute top-5 p-1 justify-center self-center items-center text-red-800 right-8 hover:bg-white hover:rounded text-4xl font-bold"
            >
              &times;
            </Button>
            <img
              src={modalImageSrc}
              alt="Expanded content"
              className="rounded-lg max-h-[90vh] w-auto object-contain"
            />
          </div>
        </div>
      )}

      {/* Desktop View */}
      <div className="hidden md:block">
        <ScrollArea className="h-[calc(100vh-3.5rem)]">
          <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">
                Welcome back,{" "}
                <span className="bg-gradient-to-br from-red-300 to-indigo-600 bg-clip-text text-transparent text-4xl font-bold">
                  {userData.fullName}
                </span>
              </h2>
            </div>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Create a Post</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Share your thoughts, ideas, or questions..."
                    value={newPost.content}
                    onChange={handleNewPostChange}
                    className="mb-4"
                  />
                  {newPost.media ? (
                    <div className="relative mb-4">
                      {newPost.media.type === "image" ? (
                        <img
                          src={newPost.media.url}
                          alt="Uploaded content"
                          className="max-h-64 w-full object-cover rounded-md"
                        />
                      ) : (
                        <video
                          src={newPost.media.url}
                          controls
                          className="max-h-64 w-full rounded-md"
                        />
                      )}
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={handleRemoveMedia}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <Input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleMediaUpload}
                        ref={fileInputRef}
                        id="media-upload"
                      />
                    </div>
                  )}
                  <div className="flex justify-end">
                    <Button onClick={handlePost}>Post</Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Activity Feed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <Card key={post.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Avatar className="h-12 w-12 mr-2">
                                <AvatarImage
                                  src={
                                    post?.user?.avatar ||
                                    `/placeholder.svg?height=32&width=32&text=${post?.user?.fullName}`
                                  }
                                />
                                <AvatarFallback>
                                  {post?.user?.fullName[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <CardTitle className="text-sm">
                                  {post.user.fullName}
                                </CardTitle>
                                <p className="text-xs text-muted-foreground">
                                  Posted{" "}
                                  {formatDistanceToNow(
                                    new Date(post.createdAt)
                                  )}{" "}
                                  ago
                                </p>
                              </div>
                            </div>
                            <div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-5 w-5" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="p-3 bg-white shadow-md rounded-md"
                                >
                                  <DropdownMenuItem className="flex items-center gap-2 m-2 space-x-2">
                                    <UserPlus className="h-4 w-4 text-blue-400" />
                                    <span className="text-blue-400">
                                      Follow
                                    </span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="flex items-center space-x-2 gap-2 m-2 text-red-500">
                                    <UserMinus className="h-4 w-4" />
                                    <span>UnFollow</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="flex items-center space-x-2 gap-2 m-2">
                                    <Bell className="h-4 w-4" />
                                    <span>Mute notifications</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="flex items-center space-x-2 gap-2 m-2">
                                    <Bookmark className="h-4 w-4" />
                                    <span>Save post</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="flex items-center space-x-2 gap-2 m-2">
                                    <AlertOctagonIcon className="h-4 w-4 text-yellow-600" />
                                    <span className="text-yellow-600">
                                      Report post
                                    </span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p>{post.text}</p>
                          {post.file && (
                            <img
                              src={post.file}
                              alt="Post content"
                              className="mt-4 rounded max-h-96 w-full object-contain cursor-pointer"
                              onClick={() => handleImageClick(post.file)}
                            />
                          )}
                          <div className="flex flex-row items-center mt-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleLike(post.id)}
                              className={post.isLiked ? "text-purple-500" : ""}
                            >
                              <ThumbsUp className="h-4 w-4" />
                              {post.likes.length}
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MessageCircle className="h-4 w-4" />
                              {post.comments.length}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleShare(post.id)}
                            >
                              <Share2 className="h-4 w-4" />
                              Share
                            </Button>
                          </div>
                          <div className="mt-4 space-y-2">
                            {post.comments.map((comment) => (
                              <div
                                key={comment.id}
                                className="flex items-start space-x-2"
                              >
                                <Avatar className="h-6 w-6">
                                  <AvatarImage
                                    src={`/placeholder.svg?height=24&width=24&text=${comment.user[0]}`}
                                  />

                                  <AvatarFallback>
                                    {comment.user[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <p className="text-sm font-medium">
                                    {comment.user}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {comment.content}
                                  </p>
                                </div>
                              </div>
                            ))}
                            <div className="flex items-center space-x-2">
                              <Input
                                placeholder="Add a comment..."
                                value={newComments[post.id] || ""}
                                onChange={(e) =>
                                  handleCommentChange(post.id, e.target.value)
                                }
                              />
                              <Button
                                size="sm"
                                onClick={() => handleAddComment(post.id)}
                              >
                                Post
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Mobile View */}
      <div className="md:hidden flex flex-col min-h-screen">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              Welcome back,{" "}
              <span className="bg-gradient-to-br from-red-300 to-indigo-600 bg-clip-text text-transparent text-4xl font-bold">
                {userData.fullName}
              </span>
            </h2>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Create a Post</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Share your thoughts, ideas, or questions..."
              value={newPost.content}
              onChange={handleNewPostChange}
              className="mb-4"
            />
            {newPost.media ? (
              <div className="relative mb-4">
                {newPost.media.type === "image" ? (
                  <img
                    src={newPost.media.url}
                    alt="Uploaded content"
                    className="max-h-64 w-full object-cover rounded-md"
                  />
                ) : (
                  <video
                    src={newPost.media.url}
                    controls
                    className="max-h-64 w-full rounded-md"
                  />
                )}
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={handleRemoveMedia}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="mb-4">
                <Input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleMediaUpload}
                  ref={fileInputRef}
                  id="media-upload"
                />
              </div>
            )}
            <div className="flex justify-end">
              <Button onClick={handlePost}>Post</Button>
            </div>
          </CardContent>
        </Card>
        <Card className='mt-4'>
          {" "}
          <CardHeader>
            <CardTitle>Activity Feed</CardTitle>
          </CardHeader>
<CardContent >
        <div className="flex-1 overflow-auto ">
          {posts.map((post) => (
            <article key={post.id} className="border-b border-gray-100">
              {/* Post header */}
              <Card>
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={
                        post?.user?.avatar ||
                        `/placeholder.svg?height=32&width=32&text=${post?.user?.fullName}`
                      }
                    />
                    <AvatarFallback>{post?.user?.fullName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-semibold">
                        {post.user.fullName}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <span>
                        Posted {formatDistanceToNow(new Date(post.createdAt))}{" "}
                        ago
                      </span>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="p-3 bg-white shadow-md rounded-md"
                  >
                    <DropdownMenuItem className="flex items-center gap-2 m-2 space-x-2">
                      <UserPlus className="h-4 w-4 text-blue-400" />
                      <span className="text-blue-400">Follow</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center space-x-2 gap-2 m-2 text-red-500">
                      <UserMinus className="h-4 w-4" />
                      <span>UnFollow</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center space-x-2 gap-2 m-2">
                      <Bell className="h-4 w-4" />
                      <span>Mute notifications</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center space-x-2 gap-2 m-2">
                      <Bookmark className="h-4 w-4" />
                      <span>Save post</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center space-x-2 gap-2 m-2">
                      <AlertOctagonIcon className="h-4 w-4 text-yellow-600" />
                      <span className="text-yellow-600">Report post</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Post content */}
              <div className="px-3 pb-2">
                <p>{post.text}</p>
              </div>

              {/* Post image */}
              {post.file && (
                <div className="relative aspect-square bg-muted">
                  <img
                    src={post.file}
                    alt="Post content"
                    className="w-full h-full object-cover"
                    onClick={() => handleImageClick(post.file)}
                  />
                </div>
              )}

              {/* Engagement stats */}
              <div className="px-3 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-4">
                  <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleLike(post.id)}
                              className={post.isLiked ? "text-purple-500" : ""}
                            >
                              <ThumbsUp className="h-4 w-4" />
                              {post.likes.length}
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MessageCircle className="h-4 w-4" />
                              {post.comments.length}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleShare(post.id)}
                            >
                              <Share2 className="h-4 w-4" />
                              Share
                            </Button>
                          </div>
                          <div className="mt-4 space-y-2">
                            {post.comments.map((comment) => (
                              <div
                                key={comment.id}
                                className="flex items-start space-x-2"
                              >
                                <Avatar className="h-6 w-6">
                                  <AvatarImage
                                    src={`/placeholder.svg?height=24&width=24&text=${comment.user[0]}`}
                                  />

                                  <AvatarFallback>
                                    {comment.user[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <p className="text-sm font-medium">
                                    {comment.user}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {comment.content}
                                  </p>
                                </div>
                              </div>
                            ))}
                           
                          </div>
                          
                          </div>
                          <div className="flex items-center space-x-2 mb-3">
                              <Input
                                placeholder="Add a comment..."
                                value={newComments[post.id] || ""}
                                onChange={(e) =>
                                  handleCommentChange(post.id, e.target.value)
                                }
                              />
                              <Button
                                size="sm"
                                onClick={() => handleAddComment(post.id)}
                              >
                                Post
                              </Button>
                            </div>
                   
                
              </div>
              </Card>
            </article>
          ))}
        </div>
        </CardContent>
        </Card>
      </div>
      
    </main>
  );
}
