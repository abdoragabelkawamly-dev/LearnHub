import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import accountService from "@/api/account";
import AuthBrand from "@/components/AuthBrand";
import YetiIllustration from "@/components/YetiIllustration";
import "./Login.css";

const ConfirmEmail = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(location.state?.email || "");
  const [isResending, setIsResending] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const hasHandledLink = useRef(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const userId = searchParams.get("userId");
    const token = searchParams.get("token");

    if (!userId || !token || hasHandledLink.current) return;
    hasHandledLink.current = true;

    const confirmAndContinue = async () => {
      setIsConfirming(true);

      try {
        await accountService.confirmEmail(userId, token);
        setIsConfirmed(true);
        sessionStorage.removeItem("pendingEmailConfirmation");

        toast({
          title: "Email confirmed",
          description: "You're all set. Taking you back to LearnHub.",
        });
        window.setTimeout(() => navigate("/", { replace: true }), 1800);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Confirmation failed",
          description:
            error?.response?.data?.message ||
            error?.response?.data ||
            "This confirmation link is invalid or expired.",
        });
      } finally {
        setIsConfirming(false);
      }
    };

    confirmAndContinue();
  }, [navigate, searchParams, toast]);

  const handleResend = async () => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "Email required",
        description: "Please enter your email first.",
      });
      return;
    }

    setIsResending(true);

    try {
      await accountService.resendConfirmEmail(email);

      toast({
        title: "Email sent",
        description: "Check your inbox for the confirmation link.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to resend email",
        description:
          error?.response?.data?.message ||
          "Please check the address and try again.",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="login-page">
      <AuthBrand />
      <div className="login-page__content">
        <article className="login-page__card">
          <div className="login-page__panel">
            <div className="login-page__panel-inner">
              <div className="login-page__panel-body">
                <YetiIllustration inputSelectors={["#confirmEmail"]} />

                <Card className="w-full border-0 bg-transparent shadow-none">
                  <CardHeader className="space-y-3 pb-4 text-center">
                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      {isConfirmed ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <MailCheck className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold">
                        {isConfirming
                          ? "Confirming your email"
                          : isConfirmed
                            ? "Email confirmed"
                            : "Confirm your email"}
                      </CardTitle>
                      <div className="auth-card-line" />
                      <p className="text-sm leading-6 text-muted-foreground">
                        {isConfirming
                          ? "One moment while we finish setting up your account."
                          : isConfirmed
                            ? "Your account is active. We are taking you back to the landing page."
                            : "Open the confirmation link from your inbox, or resend it below. The little Yeti is keeping watch."}
                      </p>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {isConfirming ? (
                      <div className="flex items-center justify-center py-6 text-primary">
                        <Loader2 className="h-8 w-8 animate-spin" />
                      </div>
                    ) : (
                      <>
                        <Input
                          id="confirmEmail"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                        />
                        <Button
                          className="w-full"
                          variant="outline"
                          onClick={handleResend}
                          disabled={isResending}
                        >
                          {isResending ? "Sending..." : "Resend email"}
                        </Button>
                        {isConfirmed ? (
                          <Button className="w-full" asChild>
                            <Link to="/">Back to LearnHub</Link>
                          </Button>
                        ) : (
                          <Button className="w-full" asChild>
                            <Link to="/login">Go to login</Link>
                          </Button>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default ConfirmEmail;
