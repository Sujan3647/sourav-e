"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Camera, Edit, LogOut, Check, X, MapPin, Phone, MessageCircle, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"

export default function AccountPage() {
  const { state: authState, updateUser, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: authState.user?.name,
    phone: authState.user?.phone || "+9153652365",
    whatsapp: authState.user?.whatsapp || "+91763246723",
    gender: authState.user?.gender || "Men",
    address: authState.user?.address || "North Duragamar, khowai",
    landmark: "near ABC school",
  })

  const handleSave = async () => {
    try {
      await updateUser(formData)
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating profile:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  if (!authState.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
              <User className="w-8 h-8 text-slate-400" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Access Required</h1>
              <p className="text-slate-600 mt-2">Please login to view your account</p>
            </div>
            <Link href="/login">
              <Button className="w-full">Login to Continue</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-8 max-w-4xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center space-x-3">
            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.div
                  key="editing"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex space-x-2"
                >
                  <Button onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700">
                    <Check className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                    className="border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="not-editing"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex space-x-2"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit Profile
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50">
              <CardContent className="pt-8 pb-6">
                <div className="text-center space-y-4">
                  <div className="relative inline-block">
                    <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {formData.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -bottom-2 -right-2">
                        <Button size="sm" className="rounded-full w-8 h-8 p-0 bg-blue-600 hover:bg-blue-700">
                          <Camera className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{formData.name}</h2>
                    <Badge variant="secondary" className="mt-2 bg-blue-100 text-blue-700">
                      {formData.gender}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Details Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-6">Personal Information</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Name Field */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700 flex items-center">
                          <User className="w-4 h-4 mr-2 text-slate-400" />
                          Full Name
                        </Label>
                        {isEditing ? (
                          <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="text-slate-900 font-medium bg-slate-50 p-3 rounded-lg">{formData.name}</p>
                        )}
                      </div>

                      {/* Gender Field */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">Gender</Label>
                        {isEditing ? (
                          <RadioGroup
                            value={formData.gender}
                            onValueChange={(value) => setFormData({ ...formData, gender: value as "Men" | "Women" })}
                            className="flex space-x-6 pt-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Men" id="men" />
                              <Label htmlFor="men" className="font-normal">
                                Men
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Women" id="women" />
                              <Label htmlFor="women" className="font-normal">
                                Women
                              </Label>
                            </div>
                          </RadioGroup>
                        ) : (
                          <p className="text-slate-900 font-medium bg-slate-50 p-3 rounded-lg">{formData.gender}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-6">Contact Information</h3>
                    <div className="space-y-6">
                      {/* Phone Field */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700 flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-slate-400" />
                          Phone Number
                        </Label>
                        {isEditing ? (
                          <Input
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="text-slate-900 font-medium bg-slate-50 p-3 rounded-lg">{formData.phone}</p>
                        )}
                      </div>

                      {/* WhatsApp Field */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700 flex items-center">
                          <MessageCircle className="w-4 h-4 mr-2 text-green-500" />
                          WhatsApp Number
                        </Label>
                        {isEditing ? (
                          <div className="flex space-x-2">
                            <Input
                              value={formData.whatsapp}
                              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                              className="border-slate-200 focus:border-blue-500 focus:ring-blue-500 flex-1"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-green-200 text-green-600 hover:bg-green-50 bg-transparent"
                            >
                              Verify
                            </Button>
                          </div>
                        ) : (
                          <p className="text-slate-900 font-medium bg-slate-50 p-3 rounded-lg">{formData.whatsapp}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-6">Address Information</h3>
                    <div className="space-y-6">
                      {/* Address Field */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700 flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                          Address
                        </Label>
                        {isEditing ? (
                          <Input
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="text-slate-900 font-medium bg-slate-50 p-3 rounded-lg">{formData.address}</p>
                        )}
                      </div>

                      {/* Landmark Field */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">Landmark</Label>
                        {isEditing ? (
                          <Input
                            value={formData.landmark}
                            onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                            className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Nearby landmark or reference point"
                          />
                        ) : (
                          <p className="text-slate-900 font-medium bg-slate-50 p-3 rounded-lg">{formData.landmark}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
