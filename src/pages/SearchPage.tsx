import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const { data: allProducts } = useProducts();

  const filtered = allProducts?.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description?.toLowerCase().includes(query.toLowerCase()) ||
      p.mythology_theme?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="animate-fade-in px-4 py-4">
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, theme, or description..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
          autoFocus
        />
      </div>

      {query.length > 0 ? (
        <>
          <p className="text-sm text-muted-foreground mb-4">{filtered?.length ?? 0} results</p>
          {filtered && filtered.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <span className="text-4xl mb-4">🔍</span>
              <p className="text-muted-foreground">No results found for "{query}"</p>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <span className="text-4xl mb-4">✨</span>
          <p>Start typing to discover pieces</p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
