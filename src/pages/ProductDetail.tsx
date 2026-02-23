import { useParams } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams();

  return (
    <div className="animate-fade-in px-4 py-6">
      <h1 className="font-display text-2xl font-bold mb-4">Product Detail</h1>
      <p className="text-muted-foreground font-body text-sm">Product #{id} details coming soon.</p>
    </div>
  );
};

export default ProductDetail;
