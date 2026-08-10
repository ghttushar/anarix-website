import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, ScanSearch, Download, Mail, RotateCcw, ImagePlus, Link2, Check } from "lucide-react";
import { toast } from "sonner";
import NextStep from "@/website/components/marketing/NextStep";
import PageLayout from "@/website/components/PageLayout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useCountUp } from "@/hooks/useCountUp";
import {
  TARGET_SCORE,
  PRODUCT_LOADING_MESSAGE,
  ANALYZING_MESSAGES,
  GENERATING_MESSAGES,
  EMAIL_SENDING_MESSAGE,
  GENERATION_READY_MESSAGE,
  fetchProduct,
  sendOptimizedImage,
  generateOptimizedImage,
  analyzeProductImage,
  detectProductInput,
  type Marketplace,
  type ListingIssue,
  type Severity,
} from "@/website/lib/listingOptimization";
import heroOriginalUrl from "@/assets/optimization/hero-original.svg";
import ShowcaseSection from "@/website/components/listing-optimization/ShowcaseSection";
import StatsBand from "@/website/components/listing-optimization/StatsBand";
import GradingRulesSection from "@/website/components/listing-optimization/GradingRulesSection";
import TestimonialsSection from "@/website/components/listing-optimization/TestimonialsSection";
import FinalCtaSection from "@/website/components/listing-optimization/FinalCtaSection";

type ListingOptimizationState =
  | "input"
  | "loading-product"
  | "analyzing"
  | "analysis-complete"
  | "generating"
  | "generation-complete";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const severityStyles: Record<Severity, { dot: string; label: string }> = {
  high: { dot: "bg-red-500", label: "High impact" },
  medium: { dot: "bg-amber-500", label: "Medium impact" },
  low: { dot: "bg-green-500", label: "Low impact" },
};

const ScoreNumber = ({ value, suffix = "/10" }: { value: number; suffix?: string }) => {
  const count = useCountUp(value, { duration: 1400 });
  return (
    <span className="tabular-nums" aria-label={`${value.toFixed(1)} out of 10`}>
      {count.toFixed(1)}
      <span className="text-2xl font-semibold text-muted-foreground">{suffix}</span>
    </span>
  );
};

const ListingOptimization = () => {
  const [rawInput, setRawInput] = useState("");
  const [state, setState] = useState<ListingOptimizationState>("input");
  const [marketplace, setMarketplace] = useState<Marketplace | null>(null);
  const [productId, setProductId] = useState<string | null>(null);
  const [productTitle, setProductTitle] = useState<string | null>(null);
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null);
  const [heroImageFailed, setHeroImageFailed] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [issues, setIssues] = useState<ListingIssue[]>([]);
  const [optimizedImageUrl, setOptimizedImageUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusIndex, setStatusIndex] = useState(0);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSending, setEmailSending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const busy = state === "loading-product" || state === "analyzing" || state === "generating";
  const inputEmpty = rawInput.trim() === "";
  const showingProduct = marketplace !== null && productId !== null;
  const detecting = !busy && !inputEmpty && !showingProduct ? detectProductInput(rawInput.trim()) : null;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (state !== "analyzing" && state !== "generating") return;
    setStatusIndex(0);
    const interval = setInterval(() => {
      setStatusIndex((i) => {
        const messages = state === "analyzing" ? ANALYZING_MESSAGES : GENERATING_MESSAGES;
        return (i + 1) % messages.length;
      });
    }, 700);
    return () => clearInterval(interval);
  }, [state]);

  useEffect(() => {
    if (emailModalOpen) emailInputRef.current?.focus();
  }, [emailModalOpen]);

  const handleAnalyze = async () => {
    if (inputEmpty) return;
    setErrorMessage(null);
    setMarketplace(null);
    setProductId(null);
    setProductTitle(null);
    setHeroImageUrl(null);
    setHeroImageFailed(false);
    setScore(null);
    setIssues([]);
    setOptimizedImageUrl(null);
    setState("loading-product");
    setStatusIndex(0);

    try {
      const found = await fetchProduct({ input: rawInput.trim() });
      setMarketplace(found.marketplace);
      setProductId(found.productId);
      setProductTitle(found.title);
      setHeroImageUrl(found.heroImage);
      setState("analyzing");
      setStatusIndex(0);
      const minAnalysis = 2800 + Math.random() * 1000;
      await sleep(minAnalysis);
      const { score: s, issues: list } = analyzeProductImage(found.productId);
      setScore(s);
      setIssues(list);
      setState("analysis-complete");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "We couldn't analyze your product right now.");
      setState("input");
    }
  };

  const handleGenerate = async () => {
    if (!marketplace || !productId || !heroImageUrl) return;
    setState("generating");
    setStatusIndex(0);
    const url = await generateOptimizedImage({
      sourceImage: heroImageUrl,
      productId,
      marketplace,
    });
    setOptimizedImageUrl(url);
    setState("generation-complete");
  };

  const handleReset = () => {
    setState("input");
    setRawInput("");
    setMarketplace(null);
    setProductId(null);
    setProductTitle(null);
    setHeroImageUrl(null);
    setScore(null);
    setIssues([]);
    setOptimizedImageUrl(null);
    setErrorMessage(null);
    setEmail("");
    setEmailError(null);
    setEmailSending(false);
  };

  const handleSendImage = async () => {
    const normalized = email.trim();
    if (!EMAIL_REGEX.test(normalized)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    if (!marketplace || !productId || !optimizedImageUrl) return;
    setEmailError(null);
    setEmailSending(true);
    try {
      await sendOptimizedImage({
        email: normalized,
        imageUrl: optimizedImageUrl,
        productId,
        marketplace,
      });
      setEmailModalOpen(false);
      setEmail("");
      setEmailSending(false);
      toast.success("Your optimized image has been sent to your email.");
    } catch (err) {
      setEmailSending(false);
      setEmailError(err instanceof Error ? err.message : "We couldn't send your image right now. Please try again.");
    }
  };

  const heroImageSrc =
    state === "generation-complete" && optimizedImageUrl
      ? optimizedImageUrl
      : showingProduct && heroImageUrl && !heroImageFailed
        ? heroImageUrl
        : heroOriginalUrl;

  const statusLine = (() => {
    if (state === "loading-product") return { message: PRODUCT_LOADING_MESSAGE, loading: true };
    if (state === "analyzing") return { message: ANALYZING_MESSAGES[statusIndex], loading: true };
    if (state === "generating") return { message: GENERATING_MESSAGES[statusIndex], loading: true };
    return { message: "", loading: false };
  })();

  const criticalIssues = issues.filter((issue) => issue.severity !== "low");
  const recommendations = issues.filter((issue) => issue.severity === "low");

  return (
    <PageLayout>
      <div className="container-wide px-4 sm:px-6 relative">
        {/* Section 1 — Intro */}
        <div className="relative mx-auto max-w-3xl mt-14 mb-10 text-center">
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[480px] h-[320px] rounded-full bg-primary/25 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -top-10 -right-16 w-52 h-52 rounded-full bg-accent/40 blur-3xl" aria-hidden="true" />

          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-elevated px-3 py-1 text-xs font-semibold text-primary backdrop-blur">
              <Sparkles className="w-3.5 h-3.5" />
              Free Listing Analyzer
            </span>
            <h1 className="mt-5 text-4xl sm:text-6xl font-bold tracking-tight text-foreground leading-[1.08]">
              Analyze &amp; Fix Your{" "}
              <span className="text-gradient-primary">Listing Images</span> With AI
            </h1>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Our analyzer predicts how well your product images will perform on
              Amazon and Walmart — paste a link, see your score, and fix the
              poor performers to convert more clicks into sales.
            </p>
            <ul className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {["Amazon ASINs & links", "Walmart IDs & links", "No signup needed"].map((item) => (
                <li
                  key={item}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-surface-elevated/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur"
                >
                  <Check className="w-3 h-3 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Tool card */}
        <motion.div
          id="analyzer"
          className="max-w-4xl mx-auto scroll-mt-24 pad-card-lg rounded-3xl border border-border bg-card shadow-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          <div className="space-y-6">
            {/* Section 2 — Unified paste input */}
            <div className="relative">
              <div className="relative flex items-center gap-2 rounded-pill border border-border bg-background p-1.5 shadow-soft focus-within:ring-2 focus-within:ring-primary/40 transition-shadow">
                <Link2 className="ml-3 w-4 h-4 text-muted-foreground flex-shrink-0" />
                <input
                  ref={inputRef}
                  value={rawInput}
                  onChange={(e) => setRawInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !busy && !inputEmpty && handleAnalyze()}
                  disabled={busy}
                  placeholder="Paste your Amazon or Walmart product link or ID"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  aria-label="Amazon or Walmart product link or ID"
                  className="w-full min-w-0 flex-1 bg-transparent px-1 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none disabled:opacity-50"
                />
                <Button
                  onClick={handleAnalyze}
                  disabled={busy || inputEmpty}
                  className="flex-shrink-0 rounded-pill h-11 px-6 bg-primary text-primary-foreground btn-shine"
                >
                  {state === "analyzing" || state === "loading-product" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing…
                    </>
                  ) : (
                    <>
                      <ScanSearch className="w-4 h-4" />
                      Analyze Image
                    </>
                  )}
                </Button>
              </div>

              {/* Live detection feedback */}
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5 min-h-6" aria-live="polite">
                {detecting && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-foreground">
                    {detecting.marketplace === "amazon" ? "Amazon ·" : "Walmart ·"} {detecting.productId}
                    <Check className="w-3 h-3 text-primary" />
                  </span>
                )}
                {!detecting && !inputEmpty && !busy && (
                  <span className="text-xs text-muted-foreground">We support Amazon &amp; Walmart links and product IDs.</span>
                )}
                {errorMessage && (
                  <span className="text-xs text-destructive" role="alert">
                    {errorMessage}
                  </span>
                )}
              </div>
            </div>

            {/* Product image + results */}
            <div className="rounded-2xl border border-border bg-background p-4 sm:p-6">
              {showingProduct ? (
                <div className="md:grid md:grid-cols-2 md:gap-6 flex flex-col gap-6">
                  {/* Product image */}
                  <div className="max-w-xs w-full mx-auto md:max-w-none">
                    <div className="relative aspect-square overflow-hidden rounded-xl border border-border/60">
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={heroImageSrc}
                          src={heroImageSrc}
                          onError={() => setHeroImageFailed(true)}
                          alt={state === "generation-complete" && productId
                            ? `Optimized image for ${productId}`
                            : productId ? `${productId} main listing image` : "Product image"}
                          className={`w-full h-full object-cover ${state === "generating" ? "blur-md scale-105" : ""}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        />
                      </AnimatePresence>
                      {state === "generating" && (
                        <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                          <motion.div
                            className="flex flex-col items-center gap-3"
                            animate={{ scale: [1, 1.06, 1] }}
                            transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                          >
                            <ImagePlus className="w-10 h-10 text-primary" />
                            <p className="text-sm font-medium text-foreground text-center px-4" aria-live="polite">
                              {GENERATING_MESSAGES[statusIndex]}
                            </p>
                          </motion.div>
                        </div>
                      )}
                      {state === "analysis-complete" && score !== null && (
                        <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-surface-elevated/95 border border-border shadow-soft text-sm font-bold text-foreground tabular-nums">
                          <ScoreNumber value={score} />
                        </div>
                      )}
                      {state === "generation-complete" && (
                        <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-primary text-primary-foreground shadow-soft text-sm font-bold tabular-nums">
                          <ScoreNumber value={TARGET_SCORE} />
                        </div>
                      )}
                    </div>
                    <p className="mt-3 text-sm font-semibold text-foreground leading-snug line-clamp-2">
                      {productTitle || productId}
                    </p>
                    <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="inline-flex capitalize rounded-full border border-border px-2 py-0.5 bg-surface-elevated">
                        {marketplace}
                      </span>
                      <span className="tabular-nums">{productId}</span>
                    </p>
                  </div>

                  {/* Status + results */}
                  <div className="flex flex-col justify-center">
                    {statusLine.loading && (
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-8">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        <span aria-live="polite">{statusLine.message}</span>
                      </div>
                    )}

                    {state === "analysis-complete" && score !== null && (
                      <motion.div
                        className="space-y-5"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <div className="rounded-xl bg-accent/40 border border-border/60 p-4">
                          <div className="flex items-baseline justify-between gap-3 flex-wrap">
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Listing Image Score
                              </p>
                              <p className="text-4xl font-bold text-foreground">
                                <ScoreNumber value={score} />
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-foreground">
                                Increase your score to {TARGET_SCORE}/10
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5 max-w-[15rem]">
                                Our optimizer fixes every critical issue with AI-generated enhancements.
                              </p>
                            </div>
                          </div>
                        </div>

                        {criticalIssues.length > 0 && (
                          <div>
                            <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                              Critical issues
                            </p>
                            <ul className="space-y-2">
                              {criticalIssues.map((issue) => {
                                const style = severityStyles[issue.severity];
                                return (
                                  <li key={issue.id} className="flex items-start gap-3 p-3 rounded-xl border border-border/60">
                                    <span className={`mt-1.5 w-2 h-2 rounded-full ${style.dot} flex-shrink-0`} />
                                    <div>
                                      <p className="text-sm font-semibold text-foreground">{issue.title}</p>
                                      <p className="text-xs text-muted-foreground mt-0.5">{issue.detail}</p>
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        )}

                        {recommendations.length > 0 && (
                          <div>
                            <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                              Recommendations
                            </p>
                            <ul className="space-y-2">
                              {recommendations.map((issue) => {
                                const style = severityStyles[issue.severity];
                                return (
                                  <li key={issue.id} className="flex items-start gap-3 p-3 rounded-xl border border-border/60">
                                    <span className={`mt-1.5 w-2 h-2 rounded-full ${style.dot} flex-shrink-0`} />
                                    <div>
                                      <p className="text-sm font-semibold text-foreground">{issue.title}</p>
                                      <p className="text-xs text-muted-foreground mt-0.5">{issue.detail}</p>
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        )}

                        <Button
                          onClick={handleGenerate}
                          className="w-full rounded-pill h-12 bg-primary text-primary-foreground btn-shine"
                        >
                          <Sparkles className="w-4 h-4" />
                          Generate Optimized Image
                        </Button>
                      </motion.div>
                    )}

                    {state === "generation-complete" && (
                      <motion.div
                        className="space-y-4"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 text-sm text-foreground">
                          <p className="font-semibold flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-primary" />
                            {GENERATION_READY_MESSAGE}
                          </p>
                          <p className="text-muted-foreground mt-1 text-xs">
                            Estimated score: {TARGET_SCORE}/10 · raised from{" "}
                            {score !== null ? score.toFixed(1) : "?"}/10.
                          </p>
                        </div>
                        <Button
                          onClick={() => setEmailModalOpen(true)}
                          className="w-full rounded-pill h-11 bg-primary text-primary-foreground btn-shine"
                        >
                          <Download className="w-4 h-4" />
                          Download Image
                        </Button>
                        <button
                          onClick={handleReset}
                          className="mx-auto flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Analyze another product
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="relative max-w-xs mx-auto aspect-square overflow-hidden rounded-xl border border-border/60">
                    <img
                      src={heroOriginalUrl}
                      alt="Product image placeholder"
                      className="w-full h-full object-cover object-center opacity-60"
                    />
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    {state === "loading-product"
                      ? PRODUCT_LOADING_MESSAGE
                      : "Paste any Amazon or Walmart link above — we'll fetch the main image, score it against marketplace rules, and tell you exactly what to fix."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.p
          className="mt-8 text-center text-xs text-muted-foreground max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Free tool — no signup required. Analysis and generation are demonstrations; production
          accuracy depends on marketplace data availability.
        </motion.p>

        {/* Why good images win — glass showcase */}
        <ShowcaseSection />

        {/* Stats band */}
        <StatsBand />

        {/* Grading rules */}
        <GradingRulesSection />

        {/* Testimonials */}
        <TestimonialsSection />

        {/* Final CTA */}
        <FinalCtaSection />
      </div>

      {/* Email capture dialog */}
      <Dialog open={emailModalOpen} onOpenChange={setEmailModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Where should we send your image?</DialogTitle>
            <DialogDescription>
              Enter your email and we&apos;ll send you the optimized image.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendImage();
            }}
            className="space-y-3"
          >
            <input
              ref={emailInputRef}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={emailSending}
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
            />
            {emailError && (
              <p className="text-xs text-destructive" role="alert">
                {emailError}
              </p>
            )}
            <DialogFooter>
              <Button
                type="button"
                onClick={() => setEmailModalOpen(false)}
                variant="outline"
                className="rounded-pill h-11 border-border text-foreground"
                disabled={emailSending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={emailSending}
                className="rounded-pill h-11 bg-primary text-primary-foreground btn-shine"
              >
                {emailSending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {EMAIL_SENDING_MESSAGE}
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    Send Image
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default ListingOptimization;