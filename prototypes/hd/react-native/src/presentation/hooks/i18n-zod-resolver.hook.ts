import { zodResolver } from "@hookform/resolvers/zod";
import { z, type AnyZodObject } from "zod";

/**
 * A wrapper for React Hook Form zodResolver with Zod i18n support.
 * @param schema - Zod schema
 * @returns A typed zodResolver for useForm
 */
export function useI18nZodResolver<T extends AnyZodObject>(schema: T) {
    const localizedSchema = schema;

    return zodResolver(localizedSchema) satisfies ReturnType<
    typeof zodResolver<T>
    >;
}
