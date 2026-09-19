// ==UserScript==
// @name         修復 Discuz! 編輯器 getSelection 報錯
// @namespace    http://tampermonkey.net
// @version      1.2
// @description  修正舊版 Discuz! 論壇在現代瀏覽器（特別是 Mac Safari/Firefox/Chrome）發帖時，點擊工具列按鈕引發 editdoc.getSelection is not a function 與無限遞迴 (too much recursion) 的 Bug。
// @author       你的名字或暱稱
// @match        *://bbs.hifidiy.net/*
// @run-at       document-end
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // 提前捕捉瀏覽器 getSelection 函數
    const nativeWindowGetSelection = window.getSelection ? window.getSelection.bind(window) : null;
    const nativeDocGetSelection = document.getSelection ? document.getSelection.bind(document) : null;

    const fixTimer = setInterval(() => {
        if (typeof editdoc !== 'undefined' && editdoc !== null) {
            
            // fix: 使用原生函數封裝杜絕無限遞迴
            if (typeof editdoc.getSelection !== 'function') {
                editdoc.getSelection = function() {
                    if (nativeDocGetSelection) return nativeDocGetSelection();
                    if (nativeWindowGetSelection) return nativeWindowGetSelection();
                    return { getRangeAt: function() { return null; }, rangeCount: 0 };
                };
                console.log('[Discuz Fix] 成功修復 editdoc.getSelection 方法！');
            }
            
            // 修復另一個引發連帶崩潰的 oc_tx 未定義錯誤
            if (typeof window.oc_tx === 'undefined') {
                window.oc_tx = "";
            }

            clearInterval(fixTimer);
        }
    }, 200);

    setTimeout(() => clearInterval(fixTimer), 5000);
})();
