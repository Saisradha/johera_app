import { Link } from "react-router-dom";
import { ChevronRight, Package, MapPin, CreditCard, Settings, HelpCircle } from "lucide-react";

const menuItems = [
  { label: "Orders", icon: Package, to: "/orders" },
  { label: "Addresses", icon: MapPin, to: "/profile/addresses" },
  { label: "Payment Methods", icon: CreditCard, to: "/profile/payments" },
  { label: "Settings", icon: Settings, to: "/profile/settings" },
  { label: "Help & Support", icon: HelpCircle, to: "/help" },
];

const Profile = () => (
  <div className="animate-fade-in px-4 py-6">
    {/* Avatar + Name */}
    <div className="flex flex-col items-center mb-8">
      <div className="h-20 w-20 rounded-full bg-accent flex items-center justify-center mb-3">
        <span className="font-display text-2xl text-accent-foreground">J</span>
      </div>
      <h1 className="font-display text-xl font-bold">Guest User</h1>
      <Link to="/login" className="text-sm text-primary font-medium mt-1">
        Sign In
      </Link>
    </div>

    {/* Menu */}
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
  </div>
);

export default Profile;
