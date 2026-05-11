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
import { useNavigate, useSearchParams } from "react-router";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import {
  createDefaultNotifications,
  formatNameFromEmail,
  saveSession,
} from "../auth";

export function Login() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Estados de controle
  const [mode, setMode] = useState<"login" | "signup">(
    searchParams.get("mode") === "signup" ? "signup" : "login",
  );
  const [step, setStep] = useState<"form" | "verification">("form");
  const [verificationCode, setVerificationCode] = useState("");

  // Estados de Visibilidade de Senha
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Dados dos Formulários
  const [loginData, setLoginData] = useState({ email: "", password: "", remember: false });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    phone: "",
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

  const courseOptions = [
    "Biomedicina", "Enfermagem", "Psicologia", 
    "Engenharia de Computação", "Engenharia Elétrica"
  ];

  useEffect(() => {
    const nextMode = searchParams.get("mode") === "signup" ? "signup" : "login";
    setMode(nextMode);
    setStep("form"); // Reseta o step ao trocar entre login/cadastro
  }, [searchParams]);

  const switchMode = (nextMode: "login" | "signup") => {
    setMode(nextMode);
    setSearchParams(nextMode === "signup" ? { mode: "signup" } : {});
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = formatNameFromEmail(loginData.email);
    saveSession({
      name,
      email: loginData.email,
      university: "USF Sagrado",
      course: "Engenharia de Computação", // Valor fixo de exemplo
      notifications: createDefaultNotifications(name),
    });
    navigate("/");
  };

  // Validação do e-mail institucional
  const validateInstitutionalEmail = (email: string) => {
    return email.toLowerCase().endsWith("@mail.usf.edu.br");
  };

  const handleSignupNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInstitutionalEmail(signupData.email)) {
      window.alert("Por favor, use seu e-mail institucional (@mail.usf.edu.br).");
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      window.alert("As senhas não coincidem.");
      return;
    }

    // Aqui você chamaria sua API para enviar o código
    console.log("Enviando código para:", signupData.email);
    setStep("verification");
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulação de verificação de código
    if (verificationCode === "123456") { // Apenas exemplo
      saveSession({
        name: signupData.name,
        email: signupData.email,
        university: signupData.university,
        course: signupData.course,
        notifications: createDefaultNotifications(signupData.name),
      });
      navigate("/");
    } else {
      window.alert("Código inválido.");
    }
  };

  const handleSignupFieldChange = <K extends keyof typeof signupData>(
    field: K, value: (typeof signupData)[K]
  ) => {
    setSignupData((current) => ({ ...current, [field]: value }));
  };

  // Máscara para o telefone: (XX) XXXXX-XXXX
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não for número
    
    if (value.length <= 11) {
      value = value.replace(/^(\d{2})(\d)/g, "($1) $2"); // Coloca parênteses
      value = value.replace(/(\d)(\d{4})$/, "$1-$2");    // Coloca hífen
    }
    
    handleSignupFieldChange("phone", value);
  };

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
            {/* Seletor Login/Cadastro (só aparece se não estiver verificando código) */}
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

            {/* Cabeçalho Dinâmico */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {step === "verification" ? "Verifique seu E-mail" : isLoginMode ? "Bem-vindo ao U-Go!" : "Criar Conta"}
              </h1>
              <p className="text-gray-600">
                {step === "verification" 
                  ? `Enviamos um código para ${signupData.email}`
                  : isLoginMode ? "Entre com suas credenciais para continuar" : "Preencha seus dados para acessar a comunidade U-Go"}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {/* LOGIN */}
              {isLoginMode && (
                <motion.form 
                  key="login"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onSubmit={handleLoginSubmit} className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email" required
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
                      <a href="#" className="text-sm text-green-600 hover:text-green-700">Esqueceu a senha?</a>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"} required
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
                      <input type="checkbox" checked={loginData.remember} onChange={(e) => setLoginData({ ...loginData, remember: e.target.checked })} className="w-4 h-4 accent-green-600 cursor-pointer" />
                      <span className="text-sm text-gray-700">Lembrar de mim</span>
                    </label>
                  </div>
                  <button type="submit" className="w-full text-sm font-semibold tracking-wide text-green-700 py-3.5 rounded-full border border-green-200 bg-green-50 transition-all duration-300 hover:bg-green-600 hover:border-green-600 hover:text-white hover:shadow-md active:scale-[0.98]">
                    Entrar
                  </button>
                </motion.form>
              )}

              {/* CADASTRO (PASSO 1) */}
              {!isLoginMode && step === "form" && (
                <motion.form 
                  key="signup"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onSubmit={handleSignupNextStep} className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome completo *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="text" required value={signupData.name} onChange={(e) => handleSignupFieldChange("name", e.target.value)} className={leadingIconFieldClassName} placeholder="Seu nome completo" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Universitário *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="email" required value={signupData.email} onChange={(e) => handleSignupFieldChange("email", e.target.value)} className={leadingIconFieldClassName} placeholder="seu.email@mail.usf.edu.br" />
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
                        <select required value={signupData.university} onChange={(e) => handleSignupFieldChange("university", e.target.value)} className={selectFieldClassName}>
                          <option value="">Selecione</option>
                          <option value="USF Sagrado">USF Sagrado</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Curso *</label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        <select required value={signupData.course} onChange={(e) => handleSignupFieldChange("course", e.target.value)} className={selectFieldClassName}>
                          <option value="">Selecione o curso</option>
                          {courseOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
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
                        <input type={showSignupPassword ? "text" : "password"} required value={signupData.password} onChange={(e) => handleSignupFieldChange("password", e.target.value)} className={trailingActionFieldClassName} placeholder="Mínimo 8 caracteres" />
                        <button type="button" onClick={() => setShowSignupPassword(!showSignupPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                          {showSignupPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar senha *</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type={showConfirmPassword ? "text" : "password"} required value={signupData.confirmPassword} onChange={(e) => handleSignupFieldChange("confirmPassword", e.target.value)} className={trailingActionFieldClassName} placeholder="Confirme sua senha" />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" required checked={signupData.terms} onChange={(e) => handleSignupFieldChange("terms", e.target.checked)} className="w-5 h-5 accent-green-600 cursor-pointer" />
                    <span className="text-sm text-gray-700 leading-none">
                      Concordo com os <a href="#" className="text-green-600 hover:text-green-700 underline font-medium">Termos de Uso</a> e <a href="#" className="text-green-600 hover:text-green-700 underline font-medium">Política de Privacidade</a>
                    </span>
                  </label>

                  <button type="submit" className="w-full text-sm font-semibold tracking-wide text-green-700 py-3.5 rounded-full border border-green-200 bg-green-50 transition-all duration-300 hover:bg-green-600 hover:border-green-600 hover:text-white hover:shadow-md active:scale-[0.98]">
                    Cadastrar
                  </button>
                </motion.form>
              )}

              {/* VERIFICAÇÃO DE CÓDIGO (PASSO 2) */}
              {!isLoginMode && step === "verification" && (
                <motion.form 
                  key="verification"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleVerifyCode} className="space-y-6 flex flex-col"
                >
                  
                  {/* Botão de Alterar E-mail (Movi para o topo, conforme solicitado) */}
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
                    </div>
                    
                    {/* Correção do Input: Centralizado e com espaçamento de letras controlado */}
                    <input
                      type="text" 
                      maxLength={6} 
                      required
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                      className="w-full max-w-[240px] text-center text-3xl font-bold py-3 border-b-2 border-green-200 focus:border-green-600 outline-none transition-all text-gray-700 bg-transparent"
                      style={{ letterSpacing: '0.5em', paddingLeft: '0.5em' }} // Ajuste fino para centralizar com letter-spacing
                      placeholder="000000"
                    />
                  </div>
                  <div className="text-center">
                      <button 
                        type="button" 
                        className="text-sm font-medium text-green-600 hover:text-green-700 hover:underline transition-colors"
                      >
                        Reenviar Código
                      </button>
                    </div>

                  <div className="pt-4 flex flex-col gap-4">
                    {/* Botão com o mesmo layout de 'Entrar' e lógica de disable */}
                    <button 
                      type="submit" 
                      disabled={verificationCode.length !== 6}
                      className={`w-full text-sm font-semibold tracking-wide py-3.5 rounded-full border transition-all duration-300 ease-in-out 
                        ${verificationCode.length === 6 
                          ? "text-green-700 border-green-200 bg-green-50 hover:bg-green-600 hover:border-green-600 hover:text-white hover:shadow-md active:scale-[0.98]" 
                          : "text-gray-400 border-gray-200 bg-gray-50 cursor-not-allowed"
                        }`}
                    >
                      Finalizar
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