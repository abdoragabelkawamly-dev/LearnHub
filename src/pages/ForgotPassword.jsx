import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Loader2, Mail, MailQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import accountService from "@/api/account";
import YetiIllustration from "@/components/YetiIllustration";
import AuthBrand from "@/components/AuthBrand";
import "./Login.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await accountService.resetPassword(email);

      // إشعار نجاح العملية
      toast({
        title: "Check your email",
        description:
          "We've sent the instructions to your email. Once you have the User ID and Token, proceed to verification.",
      });

      // توجيه المستخدم مباشرة لصفحة إدخال البيانات يدوياً
      navigate("/confirm-reset");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Request failed",
        description: error.response?.data?.message || "Something went wrong.",
      });
    } finally {
      setIsLoading(false);
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
                <YetiIllustration inputSelectors={["#forgotEmail"]} />

                <Card className="w-full border-0 bg-transparent shadow-none">
                  <CardHeader className="space-y-3 pb-4 text-center">
                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <MailQuestion className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold">
                        Reset password
                      </CardTitle>
                      <div className="auth-card-line" />
                      <p className="text-sm leading-6 text-muted-foreground">
                        Enter your email and the Yeti will send the reset trail to your inbox.
                      </p>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <Input
                        id="forgotEmail"
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Mail className="mr-2 h-4 w-4" />
                        )}
                        Send reset link
                      </Button>
                    </form>

                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/confirm-reset">
                        Already have your token?
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" className="w-full" asChild>
                      <Link to="/login">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to login
                      </Link>
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

export default ForgotPassword;
