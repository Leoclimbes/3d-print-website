import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion'
import { HelpCircle, MessageSquare, Package, DollarSign, Truck, FileQuestion } from 'lucide-react'

/**
 * FAQ (Frequently Asked Questions) Page Component
 * 
 * This page answers common questions customers have about products, ordering,
 * shipping, returns, and more using an accordion interface.
 * 
 * WHY THIS STRUCTURE:
 * - Uses the same Navigation component for consistency across the site
 * - Follows the same design patterns as other pages (gradient hero, sections, icons)
 * - Uses Tailwind CSS classes for responsive design
 * - Uses Accordion component for interactive, organized Q&A display
 * - Grouped questions by category for better user experience
 * - Uses lucide-react icons for visual clarity and professional appearance
 */
export default function FAQ() {
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
              Frequently Asked Questions
            </h1>
            {/* Subtitle */}
            {/* WHY: Provides context and sets the tone for the page */}
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Find answers to common questions about our products, orders, and services
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      {/* WHY: Accordion interface allows users to expand/collapse questions */}
      {/* This keeps the page clean while providing all information */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header with Icon */}
          {/* WHY: Visual element makes the section more engaging */}
          <div className="text-center mb-16">
            <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              {/* HelpCircle icon represents FAQ/questions */}
              <HelpCircle className="h-10 w-10 text-blue-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Common Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Click on any question to see the answer
            </p>
          </div>
          
          {/* General Questions Accordion */}
          {/* WHY: Accordion component provides smooth expand/collapse animation */}
          {/* type="single" allows only one question open at a time */}
          {/* collapsible allows closing an open question */}
          <Accordion type="single" collapsible className="w-full mb-12">
            {/* Accordion Item 1: What materials do you use? */}
            {/* WHY: Each item contains a trigger (question) and content (answer) */}
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left">
                <div className="flex items-center space-x-3">
                  {/* Package icon represents products/materials */}
                  <Package className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span className="font-semibold text-lg">What materials do you use for 3D printing?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed pl-8">
                We use a variety of high-quality 3D printing materials including PLA (Polylactic Acid), 
                PETG (Polyethylene Terephthalate Glycol), ABS (Acrylonitrile Butadiene Styrene), and 
                TPU (Thermoplastic Polyurethane) for flexible items. Each material has different properties:
                <ul className="list-disc list-inside mt-3 space-y-1">
                  <li><strong>PLA:</strong> Biodegradable, easy to print, great for decorative items</li>
                  <li><strong>PETG:</strong> Strong and durable, food-safe options available</li>
                  <li><strong>ABS:</strong> Heat-resistant, impact-resistant, great for functional parts</li>
                  <li><strong>TPU:</strong> Flexible and rubber-like, perfect for phone cases and gaskets</li>
                </ul>
                The material used depends on your order requirements. Contact us if you need a specific material.
              </AccordionContent>
            </AccordionItem>

            {/* Accordion Item 2: Custom orders */}
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-5 w-5 text-purple-600 flex-shrink-0" />
                  <span className="font-semibold text-lg">Do you accept custom orders?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed pl-8">
                Yes! We love working on custom projects. Whether you have your own 3D model file (STL, OBJ, etc.) 
                or you need help designing something from scratch, we're here to help. Custom orders typically 
                require additional processing time, and pricing depends on complexity, size, and materials. 
                Please <Link href="/contact" className="text-blue-600 hover:underline">contact us</Link> with 
                your project details, and we'll provide a quote.
              </AccordionContent>
            </AccordionItem>

            {/* Accordion Item 3: Ordering process */}
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left">
                <div className="flex items-center space-x-3">
                  <FileQuestion className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="font-semibold text-lg">How do I place an order?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed pl-8">
                Placing an order is easy! Simply browse our <Link href="/products" className="text-blue-600 hover:underline">products page</Link>, 
                add items to your cart, and proceed to checkout. You'll need to create an account or sign in 
                to complete your purchase. For custom orders, please <Link href="/contact" className="text-blue-600 hover:underline">contact us first</Link> 
                to discuss your project before placing an order online.
              </AccordionContent>
            </AccordionItem>

            {/* Accordion Item 4: Order tracking */}
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left">
                <div className="flex items-center space-x-3">
                  <Truck className="h-5 w-5 text-orange-600 flex-shrink-0" />
                  <span className="font-semibold text-lg">How can I track my order?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed pl-8">
                Once your order ships, you'll receive an email with a tracking number. You can use this 
                tracking number on the USPS website to see your package's current location and estimated 
                delivery date. You can also view your order status in your account dashboard if you're logged in.
              </AccordionContent>
            </AccordionItem>

            {/* Accordion Item 5: Payment methods */}
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left">
                <div className="flex items-center space-x-3">
                  <DollarSign className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                  <span className="font-semibold text-lg">What payment methods do you accept?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed pl-8">
                We accept all major credit cards (Visa, Mastercard, American Express, Discover) and PayPal. 
                All payments are processed securely through our encrypted payment system. We do not store your 
                full payment information for security reasons.
              </AccordionContent>
            </AccordionItem>

            {/* Accordion Item 6: Shipping times */}
            <AccordionItem value="item-6">
              <AccordionTrigger className="text-left">
                <div className="flex items-center space-x-3">
                  <Truck className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <span className="font-semibold text-lg">How long does shipping take?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed pl-8">
                Standard orders typically take 8-12 business days from order date (3-5 days processing + 5-7 days shipping). 
                Express shipping (available for orders over $50) takes 5-8 business days total. Custom orders may require 
                additional processing time. For detailed shipping information, visit our 
                <Link href="/shipping" className="text-blue-600 hover:underline"> shipping info page</Link>.
              </AccordionContent>
            </AccordionItem>

            {/* Accordion Item 7: Returns and refunds */}
            <AccordionItem value="item-7">
              <AccordionTrigger className="text-left">
                <div className="flex items-center space-x-3">
                  <Package className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span className="font-semibold text-lg">What is your return policy?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed pl-8">
                We accept returns within 14 days of delivery for unused items in original condition. Custom orders 
                and personalized items are generally not returnable unless there's a manufacturing defect. If you 
                receive a damaged or defective item, please <Link href="/contact" className="text-blue-600 hover:underline">contact us immediately</Link> 
                with photos, and we'll send a replacement or provide a full refund. Please note that return shipping 
                costs are the customer's responsibility unless the item was damaged or incorrect.
              </AccordionContent>
            </AccordionItem>

            {/* Accordion Item 8: File formats */}
            <AccordionItem value="item-8">
              <AccordionTrigger className="text-left">
                <div className="flex items-center space-x-3">
                  <FileQuestion className="h-5 w-5 text-purple-600 flex-shrink-0" />
                  <span className="font-semibold text-lg">What file formats do you accept for custom orders?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed pl-8">
                We accept common 3D model file formats including STL, OBJ, STEP, and 3MF. STL is the most common 
                and recommended format. Make sure your file is properly oriented and scaled before uploading. 
                If you're not sure about your file, feel free to <Link href="/contact" className="text-blue-600 hover:underline">contact us</Link> 
                and we can review it with you before printing.
              </AccordionContent>
            </AccordionItem>

            {/* Accordion Item 9: International shipping */}
            <AccordionItem value="item-9">
              <AccordionTrigger className="text-left">
                <div className="flex items-center space-x-3">
                  <Truck className="h-5 w-5 text-teal-600 flex-shrink-0" />
                  <span className="font-semibold text-lg">Do you ship internationally?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed pl-8">
                Currently, we only ship within the United States (all 50 states, Washington D.C., and U.S. territories). 
                We're working on expanding our shipping options to include international destinations in the future. 
                If you're outside the U.S. and interested in our products, please 
                <Link href="/contact" className="text-blue-600 hover:underline"> contact us</Link> to discuss options.
              </AccordionContent>
            </AccordionItem>

            {/* Accordion Item 10: Color options */}
            <AccordionItem value="item-10">
              <AccordionTrigger className="text-left">
                <div className="flex items-center space-x-3">
                  <Package className="h-5 w-5 text-pink-600 flex-shrink-0" />
                  <span className="font-semibold text-lg">What colors are available?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed pl-8">
                We offer a wide variety of colors in our standard materials. Common colors include black, white, 
                red, blue, green, yellow, and many more. Available colors may vary by material type. If you need 
                a specific color, please mention it when placing your order or 
                <Link href="/contact" className="text-blue-600 hover:underline"> contact us</Link> to check availability. 
                For custom orders, we can work with you to find the perfect color match.
              </AccordionContent>
            </AccordionItem>

            {/* Accordion Item 11: Minimum order quantity */}
            <AccordionItem value="item-11">
              <AccordionTrigger className="text-left">
                <div className="flex items-center space-x-3">
                  <DollarSign className="h-5 w-5 text-amber-600 flex-shrink-0" />
                  <span className="font-semibold text-lg">Is there a minimum order quantity?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed pl-8">
                No, there's no minimum order quantity! You can order a single item or multiple items. We're happy 
                to fulfill orders of any size. However, bulk orders (10+ of the same item) may qualify for volume 
                discounts. <Link href="/contact" className="text-blue-600 hover:underline">Contact us</Link> if you're 
                interested in bulk pricing.
              </AccordionContent>
            </AccordionItem>

            {/* Accordion Item 12: Product durability */}
            <AccordionItem value="item-12">
              <AccordionTrigger className="text-left">
                <div className="flex items-center space-x-3">
                  <HelpCircle className="h-5 w-5 text-cyan-600 flex-shrink-0" />
                  <span className="font-semibold text-lg">How durable are 3D printed products?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed pl-8">
                Durability depends on the material used and the application. PLA products are great for decorative 
                items and light use. PETG and ABS are more durable and suitable for functional parts. With proper 
                care, 3D printed items can last for years. Avoid exposing them to excessive heat (especially PLA) 
                or harsh chemicals. If you need something for a specific use case, let us know and we can recommend 
                the best material for your needs.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Still Have Questions Section */}
      {/* WHY: Directs users to contact if they need more help */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            {/* MessageSquare icon represents contact/communication */}
            <div className="bg-white bg-opacity-20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="h-10 w-10" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Still Have Questions?
            </h2>
            <p className="text-xl mb-8 text-blue-100 leading-relaxed">
              Can't find what you're looking for? Our team is here to help! 
              Reach out to us and we'll get back to you as soon as possible.
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

