/*\
title: $:/plugins/zimiarh/extimg/CreateExternalImage.js
type: application/javascript
module-type: widget

Action widget to create an external image from google drive file link

<$action-createexternalimage $name=image_name $url=google_drive_share_link/>

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var CreateExternalImage = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
CreateExternalImage.prototype = new Widget();

/*
Render this widget into the DOM
*/
CreateExternalImage.prototype.render = function(parent,nextSibling) {
	this.computeAttributes();
	this.execute();
};

/*
Compute the internal state of the widget
*/
CreateExternalImage.prototype.execute = function() {
	this.name = this.getAttribute('name', undefined);
	this.url = this.getAttribute('url', undefined);
};

/*
Refresh the widget by ensuring our attributes are up to date
*/
CreateExternalImage.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	if(Object.keys(changedAttributes).length) {
		this.refreshSelf();
		return true;
	}
	return this.refreshChildren(changedTiddlers);
};

let getViewUrl = function(url) {
  const matchingExpressionLong = /drive\.google\.com\/file\/d\/([\d\w-]*)/g;
  const matchingExpressionShort = /drive\.google\.com\/open\?id=([\d\w-]*)/g;

  let matched = matchingExpressionLong.exec(url) || matchingExpressionShort.exec(url);
  if (matched) {
    return "https://drive.google.com/uc?export=view&id=" + matched[1];
  }
  else {
    return null;
  }
}

/*
Invoke the action associated with this widget
*/
CreateExternalImage.prototype.invokeAction = function(triggeringWidget,event) {
  let shareUrl = getViewUrl(this.url);
  let tiddlerTitle = this.name;

  if (shareUrl != null) {
    var count = 1;
    while ($tw.wiki.getTiddler(tiddlerTitle)) {
      tiddlerTitle = this.name + "_" + count;
      count++;
    }
    this.dispatchEvent({
      type: "tm-new-tiddler",
      paramObject: {"title": tiddlerTitle, "_canonical_uri": shareUrl, "type": "image/png"},
      event: event
    });

  }
  else {
    alert("Invalid image url");
  }

	return true; // Action was invoked
};

exports["action-createexternalimage"] = CreateExternalImage;

})();
