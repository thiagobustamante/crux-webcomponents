'use strict';
// tslint:disable:no-unused-expression

import * as chai from 'chai';
import 'mocha';
// import * as swapPanel from '../../src/crux-swap-panel';

const expect = chai.expect;

describe('<crux-swap-panel>', () => {
    before(() => {
        browser.url('http://localhost:8000/test/html/crux-swap-panel.html');
    });
    it('should create a swap panel', () => {
        const result = browser.elements('crux-swap-panel');
        expect(result).to.exist;
        expect(result.value).to.have.length(1);
    });
});

// describe('CruxSwapPanel element', () => {
//     beforeAll(()=>{
//         browser.url('http://localhost:8000/test/crux-swap-panel.html');
//     });

//     it('should be able to retrieve its content', () => {
// 		 let ret = browser['timeoutsAsyncScript'](5000).
// 		 executeAsync((done)=>{
// 			 const sb = <swapPanel.CruxSwapPanel>document.getElementById('swapPanel')
// 			 done({
// 				 content: sb.currentElement.innerHTML
// 			 })
// 		 });
// 		expect(ret.value.content).toEqual('Inicial Element');
//     });
// });
