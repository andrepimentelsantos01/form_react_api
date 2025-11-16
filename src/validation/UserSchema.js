import { z } from "zod";

// remove tudo que não for dígito
const stripNonDigits = (v = "") => v.replace(/\D/g, "");

// valida CPF (recebe CPF apenas com dígitos, 11 chars)
const validarCPF = (cpf) => {
    if (!cpf) return false;
    cpf = stripNonDigits(cpf);
    if (cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i), 10) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10) resto = 0;
    if (resto !== parseInt(cpf.charAt(9), 10)) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i), 10) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10) resto = 0;
    if (resto !== parseInt(cpf.charAt(10), 10)) return false;

    return true;
};

export const UserSchema = z.object({
    nome: z
        .string()
        .min(2, "Nome deve ter pelo menos 2 caracteres")
        .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, "Nome deve conter apenas letras"),
    sobrenome: z
        .string()
        .min(2, "Sobrenome deve ter pelo menos 2 caracteres")
        .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, "Sobrenome deve conter apenas letras"),
    cpf: z
        .string()
        .transform((v) => stripNonDigits(v)) // transforma para só dígitos antes da validação
        .refine((v) => v.length === 11, { message: "CPF deve conter 11 dígitos" })
        .refine((v) => validarCPF(v), { message: "CPF inválido" }),
    email: z.string().email("Email inválido"),
    cep: z
        .string()
        .transform((v) => stripNonDigits(v))
        .refine((v) => v.length === 8, { message: "CEP deve conter 8 dígitos" }),
    logradouro: z.string().optional(),
    bairro: z.string().optional(),
    cidade: z.string().optional(),
    estado: z.string().optional(),
});

