import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { handleZIndex, getIincreasedZIndex } from "services/zIndex";
import Icon from "../Icon";
import "./top-panel.css";
import Countdown from "./Countdown";

const Timer = lazy(() => import("./Timer"));
const Stopwatch = lazy(() => import("./Stopwatch"));
const Pomodoro = lazy(() => import("./Pomodoro"));

export default function TopPanel({ forceVisibility = false }) {
  const [visible, setVisible] = useState(false);
  const [rerender, setRerender] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [tabs, setTabs] = useState(() => ({
    timer: {},
    stopwatch: {},
    pomodoro: {}
  }));
  const containerRef = useRef(null);

  useEffect(() => {
    if (forceVisibility) {
      requestAnimationFrame(() => {
        setRerender(true);
      });
    }
  }, [forceVisibility]);

  useEffect(() => {
    if (rerender) {
      setVisible(true);
      setRerender(false);
    }
  }, [rerender]);

  useEffect(() => {
    if (visible && !activeTab) {
      tabs.timer.rendered = true;

      setActiveTab("timer");
      setTabs({ ...tabs });
    }
    window.addEventListener("top-panel-visible", toggleTopPanel);

    return () => {
      window.removeEventListener("top-panel-visible", toggleTopPanel);
    };
  }, [visible]);

  useEffect(() => {
    if (expanded) {
      window.addEventListener("keydown", collapse);
    }
    else {
      window.removeEventListener("keydown", collapse);
    }
    return () => {
      window.removeEventListener("keydown", collapse);
    };
  }, [expanded]);

  function toggleTopPanel() {
    setVisible(!visible);

    if (!visible) {
      const zIndex = getIincreasedZIndex();
      containerRef.current.style.setProperty("--z-index", zIndex);
    }
  }

  function hideTopPanel() {
    if (expanded) {
      setExpanded(false);
    }
    else {
      setVisible(false);
    }
  }

  function selectTab(name) {
    if (!tabs[name].rendered) {
      tabs[name].rendered = true;
      setTabs({ ...tabs });
    }
    setActiveTab(name);
  }

  function expand() {
    setExpanded(true);
  }

  function collapse(event) {
    if (event.key === "Escape") {
      setExpanded(false);
    }
  }

  return (
    <div className={`container top-panel${visible ? " visible" : ""}${expanded ? " expanded" : ""}`}
      onClick={handleZIndex} ref={containerRef}>
      <div className="top-panel-content">
        <ul className="top-panel-hide-target top-panel-header">
          <li className={`top-panel-header-item${activeTab === "timer" ? " active" : ""}`}>
            <button className="btn icon-text-btn top-panel-header-item-btn" onClick={() => selectTab("timer")}>
              <Icon id="timer"/>
              <span>Timer</span>
            </button>
          </li>
          <li className={`top-panel-header-item${activeTab === "stopwatch" ? " active" : ""}`}>
            <button className="btn icon-text-btn top-panel-header-item-btn" onClick={() => selectTab("stopwatch")}>
              <Icon id="stopwatch"/>
              <span>Stopwatch</span>
            </button>
          </li>
          <li className={`top-panel-header-item${activeTab === "pomodoro" ? " active" : ""}`}>
            <button className="btn icon-text-btn top-panel-header-item-btn" onClick={() => selectTab("pomodoro")}>
              <Icon id="pomodoro"/>
              <span>Pomodoro</span>
            </button>
          </li>
          <li className={`top-panel-header-item${activeTab === "countdown" ? " active" : ""}`}>
            <button className="btn icon-text-btn top-panel-header-item-btn" onClick={() => setActiveTab("countdown")}>
              <Icon id="countdown"/>
              <span>Countdown</span>
            </button>
          </li>
          <li className="top-panel-close-btn">
            <button className="btn icon-btn" onClick={hideTopPanel} title="Close">
              <Icon id="cross"/>
            </button>
          </li>
        </ul>
        <Suspense fallback={<div className={`top-panel-item-placeholder ${activeTab}`}></div>}>
          {tabs.timer.rendered ? <Timer visible={activeTab === "timer"} expand={expand}/> : null}
          {tabs.stopwatch.rendered ? <Stopwatch visible={activeTab === "stopwatch"} expand={expand}/> : null}
          {tabs.pomodoro.rendered ? <Pomodoro visible={activeTab === "pomodoro"} expand={expand}/> : null}
        </Suspense>
        <Countdown visible={activeTab === "countdown"}/>
        {expanded && (
          <button className="btn icon-btn top-panel-collapse-btn" onClick={hideTopPanel} title="Close">
            <Icon id="cross"/>
          </button>
        )}
      </div>
    </div>
  );
}
