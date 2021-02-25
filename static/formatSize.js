(function () {
	'use strict';

    var isCommonjs = typeof module !== 'undefined' && module.exports;
    
    function formatSize(fileSize) {
        if (fileSize < 1024) {
            return `${fileSize} B`;
        } else if (fileSize < (1024 * 1024)) {
            let temp = fileSize / 1024;
            temp = temp.toFixed(2);
            return `${temp} KB`;
        } else if (fileSize < (1024 * 1024 * 1024)) {
            let temp = fileSize / (1024 * 1024);
            temp = temp.toFixed(2);
            return `${temp} MB`; 
        } else {
            let temp = fileSize / (1024 * 1024 * 1024);
            temp = temp.toFixed(2);
            return `${temp} GB`; 
        };
    }

	if (isCommonjs) {
		module.exports = formatSize;
	} else {
		window.formatSize = formatSize;
	}
})();