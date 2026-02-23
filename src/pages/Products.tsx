import { useParams } from "react-router-dom";

const Products = () => {
  const { category } = useParams();

  return (
    <div className="animate-fade-in px-4 py-6">
      <h1 className="font-display text-2xl font-bold mb-4">
        {category ? category.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "All Products"}
      </h1>
      <p className="text-muted-foreground font-body text-sm">Product catalog coming soon.</p>
    </div>
  );
};

export default Products;
