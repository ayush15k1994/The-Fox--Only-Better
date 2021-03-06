/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// VERSION 1.0.0

this.initialShowInWindow = function(aWindow, style, animation, duration) {
	if(aWindow[objName] && aWindow[objName].slimChrome && aWindow[objName].slimStyle) {
		aWindow[objName].slimStyle.style = style;
		aWindow[objName].slimChrome.slimAnimation = animation;
		aWindow[objName].slimChrome.initialShow(duration);
	}
};

this.initialShowInOpener = function(style, animation, duration) {
	Timers.init('initialShowInOpener', function() {
		if(window.opener && window.opener instanceof window.opener.ChromeWindow) {
			initialShowInWindow(window.opener, style, animation, duration);
		} else {
			Windows.callOnMostRecent(function(aWindow) {
				initialShowInWindow(aWindow, style, animation, duration);
			}, 'navigator:browser');
		}
	}, 150);
};
