import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { RotateCcw, Package, Mail, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react'

/**
 * Returns Page Component
 * 
 * This page provides comprehensive return and refund information for customers,
 * including the 30-day return policy, return process, and conditions.
 * 
 * WHY THIS STRUCTURE:
 * - Uses the same Navigation component for consistency across the site
 * - Follows the same design patterns as other pages (gradient hero, sections, icons)
 * - Uses Tailwind CSS classes for responsive design
 * - Includes multiple sections to provide comprehensive return information
 * - Uses lucide-react icons for visual clarity and professional appearance
 */
export default function Returns() {
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
              Returns & Refunds
            </h1>
            {/* Subtitle */}
            {/* WHY: Provides context and sets the tone for the page */}
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              30-day return policy from the day you receive your package
            </p>
          </div>
        </div>
      </section>

      {/* Return Policy Overview Section */}
      {/* WHY: Highlights the main return policy - 30 days from receipt */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              {/* RotateCcw icon represents returns/refunds */}
              <RotateCcw className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Return Policy
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple, straightforward returns for your peace of mind
            </p>
          </div>
          
          {/* Return Policy Card */}
          {/* WHY: Prominent display of the 30-day return window */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border-2 border-green-200 p-8 text-center mb-12">
              {/* Clock icon represents time frame */}
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                30-Day Return Window
              </h3>
              {/* WHY: Clear, prominent statement of the return policy */}
              <p className="text-xl text-gray-700 leading-relaxed mb-4">
                You have <strong className="text-green-600">30 days from the day you receive your package</strong> to 
                return any unused item in its original condition for a full refund or exchange.
              </p>
              <p className="text-lg text-gray-600">
                The return period starts on the delivery date, not the order date, giving you plenty of time 
                to decide if your purchase is right for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Return Section */}
      {/* WHY: Step-by-step process helps customers understand what to do */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How to Return an Item
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Follow these simple steps to return your purchase
            </p>
          </div>
          
          {/* Return Steps */}
          {/* WHY: Grid layout displays steps in an organized, scannable way */}
          {/* Responsive: 1 column on mobile, 2 on tablet, 3 on desktop */}
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
            {/* Step 1: Contact Us */}
            {/* WHY: Each step card uses an icon, heading, and description for clarity */}
            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              {/* Mail icon represents contacting us */}
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Contact Us</h3>
              <p className="text-gray-600 leading-relaxed">
                <Link href="/contact" className="text-blue-600 hover:underline font-medium">
                  Reach out to us
                </Link> within 30 days of receiving your package. Include your order number 
                and reason for return.
              </p>
            </div>
            
            {/* Step 2: Get Return Authorization */}
            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              {/* Package icon represents preparing return */}
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-purple-600" />
              </div>
              <div className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Get Return Authorization</h3>
              <p className="text-gray-600 leading-relaxed">
                We'll review your request and provide you with a return authorization number 
                and shipping instructions within 1-2 business days.
              </p>
            </div>
            
            {/* Step 3: Ship It Back */}
            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              {/* RotateCcw icon represents returning item */}
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="h-8 w-8 text-green-600" />
              </div>
              <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Ship It Back</h3>
              <p className="text-gray-600 leading-relaxed">
                Package the item securely in its original packaging (if available) and ship 
                it to the address we provide. We recommend using a trackable shipping method.
              </p>
            </div>
          </div>
          
          {/* Return Processing Note */}
          {/* WHY: Sets expectations about refund timeline */}
          <div className="max-w-3xl mx-auto mt-12 text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-center space-x-3 mb-3">
              {/* Clock icon represents processing time */}
              <Clock className="h-6 w-6 text-blue-600" />
              <p className="text-lg font-semibold text-gray-900">Refund Processing</p>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Once we receive and inspect your return, we'll process your refund within 5-7 business days. 
              Refunds will be issued to your original payment method.
            </p>
          </div>
        </div>
      </section>

      {/* Return Conditions Section */}
      {/* WHY: Customers need to know what items are eligible for return */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Return Conditions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              What items are eligible for return?
            </p>
          </div>
          
          {/* Conditions Grid */}
          {/* WHY: Clear visual distinction between eligible and non-eligible items */}
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            {/* Eligible Items */}
            <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
              {/* CheckCircle icon represents eligible items */}
              <div className="flex items-center space-x-3 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-900">Eligible for Return</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                {/* WHY: Bullet list makes conditions easy to scan */}
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Items in original, unused condition</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Items with original packaging (when available)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Returns initiated within 30 days of delivery</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Items that were damaged during shipping (we'll replace or refund)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Items that don't match your order</span>
                </li>
              </ul>
            </div>
            
            {/* Non-Eligible Items */}
            <div className="bg-red-50 rounded-lg p-6 border-2 border-red-200">
              {/* XCircle icon represents non-eligible items */}
              <div className="flex items-center space-x-3 mb-4">
                <XCircle className="h-6 w-6 text-red-600" />
                <h3 className="text-xl font-semibold text-gray-900">Not Eligible for Return</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  <span>Custom or personalized items (unless defective)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  <span>Items used, worn, or damaged by the customer</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  <span>Items returned after the 30-day window</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  <span>Items without proof of purchase</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  <span>Digital products or downloadable files</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Important Information Section */}
      {/* WHY: Important details about returns and refunds */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Important Information
            </h2>
          </div>
          
          {/* Important Info Cards */}
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            {/* Return Shipping Costs Card */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-start space-x-4">
                {/* Package icon represents shipping */}
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">Return Shipping Costs</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Return shipping costs are the customer's responsibility, unless the item was damaged, 
                    defective, or incorrect. In those cases, we'll cover the return shipping costs.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Refund Timeline Card */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-start space-x-4">
                {/* Clock icon represents time */}
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">Refund Timeline</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Refunds are processed within 5-7 business days after we receive and inspect your return. 
                    It may take additional time for your bank or credit card company to post the refund to your account.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Exchanges Card */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-start space-x-4">
                {/* RotateCcw icon represents exchanges */}
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <RotateCcw className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">Exchanges</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We're happy to exchange items for a different size, color, or style (subject to availability). 
                    Please note any price differences will be charged or refunded accordingly.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Damaged Items Card */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-start space-x-4">
                {/* AlertCircle icon represents important notice */}
                <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">Damaged or Defective Items</h3>
                  <p className="text-gray-600 leading-relaxed">
                    If you receive a damaged or defective item, please <Link href="/contact" className="text-blue-600 hover:underline">contact us immediately</Link> 
                    with photos. We'll send a replacement or provide a full refund, and we'll cover return shipping costs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      {/* WHY: Directs users to contact if they need help with returns */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            {/* Mail icon represents contact */}
            <div className="bg-white bg-opacity-20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="h-10 w-10" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Need Help with a Return?
            </h2>
            <p className="text-xl mb-8 text-blue-100 leading-relaxed">
              Have questions about returning an item? Our customer service team is here to help! 
              Reach out to us and we'll assist you with your return request.
            </p>
            {/* Call-to-Action Button */}
            {/* WHY: Direct link to contact page encourages users to reach out */}
            <Link 
              href="/contact" 
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Contact Us
            </Link>
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

