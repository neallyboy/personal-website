"use client";

import { useEffect } from "react";
import * as CookieConsent from "vanilla-cookieconsent";
import "vanilla-cookieconsent/dist/cookieconsent.css";

const CLARITY_ID = "waoc4srrm9";

function grantAnalytics() {
  if (typeof window === "undefined") return;
  if ("gtag" in window) {
    (window as any).gtag("consent", "update", { analytics_storage: "granted" });
  }
  if (!document.getElementById("clarity-script")) {
    const s = document.createElement("script");
    s.id = "clarity-script";
    s.async = true;
    s.innerHTML = `(function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window,document,"clarity","script","${CLARITY_ID}");`;
    document.head.appendChild(s);
  }
}

function denyAnalytics() {
  if (typeof window !== "undefined" && "gtag" in window) {
    (window as any).gtag("consent", "update", { analytics_storage: "denied" });
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
            cookies: [
              { name: /^(_ga|_gid|_gat)/ },
              { name: /^(_clsk|_clck)/ },
            ],
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
