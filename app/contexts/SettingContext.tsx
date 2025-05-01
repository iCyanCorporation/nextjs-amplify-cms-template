"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface Setting {
  id?: string;
  key: string;
  value: string;
  description?: string;
  group?: string;
}

export interface SettingKeyConfig {
  key: string;
  label: string;
  defaultValue: string;
}

export const SETTINGS_KEYS: SettingKeyConfig[] = [
  { key: "store_name", label: "Store Name", defaultValue: "My Awesome Store" },
  {
    key: "support_email",
    label: "Support Email",
    defaultValue: "support@example.com",
  },
  { key: "currency", label: "Currency", defaultValue: "USD" },
  { key: "phone", label: "Phone Number", defaultValue: "+1 (555) 123-4567" },
  { key: "address_1", label: "Address Line 1", defaultValue: "123 Main St" },
  { key: "address_2", label: "Address Line 2", defaultValue: "Suite 101" },
  { key: "city", label: "City", defaultValue: "New York" },
  { key: "state", label: "State/Province", defaultValue: "NY" },
  { key: "zip", label: "ZIP/Postal Code", defaultValue: "10001" },
  { key: "country", label: "Country", defaultValue: "USA" },
  // Payment Methods
  {
    key: "payment_bank_transfer",
    label: "Bank Transfer Details",
    defaultValue: "",
  },
  { key: "payment_qr_code", label: "QR Code Payment Image", defaultValue: "" },
  {
    key: "payment_custom_link",
    label: "Custom Payment Link",
    defaultValue: "",
  },
  {
    key: "admin_language",
    label: "Admin Platform Language",
    defaultValue: "en",
  },
  // Payment Method Enable Flags
  {
    key: "payment_bank_transfer_enabled",
    label: "Enable Bank Transfer",
    defaultValue: "",
  },
  {
    key: "payment_qr_code_enabled",
    label: "Enable QR Code Payment",
    defaultValue: "",
  },
  {
    key: "payment_custom_link_enabled",
    label: "Enable Custom Payment Link",
    defaultValue: "",
  },
];

interface SettingContextType {
  settings: Record<string, Setting>;
  getSetting: (key: string) => string | undefined;
  refreshSettings: () => Promise<void>;
}

const SettingContext = createContext<SettingContextType | undefined>(undefined);

export const SettingProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Record<string, Setting>>({});
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.settings) {
        const map: Record<string, Setting> = {};
        for (const s of data.settings) {
          map[s.key] = s;
        }
        setSettings(map);
      }
    } catch (e) {
      // Optionally handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const getSetting = (key: string) => settings[key]?.value;

  const value: SettingContextType = {
    settings,
    getSetting,
    refreshSettings: fetchSettings,
  };

  return (
    <SettingContext.Provider value={value}>{children}</SettingContext.Provider>
  );
};

export const useSettingContext = (): SettingContextType => {
  const context = useContext(SettingContext);
  if (!context) {
    throw new Error("useSettingContext must be used within SettingProvider");
  }
  return context;
};
