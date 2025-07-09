"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, MapPin, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"

export default function CheckoutPage() {
  const { state: cartState } = useCart()
  const { state: authState } = useAuth()
  const [step, setStep] = useState(1)
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false)
  const [newAddress, setNewAddress] = useState({
    name: "",
    address: "",
    phone: "",
  })

  const additionalFees = 50
  const orderTotal = cartState.total + additionalFees

  const handleAddressSubmit = () => {
    setDeliveryAddress(`${newAddress.name}, ${newAddress.address}, ${newAddress.phone}`)
    setIsAddressDialogOpen(false)
    setNewAddress({ name: "", address: "", phone: "" })
  }

  if (cartState.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No items to checkout</h1>
          <Link href="/">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Link href="/cart">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Review Your order
          </Button>
        </Link>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            1
          </div>
          <span className="text-sm">Review</span>
          <div className="w-16 h-0.5 bg-gray-300"></div>
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            2
          </div>
          <span className="text-sm">Payment</span>
        </div>
      </div>

      {/* Order Items */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          {cartState.items.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 mb-4 last:mb-0">
              <Image
                src={item.product.image || "/placeholder.svg"}
                alt={item.product.name}
                width={60}
                height={60}
                className="rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-semibold">{item.product.name}</h4>
                <p className="text-blue-600 font-bold">₹{item.product.price}</p>
                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Delivery Address */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Delivery Address
          </CardTitle>
        </CardHeader>
        <CardContent>
          {deliveryAddress ? (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p>{deliveryAddress}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 bg-transparent"
                onClick={() => setIsAddressDialogOpen(true)}
              >
                Change Address
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Show existing user address if available */}
              {authState.user?.address && (
                <div className="p-4 bg-blue-50 rounded-lg border">
                  <h4 className="font-semibold mb-2">Your Saved Address</h4>
                  <p className="text-sm text-gray-700 mb-3">{authState.user.address}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setDeliveryAddress(authState?.user?.address || "")
                      setIsAddressDialogOpen(false)
                    }}
                  >
                    Use This Address
                  </Button>
                </div>
              )}

              {/* Add new address section */}
              <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    {authState.user?.address ? "Add New Address" : "Select Delivery Address"}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                      Select Delivery Address
                      <Button variant="ghost" size="sm" onClick={() => setIsAddressDialogOpen(false)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div className="text-sm font-medium">+ ADD NEW DELIVERY ADDRESS</div>

                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="name">Customer Name</Label>
                        <Input
                          id="name"
                          value={newAddress.name}
                          onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                          placeholder="Enter your name"
                        />
                      </div>

                      <div>
                        <Label htmlFor="address">Full Address</Label>
                        <Input
                          id="address"
                          value={newAddress.address}
                          onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                          placeholder="Enter your full address"
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                          placeholder="Enter your phone number"
                        />
                      </div>

                      <Button onClick={handleAddressSubmit} className="w-full">
                        Deliver to this Address
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Price Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Price Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Product Price</span>
              <span>+{cartState.total}</span>
            </div>
            <div className="flex justify-between">
              <span>Additional Fees</span>
              <span>+{additionalFees}</span>
            </div>
            <hr />
            <div className="flex justify-between font-bold text-lg">
              <span>Order Total</span>
              <span>+{orderTotal}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="relative max-md:hidden left-0 right-0 bg-white border-t p-4">
        <div className="container mx-auto">
          {step === 1 ? (
            <Button
              size="lg"
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => setStep(2)}
              disabled={!deliveryAddress}
            >
              Proceed to Payment
            </Button>
          ) : (
            <Button size="lg" className="w-full bg-green-600 hover:bg-green-700">
              Place Order
            </Button>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="fixed max-sm:bottom-16 left-0 right-0 bg-white border-t p-4">
        <div className="container mx-auto">
          {step === 1 ? (
            <Button
              size="lg"
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => setStep(2)}
              disabled={!deliveryAddress}
            >
              Proceed to Payment
            </Button>
          ) : (
            <Button size="lg" className="w-full bg-green-600 hover:bg-green-700">
              Place Order
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
