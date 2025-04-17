import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TestimonialCard } from "@/components/TestimonialCard";
import { fine } from "@/lib/fine";
import { ArrowRight, BookOpen, Code, Languages, GitBranch } from "lucide-react";

const testimonials = [
  {
    content: "CodeCraft helped me level up my skills and defeat the final boss interview! The roadmaps are incredibly detailed and practical.",
    author: {
      name: "Sarah Johnson",
      role: "Software Engineer",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
  },
  {
    content: "As someone transitioning careers, this platform gave me clear direction on what to learn and in what order. The progress tracking kept me motivated.",
    author: {
      name: "Michael Chen",
      role: "Web Developer",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
  },
  {
    content: "The structured approach to learning both technical and soft skills made a huge difference in my interviews. I'm now confidently working as a full-stack developer.",
    author: {
      name: "Priya Patel",
      role: "Full-Stack Developer",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
  },
];

const features = [
  {
    title: "Data Structures & Algorithms",
    description: "Master the fundamentals of DSA with structured learning paths from beginner to advanced levels.",
    icon: Code,
    imageUrl: "/images/pixel-dsa.svg",
  },
  {
    title: "Web Development",
    description: "Learn frontend and backend technologies with hands-on projects and industry best practices.",
    icon: BookOpen,
    imageUrl: "/images/pixel-web-dev.svg",
  },
  {
    title: "Programming Languages",
    description: "Dive deep into various programming languages with comprehensive resources and exercises.",
    icon: Languages,
    imageUrl: "/images/pixel-language.svg",
  },
  {
    title: "Git and GitHub",
    description: "Learn version control and collaboration tools essential for modern software development.",
    icon: GitBranch,
    imageUrl: "/images/pixel-git-github.svg",
  },
];

const Index = () => {
  const navigate = useNavigate();
  const { data: session } = fine.auth.useSession();
  const [isHovered, setIsHovered] = useState(false);

  const handleGetStarted = () => {
    if (session?.user) {
      navigate("/learning");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section with Pixel Art Background */}
        <section 
          className="py-16 md:py-24"
          style={{
            backgroundImage: `url('/images/pixel-sky-bg.svg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            imageRendering: 'pixelated'
          }}
        >
          <div className="container mx-auto px-4 text-center">
            <h1 className="pixel-font mb-6 text-4xl font-bold tracking-tight text-secondary md:text-5xl lg:text-6xl">
              Level Up Your Skills
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-white">
              A structured roadmap that bridges the gap between education and industry demands, 
              helping you build relevant technical and non-technical skills.
            </p>
            <Button 
              className="pixel-btn border-secondary bg-background text-secondary"
              size="lg" 
              onClick={handleGetStarted}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <span className="pixel-font flex items-center">
                Get Started
                <ArrowRight className={`ml-2 h-4 w-4 transition-transform duration-300 ${isHovered ? "translate-x-1" : ""}`} />
              </span>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="pixel-font mb-12 text-center text-3xl font-bold text-secondary">Learning Paths</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="pixel-card transition-all hover:translate-y-[-4px]"
                >
                  <div className="mb-4 flex justify-center">
                    <img 
                      src={feature.imageUrl} 
                      alt={feature.title} 
                      className="h-16 w-16"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  </div>
                  <h3 className="pixel-font mb-2 text-center text-xl font-medium text-secondary">{feature.title}</h3>
                  <p className="text-center text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-muted py-16">
          <div className="container mx-auto px-4">
            <h2 className="pixel-font mb-12 text-center text-3xl font-bold text-secondary">What Others Say</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard 
                  key={index} 
                  content={testimonial.content} 
                  author={testimonial.author} 
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;