(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.lineClamp = f()}})(function(){var define,module,exports;return (function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
function truncateTextNode (
  textNode,
  rootElement,
  maximumHeight,
  ellipsisCharacter
) {
  var lastIndexOfWhitespace
  var textContent = textNode.textContent
  while (textContent.length > 1) {
    lastIndexOfWhitespace = textContent.lastIndexOf(' ')
    if (lastIndexOfWhitespace === -1) {
      break
    }
    textNode.textContent = textContent.substring(0, lastIndexOfWhitespace)
    if (rootElement.scrollHeight <= maximumHeight) {
      textNode.textContent = textContent
      break
    }
    textContent = textNode.textContent
  }
  return truncateTextNodeByCharacter(
    textNode,
    rootElement,
    maximumHeight,
    ellipsisCharacter
  )
}

var TRAILING_WHITESPACE_AND_PUNCTUATION_REGEX = /[ .,;!?'‘’“”\-–—]+$/
function truncateTextNodeByCharacter (
  textNode,
  rootElement,
  maximumHeight,
  ellipsisCharacter
) {
  var textContent = textNode.textContent
  var length = textContent.length
  while (length > 1) {
    // Trim off one trailing character and any trailing punctuation and whitespace.
    textContent = textContent
      .substring(0, length - 1)
      .replace(TRAILING_WHITESPACE_AND_PUNCTUATION_REGEX, '')
    length = textContent.length
    textNode.textContent = textContent + ellipsisCharacter
    if (rootElement.scrollHeight <= maximumHeight) {
      return true
    }
  }
  return false
}

function truncateElementNode (
  element,
  rootElement,
  maximumHeight,
  ellipsisCharacter
) {
  var childNodes = element.childNodes
  var i = childNodes.length - 1
  while (i > -1) {
    var childNode = childNodes[i--]
    var nodeType = childNode.nodeType
    if (
      (nodeType === 1 &&
        truncateElementNode(
          childNode,
          rootElement,
          maximumHeight,
          ellipsisCharacter
        )) ||
      (nodeType === 3 &&
        truncateTextNode(
          childNode,
          rootElement,
          maximumHeight,
          ellipsisCharacter
        ))
    ) {
      return true
    }
    element.removeChild(childNode)
  }
  return false
}

var ELLIPSIS_CHARACTER = '\u2026'

module.exports = function (rootElement, lineCount, options) {
  rootElement.style.cssText +=
    'overflow:hidden;overflow-wrap:break-word;word-wrap:break-word'

  var maximumHeight =
    (lineCount || 1) *
    parseInt(window.getComputedStyle(rootElement).lineHeight, 10)

  // Exit if text does not overflow `rootElement`.
  if (rootElement.scrollHeight <= maximumHeight) {
    return
  }

  truncateElementNode(
    rootElement,
    rootElement,
    maximumHeight,
    (options && options.ellipsis) || ELLIPSIS_CHARACTER
  )
}

},{}]},{},[1])(1)
});
