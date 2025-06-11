"use client"
import { useState, useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"
import {
  MessageSquare,
  BarChart3,
  Shield,
  Smartphone,
  Star,
  ArrowRight,
  Wrench,
  Clock,
  Hammer,
  Zap,
  Droplets,
  Car,
  TreePine,
  PaintBucket,
  Menu,
  X,
  Download,
  CheckCircle,
  Users,
  TrendingUp,
} from "lucide-react"

export default function TaskMateLanding() {
  const { theme, setTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const scrollTo = (elementId: string) => {
    const element = document.getElementById(elementId)
    element?.scrollIntoView({ behavior: "smooth" })
    setIsMenuOpen(false)
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handymanServices = [
    { icon: Zap, name: "Electrical Repairs", color: "text-yellow-500" },
    { icon: Droplets, name: "Plumbing Services", color: "text-blue-500" },
    { icon: Hammer, name: "Carpentry Work", color: "text-amber-600" },
    { icon: PaintBucket, name: "Painting & Decorating", color: "text-purple-500" },
    { icon: Car, name: "Auto Maintenance", color: "text-red-500" },
    { icon: TreePine, name: "Landscaping & Gardening", color: "text-green-500" },
  ]

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-all duration-500 font-poppins">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 group">
                <h1 className="text-2xl font-bold text-[#0052cc] group-hover:scale-105 transition-transform duration-200">
                  TaskMate
                </h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {[
                  { name: "Home", id: "hero" },
                  { name: "Services", id: "services" },
                  { name: "About", id: "about" },
                  { name: "Testimonials", id: "testimonials" },
                  { name: "Download", id: "download" },
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => scrollTo(item.id)}
                    className="text-gray-700 dark:text-gray-300 hover:text-[#0052cc] dark:hover:text-[#0052cc] transition-all duration-200 font-medium relative group"
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#0052cc] group-hover:w-full transition-all duration-300"></span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Switch
                checked={theme === "dark"}
                onCheckedChange={toggleTheme}
                className="data-[state=checked]:bg-[#0052cc]"
                aria-label="Toggle dark mode"
              />

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-[#0052cc] transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 animate-in slide-in-from-top-2 duration-200">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {[
                  { name: "Home", id: "hero" },
                  { name: "Services", id: "services" },
                  { name: "About", id: "about" },
                  { name: "Testimonials", id: "testimonials" },
                  { name: "Download", id: "download" },
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => scrollTo(item.id)}
                    className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-[#0052cc] hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 rounded-md"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="hero"
        className="pt-16 min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#0052cc]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center">
            <Badge className="mb-6 bg-[#0052cc]/10 text-[#0052cc] border-[#0052cc]/20 hover:bg-[#0052cc]/20 transition-all duration-300 animate-in fade-in-50 slide-in-from-bottom-3">
              🔧 Trusted by 10,000+ Handymen
            </Badge>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight animate-in fade-in-50 slide-in-from-bottom-4 duration-700">
              Your Trusted
              <span className="text-[#0052cc] block">Handyman Network</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed animate-in fade-in-50 slide-in-from-bottom-5 duration-700 delay-200">
              Connect with skilled professionals for all your home repair and maintenance needs. From electrical work to
              plumbing, carpentry to painting - find the right handyman for every job.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in-50 slide-in-from-bottom-6 duration-700 delay-400">
              <Button
                size="lg"
                className="bg-[#0052cc] hover:bg-[#003d99] text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                onClick={() => scrollTo("services")}
              >
                Find a Handyman
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-[#0052cc] text-[#0052cc] hover:bg-[#0052cc] hover:text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                onClick={() => scrollTo("download")}
              >
                <Download className="mr-2 h-5 w-5" />
                Get the App
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 animate-in fade-in-50 slide-in-from-bottom-7 duration-700 delay-600">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#0052cc] mb-2">10,000+</div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">Verified Handymen</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#0052cc] mb-2">50,000+</div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">Jobs Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#0052cc] mb-2">4.9★</div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Professional Handyman Services
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              From quick fixes to major repairs, our network of skilled professionals handles it all
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {handymanServices.map((service, index) => (
              <Card
                key={service.name}
                className="border-gray-200 dark:border-gray-700 hover:shadow-xl hover:scale-105 transition-all duration-300 group cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <service.icon className={`h-8 w-8 ${service.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{service.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Professional {service.name.toLowerCase()} services by certified and experienced handymen in your
                    area.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Why Choose TaskMate?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We're revolutionizing how homeowners connect with skilled handymen, ensuring quality work and peace of
              mind
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Verified Professionals",
                description:
                  "All handymen undergo thorough background checks and skill verification before joining our platform.",
                color: "text-green-500",
              },
              {
                icon: Clock,
                title: "Real-Time Tracking",
                description:
                  "Monitor your job progress with live updates from arrival to completion with photo documentation.",
                color: "text-blue-500",
              },
              {
                icon: MessageSquare,
                title: "Direct Communication",
                description:
                  "Chat directly with your handyman, share photos, and get instant updates throughout the job.",
                color: "text-purple-500",
              },
              {
                icon: BarChart3,
                title: "Transparent Pricing",
                description:
                  "Get upfront quotes with no hidden fees. Pay securely through the app after job completion.",
                color: "text-orange-500",
              },
              {
                icon: Users,
                title: "24/7 Support",
                description:
                  "Our customer support team is available around the clock to help with any questions or issues.",
                color: "text-red-500",
              },
              {
                icon: TrendingUp,
                title: "Quality Guarantee",
                description:
                  "All work comes with our satisfaction guarantee. Not happy? We'll make it right or refund your money.",
                color: "text-indigo-500",
              },
            ].map((feature, index) => (
              <Card
                key={feature.title}
                className="border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 mr-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Real stories from homeowners and handymen who love TaskMate
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Homeowner",
                avatar: "S",
                rating: 5,
                text: "TaskMate saved my weekend! Found an excellent electrician who fixed my kitchen outlets in under 2 hours. The real-time tracking was amazing - I knew exactly when he'd arrive.",
              },
              {
                name: "Mike Rodriguez",
                role: "Professional Handyman",
                avatar: "M",
                rating: 5,
                text: "As a handyman, TaskMate has transformed my business. I get steady work, fair pay, and the app makes scheduling and payments seamless. My income has increased by 40%!",
              },
              {
                name: "Emily Chen",
                role: "Property Manager",
                avatar: "E",
                rating: 5,
                text: "Managing 20+ properties, I need reliable handymen fast. TaskMate delivers every time. The quality verification and instant communication features are game-changers.",
              },
            ].map((testimonial, index) => (
              <Card
                key={testimonial.name}
                className="border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed italic">"{testimonial.text}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-[#0052cc] rounded-full flex items-center justify-center text-white font-bold mr-4 text-lg">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-lg">{testimonial.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Download Section with QR Code */}
      <section
        id="download"
        className="py-20 bg-gradient-to-br from-[#0052cc] to-[#003d99] text-white relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Download TaskMate Today</h2>
              <p className="text-xl mb-8 text-blue-100 leading-relaxed">
                Join thousands of homeowners and handymen who trust TaskMate for all their repair and maintenance needs.
                Available on iOS and Android.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <CheckCircle className="h-6 w-6 text-green-400 mr-3" />
                  <span className="font-medium">Instant Booking</span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <CheckCircle className="h-6 w-6 text-green-400 mr-3" />
                  <span className="font-medium">Secure Payments</span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <CheckCircle className="h-6 w-6 text-green-400 mr-3" />
                  <span className="font-medium">24/7 Support</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-2xl p-8 shadow-2xl inline-block">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Scan to Download</h3>
                <div className="bg-gray-100 p-6 rounded-xl mb-6">
                  {/* QR Code placeholder - in a real app, this would be a generated QR code */}
                  <div className="w-48 h-48 mx-auto bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center relative">
                    <div className="grid grid-cols-8 gap-1 w-40 h-40">
                      {/* QR Code pattern simulation */}
                      {Array.from({ length: 64 }).map((_, i) => (
                        <div key={i} className={`w-full h-full ${Math.random() > 0.5 ? "bg-black" : "bg-white"}`} />
                      ))}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white p-2 rounded-lg shadow-lg">
                        <Smartphone className="h-8 w-8 text-[#0052cc]" />
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">Scan with your phone camera to download the TaskMate app</p>
                <div className="flex justify-center space-x-4">
                  <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">iOS</Badge>
                  <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Android</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-3xl font-bold text-[#0052cc] mb-4">TaskMate</h3>
              <p className="text-gray-300 mb-6 leading-relaxed text-lg">
                Connecting homeowners with skilled handymen for efficient, reliable, and affordable home repair and
                maintenance services.
              </p>
              <div className="flex space-x-4">
                <div className="bg-gray-800 p-3 rounded-lg">
                  <Wrench className="h-6 w-6 text-[#0052cc]" />
                </div>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <Shield className="h-6 w-6 text-[#0052cc]" />
                </div>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-[#0052cc]" />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {[
                  { name: "Home", id: "hero" },
                  { name: "Services", id: "services" },
                  { name: "About", id: "about" },
                  { name: "Testimonials", id: "testimonials" },
                  { name: "Download", id: "download" },
                ].map((item) => (
                  <li key={item.name}>
                    <button
                      onClick={() => scrollTo(item.id)}
                      className="text-gray-300 hover:text-[#0052cc] transition-colors duration-200 font-medium"
                    >
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6">Contact Info</h4>
              <div className="space-y-3">
                <p className="text-gray-300 flex items-center">
                  <span className="font-medium">Email:</span>
                  <span className="ml-2">hello@taskmate.com</span>
                </p>
                <p className="text-gray-300 flex items-center">
                  <span className="font-medium">Phone:</span>
                  <span className="ml-2">(555) 123-4567</span>
                </p>
                <p className="text-gray-300 flex items-center">
                  <span className="font-medium">Support:</span>
                  <span className="ml-2">24/7 Available</span>
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400 text-lg">
              © {new Date().getFullYear()} TaskMate. All rights reserved. | Connecting skilled hands with helping
              hearts.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
