import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import {
  Calendar, Camera, Car, CheckCircle2, ChevronDown, ChevronUp, Copy, Download, Image as ImageIcon,
  FileDown, Leaf, Lock, Pencil, ShieldCheck, Star, Users, X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Progress } from "../components/ui/progress";
import { BadgeSeal } from "../components/profile/BadgeSeal";
import { AvatarDesigner } from "../components/profile/AvatarDesigner";
import {
  defaultAvatarConfig, normalizeAvatarConfig, UgoAvatar,
  type AvatarConfig,
} from "../components/profile/UgoAvatar";
import {
  copyAchievementCertificateImage,
  downloadAchievementCertificateImage,
  downloadAchievementCertificatePdf,
  type AchievementCertificateInput,
} from "../components/profile/achievementCertificate";
import {
  fetchBadges, fetchCourses, fetchCurrentUser, fetchCurrentUserProfile,
  fetchPublicProfile, refreshAuthSession, updateCurrentUserProfileForm, useAuthSession,
  type BadgeRecord, type CourseOption, type CurrentUserRecord,
  type PublicEngagedProfile, type UserBadgeRecord,
} from "../auth";

interface BadgeViewModel {
  id: string;
  code: string;
  title: string;
  description: string;
  color: string;
  earned: boolean;
  progress: number;
  target?: number;
  achievedAt?: string;
}

const badgeColors = ["#22c55e", "#3b82f6", "#8b5cf6", "#f59e0b", "#ec4899", "#14b8a6"];
const achievementOrder = [
  "primeira_carona", "cinco_caronas", "vinte_caronas", "eco_10kg", "eco_50kg", "reconhecido_5",
  "cinquenta_caronas", "cem_caronas", "eco_100kg", "eco_250kg", "reconhecido_10", "reconhecido_25",
];
const achievementsPerStage = 6;

function defaultAvatar(name: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=e2e8f0&color=64748b&font-size=0.33`;
}

function memberSince(value?: string) {
  if (!value) return "recentemente";
  return new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(new Date(value));
}

function achievedOn(value?: string) {
  if (!value) return "Data registrada na plataforma";
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

function buildBadgeCards(catalog: BadgeRecord[], progress: UserBadgeRecord[], publicOnly: boolean) {
  const progressMap = new Map(progress.map((item) => [item.badge.id, item]));
  const cards = catalog.flatMap((badge, index) => {
    const record = progressMap.get(badge.id);
    const earned = Boolean(record?.achieved_at);
    if (publicOnly && !earned) return [];
    return [{
      id: badge.id,
      code: badge.code,
      title: badge.name,
      description: badge.description,
      color: badge.display_color || badgeColors[index % badgeColors.length],
      earned,
      progress: Number(record?.progress_value ?? 0),
      target: record?.target_value ? Number(record.target_value) : undefined,
      achievedAt: record?.achieved_at ?? undefined,
    } satisfies BadgeViewModel];
  });
  return cards.sort((a, b) => {
    const aIndex = achievementOrder.indexOf(a.code);
    const bIndex = achievementOrder.indexOf(b.code);
    return (aIndex < 0 ? Number.MAX_SAFE_INTEGER : aIndex) - (bIndex < 0 ? Number.MAX_SAFE_INTEGER : bIndex) || a.title.localeCompare(b.title, "pt-BR");
  });
}

export function Profile() {
  const { userId } = useParams();
  const session = useAuthSession();
  const isOwnProfile = !userId || userId === session?.id;
  const [currentUser, setCurrentUser] = useState<CurrentUserRecord | null>(null);
  const [publicProfile, setPublicProfile] = useState<PublicEngagedProfile | null>(null);
  const [achievementCatalog, setAchievementCatalog] = useState<BadgeRecord[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  const [certificateAction, setCertificateAction] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    bio: "", address: "", phone: "", course: "", semester: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [coverPreview, setCoverPreview] = useState("");
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [removeCover, setRemoveCover] = useState(false);
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>(defaultAvatarConfig);

  useEffect(() => () => {
    if (avatarPreview.startsWith("blob:")) URL.revokeObjectURL(avatarPreview);
  }, [avatarPreview]);

  useEffect(() => () => {
    if (coverPreview.startsWith("blob:")) URL.revokeObjectURL(coverPreview);
  }, [coverPreview]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setIsLoading(true);
      setLoadError(null);
      try {
        if (isOwnProfile) {
          const [user, profile, catalog] = await Promise.all([
            fetchCurrentUser(), fetchCurrentUserProfile(), fetchBadges("achievement"),
          ]);
          const [engaged, courseOptions] = await Promise.all([
            fetchPublicProfile(user.id), fetchCourses(user.university),
          ]);
          if (!mounted) return;
          setCurrentUser(user);
          setPublicProfile(engaged);
          setAchievementCatalog(catalog);
          setCourses(courseOptions);
          setEditForm({
            bio: profile.bio ?? "",
            address: profile.address_text ?? "",
            phone: profile.phone ?? user.phone,
            course: profile.course ?? user.course,
            semester: profile.semester ? String(profile.semester) : "",
          });
          setAvatarConfig(normalizeAvatarConfig(profile.avatar_config));
        } else if (userId) {
          const engaged = await fetchPublicProfile(userId);
          if (!mounted) return;
          setPublicProfile(engaged);
          setAchievementCatalog(engaged.achievements.map((item) => item.badge));
        }
      } catch (error) {
        if (mounted) setLoadError(error instanceof Error ? error.message : "Não foi possível carregar este perfil.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    void load();
    return () => { mounted = false; };
  }, [isOwnProfile, userId]);

  const displayName = publicProfile?.full_name ?? currentUser?.full_name ?? "Estudante U-Go";
  const avatar = publicProfile?.avatar_url ?? defaultAvatar(displayName);
  const visibleAvatarConfig = normalizeAvatarConfig(publicProfile?.avatar_config ?? currentUser?.profile?.avatar_config);
  const cover = publicProfile?.cover_photo_url ?? "";
  const bio = publicProfile?.bio || `Estudante de ${publicProfile?.course_name ?? "nossa comunidade"}, compartilhando caminhos e boas atitudes.`;
  const badgeProgress = isOwnProfile ? (currentUser?.badges ?? []) : (publicProfile?.achievements ?? []);
  const badges = useMemo(
    () => buildBadgeCards(achievementCatalog, badgeProgress, !isOwnProfile),
    [achievementCatalog, badgeProgress, isOwnProfile],
  );

  const openEdit = () => {
    if (!currentUser) return;
    setEditForm({
      bio: publicProfile?.bio ?? "",
      address: currentUser.profile?.address_text ?? "",
      phone: currentUser.phone,
      course: currentUser.course,
      semester: currentUser.profile?.semester ? String(currentUser.profile.semester) : "",
    });
    setAvatarFile(null);
    setCoverFile(null);
    setAvatarPreview(publicProfile?.avatar_url ?? "");
    setCoverPreview(publicProfile?.cover_photo_url ?? "");
    setRemoveAvatar(false);
    setRemoveCover(false);
    setAvatarConfig(normalizeAvatarConfig(publicProfile?.avatar_config ?? currentUser.profile?.avatar_config));
    setIsEditOpen(true);
  };

  const updateAvatarConfig = <Key extends keyof AvatarConfig>(key: Key, value: AvatarConfig[Key]) => {
    setAvatarConfig((current) => {
      const next = { ...current, [key]: value } as AvatarConfig;
      if (key === "hairStyle" && (value === "bald" || value === "buzz")) next.hairLength = "short";
      return next;
    });
  };

  const selectImage = (file: File | undefined, kind: "avatar" | "cover") => {
    if (!file) return;
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxBytes = (kind === "avatar" ? 5 : 8) * 1024 * 1024;
    if (!allowedTypes.includes(file.type)) {
      toast.error("Escolha uma imagem JPG, PNG ou WebP.");
      return;
    }
    if (file.size > maxBytes) {
      toast.error(`A imagem deve ter no máximo ${kind === "avatar" ? 5 : 8} MB.`);
      return;
    }
    const preview = URL.createObjectURL(file);
    if (kind === "avatar") {
      setAvatarFile(file);
      setAvatarPreview(preview);
      setRemoveAvatar(false);
    } else {
      setCoverFile(file);
      setCoverPreview(preview);
      setRemoveCover(false);
    }
  };

  const saveProfile = async () => {
    if (!currentUser) return;
    setIsSaving(true);
    setLoadError(null);
    try {
      const payload = new FormData();
      payload.append("bio", editForm.bio);
      payload.append("address_text", editForm.address);
      payload.append("phone", editForm.phone);
      payload.append("course", editForm.course);
      payload.append("semester", editForm.semester);
      payload.append("avatar_config", JSON.stringify(avatarConfig));
      if (avatarFile) payload.append("avatar_image", avatarFile);
      if (coverFile) payload.append("cover_photo_image", coverFile);
      if (removeAvatar) payload.append("remove_avatar", "true");
      if (removeCover) payload.append("remove_cover", "true");
      await updateCurrentUserProfileForm(payload);
      const [user, engaged] = await Promise.all([fetchCurrentUser(), fetchPublicProfile(currentUser.id)]);
      setCurrentUser(user);
      setPublicProfile(engaged);
      setIsEditOpen(false);
      await refreshAuthSession().catch(() => undefined);
      toast.success("Perfil atualizado com sucesso.");
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Não foi possível salvar o perfil.");
    } finally {
      setIsSaving(false);
    }
  };

  const impact = publicProfile?.impact;
  const earnedCount = badges.filter((badge) => badge.earned).length;
  const automaticAchievementLimit = Math.min(
    badges.length,
    achievementsPerStage * Math.max(1, Math.floor(earnedCount / achievementsPerStage) + 1),
  );
  const visibleBadges = showAllAchievements ? badges : badges.slice(0, automaticAchievementLimit);
  const hiddenAchievementCount = badges.length - visibleBadges.length;

  const certificateInput = (badge: BadgeViewModel): AchievementCertificateInput => ({
    recipient: displayName,
    achievement: badge.title,
    description: badge.description,
    achievedAt: badge.achievedAt,
    university: publicProfile?.university_name ?? currentUser?.university_name ?? "Universidade",
    course: publicProfile?.course_name ?? currentUser?.course_name ?? "Curso",
    color: badge.color,
  });

  const runCertificateAction = async (badge: BadgeViewModel, action: "pdf" | "image" | "copy") => {
    const actionId = `${badge.id}:${action}`;
    setCertificateAction(actionId);
    try {
      const input = certificateInput(badge);
      if (action === "pdf") await downloadAchievementCertificatePdf(input);
      if (action === "image") await downloadAchievementCertificateImage(input);
      if (action === "copy") await copyAchievementCertificateImage(input);
      toast.success(action === "copy" ? "Certificado copiado como imagem." : `Certificado baixado em ${action === "pdf" ? "PDF" : "PNG"}.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível gerar o certificado.");
    } finally {
      setCertificateAction(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <Header />
      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-24 sm:px-6">
        {loadError ? <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{loadError}</div> : null}

        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-[1.75rem] border-2 border-gray-200 bg-white shadow-[0_6px_0_#e5e7eb]">
          <div className="relative h-40 bg-gradient-to-br from-[#58cc02] via-[#36b800] to-[#1aa57a] sm:h-52">
            {cover ? <img src={cover} alt={`Capa do perfil de ${displayName}`} className="absolute inset-0 h-full w-full object-cover" /> : null}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10" />
            {!cover ? <><div className="absolute -right-10 -top-20 h-52 w-52 rounded-full border-[28px] border-white/10" /><div className="absolute bottom-4 left-1/3 h-20 w-20 rounded-full bg-lime-200/15" /></> : null}
          </div>
          <div className="relative px-5 pb-7 pt-16 sm:px-8 sm:pt-6">
            <div className="absolute -top-14 left-5 sm:-top-16 sm:left-8">
              {visibleAvatarConfig.enabled ? (
                <UgoAvatar config={visibleAvatarConfig} label={`Avatar personalizado de ${displayName}`} className="h-28 w-28 border-4 border-white shadow-[0_4px_0_rgba(0,0,0,.14)] sm:h-32 sm:w-32" />
              ) : (
                <ImageWithFallback src={avatar} alt={displayName} className="h-28 w-28 rounded-full border-4 border-white bg-white object-cover shadow-[0_4px_0_rgba(0,0,0,.14)] sm:h-32 sm:w-32" />
              )}
            </div>
            <div className="sm:ml-40 sm:min-h-24">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-gray-900">{displayName}</h1>
                  <p className="mt-1 font-semibold text-gray-600">
                    {publicProfile?.course_name ?? "Curso"}{publicProfile?.semester ? ` · ${publicProfile.semester}º semestre` : ""} · {publicProfile?.university_name ?? "Universidade"}
                  </p>
                  <p className="mt-2 flex items-center gap-2 text-xs font-medium text-gray-500"><Calendar className="h-4 w-4" /> Membro desde {memberSince(publicProfile?.created_at)}</p>
                </div>
                {isOwnProfile ? (
                  <button onClick={openEdit} disabled={isLoading} className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-5 py-2.5 text-sm font-black text-gray-700 shadow-[0_4px_0_#d1d5db] transition hover:border-green-400 hover:text-green-700 active:translate-y-1 active:shadow-none disabled:opacity-50">
                    <Pencil className="h-4 w-4" /> Editar perfil
                  </button>
                ) : null}
              </div>
            </div>
            <p className="mt-5 max-w-3xl text-sm leading-6 text-gray-700 sm:ml-40">{isLoading ? "Carregando perfil..." : bio}</p>
          </div>
        </motion.section>

        <section className="mt-6 overflow-hidden rounded-[1.75rem] border-2 border-gray-200 bg-white shadow-[0_5px_0_#e5e7eb]" aria-labelledby="profile-impact-title">
          <div className="flex flex-col gap-3 border-b-2 border-gray-100 bg-gradient-to-r from-green-50 via-white to-emerald-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#58cc02] text-white shadow-[0_3px_0_#3f9f00]"><Leaf className="h-5 w-5" /></span>
              <div><h2 id="profile-impact-title" className="text-base font-black text-gray-900">Visão Geral</h2><p className="mt-0.5 text-xs font-semibold text-gray-500">Resultados das Caronas Concluídas</p></div>
            </div>
            
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Caronas Concluídas", value: impact?.total_rides ?? 0, suffix: "", icon: Car, color: "text-green-700 bg-green-100" },
              { label: "CO₂ Evitado", value: impact?.co2_saved_kg ?? 0, suffix: "kg", icon: Leaf, color: "text-emerald-700 bg-emerald-100" },
              { label: "Distância Compartilhada", value: impact?.shared_distance_km ?? 0, suffix: "km", icon: Users, color: "text-blue-700 bg-blue-100" },
              { label: "Boas Atitudes", value: impact?.feedback_count ?? 0, suffix: "", icon: Star, color: "text-amber-700 bg-amber-100" },
            ].map(({ label, value, suffix, icon: Icon, color }, index) => (
              <div key={label} className={`flex min-h-28 items-center gap-3 px-5 py-5 sm:px-6 ${index % 2 === 0 ? "border-r-2 border-gray-100" : ""} ${index < 2 ? "border-b-2 border-gray-100 lg:border-b-0" : ""} ${index > 0 ? "lg:border-l-2 lg:border-gray-100" : ""} lg:border-r-0`}>
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${color}`}><Icon className="h-5 w-5" /></span>
                <div className="min-w-0"><p className="flex items-baseline gap-1 text-2xl font-black tracking-tight text-gray-900"><span>{value}</span>{suffix ? <span className="text-sm font-black text-gray-500">{suffix}</span> : null}</p><p className="mt-1 text-[11px] font-bold leading-4 text-gray-500 sm:text-xs">{label}</p></div>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_.7fr]">
          <section className="rounded-[1.75rem] border-2 border-gray-200 bg-white p-5 shadow-[0_5px_0_#e5e7eb] sm:p-7">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-gray-900">Conquistas</h2>
                <p className="mt-1 text-xs font-semibold text-gray-500">Seu progresso na U-Go</p>
              </div>
              <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-black text-gray-600">{earnedCount}{isOwnProfile ? ` de ${badges.length}` : " conquistadas"}</span>
            </div>
            {badges.length ? (
              <div className="space-y-3">
                {visibleBadges.map((badge, index) => {
                  const percentage = badge.target ? Math.min(badge.progress / badge.target * 100, 100) : (badge.earned ? 100 : 0);
                  return (
                    <motion.div key={badge.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * .04 }} className={`flex gap-4 rounded-2xl border-2 p-4 transition hover:-translate-y-0.5 ${badge.earned ? "border-green-200 bg-green-50/70 shadow-[0_3px_0_#bbf7d0]" : "border-gray-200 bg-gray-50"}`}>
                      <BadgeSeal code={badge.code} color={badge.color} earned={badge.earned} label={badge.title} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2"><h3 className="font-black text-gray-900">{badge.title}</h3>{badge.earned ? <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" /> : null}</div>
                        <p className="mt-1 text-xs leading-5 text-gray-600">{badge.description}</p>
                        {!badge.earned && badge.target ? <div className="mt-3"><Progress value={percentage} className="h-3 bg-gray-200 [&_[data-slot=progress-indicator]]:bg-[#58cc02]" /><p className="mt-1 text-right text-[10px] font-black text-gray-500">{badge.progress}/{badge.target}</p></div> : null}
                        {badge.earned && badge.achievedAt ? <p className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-green-700"><Calendar className="h-3.5 w-3.5" /> Conquistada em {achievedOn(badge.achievedAt)}</p> : null}
                        {badge.earned && isOwnProfile ? <div className="mt-3 flex flex-wrap gap-2" aria-label={`Opções do certificado de ${badge.title}`}>
                          <button type="button" disabled={certificateAction !== null} onClick={() => void runCertificateAction(badge, "pdf")} className="inline-flex items-center gap-1.5 rounded-lg border-2 border-green-200 bg-white px-3 py-1.5 text-[11px] font-black text-green-700 transition hover:border-green-400 hover:bg-green-50 disabled:opacity-50"><FileDown className="h-3.5 w-3.5" /> PDF</button>
                          <button type="button" disabled={certificateAction !== null} onClick={() => void runCertificateAction(badge, "image")} className="inline-flex items-center gap-1.5 rounded-lg border-2 border-blue-200 bg-white px-3 py-1.5 text-[11px] font-black text-blue-700 transition hover:border-blue-400 hover:bg-blue-50 disabled:opacity-50"><Download className="h-3.5 w-3.5" /> Imagem</button>
                          <button type="button" disabled={certificateAction !== null} onClick={() => void runCertificateAction(badge, "copy")} className="inline-flex items-center gap-1.5 rounded-lg border-2 border-violet-200 bg-white px-3 py-1.5 text-[11px] font-black text-violet-700 transition hover:border-violet-400 hover:bg-violet-50 disabled:opacity-50"><Copy className="h-3.5 w-3.5" /> Copiar</button>
                        </div> : null}
                      </div>
                    </motion.div>
                  );
                })}
                {hiddenAchievementCount > 0 ? <button type="button" onClick={() => setShowAllAchievements(true)} className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-green-300 bg-green-50 px-4 py-3 text-xs font-black text-green-700 transition hover:border-green-500 hover:bg-green-100"><ChevronDown className="h-4 w-4" /> Ver mais {hiddenAchievementCount} conquistas</button> : null}
                {showAllAchievements && badges.length > automaticAchievementLimit ? <button type="button" onClick={() => setShowAllAchievements(false)} className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-gray-200 bg-white px-4 py-3 text-xs font-black text-gray-600 transition hover:bg-gray-50"><ChevronUp className="h-4 w-4" /> Mostrar menos</button> : null}
              </div>
            ) : <p className="rounded-2xl bg-gray-50 p-6 text-center text-sm font-semibold text-gray-500">As conquistas aparecerão conforme as caronas forem concluídas.</p>}
          </section>

          <section className="rounded-[1.75rem] border-2 border-gray-200 bg-white p-5 shadow-[0_5px_0_#e5e7eb] sm:p-7">
            <h2 className="text-xl font-black text-gray-900">Boas Atitudes</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">Coleção de badges pelo reconhecimento de atitudes positivas.</p>
            <div className="mt-6 space-y-3">
              {publicProfile?.evaluations.length ? publicProfile.evaluations.map(({ badge, count }) => (
                <div key={badge.id} className="flex items-center gap-3 rounded-2xl border-2 border-amber-100 bg-amber-50/60 p-4 transition hover:border-amber-200">
                  <BadgeSeal code={badge.code} color={badge.display_color || "#f59e0b"} size="sm" label={badge.name} />
                  <div className="min-w-0 flex-1"><p className="font-black text-gray-900">{badge.name}</p><p className="truncate text-xs text-gray-600">{badge.description}</p></div>
                  <span className="rounded-full bg-white px-2.5 py-1 text-sm font-black text-amber-700 shadow-sm">×{count}</span>
                </div>
              )) : <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-center"><ShieldCheck className="mx-auto h-8 w-8 text-gray-300" /><p className="mt-2 text-sm font-semibold text-gray-500">Os reconhecimentos aparecerão aqui após caronas finalizadas.</p></div>}
            </div>
            {impact?.co2_methodology ? <p className="mt-6 rounded-xl bg-emerald-50 p-3 text-[10px] leading-4 text-emerald-800"><Leaf className="mr-1 inline h-3 w-3" /> Impacto estimado: {impact.co2_methodology}.</p> : null}
          </section>
        </div>
      </main>
      <Footer />

      <AnimatePresence>
        {isEditOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/45 p-4 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: .96, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .96 }} className="flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5"><div><h3 className="text-lg font-black text-gray-900">Editar perfil</h3><p className="mt-1 text-xs text-gray-500">Mantenha seu perfil acadêmico atualizado.</p></div><button onClick={() => setIsEditOpen(false)} className="rounded-full bg-gray-100 p-2.5 text-gray-500 hover:bg-gray-200" aria-label="Fechar"><X className="h-5 w-5" /></button></div>
              <div className="space-y-5 overflow-y-auto p-6">
                <div>
                  <p className="text-xs font-black text-gray-600">Foto de capa</p>
                  <div className="relative mt-2 h-36 overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-gradient-to-r from-emerald-100 to-lime-100">
                    {coverPreview && !removeCover ? <img src={coverPreview} alt="Prévia da capa" className="absolute inset-0 h-full w-full object-cover" /> : null}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-black text-gray-700 shadow-md transition hover:bg-green-50 hover:text-green-700">
                        <ImageIcon className="h-4 w-4" /> Escolher capa
                        <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => selectImage(event.target.files?.[0], "cover")} />
                      </label>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-3"><p className="text-[10px] text-gray-500">JPG, PNG ou WebP · até 8 MB · mínimo 320×100 px</p>{coverPreview && !removeCover ? <button type="button" onClick={() => { setCoverFile(null); setCoverPreview(""); setRemoveCover(true); }} className="text-[10px] font-black text-rose-600 hover:underline">Remover capa</button> : null}</div>
                </div>
                <div className="rounded-[1.75rem] border-2 border-gray-200 bg-gray-50/70 p-4 sm:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div><p className="text-sm font-black text-gray-800">Escolha sua imagem de perfil</p><p className="mt-1 text-[11px] text-gray-500">Mostre seu estilo com uma foto ou crie seu personagem U-Go.</p></div>
                    <div className="flex rounded-2xl border-2 border-gray-200 bg-white p-1.5 shadow-[0_3px_0_#e2e8f0]">
                      <button type="button" onClick={() => updateAvatarConfig("enabled", false)} className={`rounded-xl px-4 py-2.5 text-[11px] font-black uppercase tracking-wide transition ${!avatarConfig.enabled ? "bg-[#58cc02] text-white shadow-[0_3px_0_#58a700]" : "text-gray-500 hover:bg-gray-100"}`}>Minha foto</button>
                      <button type="button" onClick={() => updateAvatarConfig("enabled", true)} className={`rounded-xl px-4 py-2.5 text-[11px] font-black uppercase tracking-wide transition ${avatarConfig.enabled ? "bg-[#58cc02] text-white shadow-[0_3px_0_#58a700]" : "text-gray-500 hover:bg-gray-100"}`}>Criar avatar</button>
                    </div>
                  </div>

                  {avatarConfig.enabled ? (
                    <AvatarDesigner config={avatarConfig} onChange={setAvatarConfig} courses={courses} currentCourseId={editForm.course} />
                  ) : (
                    <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
                      <img src={!removeAvatar && avatarPreview ? avatarPreview : defaultAvatar(displayName)} alt="Prévia da foto de perfil" className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-md" />
                      <div className="flex flex-wrap items-center gap-2">
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-green-600 px-4 py-2.5 text-xs font-black text-white transition hover:bg-green-700">
                          <Camera className="h-4 w-4" /> Escolher foto
                          <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => selectImage(event.target.files?.[0], "avatar")} />
                        </label>
                        {avatarPreview && !removeAvatar ? <button type="button" onClick={() => { setAvatarFile(null); setAvatarPreview(""); setRemoveAvatar(true); }} className="rounded-full border border-gray-200 px-4 py-2.5 text-xs font-black text-rose-600 hover:bg-rose-50">Remover</button> : null}
                        <p className="w-full text-[10px] text-gray-500">JPG, PNG ou WebP · até 5 MB · mínimo 64×64 px</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-[1fr_160px]">
                  <label className="text-xs font-black text-gray-600">Curso<select value={editForm.course} onChange={(event) => setEditForm({ ...editForm, course: event.target.value })} className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-green-500">{courses.map((course) => <option key={course.id} value={course.id}>{course.name}</option>)}</select></label>
                  <label className="text-xs font-black text-gray-600">Semestre<select value={editForm.semester} onChange={(event) => setEditForm({ ...editForm, semester: event.target.value })} className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-green-500"><option value="">Não informar</option>{Array.from({ length: 12 }, (_, index) => index + 1).map((semester) => <option key={semester} value={semester}>{semester}º</option>)}</select></label>
                </div>
                <label className="text-xs font-black text-gray-600">Descrição<textarea value={editForm.bio} maxLength={500} onChange={(event) => setEditForm({ ...editForm, bio: event.target.value })} rows={4} className="mt-2 w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm outline-none focus:border-green-500" placeholder="Conte um pouco sobre você e sua relação com a comunidade." /><span className="mt-1 block text-right text-[10px] text-gray-400">{editForm.bio.length}/500</span></label>
                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4"><p className="flex items-center gap-2 text-xs font-black text-blue-900"><Lock className="h-4 w-4" /> Informações privadas</p><p className="mt-1 text-[11px] leading-4 text-blue-700">Telefone e endereço ajudam no funcionamento da plataforma, mas nunca aparecem para quem visita seu perfil.</p><div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="text-xs font-black text-gray-600">Telefone<input type="tel" value={editForm.phone} onChange={(event) => setEditForm({ ...editForm, phone: event.target.value })} className="mt-2 w-full rounded-xl border border-blue-100 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400" /></label><label className="text-xs font-black text-gray-600">Endereço (opcional)<input type="text" value={editForm.address} onChange={(event) => setEditForm({ ...editForm, address: event.target.value })} className="mt-2 w-full rounded-xl border border-blue-100 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400" placeholder="Bairro, cidade" /></label></div></div>
              </div>
              <div className="flex justify-end gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4"><button onClick={() => setIsEditOpen(false)} className="px-5 py-2.5 text-sm font-black text-gray-500">Cancelar</button><button onClick={() => void saveProfile()} disabled={isSaving || !editForm.course || !editForm.phone} className="rounded-full bg-green-600 px-7 py-2.5 text-sm font-black text-white hover:bg-green-700 disabled:opacity-50">{isSaving ? "Salvando..." : "Salvar alterações"}</button></div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
