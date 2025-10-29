'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  Store, 
  Mail, 
  Shield, 
  CreditCard, 
  Bell,
  Save,
  Upload,
  Download
} from 'lucide-react'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // Store Settings
    storeName: '3D Print Shop',
    storeDescription: 'High-quality custom 3D printed products for every need.',
    storeEmail: 'contact@3dprintshop.com',
    storePhone: '+1 (555) 123-4567',
    storeAddress: '123 Print Street, Tech City, TC 12345',
    
    // Business Settings
    currency: 'USD',
    timezone: 'America/New_York',
    taxRate: 8.5,
    shippingRate: 5.99,
    
    // Notification Settings
    emailNotifications: true,
    orderNotifications: true,
    lowStockNotifications: true,
    customerNotifications: true,
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordPolicy: 'strong',
    
    // Payment Settings
    stripeEnabled: true,
    paypalEnabled: false,
    cashOnDelivery: true
  })

  const [loading, setLoading] = useState(false)

  const handleInputChange = (field: string, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // In a real application, you would save these settings to your database
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      console.log('Settings saved:', settings)
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your shop configuration and preferences</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Config
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import Config
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Store Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Store className="h-5 w-5" />
              <span>Store Information</span>
            </CardTitle>
            <CardDescription>Basic information about your 3D print shop</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="storeName">Store Name</Label>
              <Input
                id="storeName"
                value={settings.storeName}
                onChange={(e) => handleInputChange('storeName', e.target.value)}
                placeholder="Your Store Name"
              />
            </div>
            
            <div>
              <Label htmlFor="storeDescription">Store Description</Label>
              <Textarea
                id="storeDescription"
                value={settings.storeDescription}
                onChange={(e) => handleInputChange('storeDescription', e.target.value)}
                placeholder="Describe your store..."
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="storeEmail">Contact Email</Label>
              <Input
                id="storeEmail"
                type="email"
                value={settings.storeEmail}
                onChange={(e) => handleInputChange('storeEmail', e.target.value)}
                placeholder="contact@yourstore.com"
              />
            </div>
            
            <div>
              <Label htmlFor="storePhone">Phone Number</Label>
              <Input
                id="storePhone"
                value={settings.storePhone}
                onChange={(e) => handleInputChange('storePhone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            
            <div>
              <Label htmlFor="storeAddress">Store Address</Label>
              <Textarea
                id="storeAddress"
                value={settings.storeAddress}
                onChange={(e) => handleInputChange('storeAddress', e.target.value)}
                placeholder="123 Main St, City, State 12345"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Business Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Business Settings</span>
            </CardTitle>
            <CardDescription>Configure pricing, taxes, and business rules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currency">Currency</Label>
                <select
                  id="currency"
                  value={settings.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CAD">CAD (C$)</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <select
                  id="timezone"
                  value={settings.timezone}
                  onChange={(e) => handleInputChange('timezone', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  step="0.1"
                  value={settings.taxRate}
                  onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value))}
                  placeholder="8.5"
                />
              </div>
              
              <div>
                <Label htmlFor="shippingRate">Shipping Rate ($)</Label>
                <Input
                  id="shippingRate"
                  type="number"
                  step="0.01"
                  value={settings.shippingRate}
                  onChange={(e) => handleInputChange('shippingRate', parseFloat(e.target.value))}
                  placeholder="5.99"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
            </CardTitle>
            <CardDescription>Configure email and system notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailNotifications">Email Notifications</Label>
                <p className="text-sm text-gray-500">Receive email notifications for important events</p>
              </div>
              <Switch
                id="emailNotifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="orderNotifications">Order Notifications</Label>
                <p className="text-sm text-gray-500">Get notified when new orders are placed</p>
              </div>
              <Switch
                id="orderNotifications"
                checked={settings.orderNotifications}
                onCheckedChange={(checked) => handleInputChange('orderNotifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="lowStockNotifications">Low Stock Alerts</Label>
                <p className="text-sm text-gray-500">Receive alerts when inventory is low</p>
              </div>
              <Switch
                id="lowStockNotifications"
                checked={settings.lowStockNotifications}
                onCheckedChange={(checked) => handleInputChange('lowStockNotifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="customerNotifications">Customer Updates</Label>
                <p className="text-sm text-gray-500">Notify customers about order status changes</p>
              </div>
              <Switch
                id="customerNotifications"
                checked={settings.customerNotifications}
                onCheckedChange={(checked) => handleInputChange('customerNotifications', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Security</span>
            </CardTitle>
            <CardDescription>Manage security settings and access controls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
              </div>
              <Switch
                id="twoFactorAuth"
                checked={settings.twoFactorAuth}
                onCheckedChange={(checked) => handleInputChange('twoFactorAuth', checked)}
              />
            </div>
            
            <div>
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
                placeholder="30"
              />
            </div>
            
            <div>
              <Label htmlFor="passwordPolicy">Password Policy</Label>
              <select
                id="passwordPolicy"
                value={settings.passwordPolicy}
                onChange={(e) => handleInputChange('passwordPolicy', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="basic">Basic (6+ characters)</option>
                <option value="medium">Medium (8+ chars, mixed case)</option>
                <option value="strong">Strong (8+ chars, numbers, symbols)</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <Button onClick={handleSave} disabled={loading} size="lg">
          <Save className="h-4 w-4 mr-2" />
          {loading ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  )
}
