import { useEffect, useState } from "react";
import ShakaPlayerComponent from "@/src/streaming/core/player-instance";
import TerminalConfigCard from "@/src/streaming/ui/TerminalConfigCard";
import MetricsWidget from "@/src/streaming/ui/MetricsWidget";
import NetworkStateTerminal from "@/src/streaming/ui/NetworkStateTerminal";
import QoEMonitorTerminal from "@/src/streaming/ui/QoEMonitorTerminal";
import connect from "@/lib/ndn/ConnectionNDN";
import ConnectionConfigPanel from "./streaming/ui/ConnectionConfigPanel";
import PlayerWrapper from "./streaming/core/PlayerWrapper";
import RealtimeLatencyLog from "./streaming/ui/RealtimeLatencyLog";
const App = () => {
  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "dark",
  );

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div className="min-h-screen bg-blue-400 dark:bg-slate-900 py-5">
      <ConnectionConfigPanel />
      <PlayerWrapper />
      <MetricsWidget />
      <RealtimeLatencyLog />
      <NetworkStateTerminal />
      <QoEMonitorTerminal />
    </div>
  );
};

export default App;
