import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KeyRound, Loader2, ShieldCheck } from "lucide-react";
import accountService from "@/api/account";
import YetiIllustration from "@/components/YetiIllustration";
import AuthBrand from "@/components/AuthBrand";
import { useToast } from "@/components/ui/use-toast";
import "./Login.css";

const ConfirmReset = () => {
  const [searchParams] = useSearchParams();
  const [userId, setUserId] = useState(searchParams.get("userId") || "");
  const [token, setToken] = useState(searchParams.get("token") || "");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleVerify = useCallback(
    async (manualUserId, manualToken) => {
      const finalUserId = manualUserId || userId;
      const finalToken = manualToken || token;

      if (!finalUserId || !finalToken) {
        toast({
          variant: "destructive",
          title: "Missing Information",
          description: "Please provide both User ID and Token.",
        });
        return;
      }

      setIsLoading(true);
      try {
        await accountService.confirmResetPassword(finalUserId, finalToken);

        // On success, redirect to the new password page
        navigate(
          `/reset-password?userId=${finalUserId}&token=${encodeURIComponent(finalToken)}`,
        );
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Verification Failed",
          description:
            err.response?.data?.message || "Invalid Token or User ID.",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [navigate, toast, token, userId],
  );

  // Auto-verify if data exists in the URL
  useEffect(() => {
    const userIdFromUrl = searchParams.get("userId");
    const tokenFromUrl = searchParams.get("token");

    if (userIdFromUrl && tokenFromUrl) {
      handleVerify(userIdFromUrl, tokenFromUrl);
    }
  }, [handleVerify, searchParams]);

  return (
    <div className="login-page">
      <AuthBrand />
      <div className="login-page__content">
        <article className="login-page__card">
          <div className="login-page__panel">
            <div className="login-page__panel-inner">
              <div className="login-page__panel-body">
                <YetiIllustration inputSelectors={["#resetUserId", "#resetToken"]} />

                <Card className="w-full border-0 bg-transparent shadow-none">
                  <CardHeader className="space-y-3 pb-4 text-center">
                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <KeyRound className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold">
                        Verify reset request
                      </CardTitle>
                      <div className="auth-card-line" />
                      <p className="text-sm leading-6 text-muted-foreground">
                        Paste the user ID and token from your email so we can unlock the new password step.
                      </p>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <Input
                      id="resetUserId"
                      placeholder="User ID"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      disabled={isLoading}
                    />
                    <Input
                      id="resetToken"
                      placeholder="Verification token"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      disabled={isLoading}
                    />
                    <Button
                      className="w-full"
                      onClick={() => handleVerify()}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="mr-2 h-4 w-4" />
                          Verify token
                        </>
                      )}
                    </Button>
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

export default ConfirmReset;
