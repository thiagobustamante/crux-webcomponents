'use strict';
// tslint:disable:no-unused-expression

import * as chai from 'chai';
import 'mocha';
import * as storyboard from '../../src/crux-storyboard';
const expect = chai.expect;

describe('<crux-storyboard>', () => {
    before(() => {
        browser.url('http://localhost:8000/test/html/crux-storyboard.html');
    });

    it('should create a storyboard panel', () => {
        const result = browser.elements('crux-storyboard');
        expect(result).to.exist;
        expect(result.value).to.have.length(2);
    });
});

describe('CruxStoryboard element', () => {
    before(() => {
        browser.url('http://localhost:8000/test/html/crux-storyboard.html');
    });
    it('should be able to retrieve its items', () => {
         const ret = browser.timeouts('script',5000).
         executeAsync((done) => {
             const sb = <storyboard.CruxStoryboard>document.getElementById('TESTE_STORYBOARD');
             done({
                 item1HTML: sb.items().item(1).innerHTML,
                 size: sb.items().length
             });
         });
        expect(ret.value.size).to.eq(5);
        expect(ret.value.item1HTML).to.eq('Item Teste 2');
    });
});

describe('CruxStoryboard Selection', () => {
    before(() => {
        browser.url('http://localhost:8000/test/html/crux-storyboard.html');
    });
    beforeEach(() => {
        browser.execute(() => {
            const sb = <storyboard.CruxStoryboard>document.getElementById('TESTE_STORYBOARD');
            sb.clearSelections();
            return true;
        });
    });

    it('should support \'multiple\' item selection', (done) => {
         const ret = browser.timeouts('script',5000).
         executeAsync((jsDone) => {
            const sb = <storyboard.CruxStoryboard>document.getElementById('TESTE_STORYBOARD');
            sb.selectionMode = 'multiple';
            const countAfterSelectionModeChange = sb.selectedItems().length;
            let chooseItemisSelected = false;

            setTimeout(() => {
                const handler = (event: any) => {
                    chooseItemisSelected = event.selectedItem.selected;
                    if (event.selectedItem.id === 'item1') {
                        const item2: storyboard.CruxStoryboardItem = <storyboard.CruxStoryboardItem>document.getElementById('item2');
                        item2.click();
                    } else {
                        const selected = sb.selectedItems();
                        sb.removeEventListener('selection', handler, false);
                        setTimeout(() => {
                            jsDone({
                                chooseItemisSelected: chooseItemisSelected,
                                countAfterSelectionModeChange: countAfterSelectionModeChange,
                                item1Selected : (['item1','item2'].indexOf(selected.item(0).id) >= 0),
                                item2Selected : (['item1','item2'].indexOf(selected.item(1).id) >= 0),
                                totalItemsSleceted: selected.length
                            });
                        },1);
                    }
                };
                sb.addEventListener('selection', handler, false);
                const item: storyboard.CruxStoryboardItem = <storyboard.CruxStoryboardItem>document.getElementById('item1');
                item.click();
            }, 1);
         });
        expect(ret.value.countAfterSelectionModeChange).to.eq(0);
        expect(ret.value.chooseItemisSelected).to.eq(true);
        expect(ret.value.totalItemsSleceted).to.eq(2);
        expect(ret.value.item1Selected).to.eq(true);
        expect(ret.value.item2Selected).to.eq(true);
    });

    it('should use \'multiple\' as default item selection', () => {
        const ret = browser.execute(() => {
            const sb = <storyboard.CruxStoryboard>document.getElementById('TESTE_STORYBOARD');
            sb.selectionMode = 'invalid value';
            return sb.selectionMode;
        });
        expect(ret['value']).to.eq('multiple');
    });

    it('should support \'none\' item selection', (done) => {
         const ret = browser.timeouts('script',5000).
         executeAsync((jsDone) => {
            const sb = <storyboard.CruxStoryboard>document.getElementById('TESTE_STORYBOARD');
            sb.selectionMode = 'none';
            const countAfterSelectionModeChange = sb.selectedItems().length;
            let selectionExecuted = false;

            setTimeout(() => {
                const handler = (event: any) => {
                    selectionExecuted = true;
                };
                sb.addEventListener('selection', handler, false);
                const item: storyboard.CruxStoryboardItem = <storyboard.CruxStoryboardItem>document.getElementById('item1');

                const clickHandler = (event: any) => {
                    const selected = sb.selectedItems();
                    sb.removeEventListener('selection', handler, false);
                    item.removeEventListener('click', clickHandler, false);
                    setTimeout(() => {
                        jsDone({
                            countAfterSelectionModeChange: countAfterSelectionModeChange,
                            itemSelected: item.selected,
                            selectionExecuted: selectionExecuted,
                            totalItemsSleceted: selected.length
                        });
                    },1);
                };

                item.addEventListener('click', clickHandler, false);
                item.click();
            }, 1);
         });
        expect(ret.value.countAfterSelectionModeChange).to.eq(0);
        expect(ret.value.selectionExecuted).to.eq(false);
        expect(ret.value.totalItemsSleceted).to.eq(0);
        expect(ret.value.itemSelected).to.eq(false);
    });

    it('should support \'single\' item selection', (done) => {
         const ret = browser.timeouts('script',5000).
         executeAsync((jsDone) => {
            const sb = <storyboard.CruxStoryboard>document.getElementById('TESTE_STORYBOARD');
            sb.selectionMode = 'single';
            const countAfterSelectionModeChange = sb.selectedItems().length;
            let chooseItemisSelected = false;

            setTimeout(() => {
                const handler = (event: any) => {
                    chooseItemisSelected = event.selectedItem.selected;
                    if (event.selectedItem.id === 'item1') {
                        const item2: storyboard.CruxStoryboardItem = <storyboard.CruxStoryboardItem>document.getElementById('item2');
                        item2.click();
                    } else {
                        const selected = sb.selectedItems();
                        sb.removeEventListener('selection', handler, false);
                        setTimeout(() => {
                            jsDone({
                                chooseItemisSelected: chooseItemisSelected,
                                countAfterSelectionModeChange: countAfterSelectionModeChange,
                                item2Selected : 'item2' === selected.item(0).id,
                                totalItemsSleceted: selected.length
                            });
                        },1);
                    }
                };
                sb.addEventListener('selection', handler, false);
                const item: storyboard.CruxStoryboardItem = <storyboard.CruxStoryboardItem>document.getElementById('item1');
                item.click();
            }, 1);
         });
        expect(ret.value.countAfterSelectionModeChange).to.eq(0);
        expect(ret.value.chooseItemisSelected).to.eq(true);
        expect(ret.value.totalItemsSleceted).to.eq(1);
        expect(ret.value.item2Selected).to.eq(true);
    });
});
