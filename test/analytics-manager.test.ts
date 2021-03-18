import { expect } from '@open-wc/testing';
import Sinon, { SinonSpy } from 'sinon';
import { ArchiveAnalytics } from '../src/analytics-manager';

// let lastImage;

/**
 * Used to capture the most recent image src used for a ping.
 *
 * Adds extra methods for verifying the values passed to it.
 */
class MockImage {
  src?: string;

  // constructor() {
  // lastImage = this;
  // }

  /**
   * @param {String} name
   * @return {Boolean}
   */
  hasParam(name: string): boolean {
    const src = new URL(`https:${this.src}`);
    return src.searchParams.has(name);
  }

  /**
   * @param {String} name
   * @return {String}
   */
  getParam(name: string): string | null {
    const src = new URL(`https:${this.src}`);
    return src.searchParams.get(name);
  }
}

(window as any).Image = MockImage;

const sandbox = Sinon.createSandbox();
let sendBeaconSpy: SinonSpy;

describe('ArchiveAnalytics', () => {
  beforeEach(() => {
    sandbox.stub(window.navigator, 'sendBeacon');
    sendBeaconSpy = window.navigator.sendBeacon as SinonSpy;
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('defaults to the ao_2 service', () => {
    const archiveAnalytics = new ArchiveAnalytics();
    archiveAnalytics.sendPing();
    expect(sendBeaconSpy.calledOnce);
    const callArgs = sendBeaconSpy.getCall(0).args[0];
    expect(callArgs).to.contain('service=ao_2');
  });

  it('can customize the service', () => {
    const archiveAnalytics = new ArchiveAnalytics({ service: 'foo_service' });
    archiveAnalytics.sendPing();
    expect(sendBeaconSpy.calledOnce);
    const callArgs = sendBeaconSpy.getCall(0).args[0];
    expect(callArgs).to.contain('service=foo_service');
  });

  describe('sendPing', () => {
    it('can send a ping via sendBeacon', () => {
      const archiveAnalytics = new ArchiveAnalytics();
      archiveAnalytics.sendPing();
      expect(sendBeaconSpy.calledOnce);
    });

    it('can send arbitrary parameters', () => {
      const archiveAnalytics = new ArchiveAnalytics();
      archiveAnalytics.sendPing({
        foo: 'bar',
        snip: 'snap',
      });
      const callArgs = sendBeaconSpy.getCall(0).args[0];
      expect(callArgs).to.contain('foo=bar');
      expect(callArgs).to.contain('snip=snap');
      expect(callArgs).to.contain('count=5');
      expect(callArgs).to.contain('version=2');
    });
  });

  describe('sendEvent', () => {
    it('sends an event properly', () => {
      const archiveAnalytics = new ArchiveAnalytics();
      archiveAnalytics.sendEvent({
        category: 'foo',
        action: 'bar',
        label: 'baz',
      });
      const callArgs = sendBeaconSpy.getCall(0).args[0];
      expect(callArgs).to.contain('ec=foo');
      expect(callArgs).to.contain('ea=bar');
      expect(callArgs).to.contain('el=baz');
    });

    it('uses window.location.pathname if no label provided', () => {
      const archiveAnalytics = new ArchiveAnalytics();
      archiveAnalytics.sendEvent({
        category: 'foo',
        action: 'bar',
      });
      const callArgs = sendBeaconSpy.getCall(0).args[0];
      expect(callArgs).to.contain('ec=foo');
      expect(callArgs).to.contain('ea=bar');
      expect(callArgs).to.contain('el=%2F'); // forward slash (root pathname) `/`
    });
  });

  describe('sendEventNoSampling', () => {
    it('sets the service to ao_no_sampling', () => {
      const archiveAnalytics = new ArchiveAnalytics();
      archiveAnalytics.sendEventNoSampling({
        category: 'foo',
        action: 'bar',
        label: 'baz',
      });
      const callArgs = sendBeaconSpy.getCall(0).args[0];
      expect(callArgs).to.contain('service=ao_no_sampling');
      expect(callArgs).to.contain('ec=foo');
      expect(callArgs).to.contain('ea=bar');
      expect(callArgs).to.contain('el=baz');
    });
  });

  // describe('send_pageview', () => {
  //   test('is defined', () => {
  //     expect(archive_analytics.send_pageview).toBeInstanceOf(Function);
  //   });

  //   describe('without options', () => {
  //     test('sends correct params', () => {
  //       archive_analytics.send_pageview();

  //       expect(lastImage).toBeDefined();
  //       expect(lastImage.getParam('kind')).toBe('pageview');
  //       expect(lastImage.hasParam('service')).toBeTruthy();
  //       expect(lastImage.hasParam('ga_cd1')).toBeTruthy();
  //       expect(lastImage.hasParam('ga_cd2')).toBeTruthy();
  //       expect(lastImage.hasParam('version')).toBeTruthy();
  //       expect(lastImage.hasParam('count')).toBeTruthy();
  //     });
  //   });

  //   describe('with options', () => {
  //     test('sends mediaType param', () => {
  //       archive_analytics.send_pageview({
  //         mediaType: 'texts',
  //       });

  //       expect(lastImage).toBeDefined();
  //       expect(lastImage.getParam('kind')).toBe('pageview');
  //       expect(lastImage.hasParam('service')).toBeTruthy();
  //       expect(lastImage.hasParam('ga_cd1')).toBeTruthy();
  //       expect(lastImage.hasParam('ga_cd2')).toBeTruthy();
  //       expect(lastImage.getParam('ga_cd3')).toBe('texts');
  //       expect(lastImage.hasParam('version')).toBeTruthy();
  //       expect(lastImage.hasParam('count')).toBeTruthy();
  //     });
  //     test('sends primaryCollection param', () => {
  //       archive_analytics.send_pageview({
  //         primaryCollection: 'primary collection',
  //       });

  //       expect(lastImage).toBeDefined();
  //       expect(lastImage.getParam('kind')).toBe('pageview');
  //       expect(lastImage.hasParam('service')).toBeTruthy();
  //       expect(lastImage.hasParam('ga_cd1')).toBeTruthy();
  //       expect(lastImage.hasParam('ga_cd2')).toBeTruthy();
  //       expect(lastImage.getParam('ga_cd5')).toBe('primary collection');
  //       expect(lastImage.hasParam('version')).toBeTruthy();
  //       expect(lastImage.hasParam('count')).toBeTruthy();
  //     });
  //   });

  //   describe('with service property set', () => {
  //     test('sends service param', () => {
  //       archive_analytics.service = 'ol';
  //       archive_analytics.send_pageview();

  //       expect(lastImage).toBeDefined();
  //       expect(lastImage.getParam('kind')).toBe('pageview');
  //       expect(lastImage.getParam('service')).toBe('ol');
  //       expect(lastImage.hasParam('ga_cd1')).toBeDefined();
  //       expect(lastImage.hasParam('ga_cd2')).toBeDefined();
  //       expect(!lastImage.hasParam('ga_cd3')).toBeDefined();
  //       expect(lastImage.hasParam('version')).toBeDefined();
  //       expect(lastImage.hasParam('count')).toBeDefined();
  //     });
  //   });
  // });
});
