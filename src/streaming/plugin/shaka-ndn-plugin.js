import { FileMetadata } from "@ndn/fileserver";
import { FwHint, Name } from "@ndn/packet";
import { retrieveMetadata } from "@ndn/rdr";
import { fetch, RttEstimator, TcpCubic } from "@ndn/segmented-object";
import hirestime from "hirestime";
import PQueue from "p-queue";
import shaka from "shaka-player";

/** @type {Array<[Name, FwHint]>} */
const fwHints = [];

/**
 * Update forwarding hint mapping.
 * @param {Record<string, string> | undefined} m
 */
export function updateFwHints(m = {}) {
  fwHints.splice(0);
  for (const [prefix, fh] of Object.entries(m)) {
    fwHints.push([new Name(prefix), new FwHint(fh)]);
  }
  fwHints.sort((a, b) => b[0].length - a[0].length);
}

/**
 * Determine forwarding hint for Interest.
 * @param {Name} name
 * @returns {import("@ndn/packet").Interest.ModifyFields | undefined}
 */
function findFwHint(name) {
  for (const [prefix, fwHint] of fwHints) {
    if (prefix.isPrefixOf(name)) {
      return { fwHint };
    }
  }
  return undefined;
}

const getNow = hirestime();

class VideoFetcher {
  constructor() {
    this.queue = new PQueue({ concurrency: 4 });
    this.rtte = new RttEstimator({ maxRto: 10000 });
    this.ca = new TcpCubic({ c: 0.1 });
  }
}

class FileFetcher {
  /**
   * @param {VideoFetcher} vf
   * @param {string} uri
   * @param {unknown} requestType
   */
  constructor(vf, uri, requestType) {
    this.vf = vf;
    this.uri = uri;
    this.requestType = requestType;
    this.name = new Name(uri.replace(/^ndn:/, ""));
    this.abort = new AbortController();
  }

  async retrieve() {
    const modifyInterest = findFwHint(this.name);
    const { signal } = this.abort;

    const metadata = await retrieveMetadata(this.name, FileMetadata, {
      retx: 10,
      modifyInterest,
      signal,
    });

    const t0 = getNow();
    const payload = await fetch(metadata.name, {
      rtte: this.vf.rtte,
      ca: this.vf.ca,
      retxLimit: 4,
      estimatedFinalSegNum: metadata.lastSeg,
      modifyInterest,
      signal,
    });

    const timeMs = getNow() - t0;

    return {
      uri: this.uri,
      originalUri: this.uri,
      data: payload,
      headers: {},
      timeMs,
    };
  }

  /**
   * @param {Error} err
   */
  handleError(err) {
    if (this.abort.signal.aborted) {
      return shaka.util.AbortableOperation.aborted();
    }

    throw new shaka.util.Error(
      shaka.util.Error.Severity.RECOVERABLE,
      shaka.util.Error.Category.NETWORK,
      shaka.util.Error.Code.BAD_HTTP_STATUS,
      this.uri,
      503,
      null,
      {},
      this.requestType,
    );
  }
}

/** @type {VideoFetcher} */
let vf;

/** shaka.extern.SchemePlugin for ndn: scheme. */
export default function NdnPlugin(uri, request, requestType) {
  const ff = new FileFetcher(vf, uri, requestType);

  const t0 = getNow();
  return new shaka.util.AbortableOperation(
    vf.queue.add(async () => {
      try {
        return await ff.retrieve();
      } catch (err) {
        ff.handleError(err);
      }
    }),
    () => ff.abort.abort(),
  );
}

NdnPlugin.reset = () => {
  vf = new VideoFetcher();
};

/** @returns {Pick<VideoFetcher, "queue"|"rtte"|"ca">} */
NdnPlugin.getInternals = () => vf;

NdnPlugin.reset();
