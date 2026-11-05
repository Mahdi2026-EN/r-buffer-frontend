
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { UserPlus, Clock4 } from "lucide-react";
import { AuthLayout } from "../../components/layout/AuthLayout";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useI18n } from "../../i18n/I18nProvider";
import { useToast } from "../../components/ui/Toast";
import { authService } from "../../services/auth";
import { ApiError } from "../../services/http";

export function RegisterPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function validate() {
    const e: Record<string, string> = {};

    if (!form.fullName.trim()) {
      e.fullName = "Full name is required";
    }

    if (!form.email.trim()) {
      e.email = "Email is required";
    } else if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) {
      e.email = "Invalid email";
    }

    if (!form.phone.trim()) {
      e.phone = "Phone is required";
    } else if (!/^[+0-9()\-\s]{6,30}$/.test(form.phone)) {
      e.phone = "Enter a valid phone number";
    }

    if (!form.password) {
      e.password = "Password is required";
    } else if (form.password.length < 8) {
      e.password = "Minimum 8 characters";
    } else if (form.password.length > 72) {
      e.password = "Maximum 72 characters";
    }

    if (form.password !== form.confirmPassword) {
      e.confirmPassword = "Passwords do not match";
    }

    if (!form.terms) {
      e.terms = t("auth.termsRequired");
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      await authService.register({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
      });

      setSubmitted(true);
      toast("Registration submitted for review", "success");
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.fieldErrors) {
          setErrors(error.fieldErrors);
        }

        toast(error.message, "error");
      } else {
        toast(
          error instanceof Error
            ? error.message
            : "Registration failed. Please try again.",
          "error",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <AuthLayout title={t("auth.pendingTitle")} subtitle="">
        <div className="space-y-5 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600">
            <Clock4 className="h-8 w-8" />
          </div>

          <p className="text-sm leading-relaxed text-ink-600">
            {t("auth.pendingDesc")}
          </p>

          <p className="text-xs text-ink-500">
            {t("auth.pendingNote")}
          </p>

          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={() => navigate("/login")}
          >
            {t("auth.loginButton")}
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title={t("auth.registerTitle")} subtitle={t("auth.registerSub")}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={t("auth.fullName")}
          required
          value={form.fullName}
          onChange={(e) =>
            setForm({ ...form, fullName: e.target.value })
          }
          error={errors.fullName}
        />

        <Input
          label={t("auth.email")}
          type="email"
          required
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          error={errors.email}
        />

        <Input
          label={t("auth.phone")}
          type="tel"
          required
          value={form.phone}
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
          error={errors.phone}
          placeholder="+93 ..."
        />

        <Input
          label={t("auth.password")}
          type="password"
          required
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          error={errors.password}
        />

        <Input
          label={t("auth.confirmPassword")}
          type="password"
          required
          value={form.confirmPassword}
          onChange={(e) =>
            setForm({ ...form, confirmPassword: e.target.value })
          }
          error={errors.confirmPassword}
        />

        <label className="flex items-start gap-2 text-sm text-ink-700">
          <input
            type="checkbox"
            checked={form.terms}
            onChange={(e) =>
              setForm({ ...form, terms: e.target.checked })
            }
            className="mt-0.5 h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
          />
          <span>{t("auth.terms")}</span>
        </label>

        {errors.terms && (
          <p className="text-xs text-red-600">{errors.terms}</p>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          leftIcon={<UserPlus className="h-4 w-4" />}
        >
          {t("auth.registerButton")}
        </Button>

        <p className="text-center text-sm text-ink-500">
          {t("auth.haveAccount")}{" "}
          <Link
            to="/login"
            className="font-medium text-brand-700 hover:text-brand-800"
          >
            {t("auth.loginButton")}
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
