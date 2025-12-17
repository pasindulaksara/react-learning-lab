import { useMemo, useState } from "react";

type ShopSettings = {
  shopName: string;
  address: string;
  phone: string;

  openHour: number;  // 0-23
  closeHour: number; // 0-23

  currencyLabel: string; // "LKR"
};

type PricingSettings = {
  hourlyRate: number; // LKR
  minChargeMinutes: number; // e.g. 30
  maxSessionHours: number; // e.g. 2
  lateGraceMinutes: number; // e.g. 5
};

type RewardsSettings = {
  enabled: boolean;
  visitsForReward: number; // e.g. 10
  rewardMinutes: number; // e.g. 60
  note: string;
};

type PaymentSettings = {
  methods: {
    cash: boolean;
    bankTransfer: boolean;
  };
  bankName: string;
  accountName: string;
  accountNumber: string;
  branch: string;
  referenceHint: string; // e.g. "Use Parent Name + Session ID"
};

type DisplayBoardSettings = {
  highlightActive: boolean;
  showTimer: boolean;
  showParentName: boolean;
  showChildrenCount: boolean;
};

type SettingsState = {
  shop: ShopSettings;
  pricing: PricingSettings;
  rewards: RewardsSettings;
  payments: PaymentSettings;
  display: DisplayBoardSettings;
};

const HOURS = Array.from({ length: 24 }, (_, i) => i);

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="mb-3">
        <h2 className="font-semibold text-gray-900">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
  helper,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  helper?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="text-sm font-medium text-gray-800">{label}</div>
        {helper && <div className="text-xs text-gray-500 mt-1">{helper}</div>}
      </div>

      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`w-12 h-7 rounded-full relative transition ${
          checked ? "bg-blue-600" : "bg-gray-300"
        }`}
        aria-pressed={checked}
      >
        <span
          className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
            checked ? "left-6" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const initial: SettingsState = useMemo(
    () => ({
      shop: {
        shopName: "ToyTown Play Area",
        address: "Colombo, Sri Lanka",
        phone: "0771234567",
        openHour: 8,
        closeHour: 20,
        currencyLabel: "LKR",
      },
      pricing: {
        hourlyRate: 1200,
        minChargeMinutes: 30,
        maxSessionHours: 2,
        lateGraceMinutes: 5,
      },
      rewards: {
        enabled: true,
        visitsForReward: 10,
        rewardMinutes: 60,
        note: "Reward applies per parent (not per child).",
      },
      payments: {
        methods: {
          cash: true,
          bankTransfer: true,
        },
        bankName: "Commercial Bank",
        accountName: "ToyTown Play Area",
        accountNumber: "1234567890",
        branch: "Kiribathgoda",
        referenceHint: "Use Parent Name + Session ID as reference.",
      },
      display: {
        highlightActive: true,
        showTimer: true,
        showParentName: true,
        showChildrenCount: true,
      },
    }),
    []
  );

  const [settings, setSettings] = useState<SettingsState>(initial);
  const [savedMsg, setSavedMsg] = useState("");

  const onSave = () => {
    // UI-only: later replace with API call.
    console.log("Settings (mock save):", settings);
    setSavedMsg("Saved (mock). Check console.");
    setTimeout(() => setSavedMsg(""), 2000);
  };

  const onReset = () => {
    setSettings(initial);
    setSavedMsg("Reset to defaults.");
    setTimeout(() => setSavedMsg(""), 2000);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="text-sm text-gray-500">
            Configure shop details, pricing, rewards, payment methods, and display board rules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {savedMsg && (
            <div className="text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded">
              {savedMsg}
            </div>
          )}
          <button
            type="button"
            onClick={onReset}
            className="px-4 py-2 rounded border bg-white hover:bg-gray-50 text-sm"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onSave}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm"
          >
            Save changes
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shop */}
        <Card title="Shop details" subtitle="Basic info shown in admin and receipts.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500">Shop name</label>
              <input
                className="w-full border rounded px-3 py-2 text-sm mt-1"
                value={settings.shop.shopName}
                onChange={(e) =>
                  setSettings((p) => ({
                    ...p,
                    shop: { ...p.shop, shopName: e.target.value },
                  }))
                }
              />
            </div>

            <div>
              <label className="text-xs text-gray-500">Phone</label>
              <input
                className="w-full border rounded px-3 py-2 text-sm mt-1"
                value={settings.shop.phone}
                onChange={(e) =>
                  setSettings((p) => ({
                    ...p,
                    shop: { ...p.shop, phone: e.target.value },
                  }))
                }
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs text-gray-500">Address</label>
              <input
                className="w-full border rounded px-3 py-2 text-sm mt-1"
                value={settings.shop.address}
                onChange={(e) =>
                  setSettings((p) => ({
                    ...p,
                    shop: { ...p.shop, address: e.target.value },
                  }))
                }
              />
            </div>

            <div>
              <label className="text-xs text-gray-500">Open hour</label>
              <select
                className="w-full border rounded px-3 py-2 text-sm mt-1"
                value={settings.shop.openHour}
                onChange={(e) =>
                  setSettings((p) => ({
                    ...p,
                    shop: { ...p.shop, openHour: Number(e.target.value) },
                  }))
                }
              >
                {HOURS.map((h) => (
                  <option key={h} value={h}>
                    {String(h).padStart(2, "0")}:00
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-500">Close hour</label>
              <select
                className="w-full border rounded px-3 py-2 text-sm mt-1"
                value={settings.shop.closeHour}
                onChange={(e) =>
                  setSettings((p) => ({
                    ...p,
                    shop: { ...p.shop, closeHour: Number(e.target.value) },
                  }))
                }
              >
                {HOURS.map((h) => (
                  <option key={h} value={h}>
                    {String(h).padStart(2, "0")}:00
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Pricing */}
        <Card title="Pricing rules" subtitle="Controls session billing logic (UI only for now).">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500">Hourly rate (LKR)</label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2 text-sm mt-1"
                value={settings.pricing.hourlyRate}
                onChange={(e) =>
                  setSettings((p) => ({
                    ...p,
                    pricing: { ...p.pricing, hourlyRate: Number(e.target.value) },
                  }))
                }
              />
            </div>

            <div>
              <label className="text-xs text-gray-500">Minimum charge (minutes)</label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2 text-sm mt-1"
                value={settings.pricing.minChargeMinutes}
                onChange={(e) =>
                  setSettings((p) => ({
                    ...p,
                    pricing: {
                      ...p.pricing,
                      minChargeMinutes: Number(e.target.value),
                    },
                  }))
                }
              />
            </div>

            <div>
              <label className="text-xs text-gray-500">Default / max session (hours)</label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2 text-sm mt-1"
                value={settings.pricing.maxSessionHours}
                onChange={(e) =>
                  setSettings((p) => ({
                    ...p,
                    pricing: { ...p.pricing, maxSessionHours: Number(e.target.value) },
                  }))
                }
              />
            </div>

            <div>
              <label className="text-xs text-gray-500">Late grace (minutes)</label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2 text-sm mt-1"
                value={settings.pricing.lateGraceMinutes}
                onChange={(e) =>
                  setSettings((p) => ({
                    ...p,
                    pricing: { ...p.pricing, lateGraceMinutes: Number(e.target.value) },
                  }))
                }
              />
            </div>

            <div className="md:col-span-2 text-xs text-gray-500">
              Note: We will connect these values into session end + billing calculation later.
            </div>
          </div>
        </Card>

        {/* Rewards */}
        <Card title="Rewards & loyalty" subtitle="Reward logic is per parent, not per child.">
          <div className="space-y-4">
            <Toggle
              label="Enable rewards"
              checked={settings.rewards.enabled}
              onChange={(v) =>
                setSettings((p) => ({
                  ...p,
                  rewards: { ...p.rewards, enabled: v },
                }))
              }
              helper="If disabled, no free-time rewards are applied."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500">Visits required</label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2 text-sm mt-1"
                  value={settings.rewards.visitsForReward}
                  onChange={(e) =>
                    setSettings((p) => ({
                      ...p,
                      rewards: { ...p.rewards, visitsForReward: Number(e.target.value) },
                    }))
                  }
                  disabled={!settings.rewards.enabled}
                />
              </div>

              <div>
                <label className="text-xs text-gray-500">Reward minutes</label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2 text-sm mt-1"
                  value={settings.rewards.rewardMinutes}
                  onChange={(e) =>
                    setSettings((p) => ({
                      ...p,
                      rewards: { ...p.rewards, rewardMinutes: Number(e.target.value) },
                    }))
                  }
                  disabled={!settings.rewards.enabled}
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs text-gray-500">Reward note (optional)</label>
                <input
                  className="w-full border rounded px-3 py-2 text-sm mt-1"
                  value={settings.rewards.note}
                  onChange={(e) =>
                    setSettings((p) => ({
                      ...p,
                      rewards: { ...p.rewards, note: e.target.value },
                    }))
                  }
                  disabled={!settings.rewards.enabled}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Payments */}
        <Card title="Payment methods" subtitle="Only Cash and Bank Transfer are supported.">
          <div className="space-y-4">
            <Toggle
              label="Cash"
              checked={settings.payments.methods.cash}
              onChange={(v) =>
                setSettings((p) => ({
                  ...p,
                  payments: {
                    ...p.payments,
                    methods: { ...p.payments.methods, cash: v },
                  },
                }))
              }
              helper="Allow cash payments."
            />

            <Toggle
              label="Bank transfer"
              checked={settings.payments.methods.bankTransfer}
              onChange={(v) =>
                setSettings((p) => ({
                  ...p,
                  payments: {
                    ...p.payments,
                    methods: { ...p.payments.methods, bankTransfer: v },
                  },
                }))
              }
              helper="Allow bank transfers and show account details."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500">Bank name</label>
                <input
                  className="w-full border rounded px-3 py-2 text-sm mt-1"
                  value={settings.payments.bankName}
                  onChange={(e) =>
                    setSettings((p) => ({
                      ...p,
                      payments: { ...p.payments, bankName: e.target.value },
                    }))
                  }
                  disabled={!settings.payments.methods.bankTransfer}
                />
              </div>

              <div>
                <label className="text-xs text-gray-500">Account name</label>
                <input
                  className="w-full border rounded px-3 py-2 text-sm mt-1"
                  value={settings.payments.accountName}
                  onChange={(e) =>
                    setSettings((p) => ({
                      ...p,
                      payments: { ...p.payments, accountName: e.target.value },
                    }))
                  }
                  disabled={!settings.payments.methods.bankTransfer}
                />
              </div>

              <div>
                <label className="text-xs text-gray-500">Account number</label>
                <input
                  className="w-full border rounded px-3 py-2 text-sm mt-1"
                  value={settings.payments.accountNumber}
                  onChange={(e) =>
                    setSettings((p) => ({
                      ...p,
                      payments: { ...p.payments, accountNumber: e.target.value },
                    }))
                  }
                  disabled={!settings.payments.methods.bankTransfer}
                />
              </div>

              <div>
                <label className="text-xs text-gray-500">Branch</label>
                <input
                  className="w-full border rounded px-3 py-2 text-sm mt-1"
                  value={settings.payments.branch}
                  onChange={(e) =>
                    setSettings((p) => ({
                      ...p,
                      payments: { ...p.payments, branch: e.target.value },
                    }))
                  }
                  disabled={!settings.payments.methods.bankTransfer}
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs text-gray-500">Reference hint</label>
                <input
                  className="w-full border rounded px-3 py-2 text-sm mt-1"
                  value={settings.payments.referenceHint}
                  onChange={(e) =>
                    setSettings((p) => ({
                      ...p,
                      payments: { ...p.payments, referenceHint: e.target.value },
                    }))
                  }
                  disabled={!settings.payments.methods.bankTransfer}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Display board */}
        <Card
          title="Display board"
          subtitle="Controls what the kids’ screen shows during active sessions."
        >
          <div className="space-y-4">
            <Toggle
              label="Highlight active session"
              checked={settings.display.highlightActive}
              onChange={(v) =>
                setSettings((p) => ({
                  ...p,
                  display: { ...p.display, highlightActive: v },
                }))
              }
              helper="Highlights the current active session in the display board."
            />

            <Toggle
              label="Show timer"
              checked={settings.display.showTimer}
              onChange={(v) =>
                setSettings((p) => ({
                  ...p,
                  display: { ...p.display, showTimer: v },
                }))
              }
              helper="If off, the display board will not show the countdown timer."
            />

            <Toggle
              label="Show parent name"
              checked={settings.display.showParentName}
              onChange={(v) =>
                setSettings((p) => ({
                  ...p,
                  display: { ...p.display, showParentName: v },
                }))
              }
              helper="Show parent name on the display board."
            />

            <Toggle
              label="Show children count"
              checked={settings.display.showChildrenCount}
              onChange={(v) =>
                setSettings((p) => ({
                  ...p,
                  display: { ...p.display, showChildrenCount: v },
                }))
              }
              helper="Show number of children for each session."
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
