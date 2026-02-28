import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ReactSketchCanvas, type ReactSketchCanvasRef } from "react-sketch-canvas";
import { Pencil, Upload, Loader2, CheckCircle, Clock, XCircle, Sparkles, Undo2, Redo2, Eraser, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useHasSubscription,
  useApprovedDesigns,
  useMyDesigns,
  useSubmitDesign,
  useDeleteDesign,
  type CoCreatorDesignWithProduct,
} from "@/hooks/useCoCreator";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const CoCreators = () => {
  const { user } = useAuth();
  const { data: hasSubscription, isLoading: subLoading } = useHasSubscription();
  const { data: approved } = useApprovedDesigns();
  const { data: myDesigns, isLoading: myLoading } = useMyDesigns();
  const submitDesign = useSubmitDesign();
  const deleteDesign = useDeleteDesign();
  const [designToDelete, setDesignToDelete] = useState<string | null>(null);
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");

  const handleSketchSubmit = async () => {
    if (!canvasRef.current) return;
    try {
      const dataUrl = await canvasRef.current.exportImage("png");
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      if (blob.size < 100) {
        toast({ title: "Please draw something first", variant: "destructive" });
        return;
      }
      await submitDesign.mutateAsync({ imageFile: blob, source: "sketch", title: title || undefined });
      setTitle("");
      canvasRef.current.resetCanvas();
      toast({ title: "Design submitted! We'll review it soon." });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to submit";
      toast({ title: "Submission failed", description: msg, variant: "destructive" });
      console.error(e);
    }
  };

  const handleUploadSubmit = async () => {
    if (!uploadFile) return;
    try {
      await submitDesign.mutateAsync({ imageFile: uploadFile, source: "upload", title: title || undefined });
      setTitle("");
      setUploadFile(null);
      toast({ title: "Design submitted! We'll review it soon." });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to submit";
      toast({ title: "Submission failed", description: msg, variant: "destructive" });
      console.error(e);
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    if (status === "approved")
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
          <CheckCircle className="h-3 w-3" /> Approved
        </span>
      );
    if (status === "rejected")
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">
          <XCircle className="h-3 w-3" /> Rejected
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
        <Clock className="h-3 w-3" /> Pending
      </span>
    );
  };

  // Not logged in
  if (!user) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center min-h-[60vh] px-6">
        <div className="h-20 w-20 rounded-full bg-accent flex items-center justify-center mb-3">
          <Sparkles className="h-10 w-10 text-primary" />
        </div>
        <h1 className="font-display text-2xl font-bold mb-1">Co-creators</h1>
        <p className="text-muted-foreground text-sm mb-6 text-center">
          Sign in to submit your designs and access the Co-creators page
        </p>
        <Button asChild>
          <Link to="/login">Sign In</Link>
        </Button>
        <p className="mt-3 text-sm text-muted-foreground">
          New here? <Link to="/register" className="text-primary hover:underline">Create account</Link>
        </p>
      </div>
    );
  }

  // Subscription required
  if (!subLoading && !hasSubscription) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center min-h-[60vh] px-6">
        <div className="h-20 w-20 rounded-full bg-accent flex items-center justify-center mb-3">
          <Sparkles className="h-10 w-10 text-primary" />
        </div>
        <h1 className="font-display text-2xl font-bold mb-1">Co-creators</h1>
        <p className="text-muted-foreground text-sm mb-6 text-center max-w-sm">
          Subscribe to access the Co-creators page — sketch or upload your designs, get them approved, and sell them.
        </p>
        <Button asChild>
          <Link to="/subscribe">Subscribe to Access</Link>
        </Button>
        <p className="mt-4 text-xs text-muted-foreground text-center">
          Subscription is required to submit and sell your designs.
        </p>
      </div>
    );
  }

  // Main Co-creators page
  return (
    <div className="animate-fade-in px-4 py-6 pb-24">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Co-creators</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Sketch or upload your design. We&apos;ll approve the best ones and sell them.
        </p>
      </div>

      <Tabs defaultValue="sketch" className="mb-8">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="sketch" className="gap-2">
            <Pencil className="h-4 w-4" /> Sketch
          </TabsTrigger>
          <TabsTrigger value="upload" className="gap-2">
            <Upload className="h-4 w-4" /> Upload
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sketch">
          <div className="rounded-xl border border-border overflow-hidden bg-white mb-4">
            <ReactSketchCanvas
              ref={canvasRef}
              strokeColor="#2c1810"
              strokeWidth={3}
              canvasColor="#faf8f5"
              style={{ width: "100%", height: 280 }}
            />
          </div>
          <div className="flex gap-2 mb-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => canvasRef.current?.undo()}
              className="flex-1"
            >
              <Undo2 className="h-4 w-4 mr-1" /> Undo
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => canvasRef.current?.redo()}
              className="flex-1"
            >
              <Redo2 className="h-4 w-4 mr-1" /> Redo
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => canvasRef.current?.resetCanvas()}
              className="flex-1"
            >
              <Eraser className="h-4 w-4 mr-1" /> Clear
            </Button>
          </div>
          <div className="space-y-2 mb-4">
            <Label htmlFor="sketch-title">Design title (optional)</Label>
            <Input
              id="sketch-title"
              placeholder="e.g. Festive Lehenga"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <Button
            className="w-full"
            onClick={handleSketchSubmit}
            disabled={submitDesign.isPending}
          >
            {submitDesign.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Submit Design
          </Button>
        </TabsContent>

        <TabsContent value="upload">
          <div className="rounded-xl border-2 border-dashed border-border p-8 text-center mb-4 bg-accent/30">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="design-upload"
              onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
            />
            <label
              htmlFor="design-upload"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <Upload className="h-10 w-10 text-muted-foreground" />
              <span className="text-sm font-medium text-primary">
                {uploadFile ? uploadFile.name : "Choose image to upload"}
              </span>
            </label>
          </div>
          <div className="space-y-2 mb-4">
            <Label htmlFor="upload-title">Design title (optional)</Label>
            <Input
              id="upload-title"
              placeholder="e.g. Festive Lehenga"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <Button
            className="w-full"
            onClick={handleUploadSubmit}
            disabled={!uploadFile || submitDesign.isPending}
          >
            {submitDesign.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Submit Design
          </Button>
        </TabsContent>
      </Tabs>

      {/* My designs */}
      <section className="mb-8">
        <h2 className="font-display text-lg font-semibold mb-3">My designs</h2>
        {myLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : !myDesigns?.length ? (
          <p className="text-sm text-muted-foreground">No designs submitted yet.</p>
        ) : (
          <>
          <div className="grid grid-cols-2 gap-3">
            {myDesigns.map((d) => (
              <div key={d.id} className="rounded-xl border border-border overflow-hidden bg-card relative group">
                <div className="aspect-square bg-accent relative">
                  <img
                    src={d.image_url}
                    alt={d.title || "Design"}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <StatusBadge status={d.status} />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setDesignToDelete(d.id);
                      }}
                      className="rounded-full bg-destructive/90 p-1.5 text-destructive-foreground hover:bg-destructive transition-colors"
                      aria-label="Delete design"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="p-2">
                  <p className="font-body text-xs font-medium truncate">{d.title || "Untitled"}</p>
                  <p className="text-xs text-muted-foreground capitalize">{d.source}</p>
                </div>
              </div>
            ))}
          </div>
          <AlertDialog open={!!designToDelete} onOpenChange={(open) => !open && setDesignToDelete(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete design?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently remove your design. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button
                  variant="destructive"
                  onClick={async () => {
                    if (designToDelete) {
                      try {
                        await deleteDesign.mutateAsync(designToDelete);
                        toast({ title: "Design deleted" });
                        setDesignToDelete(null);
                      } catch (e) {
                        toast({ title: "Failed to delete", description: (e as Error).message, variant: "destructive" });
                      }
                    }
                  }}
                  disabled={deleteDesign.isPending}
                >
                  {deleteDesign.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          </>
        )}
      </section>

      {/* Approved designs for sale */}
      <section>
        <h2 className="font-display text-lg font-semibold mb-3">Approved designs</h2>
        {!approved?.length ? (
          <p className="text-sm text-muted-foreground">
            Approved designs will appear here. Our team reviews submissions regularly.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {approved.map((d: CoCreatorDesignWithProduct) => {
              const slug = d.products?.slug;
              return (
              <Link
                key={d.id}
                to={slug ? `/product/${slug}` : "#"}
                className="rounded-xl border border-border overflow-hidden bg-card block"
              >
                <div className="aspect-square bg-accent">
                  <img
                    src={d.image_url}
                    alt={d.title || "Design"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-2">
                  <p className="font-body text-xs font-medium truncate">{d.title || "Design"}</p>
                  {slug ? (
                    <span className="text-xs text-primary">View product →</span>
                  ) : (
                    <span className="text-xs text-muted-foreground">Coming to shop soon</span>
                  )}
                </div>
              </Link>
            );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default CoCreators;
