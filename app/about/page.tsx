import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Navigation from '@/components/Navigation'
import { MapPin, Heart, Users, Target, Rocket, Award } from 'lucide-react'

/**
 * About Page Component
 * 
 * This page tells the story of Olingo Labs - a Nebraska-based 3D printing company.
 * 
 * WHY THIS STRUCTURE:
 * - Uses the same Navigation component for consistency across the site
 * - Follows the same design patterns as the home page (gradient hero, sections, icons)
 * - Uses Tailwind CSS classes for responsive design
 * - Includes multiple sections to tell the company story comprehensively
 */
export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Component */}
      {/* WHY: Consistent navigation across all pages - users can navigate easily */}
      <Navigation />
      
      {/* Hero Section */}
      {/* WHY: First thing visitors see - makes a strong impression */}
      {/* Uses gradient background to match home page style */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Main Heading */}
            {/* WHY: Large, bold text captures attention and states our purpose */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About Olingo Labs
            </h1>
            {/* Subtitle */}
            {/* WHY: Provides context and sets the tone for the page */}
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Proudly crafting custom 3D printed products from the heart of Nebraska
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      {/* WHY: Tells visitors who we are and what we stand for */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            {/* Section Title */}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Story
            </h2>
            {/* Story Content */}
            {/* WHY: Paragraphs break up text for readability - explains our mission */}
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              Olingo Labs was founded with a simple mission: to bring innovative 3D printing 
              technology to communities across Nebraska and beyond. We believe that everyone 
              should have access to high-quality, custom 3D printed products.
            </p>
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              Based in Nebraska, we're proud to be part of a community that values craftsmanship, 
              innovation, and service. Our location in the heartland of America gives us a unique 
              perspective on combining traditional values with cutting-edge technology.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Whether you need custom parts for a project, unique gifts, or specialized prototypes, 
              we're here to turn your ideas into reality with precision and care.
            </p>
          </div>
        </div>
      </section>

      {/* Location Section */}
      {/* WHY: Highlights our Nebraska roots - builds local connection */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            {/* Location Icon */}
            {/* WHY: Visual element makes the section more engaging */}
            <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              {/* MapPin icon from lucide-react - represents our location */}
              <MapPin className="h-10 w-10 text-red-600" />
            </div>
            {/* Section Heading */}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              From Nebraska, For Everyone
            </h2>
            {/* Location Content */}
            {/* WHY: Explains why being in Nebraska matters to us */}
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              We're proud to call Nebraska home. The values we learned here—hard work, 
              dedication, and treating customers like family—shape everything we do. 
              While we're based in the Cornhusker State, we're excited to serve customers 
              nationwide with the same commitment to quality and service.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Nebraska's spirit of innovation and community drives us to create products 
              that matter, delivered with the personal touch that sets small businesses apart.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      {/* WHY: Shows what we stand for - builds trust and connection */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at Olingo Labs
            </p>
          </div>
          
          {/* Values Grid */}
          {/* WHY: Grid layout displays multiple values in an organized, scannable way */}
          {/* Responsive: 1 column on mobile, 2 on tablet, 3 on desktop */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Quality Value */}
            {/* WHY: Each value card uses an icon, heading, and description for clarity */}
            <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow">
              {/* Award icon represents our commitment to quality */}
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Quality First</h3>
              <p className="text-gray-600">
                We never compromise on quality. Every product we create meets our 
                rigorous standards for precision and durability.
              </p>
            </div>
            
            {/* Innovation Value */}
            <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow">
              {/* Rocket icon symbolizes innovation and forward thinking */}
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Innovation</h3>
              <p className="text-gray-600">
                We stay on the cutting edge of 3D printing technology, constantly 
                learning and improving our techniques.
              </p>
            </div>
            
            {/* Community Value */}
            <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow">
              {/* Heart icon represents our care for community and customers */}
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Community</h3>
              <p className="text-gray-600">
                We believe in supporting our local community in Nebraska while 
                building relationships with customers everywhere.
              </p>
            </div>
            
            {/* Customer Focus Value */}
            <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow">
              {/* Users icon represents our focus on people */}
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Customer Focus</h3>
              <p className="text-gray-600">
                Your satisfaction is our priority. We work closely with you to 
                ensure your vision becomes reality.
              </p>
            </div>
            
            {/* Mission-Driven Value */}
            <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow">
              {/* Target icon represents our clear goals and mission */}
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Mission-Driven</h3>
              <p className="text-gray-600">
                We're driven by a passion for making 3D printing accessible and 
                helping bring your ideas to life.
              </p>
            </div>
            
            {/* Integrity Value */}
            <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow">
              {/* Award icon (reused) represents our commitment to doing right */}
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Integrity</h3>
              <p className="text-gray-600">
                Honest communication, fair pricing, and transparent processes— 
                that's the Nebraska way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      {/* WHY: Explains our services and capabilities */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What We Do
            </h2>
            <p className="text-xl mb-8 text-blue-100 leading-relaxed">
              At Olingo Labs, we specialize in custom 3D printing services. From prototypes 
              to finished products, we work with a variety of materials and technologies to 
              meet your specific needs. Whether you're an individual looking for a unique gift, 
              an entrepreneur developing a product, or a business in need of custom parts, 
              we're here to help.
            </p>
            <p className="text-xl text-blue-100 leading-relaxed mb-8">
              Our process is simple: you share your ideas or requirements, and we bring them 
              to life with precision and care. We're committed to making the 3D printing 
              process accessible and enjoyable for everyone.
            </p>
            {/* Call-to-Action Buttons */}
            {/* WHY: Direct users to take action after reading about us */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white hover:text-blue-600">
                <Link href="/products">View Our Products</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white hover:text-blue-600">
                <Link href="/contact">Get In Touch</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* WHY: Consistent footer across pages provides navigation and branding */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Company Info Column */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Olingo Labs</h3>
              <p className="text-gray-400">
                Custom 3D printed products from Nebraska.
              </p>
            </div>
            {/* Quick Links Column */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/products" className="hover:text-white transition-colors">Products</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            {/* Customer Service Column */}
            <div>
              <h4 className="font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping Info</Link></li>
                <li><Link href="/returns" className="hover:text-white transition-colors">Returns</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
          </div>
          {/* Copyright Section */}
          {/* WHY: Legal requirement and professional touch */}
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Olingo Labs. All rights reserved.</p>
            <p className="mt-2 text-sm">Proudly based in Nebraska</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

