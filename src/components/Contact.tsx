import { motion, useReducedMotion } from 'framer-motion';
import { Github, Linkedin, Instagram, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { sendContactMessage, validateContactForm, type ContactInput } from '@/services/contact';
import { useSettings } from '@/lib/projects-store';
import { safeHref } from '@/lib/utils';

type Errors = Partial<Record<keyof ContactInput, string>>;
type Status = 'idle' | 'loading' | 'success' | 'error';

const INITIAL: ContactInput = { name: '', email: '', message: '' };

function socialUrl(value?: string) {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  return safeHref(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
}

export function Contact() {
  const { settings } = useSettings();
  const reduceMotion = useReducedMotion();
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Errors>({});
  const [values, setValues] = useState<ContactInput>(INITIAL);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setErrors({});

      const validation = validateContactForm(values);
      if (!validation.ok) {
        setErrors(validation.errors);
        setStatus('error');
        toast.error('Verifique os campos do formulário');
        return;
      }

      setStatus('loading');
      const result = await sendContactMessage(validation.data);

      if (result.ok) {
        setStatus('success');
        toast.success('Mensagem enviada — retorno em breve ✦');
        setValues(INITIAL);
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
        toast.error(result.error);
      }
    },
    [values],
  );

  const isLoading = status === 'loading';
  const isSuccess = status === 'success';

  const socialLinks = [
    {
      Icon: Github,
      label: 'GitHub',
      href: socialUrl(settings.github),
    },
    {
      Icon: Linkedin,
      label: 'LinkedIn',
      href: socialUrl(settings.linkedin),
    },
    {
      Icon: Instagram,
      label: 'Instagram',
      href: socialUrl(settings.instagram),
    },
  ].filter((item) => item.href);

  return (
    <section
      id="contato"
      className="relative scroll-mt-24 border-t border-border px-4 py-20 sm:px-6 sm:py-24 lg:px-10 lg:py-28"
      aria-labelledby="contato-title"
    >
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
        <div className="flex flex-col justify-between gap-8 lg:py-3">
          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-primary sm:text-xs">
              // 06 — Contato
            </p>
            <h2
              id="contato-title"
              className="display text-4xl leading-[0.98] sm:text-5xl lg:text-6xl"
            >
              Vamos conversar <span className="text-primary">sobre o próximo passo.</span>
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              Para oportunidades de {settings.role || 'Desenvolvedor Front-End Júnior'}, projetos
              freelance ou colaboração, me envie uma mensagem.
            </p>
          </div>

          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Outros canais
            </p>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href?.startsWith('http') ? '_blank' : undefined}
                  rel={href?.startsWith('http') ? 'noreferrer' : undefined}
                  data-cursor="hover"
                  aria-label={`Abrir perfil no ${label}`}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {label}
                </a>
              ))}
              {socialLinks.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Os perfis sociais ainda não foram configurados.
                </p>
              )}
            </div>
          </div>
        </div>

        <motion.form
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: reduceMotion ? 0 : 0.35 }}
          onSubmit={onSubmit}
          noValidate
          aria-label="Formulário de contato"
          className="space-y-5 rounded-2xl border border-border bg-card/45 p-5 backdrop-blur-xl sm:p-8"
        >
          <div className="mb-2 border-b border-border pb-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
              Mensagem direta
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Retorno pelo e-mail informado.</p>
          </div>
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
              aria-describedby={errors.message ? 'message-error' : undefined}
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
