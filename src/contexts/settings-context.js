import { createContext, useState, useContext } from "react";
import * as settingsService from "../services/settings";

const SettingsContext = createContext();

function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => settingsService.getSettings());

  function setSetting(group, setting) {
    setSettings({ ...settingsService.setSetting({ [group]: setting }) });
  }

  function updateSetting(group, setting) {
    const settings = settingsService.updateSetting({ [group]: setting });

    setSettings({ ...settings });
  }

  function toggleSetting(group, settingName) {
    updateSetting(group, {
      [settingName]: !settings[group][settingName]
    });
  }

  return <SettingsContext.Provider value={{ settings, setSetting, updateSetting, toggleSetting }}>{children}</SettingsContext.Provider>;
}

function useSettings() {
  return useContext(SettingsContext);
}

export {
  SettingsProvider,
  useSettings
};
