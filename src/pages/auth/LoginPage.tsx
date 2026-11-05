
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { LogIn } from "lucide-react";
import { AuthLayout } from "../../components/layout/AuthLayout";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useI18n } from "../../i18n/I18nProvider";
import { useToast } from "../../components/ui/Toast";
import { authService } from "../../services/auth";
import { ApiError } from "../../services/http";

export function LoginPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};

    if (!email.trim()) {
      e.email = "Email is required";
    } else if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      e.email = "Invalid email format";
    }

    if (!password) {
      e.password = "Password is required";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const result = await authService.login(
        email.trim(),
        password,
        remember,
      );

      toast("Signed in successfully", "success");

      navigate(
        result.user.role === "admin" ? "/admin" : "/dashboard",
        { replace: true },
      );
    } catch (error) {
      let message = "Login failed. Please try again.";

      if (error instanceof ApiError) {
        switch (error.code) {
          case "INVALID_CREDENTIALS":
            message = "Email or password is incorrect.";
            break;
          case "ACCOUNT_PENDING":
            message = "Your account is waiting for administrator approval.";
            break;
          case "ACCOUNT_REJECTED":
            message = "Your account registration was rejected.";
            break;
          case "ACCOUNT_SUSPENDED":
            message = "Your account is suspended. Please contact support.";
            break;
          default:
            message = error.message;
        }
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast(message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title={t("auth.loginTitle")} subtitle={t("auth.loginSub")}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={t("auth.email")}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          placeholder="you@example.com"
        />

        <Input
          label={t("auth.password")}
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          placeholder="••••••••"
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-ink-700">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
            />
            {t("auth.rememberMe")}
          </label>

          <Link
            to="/login"
            className="text-sm font-medium text-brand-700 hover:text-brand-800"
          >
            {t("auth.forgotPassword")}
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          leftIcon={<LogIn className="h-4 w-4" />}
        >
          {t("auth.loginButton")}
        </Button>

        <p className="text-center text-sm text-ink-500">
          {t("auth.noAccount")}{" "}
          <Link
            to="/register"
            className="font-medium text-brand-700 hover:text-brand-800"
          >
            {t("auth.registerButton")}
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
