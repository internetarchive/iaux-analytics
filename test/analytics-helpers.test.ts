import { expect } from '@open-wc/testing';
import Sinon from 'sinon';
import { AnalyticsHelpers } from '../src/analytics-helpers';
import { MockAnalyticsManager } from './mock-analytics-manager';

const sandbox = Sinon.createSandbox();

describe('AnalyticsHelper', () => {
  beforeEach(() => {
    sandbox.stub(window.navigator, 'sendBeacon');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('tracks the iax parameter', () => {
    const manager = new MockAnalyticsManager();
    const helper = new AnalyticsHelpers(manager);
    helper.trackIaxParameter('http://foo.org/?iax=foo|bar');
    expect(manager.sendEventNoSamplingOptions).to.deep.equal({
      category: 'foo',
      action: 'bar',
      label: undefined,
    });
  });
});
