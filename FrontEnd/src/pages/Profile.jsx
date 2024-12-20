import React, { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Github, Linkedin, ExternalLink, Mail, Edit2, Save, Plus, Trash2, Upload, Image as ImageIcon, Video, X, Heart, MessageCircle, FileText, UploadIcon, AlignHorizontalDistributeCenterIcon, Delete } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useUserContext } from '@/userContext'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Component() {
  const [isEditing, setIsEditing] = useState(false)
  const [avatarUpload, setAvatarUpload] = useState(null);
  const {userData, setUserData} = useUserContext()
  const [data, setData] = useState({
    name: userData.fullName,
    username: '@'+userData.username,
    location: "Location",
    title: "Designation",
    profilePicture: "/placeholder.svg",
    resume: null,
    skills: [
      { name: "Python", proficiency: 90 },
      { name: "JavaScript", proficiency: 85 },
      { name: "React", proficiency: 80 },
      { name: "Node.js", proficiency: 75 },
      { name: "AWS", proficiency: 70 },
      { name: "Docker", proficiency: 65 },
    ],
    projects: [
      { title: "AI Chatbot", description: "Developed an AI-powered chatbot using NLP techniques", link: "https://github.com/janedoe/ai-chatbot" },
      { title: "IoT Home Automation", description: "Created a smart home system with Arduino and Raspberry Pi", link: "https://github.com/janedoe/iot-home" },
    ],
    experience: [
      { title: "Senior Software Engineer", company: "Tech Corp", year: "2020 - Present" },
      { title: "Software Engineer", company: "Startup Inc", year: "2018 - 2020" },
      { title: "B.S. Computer Science", company: "University of Technology", year: "2014 - 2018" },
    ],
    email: "jane.doe@example.com",
    portfolioLinks: {
      github: "https://github.com/janedoe",
      linkedin: "https://linkedin.com/in/janedoe",
      website: "https://janedoe.com",
    },
  })
  
  const [preview, setPreview] = useState(null); // Preview of avatar
  const [newPost, setNewPost] = useState({ type: 'image', content: null, description: '' })
  const [newComment, setNewComment] = useState('')
  const [profileData, setProfileData] = useState({
    name: userData.fullName,
    username:'@'+userData.username,
    location: userData.location,
    title: userData.title,
    avatar: userData?.avatar || preview
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State for dialog visibility

  

  const handleSkillChange = (index, field, value) => {
    const newSkills = [...data.skills]
    newSkills[index][field] = value
    setData({ ...data, skills: newSkills })
  }

  const handleProjectChange = (index, field, value) => {
    const newProjects = [...data.projects]
    newProjects[index][field] = value
    setData({ ...data, projects: newProjects })
  }

  const handleExperienceChange = (index, field, value) => {
    const newExperience = [...data.experience]
    newExperience[index][field] = value
    setData({ ...data, experience: newExperience })
  }

  const handlePortfolioLinkChange = (field, value) => {
    setData({ ...data, portfolioLinks: { ...data.portfolioLinks, [field]: value } })
  }

  const handleSave = () => {
    console.log("Saving user data:", data)
    setIsEditing(false)
  }

  const addProject = () => {
    setData({
      ...data,
      projects: [...data.projects, { title: "New Project", description: "Project description", link: "" }]
    })
  }

  const removeProject = (index) => {
    const newProjects = data.projects.filter((_, i) => i !== index)
    setData({ ...data, projects: newProjects })
  }

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setData({ ...data, profilePicture: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleResumeUpload = async () => {
    if (!resumeFile) {
      alert("Please select a resume to upload.");
      return;
    }

    setIsDialogOpen(true)
    console.log("----->",resumeFile)
    
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('resume', resumeFile);

    try {
      const response = await axios.post(`https://engineers-verse-back.vercel.app/api/v1/users/upload-resume/${localStorage.getItem('_id')}`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'multipart/form-data', // Ensure you set the correct content type
        },
      });

      // Handle the response from the server
      if (response.data.success) {
        console.log("Resume uploaded successfully", response.data.user);
        setUserData(response.data.user); // Update user data in the context or state
        setIsDialogOpen(false)
        localStorage.setItem('User', JSON.stringify(response.data.user));
        toast.success("Resume Uploaded Successfully", {
          autoClose: 3000,
        });
      } else {
        console.error("Failed to upload resume:", response.data.message);
        alert("Failed to upload resume.");
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast.error("Oh No!! Try Again, Resume wasn't uploaded suceessfully", {
        autoClose: 3000,
      });
    } finally {
      setIsDialogOpen(false)
      setResumeFile(null); // Clear the file input after upload
    }
  };


  const handleNewPostChange = (e) => {
    if (e.target.name === 'content') {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setNewPost({ ...newPost, content: reader.result })
        }
        reader.readAsDataURL(file)
      }
    } else {
      setNewPost({ ...newPost, [e.target.name]: e.target.value })
    }
  }

  const handlePostSubmit = () => {
    if (newPost.content && newPost.description) {
      setData({
        ...data,
        posts: [
          { id: data.posts.length + 1, ...newPost, likes: 0, isLiked: false, comments: [] },
          ...data.posts
        ]
      })
      setNewPost({ type: 'image', content: null, description: '' })
    }
  }

  const handleDeletePost = async (postId) => {
    try {
      const response = await fetch(`https://engineers-verse-back.vercel.app/api/v1/post/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })
      if (response.ok) {
        setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId))
      } else {
        console.error('Failed to delete post:', response.status)
      }
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  const handleLikePost = (postId) => {
    setData({
      ...data,
      posts: data.posts.map(post =>
        post.id === postId
          ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
          : post
      )
    })
  }

  const handleAddComment = (postId) => {
    if (newComment.trim()) {
      setData({
        ...data,
        posts: data.posts.map(post =>
          post.id === postId
            ? {
                ...post,
                comments: [
                  ...post.comments,
                  { id: post.comments.length + 1, user: data.name, text: newComment.trim() }
                ]
              }
            : post
        )
      })
      setNewComment('')
    }
  }
  const [posts, setPosts] = useState([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [accessToken, setAccessToken] = useState(null)

  // Fetch posts for the current user
  const getUserPosts = async () => {
    try {
      const userId = localStorage.getItem('_id')
      const token = localStorage.getItem('accessToken') // assuming token is stored
      setAccessToken(token)
      const response = await fetch(`https://engineers-verse-back.vercel.app/api/v1/post/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,  // Include JWT token for authentication
          'Content-Type': 'application/json'  // Optional, but helps ensure the correct content type
        }
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Posts created by user:', response)
        setPosts(data)
      } else {
        console.error('Failed to fetch posts for the user:', response.status)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoadingPosts(false)
    }
  }

  const [resumeFile, setResumeFile] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfileData({ ...profileData, [name]: value })
  }

  const handleResumeChange = (e) => {
    setResumeFile(e.target.files[0]) // Set the selected file
  }

  const handleSaveProfile = async () => {
    try {
        // Update profile information
        console.log("Profile data: ", profileData);
        console.log("Avatar : ", preview);
        
        const formData = new FormData();
        formData.append('avatar', avatarUpload); // Ensure avatarUpload is a File object
        formData.append('fullName', profileData.name);
        formData.append('location', profileData.location);
        formData.append('title', profileData.title);

        // Await the profile update response
        const profileResponse = await axios.post(
            `https://engineers-verse-back.vercel.app/api/v1/users/update-profile/${localStorage.getItem('_id')}`, 
            formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            }
        );

        // Handle profile response
        if (profileResponse.data.success) {
            const updatedProfile = profileResponse.data; // The user data is here
            console.log("Profile updated successfully", updatedProfile.user);
            setUserData(updatedProfile.user);
            toast.success("Profile updated successfully");

            // Update user data in the context or state
            setUserData(updatedProfile.user); // Assuming you're using setUser from the context
            localStorage.setItem('User', JSON.stringify(updatedProfile.user));

            setIsEditing(false);
        } else {
            console.error("Failed to update profile:", profileResponse.status);
            toast.error("Failed to update profile");
        }

    } catch (error) {
        console.error("Error updating profile: ", error.response?.data || error.message);
        toast.error("Failed to update profile");
    }
};

  
  // Fetch posts on component mount
  useEffect(() => {
    getUserPosts()
  }, [])
  
  

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      
      setPreview(URL.createObjectURL(file)); // Preview the image
      setAvatarUpload(file);
    }
    else{
      console.log("No file")
    }
  };

  const removeAvatar = async () => {
    try {
      console.log("do")
      const response = await fetch(`http://localhost:8001/api/v1/users/remove-avatar/${localStorage.getItem('_id')}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        toast.error("Failed to remove avatar");
        throw new Error('Failed to remove avatar');
      }

      // Update the UI after successfully removing the avatar
      

      await setUserData((prevData) => ({
        ...prevData,
        avatar: "",  // Set avatar to an empty string or a default image path
      }));
      toast.success("Avatar removed successfully");
      
    } catch (error) {
      console.error("Error removing avatar:", error);
      // Optional: Show an error message to the user
    }
  };
  
  

  return (
    <div className="container mx-auto p-4 space-y-8 bg-gray-50 min-h-screen">
      <ToastContainer/>
        
        <div className="w-full">
      <div className="p-6 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
        <div className="relative">
  <Avatar className="w-32 h-32">
    <AvatarImage src={isEditing ? preview || userData.avatar : userData.avatar} alt={profileData.name} />
    <AvatarFallback>{profileData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
  </Avatar>
  {isEditing && (
    <>
      <input 
        id="avatar-upload" 
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={(e) => handleAvatarChange(e)} 
      />
      <label htmlFor="avatar-upload" className="absolute bottom-0 right-0" >
        <Button variant="outline" className="w-8 h-8 rounded-full bg-white text-purple-500 font-extrabold" onClick={() => document.getElementById('avatar-upload').click()}>
          <UploadIcon className="w-4 h-4" />
        </Button>
      </label>
        <label  className="absolute bottom-0 left-0" ></label>
        <Button variant="outline" className="w-8 h-8 rounded-full bottom-0 left-0 absolute bg-red text-red-900" onClick={() => removeAvatar()}>
          <Delete className="w-4 h-4"/>
        </Button>
    </>
  )}
</div>

        <div className="flex-grow space-y-2 text-center md:text-left">
          {isEditing ? (
            <>
              <Input
                name="name"
                value={profileData.name}
                onChange={handleInputChange}
                className="text-2xl font-bold"
                placeholder="Name"
              />
              <Input
                name="title"
                value={profileData.title}
                onChange={handleInputChange}
                className="text-lg"
                placeholder="Title"
              />
              <Input
                name="location"
                value={profileData.location}
                onChange={handleInputChange}
                className="text-sm"
                placeholder="Location"
              />
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold">{profileData.name}</h1>
              <p className="text-xl text-muted-foreground">{profileData.title}</p>
              <p className="text-sm text-muted-foreground">{profileData.location}</p>
              <p className="text-sm text-muted-foreground">{profileData.username}</p>
            </>
          )}
        </div>
        <div className="space-y-2">
          {isEditing ? (
            <Button onClick={handleSaveProfile}>
              Save
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
                   <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full" onClick={() => setIsDialogOpen()}>
          <FileText className="mr-2 h-4 w-4" />
          {userData.resume ? "Update Resume" : "Upload Resume"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Resume</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label htmlFor="resume-upload" className="block text-sm font-medium text-gray-700 mb-2">
              Upload from Computer
            </label>
            <Input
              id="resume-upload"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeChange}
            />
          </div>
          <div>
            <Button onClick={handleResumeUpload} className="w-full">
              <img src="https://w7.pngwing.com/pngs/733/160/png-transparent-computer-icons-upload-youtube-icon-upload-miscellaneous-photography-sign-thumbnail.png" alt="Google Drive" className="w-5 h-5 mr-2" />
              Upload
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
        
    <Button 
  variant="outline" 
  className="w-full" 
  onClick={() => {
    if (userData.resume) {
      window.open(userData.resume, '_blank'); // Open the resume URL in a new tab
    } else {
      console.error('No resume available');
    }
  }}
>
  {userData?.resume ? "View Your Resume" : "No Resume Yet" }
</Button>

      
        </div>
      </div>
    </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Skills Section */}
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.skills.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-muted-foreground">{skill.proficiency}%</span>
                  </div>
                  <Progress value={skill.proficiency} className="h-2" />
                </div>
              ))}
              {isEditing && (
                <Button variant="outline" className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Skill
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Portfolio Links Section */}
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Github className="h-5 w-5" />
                <a href={data.portfolioLinks.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  GitHub
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Linkedin className="h-5 w-5" />
                <a href={data.portfolioLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  LinkedIn
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <ExternalLink className="h-5 w-5" />
                <a href={data.portfolioLinks.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Website
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <a href={`mailto:${data.email}`} className="text-blue-600 hover:underline">
                  {data.email}
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column  */}
        <div className="md:col-span-2 space-y-8">
          {/* Tabs for Projects, Experience, and Posts */}
          <Tabs defaultValue="projects" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="posts">Posts</TabsTrigger>
            </TabsList>
            <TabsContent value="projects" className="space-y-4">
              {data.projects.map((project, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{project.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{project.description}</p>
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mt-2 inline-block">
                      View Project
                    </a>
                  </CardContent>
                </Card>
              ))}
              {isEditing && (
                <Button onClick={addProject} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Project
                </Button>
              )}
            </TabsContent>
            <TabsContent value="experience" className="space-y-4">
              {data.experience.map((exp, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{exp.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium">{exp.company}</p>
                    <p className="text-muted-foreground">{exp.year}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="posts" className="space-y-4">
  {loadingPosts ? (
    <p>Loading...</p>
  ) : (
    posts.length === 0 ? (
      <p>No posts to display.</p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <Card key={post._id} className="w-full flex flex-col">
            <CardContent className="p-4 space-y-4 flex-grow">
              <img src={post.file} alt="Post" className="h-80 w-80 object- rounded-lg" />
              <p className="mt-2 text-sm">{post.text}</p>
              <hr />
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    onClick={() => handleLikePost(post._id)}
                    className={post.isLiked ? "text-red-500" : ""}
                  >
                    <Heart className={`mr-1 h-4 w-4 ${post.isLiked ? "fill-current" : ""}`} />
                    {post.likes}
                  </Button>
                </div>
                <Button variant="outline " className="hover:bg-red-300" onClick={() => handleDeletePost(post._id)}>
                  <Trash2 className="mr-2 h-4 w-4 hover:text-emerald-600" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  )}
</TabsContent>



                     </Tabs>
        </div>
      </div>
    </div>
  )
}
