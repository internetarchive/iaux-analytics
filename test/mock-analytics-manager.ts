import type {
  AnalyticsEvent,
  AnalyticsManagerInterface,
} from '../src/analytics-manager';

export class MockAnalyticsManager implements AnalyticsManagerInterface {
  sendPingValues?: Record<string, any>;

  sendEventOptions?: AnalyticsEvent;

  sendEventNoSamplingOptions?: AnalyticsEvent;

  sendPing(values: Record<string, any>): void {
    this.sendPingValues = values;
  }

  sendEvent(options: AnalyticsEvent): void {
    this.sendEventOptions = options;
  }

  sendEventNoSampling(options: AnalyticsEvent): void {
    this.sendEventNoSamplingOptions = options;
  }
}
