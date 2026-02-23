import { Search, Bell, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border safe-top">
      <div className="flex items-center justify-between px-4 h-14">
        <Link to="/" className="font-display text-xl font-bold tracking-wider text-primary">
          JOHERA
        </Link>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/search" aria-label="Search">
              <Search className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link to="/notifications" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link to="/cart" aria-label="Shopping cart">
              <ShoppingBag className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
