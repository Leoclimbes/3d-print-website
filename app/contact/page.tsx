import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { Phone, Mail, MapPin } from 'lucide-react'

/**
 * Contact Page Component
 * 
 * This page displays contact information for Olingo Labs, including phone and email.
 * It allows customers to easily reach out with questions or inquiries.
 * 
 * WHY THIS STRUCTURE:
 * - Uses the same Navigation component for consistency across the site
 * - Follows the same design patterns as other pages (gradient hero, sections, icons)
 * - Uses Tailwind CSS classes for responsive design
 * - Includes multiple sections to provide comprehensive contact information
 * - Uses lucide-react icons for visual clarity and professional appearance
 */
export default function Contact() {
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
              Get In Touch
            </h1>
            {/* Subtitle */}
            {/* WHY: Provides context and sets the tone for the page */}
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              We'd love to hear from you! Reach out with questions, custom orders, or just to say hello.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      {/* WHY: Displays all primary contact methods in an organized, scannable format */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Contact Information
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the best way to reach us
            </p>
          </div>
          
          {/* Contact Methods Grid */}
          {/* WHY: Grid layout displays multiple contact methods in an organized way */}
          {/* Responsive: 1 column on mobile, 2 on tablet, 3 on desktop */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Phone Contact Card */}
            {/* WHY: Each contact method has its own card for clear visual separation */}
            <div className="text-center p-8 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow">
              {/* Phone icon represents phone contact method */}
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Phone</h3>
              {/* Fake phone number - formatted for readability */}
              <p className="text-lg text-gray-600 mb-2">
                Call us anytime
              </p>
              {/* Link that opens phone dialer on mobile devices */}
              {/* tel: protocol allows clicking to call on mobile devices */}
              <a 
                href="tel:+14021234567" 
                className="text-lg text-blue-600 hover:text-blue-800 transition-colors font-medium"
              >
                (402) 123-4567
              </a>
            </div>
            
            {/* Email Contact Card */}
            <div className="text-center p-8 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow">
              {/* Mail icon represents email contact method */}
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Email</h3>
              <p className="text-lg text-gray-600 mb-2">
                Send us a message
              </p>
              {/* Link that opens default email client */}
              {/* mailto: protocol opens user's email client with recipient pre-filled */}
              <a 
                href="mailto:contact@olingolabs.com" 
                className="text-lg text-blue-600 hover:text-blue-800 transition-colors font-medium break-all"
              >
                contact@olingolabs.com
              </a>
            </div>
            
            {/* Location Contact Card */}
            <div className="text-center p-8 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow">
              {/* MapPin icon represents our physical location */}
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Location</h3>
              <p className="text-lg text-gray-600 mb-2">
                Visit us in person
              </p>
              {/* Address information - fake address for now */}
              <p className="text-lg text-gray-700 font-medium">
                123 Innovation Street<br />
                Lincoln, NE 68508
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* WHY: Consistent footer across pages provides navigation and branding */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
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
            {/* Connect Column */}
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/newsletter" className="hover:text-white transition-colors">Newsletter</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
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

