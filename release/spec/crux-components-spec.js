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
	browser.url("http://127.0.0.1/dev/crux-storyboard.html");
	var sb = document.getElementsByTagName("crux-storyboard")[0];
	describe("<crux-storyboard>", function () {
	    it("should create a storyboard panel", function () {
	        var items = document.getElementsByTagName("crux-storyboard");
	        expect(items).toBeDefined();
	        expect(items.length).toEqual(2);
	    });
	});
	describe("CruxStoryboard element", function () {
	    it("should be able to retrieve its items", function () {
	        expect(sb.items().length).toEqual(5);
	        expect(sb.items().item(1).innerHTML).toEqual("Item Teste 2");
	    });
	});
	describe("CruxStoryboard Selection", function () {
	    beforeEach(function () {
	        sb.clearSelections();
	    });
	    it("should support 'multiple' item selection", function (done) {
	        sb.selectionMode = "multiple";
	        setTimeout(function () {
	            expect(sb.selectedItems().length).toEqual(0);
	            var handler = function (event) {
	                var firedBy = event.selectedItem.id;
	                expect(event.selectedItem.selected).toEqual(true);
	                if (event.selectedItem.id === 'item1') {
	                    var item2 = document.getElementById("item2");
	                    item2.click();
	                }
	                else {
	                    var selected = sb.selectedItems();
	                    expect(selected.length).toEqual(2);
	                    expect(['item1', 'item2']).toContain(selected.item(0).id);
	                    expect(['item1', 'item2']).toContain(selected.item(1).id);
	                    sb.removeEventListener('selection', handler, false);
	                    setTimeout(function () {
	                        done();
	                    }, 1);
	                }
	            };
	            sb.addEventListener('selection', handler, false);
	            var item = document.getElementById("item1");
	            item.click();
	        }, 1);
	    });
	    it("should use 'multiple' as default item selection", function () {
	        sb.selectionMode = "invalid value";
	        expect(sb.selectionMode).toEqual("multiple");
	    });
	    it("should support 'none' item selection", function (done) {
	        sb.selectionMode = "none";
	        expect(sb.selectedItems().length).toEqual(0);
	        var handler = function (event) {
	            fail("This element should not dispatch selection events with selectionMode = 'none'");
	        };
	        sb.addEventListener('selection', handler, false);
	        var item = document.getElementById("item1");
	        var clickHandler = function (event) {
	            var selected = sb.selectedItems();
	            expect(selected.length).toEqual(0);
	            expect(item.selected).toEqual(false);
	            sb.removeEventListener('selection', handler, false);
	            item.removeEventListener('click', clickHandler, false);
	            setTimeout(function () {
	                done();
	            }, 1);
	        };
	        item.addEventListener('click', clickHandler, false);
	        item.click();
	    });
	    it("should support 'single' item selection", function (done) {
	        sb.selectionMode = "single";
	        expect(sb.selectedItems().length).toEqual(0);
	        var handler = function (event) {
	            expect(event.selectedItem.selected).toEqual(true);
	            if (event.selectedItem.id === 'item1') {
	                var item2 = document.getElementById("item2");
	                item2.click();
	            }
	            else {
	                var selected = sb.selectedItems();
	                expect(selected.length).toEqual(1);
	                expect('item2').toEqual(selected.item(0).id);
	                sb.removeEventListener('selection', handler, false);
	                setTimeout(function () {
	                    done();
	                }, 1);
	            }
	        };
	        sb.addEventListener('selection', handler, false);
	        var item = document.getElementById("item1");
	        item.click();
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