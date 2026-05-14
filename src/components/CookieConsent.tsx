"use client";

import { useEffect } from "react";
import CookieConsent from "vanilla-cookieconsent";
import "vanilla-cookieconsent/dist/cookieconsent.css";

function grantAnalytics() {
  if (typeof window === "undefined") return;
  if ("gtag" in window) {
    (window as { gtag: (...args: unknown[]) => void }).gtag("consent", "update", { analytics_storage: "granted" });
  }
}

function denyAnalytics() {
  if (typeof window !== "undefined" && "gtag" in window) {
    (window as { gtag: (...args: unknown[]) => void }).gtag("consent", "update", { analytics_storage: "denied" });
  }
}

export function CookieConsentBanner() {
  useEffect(() => {
    CookieConsent.run({
      categories: {
        necessary: {
          enabled: true,
          readOnly: true,
        },
        analytics: {
          autoClear: {
            cookies: [{ name: /^(_ga|_gid|_gat)/ }, { name: /^(_clsk|_clck)/ }],
          },
        },
      },

      onFirstConsent: () => {
        if (CookieConsent.acceptedCategory("analytics")) {
          grantAnalytics();
        } else {
          denyAnalytics();
        }
      },

      onConsent: () => {
        if (CookieConsent.acceptedCategory("analytics")) {
          grantAnalytics();
        }
      },

      onChange: ({ changedCategories }) => {
        if (changedCategories.includes("analytics")) {
          if (CookieConsent.acceptedCategory("analytics")) {
            grantAnalytics();
          } else {
            denyAnalytics();
          }
        }
      },

      language: {
        default: "en",
        translations: {
          en: {
            consentModal: {
              title: "Cookie preferences",
              description:
                "This site uses analytics cookies to understand how visitors use it. You can accept or decline at any time.",
              acceptAllBtn: "Accept all",
              acceptNecessaryBtn: "Reject all",
              showPreferencesBtn: "Manage preferences",
            },
            preferencesModal: {
              title: "Cookie preferences",
              acceptAllBtn: "Accept all",
              acceptNecessaryBtn: "Reject all",
              savePreferencesBtn: "Save preferences",
              closeIconLabel: "Close",
              sections: [
                {
                  title: "Necessary",
                  description:
                    "Required for the site to function. Cannot be disabled.",
                  linkedCategory: "necessary",
                },
                {
                  title: "Analytics",
                  description:
                    "Help understand how visitors use this site via Google Analytics and Microsoft Clarity. No personal data is sold or shared.",
                  linkedCategory: "analytics",
                },
              ],
            },
          },
        },
      },
    });
  }, []);

  return null;
}
