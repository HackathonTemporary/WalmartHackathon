import { useState } from "react";
import Layout from "@/components/Layout";
import { fakeApi, NodeInfo } from "@/lib/fakeApi";
import {
  Phone,
  MapPin,
  Store,
  CheckCircle,
  ArrowRight,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type OnboardingStep = "phone" | "profile" | "assignment" | "complete";

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("phone");
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [shopProfile, setShopProfile] = useState({
    name: "",
    location: "",
    type: "Kirana Store",
  });
  const [assignedNode, setAssignedNode] = useState<NodeInfo | null>(null);

  const handlePhoneVerification = async () => {
    if (!phoneNumber || phoneNumber.length < 10) return;

    setIsLoading(true);
    // Simulate phone verification
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep("profile");
    }, 1500);
  };

  const handleProfileSubmit = async () => {
    if (!shopProfile.name || !shopProfile.location) return;

    setIsLoading(true);
    try {
      const node = await fakeApi.getNodeAssignment();
      setAssignedNode(node);
      setCurrentStep("assignment");
    } catch (error) {
      console.error("Error getting node assignment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    setCurrentStep("complete");
  };

  const renderPhoneStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Phone className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Verify Your Phone
        </h2>
        <p className="text-muted-foreground">
          Enter your phone number to get started with the AI-Powered Hyperlocal
          Network
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+91 98765 43210"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="mt-1"
          />
        </div>
        <Button
          onClick={handlePhoneVerification}
          disabled={!phoneNumber || phoneNumber.length < 10 || isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              Send OTP
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );

  const renderProfileStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10">
            <Store className="h-8 w-8 text-secondary" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Shop Profile
        </h2>
        <p className="text-muted-foreground">
          Tell us about your shop to get the best AI recommendations
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="shopName">Shop Name</Label>
          <Input
            id="shopName"
            placeholder="Sharma General Store"
            value={shopProfile.name}
            onChange={(e) =>
              setShopProfile({ ...shopProfile, name: e.target.value })
            }
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="Andheri West, Mumbai"
            value={shopProfile.location}
            onChange={(e) =>
              setShopProfile({ ...shopProfile, location: e.target.value })
            }
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="type">Shop Type</Label>
          <select
            id="type"
            value={shopProfile.type}
            onChange={(e) =>
              setShopProfile({ ...shopProfile, type: e.target.value })
            }
            className="w-full mt-1 px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="Kirana Store">Kirana Store</option>
            <option value="General Store">General Store</option>
            <option value="Provision Store">Provision Store</option>
            <option value="Supermarket">Supermarket</option>
          </select>
        </div>
        <Button
          onClick={handleProfileSubmit}
          disabled={!shopProfile.name || !shopProfile.location || isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );

  const renderAssignmentStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Assignment Complete!
        </h2>
        <p className="text-muted-foreground">
          You've been assigned to a network node
        </p>
      </div>

      {assignedNode && (
        <div className="rounded-2xl border bg-gradient-to-br from-green-50 to-blue-50 p-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">
                Welcome to {assignedNode.name}!
              </h3>
              <p className="text-muted-foreground mt-1">
                {assignedNode.type} • {assignedNode.location}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
              <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/50">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Central Location</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/50">
                <Store className="h-4 w-4 text-secondary" />
                <span className="text-sm font-medium">5 Partner Nodes</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <Button onClick={handleComplete} className="w-full" size="lg">
        Start Using Network
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 animate-pulse">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">All Set! 🎉</h2>
        <p className="text-muted-foreground">
          Your shop is now part of the AI-Powered Hyperlocal Network
        </p>
      </div>

      <div className="rounded-2xl border bg-gradient-to-br from-primary/10 to-secondary/10 p-6">
        <div className="text-center space-y-4">
          <h3 className="font-semibold text-foreground">What's Next?</h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>✓ AI will start analyzing your inventory patterns</p>
            <p>✓ You'll receive smart restock recommendations</p>
            <p>✓ Connect with nearby nodes for inventory swaps</p>
            <p>✓ Access real-time market insights</p>
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        <Button onClick={() => (window.location.href = "/")} className="flex-1">
          Go to Dashboard
        </Button>
        <Button
          onClick={() => (window.location.href = "/swap")}
          variant="outline"
          className="flex-1"
        >
          Explore Swaps
        </Button>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="max-w-md mx-auto pb-20 md:pb-6">
        <div className="rounded-2xl border bg-card p-8 shadow-sm">
          {currentStep === "phone" && renderPhoneStep()}
          {currentStep === "profile" && renderProfileStep()}
          {currentStep === "assignment" && renderAssignmentStep()}
          {currentStep === "complete" && renderCompleteStep()}
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mt-6 space-x-2">
          {["phone", "profile", "assignment", "complete"].map((step, index) => (
            <div
              key={step}
              className={`h-2 w-8 rounded-full transition-colors ${
                ["phone", "profile", "assignment", "complete"].indexOf(
                  currentStep,
                ) >= index
                  ? "bg-primary"
                  : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}
