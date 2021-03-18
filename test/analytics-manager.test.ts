// import { expect } from '@open-wc/testing';

// let lastImage;

// /**
//  * Used to capture the most recent image src used for a ping.
//  *
//  * Adds extra methods for verifying the values passed to it.
//  */
// class MockImage {
//   src?: string;

//   constructor() {
//     lastImage = this;
//   }

//   /**
//    * @param {String} name
//    * @return {Boolean}
//    */
//   hasParam(name: string): boolean {
//     const src = new URL(`https:${this.src}`);
//     return src.searchParams.has(name);
//   }

//   /**
//    * @param {String} name
//    * @return {String}
//    */
//   getParam(name: string): string | null {
//     const src = new URL(`https:${this.src}`);
//     return src.searchParams.get(name);
//   }
// }

// (window as any).Image = MockImage;

// describe('archive_analytics', () => {
//   beforeEach(() => {
//     // Don't forget to reset the state of these globals!
//     // They're carried over from test to test.
//     lastImage = undefined;
//     archive_analytics.service = undefined;
//     archive_analytics.values = {};
//   });

//   test('is defined', () => {
//     expect(archive_analytics).toBeInstanceOf(Object);
//   });

//   describe('send_ping', () => {
//     test('is defined', () => {
//       expect(archive_analytics.send_ping).toBeInstanceOf(Function);
//     });

//     test('sends default params', () => {
//       archive_analytics.send_ping();

//       expect(lastImage).toBeDefined();
//       expect(lastImage.hasParam('version')).toBeTruthy();
//       expect(lastImage.hasParam('count')).toBeTruthy();
//     });

//     describe('with custom params', () => {
//       test('sends custom params', () => {
//         archive_analytics.send_ping({
//           foo: 'bar',
//         });

//         expect(lastImage).toBeDefined();
//         expect(lastImage.getParam('foo')).toBe('bar');
//         expect(lastImage.hasParam('version')).toBeTruthy();
//         expect(lastImage.hasParam('count')).toBeTruthy();
//       });
//     });

//     describe('with service property set', () => {
//       test('sends service param', () => {
//         archive_analytics.service = 'wb';
//         archive_analytics.send_ping();

//         expect(lastImage).toBeDefined();
//         expect(lastImage.getParam('service')).toBe('wb');
//         expect(lastImage.hasParam('version')).toBeTruthy();
//         expect(lastImage.hasParam('count')).toBeTruthy();
//       });
//     });
//   });

//   describe('send_scroll_fetch_event', () => {
//     test('is defined', () => {
//       expect(archive_analytics.send_scroll_fetch_event).toBeInstanceOf(Function);
//     });
//   });

//   describe('send_scroll_fetch_base_event', () => {
//     test('is defined', () => {
//       expect(archive_analytics.send_scroll_fetch_base_event).toBeInstanceOf(Function);
//     });
//   });

//   describe('send_event_no_sampling', () => {
//     test('is defined', () => {
//       expect(archive_analytics.send_event_no_sampling).toBeInstanceOf(Function);
//     });

//     test('sets the service to ao_no_sampling', () => {
//       archive_analytics.send_event_no_sampling('foo', 'bar', 'baz', { service: 'foo' });

//       expect(lastImage).toBeDefined();
//       expect(lastImage.getParam('service')).toBe('ao_no_sampling');
//     });
//   });

//   describe('send_pageview', () => {
//     test('is defined', () => {
//       expect(archive_analytics.send_pageview).toBeInstanceOf(Function);
//     });

//     describe('without options', () => {
//       test('sends correct params', () => {
//         archive_analytics.send_pageview();

//         expect(lastImage).toBeDefined();
//         expect(lastImage.getParam('kind')).toBe('pageview');
//         expect(lastImage.hasParam('service')).toBeTruthy();
//         expect(lastImage.hasParam('ga_cd1')).toBeTruthy();
//         expect(lastImage.hasParam('ga_cd2')).toBeTruthy();
//         expect(lastImage.hasParam('version')).toBeTruthy();
//         expect(lastImage.hasParam('count')).toBeTruthy();
//       });
//     });

//     describe('with options', () => {
//       test('sends mediaType param', () => {
//         archive_analytics.send_pageview({
//           mediaType: 'texts',
//         });

//         expect(lastImage).toBeDefined();
//         expect(lastImage.getParam('kind')).toBe('pageview');
//         expect(lastImage.hasParam('service')).toBeTruthy();
//         expect(lastImage.hasParam('ga_cd1')).toBeTruthy();
//         expect(lastImage.hasParam('ga_cd2')).toBeTruthy();
//         expect(lastImage.getParam('ga_cd3')).toBe('texts');
//         expect(lastImage.hasParam('version')).toBeTruthy();
//         expect(lastImage.hasParam('count')).toBeTruthy();
//       });
//       test('sends primaryCollection param', () => {
//         archive_analytics.send_pageview({
//           primaryCollection: 'primary collection',
//         });

//         expect(lastImage).toBeDefined();
//         expect(lastImage.getParam('kind')).toBe('pageview');
//         expect(lastImage.hasParam('service')).toBeTruthy();
//         expect(lastImage.hasParam('ga_cd1')).toBeTruthy();
//         expect(lastImage.hasParam('ga_cd2')).toBeTruthy();
//         expect(lastImage.getParam('ga_cd5')).toBe('primary collection');
//         expect(lastImage.hasParam('version')).toBeTruthy();
//         expect(lastImage.hasParam('count')).toBeTruthy();
//       });
//     });

//     describe('with service property set', () => {
//       test('sends service param', () => {
//         archive_analytics.service = 'ol';
//         archive_analytics.send_pageview();

//         expect(lastImage).toBeDefined();
//         expect(lastImage.getParam('kind')).toBe('pageview');
//         expect(lastImage.getParam('service')).toBe('ol');
//         expect(lastImage.hasParam('ga_cd1')).toBeDefined();
//         expect(lastImage.hasParam('ga_cd2')).toBeDefined();
//         expect(!lastImage.hasParam('ga_cd3')).toBeDefined();
//         expect(lastImage.hasParam('version')).toBeDefined();
//         expect(lastImage.hasParam('count')).toBeDefined();
//       });
//     });
//   });

//   describe('send_pageview_on_load', () => {
//     test('is defined', () => {
//       expect(archive_analytics.send_pageview_on_load).toBeInstanceOf(Function);
//     });
//   });

//   describe('get_data_packets', () => {
//     test('is defined', () => {
//       expect(archive_analytics.get_data_packets).toBeInstanceOf(Function);
//     });
//   });
// });
