import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  ChevronDown,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import {
  fetchCourses,
  fetchUniversities,
  confirmPasswordReset,
  loginWithPassword,
  requestPasswordReset,
  resendVerification,
  signUp,
  verifyEmail,
  type CourseOption,
  type UniversityOption,
} from "../auth";

export function Login() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mode, setMode] = useState<"login" | "signup">(
    searchParams.get("mode") === "signup" ? "signup" : "login",
  );
  const [step, setStep] = useState<"form" | "verification" | "forgot" | "reset" | "reset-sent">(
    searchParams.get("reset_uid") && searchParams.get("reset_token") ? "reset" : "form",
  );
  const [verificationCode, setVerificationCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResendingCode, setIsResendingCode] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [debugVerificationCode, setDebugVerificationCode] = useState<string | null>(null);
  const [universities, setUniversities] = useState<UniversityOption[]>([]);
  const [courseOptions, setCourseOptions] = useState<CourseOption[]>([]);

  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loginData, setLoginData] = useState({ email: "", password: "", remember: false });
  const [resetEmail, setResetEmail] = useState("");
  const [resetPassword, setResetPassword] = useState({ password: "", confirmPassword: "" });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    phone: "",
    rideVisibilityGroup: "woman" as "woman" | "man" | "non_binary" | "other" | "prefer_not_to_say",
    customGender: "",
    password: "",
    confirmPassword: "",
    university: "",
    course: "",
    address: "",
    terms: false,
  });

  const isLoginMode = mode === "login";
  const formPanelWidth = isLoginMode ? "max-w-[480px]" : "max-w-[800px]";
  const baseFieldClassName =
    "w-full rounded-lg border border-gray-200 bg-white py-3 text-gray-900 outline-none shadow-none transition-colors duration-200 placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-0 focus:shadow-none";
  const leadingIconFieldClassName = `${baseFieldClassName} pl-11 pr-4`;
  const trailingActionFieldClassName = `${baseFieldClassName} pl-11 pr-11`;
  const selectFieldClassName = `${baseFieldClassName} appearance-none pl-11 pr-10`;

  useEffect(() => {
    if (searchParams.get("reset_uid") && searchParams.get("reset_token")) {
      setMode("login");
      setStep("reset");
      setFormError(null);
      return;
    }
    const nextMode = searchParams.get("mode") === "signup" ? "signup" : "login";
    setMode(nextMode);
    setStep("form");
    setFormError(null);
  }, [searchParams]);

  const showFormError = (message: string) => {
    setFormError(message);
    toast.error(message);
  };

  useEffect(() => {
    let isMounted = true;

    async function loadUniversityOptions() {
      try {
        const data = await fetchUniversities();
        if (!isMounted) {
          return;
        }

        setUniversities(data);
        if (!signupData.university && data[0]) {
          setSignupData((current) => ({ ...current, university: data[0].id }));
        }
      } catch (error) {
        if (isMounted) {
          setFormError(error instanceof Error ? error.message : "Não foi possível carregar as universidades.");
        }
      }
    }

    void loadUniversityOptions();

    return () => {
      isMounted = false;
    };
  }, [signupData.university]);

  useEffect(() => {
    if (!signupData.university) {
      setCourseOptions([]);
      return;
    }

    let isMounted = true;

    async function loadUniversityCourses() {
      try {
        const data = await fetchCourses(signupData.university);
        if (!isMounted) {
          return;
        }

        setCourseOptions(data);
        setSignupData((current) => ({
          ...current,
          course: data.some((course) => course.id === current.course) ? current.course : (data[0]?.id ?? ""),
        }));
      } catch (error) {
        if (isMounted) {
          setFormError(error instanceof Error ? error.message : "Não foi possível carregar os cursos.");
        }
      }
    }

    void loadUniversityCourses();

    return () => {
      isMounted = false;
    };
  }, [signupData.university]);

  const switchMode = (nextMode: "login" | "signup") => {
    setMode(nextMode);
    setFormError(null);
    setDebugVerificationCode(null);
    setVerificationCode("");
    setSearchParams(nextMode === "signup" ? { mode: "signup" } : {});
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    try {
      await loginWithPassword({
        email: loginData.email,
        password: loginData.password,
        remember_me: loginData.remember,
      });
      navigate("/");
    } catch (error) {
      showFormError(error instanceof Error ? error.message : "Não foi possível realizar o login.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateInstitutionalEmail = (email: string) => {
    const selectedUniversity = universities.find((item) => item.id === signupData.university);
    if (!selectedUniversity) {
      return false;
    }

    return email.toLowerCase().endsWith(`@${selectedUniversity.email_domain.toLowerCase()}`);
  };

  const handleSignupNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setDebugVerificationCode(null);

    if (!validateInstitutionalEmail(signupData.email)) {
      showFormError("Use um e-mail institucional compatível com a universidade selecionada.");
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      showFormError("As senhas não coincidem.");
      return;
    }

    if (!signupData.terms) {
      showFormError("Você precisa aceitar os Termos de Uso e a Política de Privacidade para continuar.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await signUp({
        full_name: signupData.name,
        email: signupData.email,
        phone: signupData.phone,
        ride_visibility_group: signupData.rideVisibilityGroup, // Vai enviar "other"
        custom_gender: signupData.rideVisibilityGroup === "other" ? signupData.customGender : "", // Envia o texto digitado
        university: signupData.university,
        course: signupData.course,
        password: signupData.password,
        confirm_password: signupData.confirmPassword,
        address_text: signupData.address,
        accept_terms: true,
      });

      setDebugVerificationCode(response.debug_verification_code ?? null);
      setStep("verification");
      toast.success(response.message);
    } catch (error) {
      showFormError(error instanceof Error ? error.message : "Não foi possível concluir o cadastro.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    try {
      await verifyEmail(signupData.email, verificationCode);
      navigate("/");
    } catch (error) {
      showFormError(error instanceof Error ? error.message : "Não foi possível validar o código.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    setFormError(null);
    setIsResendingCode(true);

    try {
      const response = await resendVerification(signupData.email);
      setDebugVerificationCode(response.debug_verification_code ?? null);
      toast.success(response.message);
    } catch (error) {
      showFormError(error instanceof Error ? error.message : "Não foi possível reenviar o código.");
    } finally {
      setIsResendingCode(false);
    }
  };

  const handlePasswordResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);
    try {
      const response = await requestPasswordReset(resetEmail);
      toast.success(response.message);
      if (response.debug_reset_uid && response.debug_reset_token) {
        setSearchParams({ reset_uid: response.debug_reset_uid, reset_token: response.debug_reset_token });
        setStep("reset");
      } else {
        setStep("reset-sent");
      }
    } catch (error) {
      showFormError(error instanceof Error ? error.message : "Não foi possível iniciar a recuperação de senha.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordResetConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (resetPassword.password !== resetPassword.confirmPassword) {
      showFormError("As senhas não coincidem.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await confirmPasswordReset({
        uid: searchParams.get("reset_uid") ?? "",
        token: searchParams.get("reset_token") ?? "",
        password: resetPassword.password,
        confirm_password: resetPassword.confirmPassword,
      });
      toast.success(response.message);
      setSearchParams({});
      setStep("form");
    } catch (error) {
      showFormError(error instanceof Error ? error.message : "Não foi possível redefinir a senha.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupFieldChange = <K extends keyof typeof signupData>(
    field: K,
    value: (typeof signupData)[K],
  ) => {
    setSignupData((current) => ({ ...current, [field]: value }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length <= 11) {
      value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
      value = value.replace(/(\d)(\d{4})$/, "$1-$2");
    }

    handleSignupFieldChange("phone", value);
  };

  const selectedUniversity = universities.find((item) => item.id === signupData.university);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 font-sans flex flex-col">
      <Header />

      <div className="flex-1 pt-24 pb-32 px-4 sm:px-6 lg:px-8 flex justify-center">
        <div className={`w-full transition-all duration-500 ${formPanelWidth}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-white p-6 shadow-2xl sm:p-8 lg:p-10 border border-green-50"
          >
            {step === "form" && (
              <div className="mb-8 inline-flex rounded-full border border-green-100 bg-green-50 p-1">
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                    isLoginMode ? "bg-white text-green-700 shadow-sm" : "text-gray-500 hover:text-green-700"
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => switchMode("signup")}
                  className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                    !isLoginMode ? "bg-white text-green-700 shadow-sm" : "text-gray-500 hover:text-green-700"
                  }`}
                >
                  Cadastro
                </button>
              </div>
            )}

            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {step === "verification" ? "Verifique seu e-mail"
                  : step === "forgot" ? "Recuperar senha"
                    : step === "reset" ? "Crie uma nova senha"
                      : step === "reset-sent" ? "Confira seu e-mail"
                        : isLoginMode ? "Bem-vindo ao U-Go!" : "Criar Conta"}
              </h1>
              <p className="text-gray-600">
                {step === "verification"
                  ? `Enviamos um código para ${signupData.email}`
                  : step === "forgot"
                    ? "Informe seu e-mail institucional para receber o link de recuperação."
                    : step === "reset"
                      ? "Escolha uma senha forte para proteger sua conta."
                      : step === "reset-sent"
                        ? "Se o endereço estiver cadastrado, o link de recuperação chegará em instantes."
                  : isLoginMode
                    ? "Entre com suas credenciais para continuar"
                    : "Preencha seus dados para acessar a comunidade U-Go"}
              </p>
            </div>

            {formError ? (
              <div className="mb-6 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                {formError}
              </div>
            ) : null}

            <AnimatePresence mode="wait">
              {isLoginMode && step === "form" && (
                <motion.form
                  key="login"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleLoginSubmit}
                  onInvalid={() => showFormError("Revise os campos obrigatórios antes de continuar.")}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        required
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        className={leadingIconFieldClassName}
                        placeholder="seu.email@mail.usf.edu.br"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">Senha</label>
                      <button type="button" onClick={() => { setFormError(null); setResetEmail(loginData.email); setStep("forgot"); }} className="text-sm text-green-600 hover:text-green-700">Esqueceu a senha?</button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        className={trailingActionFieldClassName}
                        placeholder="Sua senha"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={loginData.remember}
                        onChange={(e) => setLoginData({ ...loginData, remember: e.target.checked })}
                        className="w-4 h-4 accent-green-600 cursor-pointer"
                      />
                      <span className="text-sm text-gray-700">Lembrar de mim</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full text-sm font-semibold tracking-wide text-green-700 py-3.5 rounded-full border border-green-200 bg-green-50 transition-all duration-300 hover:bg-green-600 hover:border-green-600 hover:text-white hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? "Entrando..." : "Entrar"}
                  </button>
                </motion.form>
              )}

              {step === "forgot" && (
                <motion.form key="forgot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handlePasswordResetRequest} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">E-mail institucional</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="email" required value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} className={leadingIconFieldClassName} placeholder="seu.email@mail.usf.edu.br" />
                    </div>
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-green-600 py-3.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60">
                    {isSubmitting ? "Enviando..." : "Enviar link de recuperação"}
                  </button>
                  <button type="button" onClick={() => setStep("form")} className="w-full text-sm font-medium text-gray-500 hover:text-green-700">Voltar ao login</button>
                </motion.form>
              )}

              {step === "reset" && (
                <motion.form key="reset" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handlePasswordResetConfirm} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nova senha</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="password" required minLength={8} value={resetPassword.password} onChange={(e) => setResetPassword((current) => ({ ...current, password: e.target.value }))} className={leadingIconFieldClassName} placeholder="Mínimo 8 caracteres" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar nova senha</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="password" required minLength={8} value={resetPassword.confirmPassword} onChange={(e) => setResetPassword((current) => ({ ...current, confirmPassword: e.target.value }))} className={leadingIconFieldClassName} placeholder="Repita a nova senha" />
                    </div>
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-green-600 py-3.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60">
                    {isSubmitting ? "Salvando..." : "Redefinir senha"}
                  </button>
                </motion.form>
              )}

              {step === "reset-sent" && (
                <motion.div key="reset-sent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                  <div className="rounded-2xl border border-green-100 bg-green-50 p-5 text-sm leading-relaxed text-green-800">O link é temporário e só pode ser usado uma vez. Verifique também a pasta de spam.</div>
                  <button type="button" onClick={() => setStep("form")} className="w-full rounded-full border border-green-200 bg-white py-3.5 text-sm font-semibold text-green-700 hover:bg-green-50">Voltar ao login</button>
                </motion.div>
              )}

              {!isLoginMode && step === "form" && (
                <motion.form
                  key="signup"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSignupNextStep}
                  onInvalid={() => showFormError("Revise os campos obrigatórios antes de continuar.")}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome completo *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={signupData.name}
                        onChange={(e) => handleSignupFieldChange("name", e.target.value)}
                        className={leadingIconFieldClassName}
                        placeholder="Seu nome completo"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Universitário *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          required
                          value={signupData.email}
                          onChange={(e) => handleSignupFieldChange("email", e.target.value)}
                          className={leadingIconFieldClassName}
                          placeholder={selectedUniversity ? `seu.email@${selectedUniversity.email_domain}` : "seu.email@universidade"}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Telefone *</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          required
                          maxLength={15}
                          value={signupData.phone}
                          onChange={handlePhoneChange}
                          className={leadingIconFieldClassName}
                          placeholder="(19) 99999-9999"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Universidade *</label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        <select
                          required
                          value={signupData.university}
                          onChange={(e) => handleSignupFieldChange("university", e.target.value)}
                          className={selectFieldClassName}
                        >
                          <option value="">Selecione</option>
                          {universities.map((university) => (
                            <option key={university.id} value={university.id}>{university.name}</option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Curso *</label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        <select
                          required
                          value={signupData.course}
                          onChange={(e) => handleSignupFieldChange("course", e.target.value)}
                          className={selectFieldClassName}
                        >
                          <option value="">Selecione o curso</option>
                          {courseOptions.map((course) => (
                            <option key={course.id} value={course.id}>{course.name}</option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Qual é seu gênero/identidade de gênero? *</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => handleSignupFieldChange("rideVisibilityGroup", "woman")}
                        className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors ${signupData.rideVisibilityGroup === "woman" ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 bg-white text-gray-600 hover:border-green-300"}`}
                      >
                        Feminina
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSignupFieldChange("rideVisibilityGroup", "man")}
                        className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors ${signupData.rideVisibilityGroup === "man" ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 bg-white text-gray-600 hover:border-green-300"}`}
                      >
                        Masculina
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSignupFieldChange("rideVisibilityGroup", "non_binary")}
                        className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors ${signupData.rideVisibilityGroup === "non_binary" ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 bg-white text-gray-600 hover:border-green-300"}`}
                      >
                        Não binárie
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSignupFieldChange("rideVisibilityGroup", "prefer_not_to_say")}
                        className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors ${signupData.rideVisibilityGroup === "prefer_not_to_say" ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 bg-white text-gray-600 hover:border-green-300"}`}
                      >
                        Prefiro não dizer
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSignupFieldChange("rideVisibilityGroup", "other")}
                        className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors ${signupData.rideVisibilityGroup === "other" ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 bg-white text-gray-600 hover:border-green-300"}`}
                      >
                        Outro
                      </button>
                      
                      {/* Campo de texto condicional que aparece ao lado do "Outro" */}
                      <AnimatePresence>
                        {signupData.rideVisibilityGroup === "other" && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center"
                          >
                            <input
                              type="text"
                              value={signupData.customGender || ""}
                              onChange={(e) => handleSignupFieldChange("customGender", e.target.value)}
                              placeholder="Qual?"
                              className="w-full rounded-2xl border border-green-500 bg-white px-4 py-3 text-sm font-medium text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-green-600 focus:ring-0"
                              autoFocus
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      Isso é usado para respeitar caronas exclusivas.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Endereço <span className="text-gray-400 font-normal">(Opcional)</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={signupData.address}
                        onChange={(e) => handleSignupFieldChange("address", e.target.value)}
                        className={leadingIconFieldClassName}
                        placeholder="Barão Geraldo, Campinas"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Senha *</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showSignupPassword ? "text" : "password"}
                          required
                          value={signupData.password}
                          onChange={(e) => handleSignupFieldChange("password", e.target.value)}
                          className={trailingActionFieldClassName}
                          placeholder="Mínimo 8 caracteres"
                        />
                        <button type="button" onClick={() => setShowSignupPassword(!showSignupPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                          {showSignupPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar senha *</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          value={signupData.confirmPassword}
                          onChange={(e) => handleSignupFieldChange("confirmPassword", e.target.value)}
                          className={trailingActionFieldClassName}
                          placeholder="Confirme sua senha"
                        />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      required
                      checked={signupData.terms}
                      onChange={(e) => handleSignupFieldChange("terms", e.target.checked)}
                      className="w-5 h-5 accent-green-600 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 leading-none">
                      Concordo com os <Link to="/termos" target="_blank" className="text-green-600 hover:text-green-700 underline font-medium">Termos de Uso</Link> e a <Link to="/privacidade" target="_blank" className="text-green-600 hover:text-green-700 underline font-medium">Política de Privacidade</Link>
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full text-sm font-semibold tracking-wide text-green-700 py-3.5 rounded-full border border-green-200 bg-green-50 transition-all duration-300 hover:bg-green-600 hover:border-green-600 hover:text-white hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? "Cadastrando..." : "Cadastrar"}
                  </button>
                </motion.form>
              )}

              {!isLoginMode && step === "verification" && (
                <motion.form
                  key="verification"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleVerifyCode}
                  className="space-y-6 flex flex-col"
                >
                  <div className="flex justify-start mb-6">
                    <button
                      type="button"
                      onClick={() => setStep("form")}
                      className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700 hover:underline transition-colors font-medium"
                    >
                      <ArrowLeft className="w-4 h-4" /> Alterar e-mail ou dados
                    </button>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="bg-green-50 p-4 rounded-full mb-4">
                      <Mail className="w-8 h-8 text-green-600" />
                    </div>

                    <div className="text-center text-sm text-gray-500 mb-8 max-w-sm">
                      <p>Digite o código de 6 dígitos.</p>
                      <p className="mt-1">Verifique também a pasta de spam.</p>
                      {selectedUniversity ? <p className="mt-1">E-mail institucional esperado: @{selectedUniversity.email_domain}</p> : null}
                      {debugVerificationCode ? <p className="mt-2 font-semibold text-emerald-700">Código de desenvolvimento: {debugVerificationCode}</p> : null}
                    </div>

                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                      className="w-full max-w-[240px] text-center text-2xl font-bold py-3 border-b-2 border-green-200 focus:border-green-600 outline-none transition-all text-gray-700 bg-transparent"
                      style={{ letterSpacing: "0.5em", paddingLeft: "0.5em" }}
                      placeholder="000000"
                    />
                  </div>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => void handleResendCode()}
                      disabled={isResendingCode}
                      className="text-sm font-medium text-green-600 hover:text-green-700 hover:underline transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isResendingCode ? "Reenviando..." : "Reenviar Código"}
                    </button>
                  </div>

                  <div className="pt-4 flex flex-col gap-4">
                    <button
                      type="submit"
                      disabled={verificationCode.length !== 6 || isSubmitting}
                      className={`w-full text-sm font-semibold tracking-wide py-3.5 rounded-full border transition-all duration-300 ease-in-out ${
                        verificationCode.length === 6 && !isSubmitting
                          ? "text-green-700 border-green-200 bg-green-50 hover:bg-green-600 hover:border-green-600 hover:text-white hover:shadow-md active:scale-[0.98]"
                          : "text-gray-400 border-gray-200 bg-gray-50 cursor-not-allowed"
                      }`}
                    >
                      {isSubmitting ? "Validando..." : "Finalizar"}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
