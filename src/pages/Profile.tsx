import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Package, MapPin, CreditCard, Settings, HelpCircle, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const menuItems = [
  { label: "Orders", icon: Package, to: "/orders" },
  { label: "Addresses", icon: MapPin, to: "/profile/addresses" },
  { label: "Payment Methods", icon: CreditCard, to: "/profile/payments" },
  { label: "Settings", icon: Settings, to: "/profile/settings" },
  { label: "Help & Support", icon: HelpCircle, to: "/help" },
];

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center min-h-[60vh] px-6">
        <div className="h-20 w-20 rounded-full bg-accent flex items-center justify-center mb-3">
          <span className="font-display text-2xl text-accent-foreground">J</span>
        </div>
        <h1 className="font-display text-xl font-bold mb-1">Guest User</h1>
        <p className="text-muted-foreground text-sm mb-6">Sign in to access your account</p>
        <Button asChild><Link to="/login">Sign In</Link></Button>
        <p className="mt-3 text-sm text-muted-foreground">
          New here? <Link to="/register" className="text-primary hover:underline">Create account</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in px-4 py-6">
      <div className="flex flex-col items-center mb-8">
        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-3">
          <span className="font-display text-2xl text-primary">
            {user.email?.[0]?.toUpperCase() ?? "U"}
          </span>
        </div>
        <h1 className="font-display text-xl font-bold">{user.email}</h1>
      </div>

      <div className="space-y-1">
        {menuItems.map(({ label, icon: Icon, to }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center justify-between rounded-lg px-4 py-3 transition-colors hover:bg-accent"
          >
            <div className="flex items-center gap-3">
              <Icon className="h-5 w-5 text-muted-foreground" />
              <span className="font-body text-sm font-medium">{label}</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:text-destructive"
          onClick={async () => {
            await signOut();
            navigate("/");
          }}
        >
          <LogOut className="h-5 w-5" /> Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Profile;
