import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { Truck, Package, Clock, DollarSign, MapPin, AlertCircle } from 'lucide-react'

/**
 * Shipping Info Page Component
 * 
 * This page provides comprehensive shipping information for customers, including
 * shipping methods, rates, processing times, and delivery policies.
 * 
 * WHY THIS STRUCTURE:
 * - Uses the same Navigation component for consistency across the site
 * - Follows the same design patterns as other pages (gradient hero, sections, icons)
 * - Uses Tailwind CSS classes for responsive design
 * - Includes multiple sections to provide comprehensive shipping information
 * - Uses lucide-react icons for visual clarity and professional appearance
 */
export default function Shipping() {
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
              Shipping Information
            </h1>
            {/* Subtitle */}
            {/* WHY: Provides context and sets the tone for the page */}
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Fast, reliable shipping from Nebraska to anywhere in the USA
            </p>
          </div>
        </div>
      </section>

      {/* Processing Time Section */}
      {/* WHY: Customers need to know when their order will ship */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Processing & Delivery Times
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              How long it takes us to process and ship your order
            </p>
          </div>
          
          {/* Processing Time Cards */}
          {/* WHY: Grid layout displays information in an organized, scannable way */}
          {/* Responsive: 1 column on mobile, 2 on tablet, 3 on desktop */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Processing Time Card */}
            {/* WHY: Each card uses an icon, heading, and description for clarity */}
            <div className="text-center p-8 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow">
              {/* Clock icon represents processing time */}
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Processing Time</h3>
              {/* Processing time information */}
              {/* WHY: Clear, concise information about order processing */}
              <p className="text-lg text-gray-600 mb-2">
                3-5 Business Days
              </p>
              <p className="text-sm text-gray-500">
                Orders are processed Monday through Friday. Custom items may take additional time.
              </p>
            </div>
            
            {/* Standard Shipping Card */}
            <div className="text-center p-8 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow">
              {/* Truck icon represents shipping */}
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Standard Shipping</h3>
              <p className="text-lg text-gray-600 mb-2">
                5-7 Business Days
              </p>
              <p className="text-sm text-gray-500">
                USPS Priority Mail. Tracking number provided upon shipment.
              </p>
            </div>
            
            {/* Express Shipping Card */}
            <div className="text-center p-8 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow">
              {/* Truck icon represents express shipping */}
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Express Shipping</h3>
              <p className="text-lg text-gray-600 mb-2">
                2-3 Business Days
              </p>
              <p className="text-sm text-gray-500">
                USPS Priority Express. Available for orders over $50.
              </p>
            </div>
          </div>
          
          {/* Total Delivery Time Note */}
          {/* WHY: Helps customers calculate total time from order to delivery */}
          <div className="max-w-3xl mx-auto text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-lg text-gray-700">
              <strong className="text-gray-900">Total Delivery Time:</strong> Standard orders typically arrive within 8-12 business days from order date. Express orders arrive within 5-8 business days.
            </p>
          </div>
        </div>
      </section>

      {/* Shipping Rates Section */}
      {/* WHY: Customers need clear pricing information */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Shipping Rates
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Transparent pricing for all shipping methods
            </p>
          </div>
          
          {/* Shipping Rates Table/Cards */}
          {/* WHY: Organized display of shipping costs by order value */}
          <div className="max-w-4xl mx-auto">
            {/* Standard Shipping Rates */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="bg-blue-600 text-white p-6">
                <div className="flex items-center justify-center space-x-3">
                  {/* Package icon represents standard shipping */}
                  <Package className="h-6 w-6" />
                  <h3 className="text-2xl font-bold">Standard Shipping (USPS Priority Mail)</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {/* WHY: Each rate tier is clearly displayed */}
                  {/* DollarSign icon used for pricing information */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <span className="text-lg font-medium text-gray-900">Orders under $25</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">$5.99</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <span className="text-lg font-medium text-gray-900">Orders $25 - $50</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">$7.99</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <span className="text-lg font-medium text-gray-900">Orders $50 - $100</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">$9.99</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <span className="text-lg font-medium text-gray-900">Orders over $100</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">FREE</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Express Shipping Rates */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-green-600 text-white p-6">
                <div className="flex items-center justify-center space-x-3">
                  {/* Truck icon represents express shipping */}
                  <Truck className="h-6 w-6" />
                  <h3 className="text-2xl font-bold">Express Shipping (USPS Priority Express)</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                      <span className="text-lg font-medium text-gray-900">All Orders</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">$19.99</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    Express shipping is available for orders over $50. Includes signature confirmation and insurance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shipping Destinations Section */}
      {/* WHY: Customers need to know where we ship */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Where We Ship
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Shipping destinations and restrictions
            </p>
          </div>
          
          {/* Shipping Destinations Card */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              {/* MapPin icon represents shipping locations */}
              <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="h-10 w-10 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Currently Shipping to the United States
              </h3>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                We currently ship to all 50 states, Washington D.C., and U.S. territories. 
                International shipping is not available at this time, but we're working on 
                expanding our shipping options in the future.
              </p>
              <p className="text-md text-gray-500">
                All orders are shipped from our facility in Nebraska, USA.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Important Information Section */}
      {/* WHY: Important shipping policies and disclaimers */}
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
            {/* Tracking Information Card */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-start space-x-4">
                {/* Package icon represents tracking */}
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">Tracking Information</h3>
                  <p className="text-gray-600 leading-relaxed">
                    You'll receive a tracking number via email once your order ships. 
                    You can use this to track your package's journey to your door.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Business Days Card */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-start space-x-4">
                {/* Clock icon represents business days */}
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">Business Days</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Processing and shipping times are calculated in business days (Monday-Friday). 
                    Holidays and weekends are not included.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Custom Orders Card */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-start space-x-4">
                {/* AlertCircle icon represents important notice */}
                <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">Custom Orders</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Custom or personalized items may require additional processing time. 
                    We'll contact you if your order needs extra time to fulfill.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Lost or Damaged Card */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-start space-x-4">
                {/* AlertCircle icon represents issues */}
                <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">Lost or Damaged Items</h3>
                  <p className="text-gray-600 leading-relaxed">
                    If your package is lost or arrives damaged, please contact us immediately. 
                    We'll work with the shipping carrier to resolve the issue quickly.
                  </p>
                </div>
              </div>
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

