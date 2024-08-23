import { app } from "electron";
import i18next, { Resource } from "i18next";
import { is } from "./is";

/**
 * Initializes the i18n configuration with the provided localization messages.
 *
 * @param messages An object containing localization resources.
 *
 * @param locale The default locale to use for translations.
 * If not provided, it falls back to the system locale retrieved via `app.getLocale()`.
 */
export const i18nInit = async (messages: Resource, locale?: string) => {
  await i18next.init({
    lng: locale || app.getLocale(),
    debug: is.env.dev,
    missingKeyNoValueFallbackToKey: true,
    resources: Object.fromEntries(
      Object.entries(messages).map(([lang, resource]) => [
        lang,
        Object.keys(messages).length === 1 && resource.translation
          ? resource
          : { translation: resource }
      ])
    )
  });
};

export const i18n = i18next;

export const t = i18next.t;
