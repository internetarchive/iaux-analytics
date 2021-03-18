export type AnalyticsEventConfig = {
  service?: string;
};

export type AnalyticsEvent = {
  /**
   * The event category, ie. "DonatePage"
   *
   * @type {string}
   */
  category: string;

  /**
   * The event action, ie. "LinkClicked"
   *
   * @type {string}
   */
  action: string;

  /**
   * The event label, used to add specificity to the action, ie "MoreInfoLink"
   *
   * Defaults to window.locatiioni.pathname if not provided
   *
   * @type {string}
   */
  label?: string;

  /**
   * Configuration for the event, such as `service`
   *
   * This does not get passed to Google Analytics.
   *
   * @type {AnalyticsEventConfig}
   */
  eventConfiguration?: AnalyticsEventConfig;
};

export interface ArchiveAnalyticsInterface {
  /**
   * A general purpose analytics ping that takes arbitrary key-value pairs
   * and pings the analytics endpoint
   *
   * @param {Record<string, any>} values
   */
  sendPing(values: Record<string, any>): void;

  /**
   * Send a sampled event
   *
   * @param {options} AnalyticsEvent
   */
  sendEvent(options: AnalyticsEvent): void;

  /**
   * Send an unsampled event.
   *
   * **NOTE** Use sparingly as it can generate a lot of events
   * and deplete our event budget.
   *
   * @param {options} AnalyticsEvent
   */
  sendEventNoSampling(options: AnalyticsEvent): void;
}

export class ArchiveAnalytics implements ArchiveAnalyticsInterface {
  private readonly ARCHIVE_ANALYTICS_VERSION = 2;

  private readonly DEFAULT_SERVICE = 'ao_2';

  /**
   * The service for sending events without sampling
   *
   * @private
   * @memberof ArchiveAnalytics
   */
  private readonly NO_SAMPLING_SERVICE = 'ao_no_sampling';

  private readonly DEFAULT_IMAGE_URL = 'https://analytics.archive.org/0.gif';

  private service: string;

  private imageUrl: string;

  private imageContainer: Node;

  /**
   * Force an image ping inistead of using the sendBeacon API
   *
   * Useful to test older browser support.
   *
   * @private
   * @type {boolean}
   * @memberof ArchiveAnalytics
   */
  private requireImagePing: boolean;

  constructor(options?: {
    service?: string;
    imageUrl?: string;
    imageContainer?: Node;
    requireImagePing?: boolean;
  }) {
    this.service = options?.service ?? this.DEFAULT_SERVICE;
    this.imageUrl = options?.imageUrl ?? this.DEFAULT_IMAGE_URL;
    this.imageContainer = options?.imageContainer ?? document.body;
    this.requireImagePing = options?.requireImagePing ?? false;
  }

  /** @inheritdoc */
  sendPing(values?: Record<string, any>) {
    if (
      !this.requireImagePing &&
      typeof window.navigator !== 'undefined' &&
      typeof window.navigator.sendBeacon !== 'undefined'
    ) {
      this.sendPingViaBeacon(values);
    } else {
      this.sendPingViaImage(values);
    }
  }

  /** @inheritdoc */
  sendEvent(options: AnalyticsEvent) {
    const label =
      options.label && options.label.trim().length > 0
        ? options.label
        : window.location.pathname;
    const eventParams = {
      kind: 'event',
      ec: options.category,
      ea: options.action,
      el: label,
      cache_bust: Math.random(),
      ...options.eventConfiguration,
    };
    this.sendPing(eventParams);
  }

  /** @inheritdoc */
  sendEventNoSampling(options: AnalyticsEvent): void {
    const eventConfig = options.eventConfiguration || {};
    eventConfig.service = this.NO_SAMPLING_SERVICE;
    const newOptions = options;
    newOptions.eventConfiguration = eventConfig;
    this.sendEvent(newOptions);
  }

  /**
   * Sends a ping via Beacon API
   * NOTE: Assumes window.navigator.sendBeacon exists
   * @param {Record<string, any>} values Tracking parameters to pass
   */
  private sendPingViaBeacon(values?: Record<string, any>): void {
    const url = this.generateTrackingUrl(values);
    window.navigator.sendBeacon(url.toString());
  }

  /**
   * Sends a ping via Image object
   * @param {Record<string, any>} values Tracking parameters to pass
   */
  private sendPingViaImage(values?: Record<string, any>) {
    const url = this.generateTrackingUrl(values);
    const pingImage = new Image(1, 1);
    pingImage.src = url.toString();
    pingImage.alt = '';
    this.imageContainer.appendChild(pingImage);
  }

  /**
   * Construct complete tracking URL containing payload
   * @param {Object} params Tracking parameters to pass
   * @return {String} URL to use for tracking call
   */
  private generateTrackingUrl(params?: Record<string, any>): URL {
    const outputParams = params ?? {};
    outputParams.service = outputParams.service ?? this.service;
    const url = new URL(this.imageUrl);

    // Build array of querystring parameters
    const keys = Object.keys(outputParams);
    keys.forEach((key: string) => {
      const value = outputParams[key];
      url.searchParams.append(key, value);
    });
    url.searchParams.append('version', `${this.ARCHIVE_ANALYTICS_VERSION}`);
    url.searchParams.append('count', `${keys.length + 2}`);
    return url;
  }

  /**
   * Handles tracking events passed in URL.
   * Assumes category and action values are separated by a "|" character.
   * NOTE: Uses the unsampled analytics property. Watch out for future high click links!
   * @param {Location}
   */
  processIaxParameter(location: Location) {
    const searchParams = new URLSearchParams(location.toString());
    const iaxParam = searchParams.get('iax');
    if (!iaxParam) return;
    const eventValues = iaxParam.split('|');
    const actionValue = eventValues.length >= 1 ? eventValues[1] : '';
    this.sendEventNoSampling({
      category: eventValues[0],
      action: actionValue,
    });
  }
}
