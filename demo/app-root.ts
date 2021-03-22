import { html, css, LitElement, customElement, query } from 'lit-element';
import { AnalyticsHelpers } from '../src/analytics-helpers';
import { AnalyticsManager } from '../src/analytics-manager';

@customElement('app-root')
export class AppRoot extends LitElement {
  @query('#input-category') categoryInput!: HTMLInputElement;

  @query('#input-action') actionInput!: HTMLInputElement;

  @query('#input-label') labelInput!: HTMLInputElement;

  @query('#input-form') inputForm!: HTMLFormElement;

  private analyticsManager = new AnalyticsManager();

  private analyticsHelper = new AnalyticsHelpers(this.analyticsManager);

  private sendEvent() {
    const valid = this.inputForm.reportValidity();
    if (!valid) return;
    this.analyticsManager.sendEvent({
      category: this.categoryInput.value,
      action: this.actionInput.value,
      label: this.labelInput.value,
    });
  }

  private sendEventNoSampling() {
    const valid = this.inputForm.reportValidity();
    if (!valid) return;
    this.analyticsManager.sendEventNoSampling({
      category: this.categoryInput.value,
      action: this.actionInput.value,
      label: this.labelInput.value,
    });
  }

  firstUpdated(): void {
    this.analyticsHelper.trackIaxParameter(window.location);
  }

  render() {
    return html`
      <h1>Archive Analytics</h1>

      <p>
        Open the network inspector and click the buttons below to test the
        analytics.
      </p>

      <form id="input-form">
        <fieldset>
          <legend>Configure Event</legend>
          <dl>
            <dt>Category*</dt>
            <dd>
              <input
                type="text"
                id="input-category"
                placeholder="DonatePage"
                required
              />
            </dd>
            <dt>Action*</dt>
            <dd>
              <input
                type="text"
                id="input-action"
                placeholder="LinkClicked"
                required
              />
            </dd>
            <dt>Label</dt>
            <dd>
              <input type="text" id="input-label" placeholder="MoreInfoLink" />
            </dd>
          </dl>
          * Required
        </fieldset>
      </form>

      <button @click=${this.sendEvent}>Send Event</button>
      <button @click=${this.sendEventNoSampling}>Send Event No Sampling</button>
    `;
  }

  static styles = css`
    :host {
      display: block;
      font-size: 1.4rem;
    }

    dd {
      margin-left: 0;
      margin-bottom: 1rem;
    }
  `;
}
