import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Nome muito curto").max(80, "Nome muito longo"),
  email: z.string().trim().email("Email inválido").max(120),
  message: z.string().trim().min(10, "Mensagem muito curta").max(1500, "Mensagem muito longa"),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactResult = { ok: true; provider: "emailjs" } | { ok: false; error: string };

const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

function readEmailJsConfig() {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;

  if (!serviceId || !templateId || !publicKey) {
    return {
      ok: false as const,
      error:
        "EmailJS não configurado. Defina VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID e VITE_EMAILJS_PUBLIC_KEY.",
    };
  }

  return { ok: true as const, data: { serviceId, templateId, publicKey } };
}

export function validateContactForm(
  input: unknown,
):
  | { ok: true; data: ContactInput }
  | { ok: false; errors: Partial<Record<keyof ContactInput, string>> } {
  const parsed = contactSchema.safeParse(input);
  if (parsed.success) return { ok: true, data: parsed.data };
  const errors: Partial<Record<keyof ContactInput, string>> = {};
  for (const issue of parsed.error.issues) {
    const k = issue.path[0] as keyof ContactInput;
    if (k && !errors[k]) errors[k] = issue.message;
  }
  return { ok: false, errors };
}

export async function sendContactMessage(input: ContactInput): Promise<ContactResult> {
  const validated = validateContactForm(input);
  if (!validated.ok) return { ok: false, error: "Dados inválidos." };

  const config = readEmailJsConfig();
  if (!config.ok) return { ok: false, error: config.error };

  try {
    const payload = {
      service_id: config.data.serviceId,
      template_id: config.data.templateId,
      user_id: config.data.publicKey,
      template_params: {
        from_name: validated.data.name,
        from_email: validated.data.email,
        reply_to: validated.data.email,
        message: validated.data.message,
        subject: `Novo contato do portfólio — ${validated.data.name}`,
      },
    };

    const response = await fetch(EMAILJS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const reason = await response.text();
      return {
        ok: false,
        error: reason || "Falha ao enviar email pelo EmailJS.",
      };
    }

    return { ok: true, provider: "emailjs" };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Erro inesperado." };
  }
}
