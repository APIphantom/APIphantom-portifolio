import { motion } from "framer-motion";
import { Github, Linkedin, Instagram, Send, Loader2, CheckCircle2 } from "lucide-react";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { sendContactMessage, validateContactForm, type ContactInput } from "@/services/contact";
import { useSettings } from "@/lib/projects-store";

type Errors = Partial<Record<keyof ContactInput, string>>;
type Status = "idle" | "loading" | "success" | "error";

const INITIAL: ContactInput = { name: "", email: "", message: "" };

function toAbsoluteUrl(url: string) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
}

export function Contact() {
  const { settings } = useSettings();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [values, setValues] = useState<ContactInput>(INITIAL);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setErrors({});

      const validation = validateContactForm(values);
      if (!validation.ok) {
        setErrors(validation.errors);
        setStatus("error");
        toast.error("Verifique os campos do formulário");
        return;
      }

      setStatus("loading");
      const result = await sendContactMessage(validation.data);

      if (result.ok) {
        setStatus("success");
        toast.success("Mensagem enviada — retorno em breve ✦");
        setValues(INITIAL);
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
        toast.error(result.error);
      }
    },
    [values],
  );

  const isLoading = status === "loading";
  const isSuccess = status === "success";

  const socialLinks = [
    {
      Icon: Github,
      label: settings.github || "GitHub não configurado",
      href: toAbsoluteUrl(settings.github),
    },
    {
      Icon: Linkedin,
      label: settings.linkedin || "LinkedIn não configurado",
      href: toAbsoluteUrl(settings.linkedin),
    },
    {
      Icon: Instagram,
      label: settings.instagram || "Instagram não configurado",
      href: toAbsoluteUrl(settings.instagram),
    },
  ].filter((item) => item.href);

  return (
    <section
      id="contato"
      className="relative py-32 px-6 lg:px-10 border-t border-border"
      aria-labelledby="contato-title"
    >
      <div className="mx-auto max-w-7xl grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <div className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
            // 05 — Contato
          </div>
          <h2 id="contato-title" className="display text-5xl md:text-7xl">
            Vamos
            <br />
            conversar
            <br />
            <span className="text-primary">.</span>
          </h2>
          <p className="mt-6 text-muted-foreground max-w-md">
            Estou em busca da minha primeira oportunidade como {settings.role || "Front-End Júnior"}
            . Aberto a posições full-time, estágio, freelance e projetos colaborativos. Respondo
            rápido.
          </p>
          <div className="mt-10 space-y-3">
            {socialLinks.map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                data-cursor="hover"
                aria-label={label}
                className="group flex items-center gap-4 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <span className="inline-flex size-10 items-center justify-center rounded-full border border-border group-hover:border-primary group-hover:glow-neon transition-all">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                {label}
              </a>
            ))}
            {socialLinks.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Configure suas redes no painel admin em Configuracoes.
              </p>
            )}
          </div>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={onSubmit}
          noValidate
          aria-label="Formulário de contato"
          className="lg:col-span-7 p-8 rounded-3xl border border-border bg-card/60 backdrop-blur-xl space-y-5"
        >
          <Field
            id="name"
            label="Nome"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={(v) => setValues({ ...values, name: v })}
            error={errors.name}
          />
          <Field
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(v) => setValues({ ...values, email: v })}
            error={errors.email}
          />
          <div>
            <label
              htmlFor="message"
              className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-2"
            >
              Mensagem
            </label>
            <textarea
              id="message"
              rows={4}
              value={values.message}
              onChange={(e) => setValues({ ...values, message: e.target.value })}
              placeholder="Conte sobre a oportunidade ou o projeto..."
              data-cursor="hover"
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "message-error" : undefined}
              className="w-full bg-transparent border-0 border-b border-border focus:border-primary outline-none py-3 text-lg resize-none transition-colors"
            />
            {errors.message && (
              <p id="message-error" role="alert" className="mt-1 text-xs text-destructive">
                {errors.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading || isSuccess}
            data-cursor="hover"
            className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-full bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs hover:glow-neon transition-shadow disabled:opacity-60 min-h-11"
          >
            {isLoading && (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Enviando…
              </>
            )}
            {isSuccess && (
              <>
                <CheckCircle2 className="size-4" aria-hidden="true" /> Enviado!
              </>
            )}
            {!isLoading && !isSuccess && (
              <>
                Enviar <Send className="size-4" aria-hidden="true" />
              </>
            )}
          </button>
        </motion.form>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  type,
  value,
  onChange,
  error,
  autoComplete,
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-2"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        placeholder={label.toLowerCase()}
        data-cursor="hover"
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className="w-full bg-transparent border-0 border-b border-border focus:border-primary outline-none py-3 text-lg transition-colors"
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
