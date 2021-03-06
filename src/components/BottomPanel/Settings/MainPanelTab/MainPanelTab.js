import { useSettings } from "contexts/settings-context";
import { dispatchCustomEvent } from "utils";

export default function MainPanelTab() {
  const { settings: { mainPanel: settings }, updateSetting, toggleSetting } = useSettings();

  function toggleComponent(item) {
    let disabledComponentCount = 0;
    settings.components[item].disabled = !settings.components[item].disabled;

    for (const key of Object.keys(settings.components)) {
      if (settings.components[key].disabled) {
        disabledComponentCount += 1;
      }
    }
    updateSetting("mainPanel", {
      navDisabled: disabledComponentCount > 2,
      disabled: disabledComponentCount === 4,
      components: { ...settings.components }
    });
  }

  function resetTopSites() {
    dispatchCustomEvent("top-sites-reset");
  }

  function toggleTopSiteItemCount({ target }) {
    toggleTopSiteSetting({ visibleItemCount: target.checked ? 4 : 8 });
  }

  function toggleTopSiteButtonVisibility({ target }) {
    toggleTopSiteSetting({ addSiteButtonHidden: target.checked });
  }

  function toggleTopSiteSetting(setting) {
    const { components } = settings;

    updateSetting("mainPanel", {
      components: {
        ...components,
        topSites: {
          ...components.topSites,
          ...setting
        }
      }
    });
  }

  return (
    <div className="setting-tab">
      <label className="setting">
        <span>Hide item bar</span>
        <input type="checkbox" className="sr-only checkbox-input"
          checked={settings.navHidden}
          onChange={() => toggleSetting("mainPanel", "navHidden")}/>
        <div className="checkbox">
          <div className="checkbox-tick"></div>
        </div>
      </label>
      <label className="setting">
        <span>Disable top sites</span>
        <input type="checkbox" className="sr-only checkbox-input"
          checked={settings.components.topSites.disabled}
          onChange={() => toggleComponent("topSites")}/>
        <div className="checkbox">
          <div className="checkbox-tick"></div>
        </div>
      </label>
      <div className={`setting${settings.components.topSites.disabled ? " disabled" : ""}`}>
        <span>Restore default top sites</span>
        <button className="btn" onClick={resetTopSites}>Reset</button>
      </div>
      <label className={`setting${settings.components.topSites.disabled ? " disabled" : ""}`}>
        <span>Show one row of top sites</span>
        <input type="checkbox" className="sr-only checkbox-input"
          disabled={settings.components.topSites.disabled}
          checked={settings.components.topSites.visibleItemCount === 4}
          onChange={toggleTopSiteItemCount}/>
        <div className="checkbox">
          <div className="checkbox-tick"></div>
        </div>
      </label>
      <label className={`setting${settings.components.topSites.disabled ? " disabled" : ""}`}>
        <span>Hide add site button</span>
        <input type="checkbox" className="sr-only checkbox-input"
          disabled={settings.components.topSites.disabled}
          checked={settings.components.topSites.addSiteButtonHidden}
          onChange={toggleTopSiteButtonVisibility}/>
        <div className="checkbox">
          <div className="checkbox-tick"></div>
        </div>
      </label>
      <label className="setting">
        <span>Disable notepad</span>
        <input type="checkbox" className="sr-only checkbox-input"
          checked={settings.components.notepad.disabled}
          onChange={() => toggleComponent("notepad")}/>
        <div className="checkbox">
          <div className="checkbox-tick"></div>
        </div>
      </label>
      <label className="setting">
        <span>Disable twitter</span>
        <input type="checkbox" className="sr-only checkbox-input"
          checked={settings.components.twitter.disabled}
          onChange={() => toggleComponent("twitter")}/>
        <div className="checkbox">
          <div className="checkbox-tick"></div>
        </div>
      </label>
      <label className="setting">
        <span>Disable RSS feed</span>
        <input type="checkbox" className="sr-only checkbox-input"
          checked={settings.components.rssFeed.disabled}
          onChange={() => toggleComponent("rssFeed")}/>
        <div className="checkbox">
          <div className="checkbox-tick"></div>
        </div>
      </label>
    </div>
  );
}
