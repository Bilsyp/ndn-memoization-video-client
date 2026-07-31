import NdnPlugin from "../plugin/shaka-ndn-plugin";
export function initCustomNetworkEngine(shaka) {
  if (shaka.net.HttpFetchPlugin.isSupported()) {
    shaka.net.NetworkingEngine.registerScheme(
      "http",
      shaka.net.HttpFetchPlugin.parse,
      shaka.net.NetworkingEngine.PluginPriority.PREFERRED,
      /* progressSupport= */ true,
    );
    shaka.net.NetworkingEngine.registerScheme(
      "https",
      shaka.net.HttpFetchPlugin.parse,
      shaka.net.NetworkingEngine.PluginPriority.PREFERRED,
      /* progressSupport= */ true,
    );
  }
  shaka.net.NetworkingEngine.registerScheme("ndn", NdnPlugin);
}
