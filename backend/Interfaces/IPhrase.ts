export const languages = {
  en: "en",
  es: "es",
};

export type languagesType = (typeof languages)[keyof typeof languages];

export default interface IPhrase {
  get: ({ lang }: { lang?: languagesType }) => Promise<string | null>;
}
