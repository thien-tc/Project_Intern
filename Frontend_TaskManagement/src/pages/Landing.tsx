import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  CheckCircle,
  User,
  Clock,
  BarChart3,
  MessageCircle,
  Star,
  Play,
  Menu,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: User,
      title: "Group Management",
      description:
        "Organize and manage work teams effectively with powerful collaboration tools.",
    },
    {
      icon: Clock,
      title: "Time tracking",
      description:
        "Track detailed working time for each task and project accurately.",
    },
    {
      icon: BarChart3,
      title: "Report & analytics",
      description:
        "View detailed reports on work performance and project progress.",
    },
    {
      icon: MessageCircle,
      title: "Integrated chat",
      description: "Communicate directly with team members right in the app.",
    },
  ];
  const testimonials = [
    {
      name: "Nguyen Van A",
      role: "Project Manager",
      company: "Tech crop",
      content:
        "TaskFlow has helped our team increase productivity by 40%. The interface is intuitive and easy to use. ",
      rating: 5,
    },
    {
      name: "Trần Thị B",
      role: "Team Lead",
      company: "StartupXYZ",
      content:
        "The built-in chat and time tracking feature is really helpful for remote teams like us.",
      rating: 5,
    },
    {
      name: "Lê Minh C",
      role: "Developer",
      company: "DevStudio",
      content:
        "Since using TaskFlow, managing tasks and deadlines has become much easier.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
              T
            </div>
            <span className="font-bold text-xl">TaskManagement</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#features"
              className="text-sm hover:text-primary transition-colors"
            >
              Feature
            </a>
            <a
              href="#testimonials"
              className="text-sm hover:text-primary transition-colors"
            >
              Evaluate
            </a>
            <a
              href="#pricing"
              className="text-sm hover:text-primary transition-colors"
            >
              Price
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm">
                Sign up for free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-background p-4 space-y-4">
            <a
              href="#features"
              className="block text-sm hover:text-primary transition-colors"
            >
              Feature
            </a>
            <a
              href="#testimonials"
              className="block text-sm hover:text-primary transition-colors"
            >
              Evaluate
            </a>
            <a
              href="#pricing"
              className="block text-sm hover:text-primary transition-colors"
            >
              Price
            </a>
            <div className="flex flex-col gap-2 pt-4 border-t border-border">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="w-full">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="w-full">
                  Sign up for free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-4">
            🚀 New release
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Project Management
            <br />
            more effective than ever
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            TaskManagement helps your team organize work, track progress, and collaborate effectively. All in one platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/register">
              <Button size="lg" className="text-lg px-8">
                Start for free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8">
              <Play className="mr-2 h-5 w-5" />
              See demo
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            14 Days Free • No credit card required
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Outstanding features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              All the tools you need to effectively manage projects and teams
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What our customers say about us
            </h2>
            <p className="text-xl text-muted-foreground">
              More than 10,000+ teams trust TaskFlow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role} tại {testimonial.company}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple price list
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose the package that suits your team's needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="font-bold text-xl mb-2">Free</h3>
                <p className="text-3xl font-bold mb-4">
                  0VND
                  <span className="text-sm font-normal text-muted-foreground">
                    /month
                  </span>
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Maximum 5 members</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Basic task management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Group chat</span>
                  </li>
                </ul>
                <Link to="/register">
                  <Button variant="outline" className="w-full">
                    Start for free
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="hover:shadow-lg transition-shadow border-primary relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">
                  Popular
                </Badge>
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-xl mb-2">Pro</h3>
                <p className="text-3xl font-bold mb-4">
                  99,000VND
                  <span className="text-sm font-normal text-muted-foreground">
                    /month
                  </span>
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Unlimited members</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">All basic features</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Detailed report</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Time tracking</span>
                  </li>
                </ul>
                <Link to="/register">
                  <Button className="w-full">Choose the Pro package</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="font-bold text-xl mb-2">Enterprise</h3>
                <p className="text-3xl font-bold mb-4">
                  Contact
                  <span className="text-sm font-normal text-muted-foreground"></span>
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">All Pro features</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">API integration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">24/7 Support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Advanced security</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full">
                  Contact for consultation
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to increase your productivity?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
           Join thousands of teams using TaskFlow to manage projects more efficiently.
          </p>
          <Link to="/register">
            <Button size="lg" className="text-lg px-8">
              Start for free now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-primary-foreground font-bold text-sm">
                  T
                </div>
                <span className="font-bold">TaskManagement</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Modern project management platform for efficient teams.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Sản phẩm</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Feature
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Evaluate
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Hỗ trợ</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    System status
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    About us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Recruitment
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 TaskManagement. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
