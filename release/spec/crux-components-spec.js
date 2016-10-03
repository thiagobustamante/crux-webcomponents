/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	__webpack_require__(2);
	module.exports = __webpack_require__(3);


/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	browser.url("http://localhost:8000/crux-storyboard.html");
	describe("<crux-storyboard>", function () {
	    it("should create a storyboard panel", function () {
	        browser.elements("crux-storyboard", function (result) {
	            expect(result).toBeDefined();
	            expect(result.value).toEqual(2);
	        });
	    });
	});
	describe("CruxStoryboard element", function () {
	    it("should be able to retrieve its items", function () {
	        var ret = browser['timeoutsAsyncScript'](5000).
	            executeAsync(function (done) {
	            var sb = document.getElementById('TESTE_STORYBOARD');
	            done({
	                size: sb.items().length,
	                item1HTML: sb.items().item(1).innerHTML
	            });
	        });
	        expect(ret.value.size).toEqual(5);
	        expect(ret.value.item1HTML).toEqual("Item Teste 2");
	    });
	});
	describe("CruxStoryboard Selection", function () {
	    beforeEach(function () {
	        browser.execute(function () {
	            var sb = document.getElementById('TESTE_STORYBOARD');
	            sb.clearSelections();
	            return true;
	        });
	    });
	    it("should support 'multiple' item selection", function (done) {
	        var ret = browser['timeoutsAsyncScript'](5000).
	            executeAsync(function (done) {
	            var sb = document.getElementById('TESTE_STORYBOARD');
	            sb.selectionMode = "multiple";
	            var countAfterSelectionModeChange = sb.selectedItems().length;
	            var chooseItemisSelected = false;
	            setTimeout(function () {
	                var handler = function (event) {
	                    chooseItemisSelected = event.selectedItem.selected;
	                    if (event.selectedItem.id === 'item1') {
	                        var item2 = document.getElementById("item2");
	                        item2.click();
	                    }
	                    else {
	                        var selected_1 = sb.selectedItems();
	                        sb.removeEventListener('selection', handler, false);
	                        setTimeout(function () {
	                            done({
	                                countAfterSelectionModeChange: countAfterSelectionModeChange,
	                                chooseItemisSelected: chooseItemisSelected,
	                                totalItemsSleceted: selected_1.length,
	                                item1Selected: (['item1', 'item2'].indexOf(selected_1.item(0).id) >= 0),
	                                item2Selected: (['item1', 'item2'].indexOf(selected_1.item(1).id) >= 0)
	                            });
	                        }, 1);
	                    }
	                };
	                sb.addEventListener('selection', handler, false);
	                var item = document.getElementById("item1");
	                item.click();
	            }, 1);
	        });
	        expect(ret.value.countAfterSelectionModeChange).toEqual(0);
	        expect(ret.value.chooseItemisSelected).toEqual(true);
	        expect(ret.value.totalItemsSleceted).toEqual(2);
	        expect(ret.value.item1Selected).toEqual(true);
	        expect(ret.value.item2Selected).toEqual(true);
	    });
	    it("should use 'multiple' as default item selection", function () {
	        var ret = browser.execute(function () {
	            var sb = document.getElementById('TESTE_STORYBOARD');
	            sb.selectionMode = "invalid value";
	            return sb.selectionMode;
	        });
	        expect(ret['value']).toEqual("multiple");
	    });
	    it("should support 'none' item selection", function (done) {
	        var ret = browser['timeoutsAsyncScript'](5000).
	            executeAsync(function (done) {
	            var sb = document.getElementById('TESTE_STORYBOARD');
	            sb.selectionMode = "none";
	            var countAfterSelectionModeChange = sb.selectedItems().length;
	            var selectionExecuted = false;
	            setTimeout(function () {
	                var handler = function (event) {
	                    selectionExecuted = true;
	                };
	                sb.addEventListener('selection', handler, false);
	                var item = document.getElementById("item1");
	                var clickHandler = function (event) {
	                    var selected = sb.selectedItems();
	                    sb.removeEventListener('selection', handler, false);
	                    item.removeEventListener('click', clickHandler, false);
	                    setTimeout(function () {
	                        done({
	                            countAfterSelectionModeChange: countAfterSelectionModeChange,
	                            totalItemsSleceted: selected.length,
	                            itemSelected: item.selected,
	                            selectionExecuted: selectionExecuted
	                        });
	                    }, 1);
	                };
	                item.addEventListener('click', clickHandler, false);
	                item.click();
	            }, 1);
	        });
	        expect(ret.value.countAfterSelectionModeChange).toEqual(0);
	        expect(ret.value.selectionExecuted).toEqual(false);
	        expect(ret.value.totalItemsSleceted).toEqual(0);
	        expect(ret.value.itemSelected).toEqual(false);
	    });
	    it("should support 'single' item selection", function (done) {
	        var ret = browser['timeoutsAsyncScript'](5000).
	            executeAsync(function (done) {
	            var sb = document.getElementById('TESTE_STORYBOARD');
	            sb.selectionMode = "single";
	            var countAfterSelectionModeChange = sb.selectedItems().length;
	            var chooseItemisSelected = false;
	            setTimeout(function () {
	                var handler = function (event) {
	                    chooseItemisSelected = event.selectedItem.selected;
	                    if (event.selectedItem.id === 'item1') {
	                        var item2 = document.getElementById("item2");
	                        item2.click();
	                    }
	                    else {
	                        var selected_2 = sb.selectedItems();
	                        sb.removeEventListener('selection', handler, false);
	                        setTimeout(function () {
	                            done({
	                                countAfterSelectionModeChange: countAfterSelectionModeChange,
	                                chooseItemisSelected: chooseItemisSelected,
	                                totalItemsSleceted: selected_2.length,
	                                item2Selected: 'item2' === selected_2.item(0).id,
	                            });
	                        }, 1);
	                    }
	                };
	                sb.addEventListener('selection', handler, false);
	                var item = document.getElementById("item1");
	                item.click();
	            }, 1);
	        });
	        expect(ret.value.countAfterSelectionModeChange).toEqual(0);
	        expect(ret.value.chooseItemisSelected).toEqual(true);
	        expect(ret.value.totalItemsSleceted).toEqual(1);
	        expect(ret.value.item2Selected).toEqual(true);
	    });
	});


/***/ },
/* 2 */
/***/ function(module, exports) {

	

/***/ },
/* 3 */
/***/ function(module, exports) {

	

/***/ }
/******/ ]);