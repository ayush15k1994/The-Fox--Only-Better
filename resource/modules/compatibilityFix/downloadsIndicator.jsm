moduleAid.VERSION = '1.0.4';

this.__defineGetter__('DownloadsIndicatorView', function() { return window.DownloadsIndicatorView; });
this.__defineGetter__('DownloadsCommon', function() { return window.DownloadsCommon; });

this.reDoDownloadsNotifications = null;

this.downloadsFinishedWidth = function() {
	if(reDoDownloadsNotifications) {
		DownloadsIndicatorView._showEventNotification(reDoDownloadsNotifications);
		reDoDownloadsNotifications = null;
	}
};

this.setupHoldDownloadsPanel = function(e) {
	if(e.target.id == 'downloadsPanel') {
		listenerAid.remove(window, 'popupshowing', setupHoldDownloadsPanel);
		listenerAid.add(e.target, 'AskingForNodeOwner', holdDownloadsPanel);
	}
};

this.holdDownloadsPanel = function(e) {
	e.detail = 'downloads-button';
	e.stopPropagation();
};

moduleAid.LOADMODULE = function() {
	piggyback.add('downloadsIndicator', DownloadsIndicatorView, 'showEventNotification', function(aType) {
		// we're already opening to animate, so don't animate again, just replace the previous animation type
		if(reDoDownloadsNotifications) {
			reDoDownloadsNotifications = aType;
			return false;
		}
		
		// only pause animation if the button is in the slimChromeContainer
		if(typeof(slimChromeContainer) != 'undefined'
		&& this._initialized && DownloadsCommon.animateNotifications
		&& (	isAncestor($('downloads-button'), slimChromeContainer)
			|| isAncestor($('downloads-button'), overflowList)
			// not using CUI.getPlacementOfWidget because this involves less checks
			|| CustomizableUI.getWidgetIdsInArea('PanelUI-contents').indexOf('downloads-button') > -1)
		) {
			// if container is hidden, pause until it is shown
			if(!trueAttribute(slimChromeContainer, 'hover')) {
				reDoDownloadsNotifications = aType;
				initialShowChrome();
				return false;
			}
			
			// container is not hidden, so keep showing it until animation is done at least
			initialShowChrome(1500);
		}
		
		return true;
	}, piggyback.MODE_BEFORE);
	
	// the downloadsPanel is only created when first called
	if($('downloadsPanel')) {
		listenerAid.add($('downloadsPanel'), 'AskingForNodeOwner', holdDownloadsPanel);
	} else {
		listenerAid.add(window, 'popupshowing', setupHoldDownloadsPanel);
	}
	
	listenerAid.add(window, 'FinishedSlimChromeWidth', downloadsFinishedWidth);
};

moduleAid.UNLOADMODULE = function() {
	listenerAid.remove(window, 'FinishedSlimChromeWidth', downloadsFinishedWidth);
	listenerAid.remove($('downloadsPanel'), 'AskingForNodeOwner', holdDownloadsPanel);
	listenerAid.remove(window, 'popupshowing', setupHoldDownloadsPanel);
	
	piggyback.revert('downloadsIndicator', DownloadsIndicatorView, 'showEventNotification');
};
