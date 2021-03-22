import type { AnalyticsManagerInterface } from './analytics-manager';

export class AnalyticsHelpers {
  private analyticsManager: AnalyticsManagerInterface;

  constructor(analyticsManager: AnalyticsManagerInterface) {
    this.analyticsManager = analyticsManager;
  }

  /**
   * Handles tracking events passed in URL.
   * Assumes category and action values are separated by a "|" character.
   * NOTE: Uses the unsampled analytics property. Watch out for future high click links!
   * @param {Location}
   */
  trackIaxParameter(location: Location) {
    const searchParams = new URLSearchParams(location.search);
    const iaxParam = searchParams.get('iax');
    if (!iaxParam) return;
    const eventValues = iaxParam.split('|');
    const actionValue = eventValues.length >= 1 ? eventValues[1] : '';
    this.analyticsManager.sendEventNoSampling({
      category: eventValues[0],
      action: actionValue,
    });
  }
}
