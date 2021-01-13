import type {
  FetcherResult,
  GraphiQLProps,
} from 'graphiql/esm/components/GraphiQL'
import { GraphQLError } from 'graphql'
import { GraphQLResponse } from 'graphql-request/dist/types'
import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { createGlobalStyle } from 'styled-components'

import { endpoint } from '@/api/endpoint'
import { useAuth } from '@/auth/use-auth'

const Style = createGlobalStyle`
body {
  padding: 0;
  margin: 0;
  min-height: 100vh;
}
#__next {
  height: 100vh;
}

.graphiql-container,
.graphiql-container button,
.graphiql-container input {
  color: #141823;
  font-family:
    system,
    -apple-system,
    'San Francisco',
    '.SFNSDisplay-Regular',
    'Segoe UI',
    Segoe,
    'Segoe WP',
    'Helvetica Neue',
    helvetica,
    'Lucida Grande',
    arial,
    sans-serif;
  font-size: 14px;
}

.graphiql-container {
  display: flex;
  flex-direction: row;
  height: 100%;
  margin: 0;
  overflow: hidden;
  width: 100%;
}

.graphiql-container .editorWrap {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-x: hidden;
}

.graphiql-container .title {
  font-size: 18px;
}

.graphiql-container .title em {
  font-family: georgia;
  font-size: 19px;
}

.graphiql-container .topBarWrap {
  display: flex;
  flex-direction: row;
}

.graphiql-container .topBar {
  align-items: center;
  background: linear-gradient(#f7f7f7, #e2e2e2);
  border-bottom: 1px solid #d0d0d0;
  cursor: default;
  display: flex;
  flex-direction: row;
  flex: 1;
  height: 34px;
  overflow-y: visible;
  padding: 7px 14px 6px;
  user-select: none;
}

.graphiql-container .toolbar {
  overflow-x: visible;
  display: flex;
}

.graphiql-container .docExplorerShow,
.graphiql-container .historyShow {
  background: linear-gradient(#f7f7f7, #e2e2e2);
  border-radius: 0;
  border-bottom: 1px solid #d0d0d0;
  border-right: none;
  border-top: none;
  color: #3B5998;
  cursor: pointer;
  font-size: 14px;
  margin: 0;
  padding: 2px 20px 0 18px;
}

.graphiql-container .docExplorerShow {
  border-left: 1px solid rgba(0, 0, 0, 0.2);
}

.graphiql-container .historyShow {
  border-right: 1px solid rgba(0, 0, 0, 0.2);
  border-left: 0;
}

.graphiql-container .docExplorerShow:before {
  border-left: 2px solid #3B5998;
  border-top: 2px solid #3B5998;
  content: '';
  display: inline-block;
  height: 9px;
  margin: 0 3px -1px 0;
  position: relative;
  transform: rotate(-45deg);
  width: 9px;
}

.graphiql-container .editorBar {
  display: flex;
  flex-direction: row;
  flex: 1;
}

.graphiql-container .queryWrap {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.graphiql-container .resultWrap {
  border-left: solid 1px #e0e0e0;
  display: flex;
  flex-direction: column;
  flex: 1;
  flex-basis: 1em;
  position: relative;
}

.graphiql-container .docExplorerWrap,
.graphiql-container .historyPaneWrap {
  background: white;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 3;
}

.graphiql-container .historyPaneWrap {
  min-width: 230px;
  z-index: 5;
}

.graphiql-container .docExplorerResizer {
  cursor: col-resize;
  height: 100%;
  left: -5px;
  position: absolute;
  top: 0;
  width: 10px;
  z-index: 10;
}

.graphiql-container .docExplorerHide {
  cursor: pointer;
  font-size: 18px;
  margin: -7px -8px -6px 0;
  padding: 18px 16px 15px 12px;
  background: 0;
  border: 0;
  line-height: 14px;
}

.graphiql-container div .query-editor {
  flex: 1;
  position: relative;
}

.graphiql-container .secondary-editor {
  display: flex;
  flex-direction: column;
  height: 30px;
  position: relative;
}

.graphiql-container .secondary-editor-title {
  background: #eeeeee;
  border-bottom: 1px solid #d6d6d6;
  border-top: 1px solid #e0e0e0;
  color: #777;
  font-variant: small-caps;
  font-weight: bold;
  letter-spacing: 1px;
  line-height: 14px;
  padding: 6px 0 8px 43px;
  text-transform: lowercase;
  user-select: none;
}

.graphiql-container .codemirrorWrap {
  flex: 1;
  height: 100%;
  position: relative;
}

.graphiql-container .result-window {
  flex: 1;
  height: 100%;
  position: relative;
}

.graphiql-container .footer {
  background: #f6f7f8;
  border-left: 1px solid #e0e0e0;
  border-top: 1px solid #e0e0e0;
  margin-left: 12px;
  position: relative;
}

.graphiql-container .footer:before {
  background: #eeeeee;
  bottom: 0;
  content: " ";
  left: -13px;
  position: absolute;
  top: -1px;
  width: 12px;
}

/* No \`.graphiql-container\` here so themes can overwrite */

.result-window .CodeMirror {
  background: #f6f7f8;
}

.graphiql-container .result-window .CodeMirror-gutters {
  background-color: #eeeeee;
  border-color: #e0e0e0;
  cursor: col-resize;
}

.graphiql-container .result-window .CodeMirror-foldgutter,
.graphiql-container .result-window .CodeMirror-foldgutter-open:after,
.graphiql-container .result-window .CodeMirror-foldgutter-folded:after {
  padding-left: 3px;
}

.graphiql-container .toolbar-button {
  background: #fdfdfd;
  background: linear-gradient(#f9f9f9, #ececec);
  border: 0;
  border-radius: 3px;
  box-shadow:
    inset 0 0 0 1px rgba(0,0,0,0.20),
    0 1px 0 rgba(255,255,255, 0.7),
    inset 0 1px #fff;
  color: #555;
  cursor: pointer;
  display: inline-block;
  margin: 0 5px;
  padding: 3px 11px 5px;
  text-decoration: none;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 150px;
}

.graphiql-container .toolbar-button:active {
  background: linear-gradient(#ececec, #d5d5d5);
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.7),
    inset 0 0 0 1px rgba(0,0,0,0.10),
    inset 0 1px 1px 1px rgba(0, 0, 0, 0.12),
    inset 0 0 5px rgba(0, 0, 0, 0.1);
}

.graphiql-container .toolbar-button.error {
  background: linear-gradient(#fdf3f3, #e6d6d7);
  color: #b00;
}

.graphiql-container .toolbar-button-group {
  margin: 0 5px;
  white-space: nowrap;
}

.graphiql-container .toolbar-button-group > * {
  margin: 0;
}

.graphiql-container .toolbar-button-group > *:not(:last-child) {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.graphiql-container .toolbar-button-group > *:not(:first-child) {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  margin-left: -1px;
}

.graphiql-container .execute-button-wrap {
  height: 34px;
  margin: 0 14px 0 28px;
  position: relative;
}

.graphiql-container .execute-button {
  background: linear-gradient(#fdfdfd, #d2d3d6);
  border-radius: 17px;
  border: 1px solid rgba(0,0,0,0.25);
  box-shadow: 0 1px 0 #fff;
  cursor: pointer;
  fill: #444;
  height: 34px;
  margin: 0;
  padding: 0;
  width: 34px;
}

.graphiql-container .execute-button svg {
  pointer-events: none;
}

.graphiql-container .execute-button:active {
  background: linear-gradient(#e6e6e6, #c3c3c3);
  box-shadow:
    0 1px 0 #fff,
    inset 0 0 2px rgba(0, 0, 0, 0.2),
    inset 0 0 6px rgba(0, 0, 0, 0.1);
}

.graphiql-container .toolbar-menu,
.graphiql-container .toolbar-select {
  position: relative;
}

.graphiql-container .execute-options,
.graphiql-container .toolbar-menu-items,
.graphiql-container .toolbar-select-options {
  background: #fff;
  box-shadow:
    0 0 0 1px rgba(0,0,0,0.1),
    0 2px 4px rgba(0,0,0,0.25);
  margin: 0;
  padding: 6px 0;
  position: absolute;
  z-index: 100;
}

.graphiql-container .execute-options {
  min-width: 100px;
  top: 37px;
  left: -1px;
}

.graphiql-container .toolbar-menu-items {
  left: 1px;
  margin-top: -1px;
  min-width: 110%;
  top: 100%;
  visibility: hidden;
}

.graphiql-container .toolbar-menu-items.open {
  visibility: visible;
}

.graphiql-container .toolbar-select-options {
  left: 0;
  min-width: 100%;
  top: -5px;
  visibility: hidden;
}

.graphiql-container .toolbar-select-options.open {
  visibility: visible;
}

.graphiql-container .execute-options > li,
.graphiql-container .toolbar-menu-items > li,
.graphiql-container .toolbar-select-options > li {
  cursor: pointer;
  display: block;
  margin: none;
  max-width: 300px;
  overflow: hidden;
  padding: 2px 20px 4px 11px;
  white-space: nowrap;
}

.graphiql-container .execute-options > li.selected,
.graphiql-container .toolbar-menu-items > li.hover,
.graphiql-container .toolbar-menu-items > li:active,
.graphiql-container .toolbar-menu-items > li:hover,
.graphiql-container .toolbar-select-options > li.hover,
.graphiql-container .toolbar-select-options > li:active,
.graphiql-container .toolbar-select-options > li:hover,
.graphiql-container .history-contents > li:hover,
.graphiql-container .history-contents > li:active {
  background: #e10098;
  color: #fff;
}

.graphiql-container .toolbar-select-options > li > svg {
  display: inline;
  fill: #666;
  margin: 0 -6px 0 6px;
  pointer-events: none;
  vertical-align: middle;
}

.graphiql-container .toolbar-select-options > li.hover > svg,
.graphiql-container .toolbar-select-options > li:active > svg,
.graphiql-container .toolbar-select-options > li:hover > svg {
  fill: #fff;
}

.graphiql-container .CodeMirror-scroll {
  overflow-scrolling: touch;
}

.graphiql-container .CodeMirror {
  color: #141823;
  font-family:
    'Consolas',
    'Inconsolata',
    'Droid Sans Mono',
    'Monaco',
    monospace;
  font-size: 13px;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
}

.graphiql-container .CodeMirror-lines {
  padding: 20px 0;
}

.CodeMirror-hint-information .content {
  box-orient: vertical;
  color: #141823;
  display: flex;
  font-family: system, -apple-system, 'San Francisco', '.SFNSDisplay-Regular', 'Segoe UI', Segoe, 'Segoe WP', 'Helvetica Neue', helvetica, 'Lucida Grande', arial, sans-serif;
  font-size: 13px;
  line-clamp: 3;
  line-height: 16px;
  max-height: 48px;
  overflow: hidden;
  text-overflow: -o-ellipsis-lastline;
}

.CodeMirror-hint-information .content p:first-child {
  margin-top: 0;
}

.CodeMirror-hint-information .content p:last-child {
  margin-bottom: 0;
}

.CodeMirror-hint-information .infoType {
  color: #CA9800;
  cursor: pointer;
  display: inline;
  margin-right: 0.5em;
}

.autoInsertedLeaf.cm-property {
  animation-duration: 6s;
  animation-name: insertionFade;
  border-bottom: 2px solid rgba(255, 255, 255, 0);
  border-radius: 2px;
  margin: -2px -4px -1px;
  padding: 2px 4px 1px;
}

@keyframes insertionFade {
  from, to {
    background: rgba(255, 255, 255, 0);
    border-color: rgba(255, 255, 255, 0);
  }

  15%, 85% {
    background: #fbffc9;
    border-color: #f0f3c0;
  }
}

div.CodeMirror-lint-tooltip {
  background-color: white;
  border-radius: 2px;
  border: 0;
  color: #141823;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.45);
  font-size: 13px;
  line-height: 16px;
  max-width: 430px;
  opacity: 0;
  padding: 8px 10px;
  transition: opacity 0.15s;
  white-space: pre-wrap;
}

div.CodeMirror-lint-tooltip > * {
  padding-left: 23px;
}

div.CodeMirror-lint-tooltip > * + * {
  margin-top: 12px;
}

/* COLORS */

.graphiql-container .CodeMirror-foldmarker {
  border-radius: 4px;
  background: #08f;
  background: linear-gradient(#43A8FF, #0F83E8);
  box-shadow:
    0 1px 1px rgba(0, 0, 0, 0.2),
    inset 0 0 0 1px rgba(0, 0, 0, 0.1);
  color: white;
  font-family: arial;
  font-size: 12px;
  line-height: 0;
  margin: 0 3px;
  padding: 0px 4px 1px;
  text-shadow: 0 -1px rgba(0, 0, 0, 0.1);
}

.graphiql-container div.CodeMirror span.CodeMirror-matchingbracket {
  color: #555;
  text-decoration: underline;
}

.graphiql-container div.CodeMirror span.CodeMirror-nonmatchingbracket {
  color: #f00;
}

/* Comment */

.cm-comment {
  color: #999;
}

/* Punctuation */

.cm-punctuation {
  color: #555;
}

/* Keyword */

.cm-keyword {
  color: #B11A04;
}

/* OperationName, FragmentName */

.cm-def {
  color: #D2054E;
}

/* FieldName */

.cm-property {
  color: #1F61A0;
}

/* FieldAlias */

.cm-qualifier {
  color: #1C92A9;
}

/* ArgumentName and ObjectFieldName */

.cm-attribute {
  color: #8B2BB9;
}

/* Number */

.cm-number {
  color: #2882F9;
}

/* String */

.cm-string {
  color: #D64292;
}

/* Boolean */

.cm-builtin {
  color: #D47509;
}

/* EnumValue */

.cm-string-2 {
  color: #0B7FC7;
}

/* Variable */

.cm-variable {
  color: #397D13;
}

/* Directive */

.cm-meta {
  color: #B33086;
}

/* Type */

.cm-atom {
  color: #CA9800;
}

/* BASICS */

.CodeMirror {
  /* Set height, width, borders, and global font properties here */
  color: black;
  font-family: monospace;
  height: 300px;
}

/* PADDING */

.CodeMirror-lines {
  padding: 4px 0; /* Vertical padding around content */
}

.CodeMirror pre {
  padding: 0 4px; /* Horizontal padding of content */
}

.CodeMirror-scrollbar-filler, .CodeMirror-gutter-filler {
  background-color: white; /* The little square between H and V scrollbars */
}

/* GUTTER */

.CodeMirror-gutters {
  border-right: 1px solid #ddd;
  background-color: #f7f7f7;
  white-space: nowrap;
}

.CodeMirror-linenumbers {}

.CodeMirror-linenumber {
  color: #999;
  min-width: 20px;
  padding: 0 3px 0 5px;
  text-align: right;
  white-space: nowrap;
}

.CodeMirror-guttermarker { color: black; }

.CodeMirror-guttermarker-subtle { color: #999; }

/* CURSOR */

.CodeMirror .CodeMirror-cursor {
  border-left: 1px solid black;
}

/* Shown when moving in bi-directional text */

.CodeMirror div.CodeMirror-secondarycursor {
  border-left: 1px solid silver;
}

.CodeMirror.cm-fat-cursor div.CodeMirror-cursor {
  background: #7e7;
  border: 0;
  width: auto;
}

.CodeMirror.cm-fat-cursor div.CodeMirror-cursors {
  z-index: 1;
}

.cm-animate-fat-cursor {
  animation: blink 1.06s steps(1) infinite;
  border: 0;
  width: auto;
}

@keyframes blink {
  0% { background: #7e7; }
  50% { background: none; }
  100% { background: #7e7; }
}

/* Can style cursor different in overwrite (non-insert) mode */

div.CodeMirror-overwrite div.CodeMirror-cursor {}

.cm-tab { display: inline-block; text-decoration: inherit; }

.CodeMirror-ruler {
  border-left: 1px solid #ccc;
  position: absolute;
}

/* DEFAULT THEME */

.cm-s-default .cm-keyword {color: #708;}

.cm-s-default .cm-atom {color: #219;}

.cm-s-default .cm-number {color: #164;}

.cm-s-default .cm-def {color: #00f;}

.cm-s-default .cm-variable,
.cm-s-default .cm-punctuation,
.cm-s-default .cm-property,
.cm-s-default .cm-operator {}

.cm-s-default .cm-variable-2 {color: #05a;}

.cm-s-default .cm-variable-3 {color: #085;}

.cm-s-default .cm-comment {color: #a50;}

.cm-s-default .cm-string {color: #a11;}

.cm-s-default .cm-string-2 {color: #f50;}

.cm-s-default .cm-meta {color: #555;}

.cm-s-default .cm-qualifier {color: #555;}

.cm-s-default .cm-builtin {color: #30a;}

.cm-s-default .cm-bracket {color: #997;}

.cm-s-default .cm-tag {color: #170;}

.cm-s-default .cm-attribute {color: #00c;}

.cm-s-default .cm-header {color: blue;}

.cm-s-default .cm-quote {color: #090;}

.cm-s-default .cm-hr {color: #999;}

.cm-s-default .cm-link {color: #00c;}

.cm-negative {color: #d44;}

.cm-positive {color: #292;}

.cm-header, .cm-strong {font-weight: bold;}

.cm-em {font-style: italic;}

.cm-link {text-decoration: underline;}

.cm-strikethrough {text-decoration: line-through;}

.cm-s-default .cm-error {color: #f00;}

.cm-invalidchar {color: #f00;}

.CodeMirror-composing { border-bottom: 2px solid; }

/* Default styles for common addons */

div.CodeMirror span.CodeMirror-matchingbracket {color: #0f0;}

div.CodeMirror span.CodeMirror-nonmatchingbracket {color: #f22;}

.CodeMirror-matchingtag { background: rgba(255, 150, 0, .3); }

.CodeMirror-activeline-background {background: #e8f2ff;}

/* STOP */

/* The rest of this file contains styles related to the mechanics of
   the editor. You probably shouldn't touch them. */

.CodeMirror {
  background: white;
  overflow: hidden;
  position: relative;
}

.CodeMirror-scroll {
  height: 100%;
  /* 30px is the magic margin used to hide the element's real scrollbars */
  /* See overflow: hidden in .CodeMirror */
  margin-bottom: -30px; margin-right: -30px;
  outline: none; /* Prevent dragging from highlighting the element */
  overflow: scroll !important; /* Things will break if this is overridden */
  padding-bottom: 30px;
  position: relative;
}

.CodeMirror-sizer {
  border-right: 30px solid transparent;
  position: relative;
}

/* The fake, visible scrollbars. Used to force redraw during scrolling
   before actual scrolling happens, thus preventing shaking and
   flickering artifacts. */

.CodeMirror-vscrollbar, .CodeMirror-hscrollbar, .CodeMirror-scrollbar-filler, .CodeMirror-gutter-filler {
  display: none;
  position: absolute;
  z-index: 6;
}

.CodeMirror-vscrollbar {
  overflow-x: hidden;
  overflow-y: scroll;
  right: 0; top: 0;
}

.CodeMirror-hscrollbar {
  bottom: 0; left: 0;
  overflow-x: scroll;
  overflow-y: hidden;
}

.CodeMirror-scrollbar-filler {
  right: 0; bottom: 0;
}

.CodeMirror-gutter-filler {
  left: 0; bottom: 0;
}

.CodeMirror-gutters {
  min-height: 100%;
  position: absolute; left: 0; top: 0;
  z-index: 3;
}

.CodeMirror-gutter {
  display: inline-block;
  height: 100%;
  margin-bottom: -30px;
  vertical-align: top;
  white-space: normal;
  /* Hack to make IE7 behave */
  *zoom:1;
  *display:inline;
}

.CodeMirror-gutter-wrapper {
  background: none !important;
  border: none !important;
  position: absolute;
  z-index: 4;
}

.CodeMirror-gutter-background {
  position: absolute;
  top: 0; bottom: 0;
  z-index: 4;
}

.CodeMirror-gutter-elt {
  cursor: default;
  position: absolute;
  z-index: 4;
}

.CodeMirror-gutter-wrapper {
  user-select: none;
}

.CodeMirror-lines {
  cursor: text;
  min-height: 1px; /* prevents collapsing before first draw */
}

.CodeMirror pre {
  -webkit-tap-highlight-color: transparent;
  /* Reset some styles that the rest of the page might have set */
  background: transparent;
  border-radius: 0;
  border-width: 0;
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  font-variant-ligatures: none;
  line-height: inherit;
  margin: 0;
  overflow: visible;
  position: relative;
  white-space: pre;
  word-wrap: normal;
  z-index: 2;
}

.CodeMirror-wrap pre {
  word-wrap: break-word;
  white-space: pre-wrap;
  word-break: normal;
}

.CodeMirror-linebackground {
  position: absolute;
  left: 0; right: 0; top: 0; bottom: 0;
  z-index: 0;
}

.CodeMirror-linewidget {
  overflow: auto;
  position: relative;
  z-index: 2;
}

.CodeMirror-widget {}

.CodeMirror-code {
  outline: none;
}

/* Force content-box sizing for the elements where we expect it */

.CodeMirror-scroll,
.CodeMirror-sizer,
.CodeMirror-gutter,
.CodeMirror-gutters,
.CodeMirror-linenumber {
  box-sizing: content-box;
}

.CodeMirror-measure {
  height: 0;
  overflow: hidden;
  position: absolute;
  visibility: hidden;
  width: 100%;
}

.CodeMirror-cursor { position: absolute; }

.CodeMirror-measure pre { position: static; }

div.CodeMirror-cursors {
  position: relative;
  visibility: hidden;
  z-index: 3;
}

div.CodeMirror-dragcursors {
  visibility: visible;
}

.CodeMirror-focused div.CodeMirror-cursors {
  visibility: visible;
}

.CodeMirror-selected { background: #d9d9d9; }

.CodeMirror-focused .CodeMirror-selected { background: #d7d4f0; }

.CodeMirror-crosshair { cursor: crosshair; }

.CodeMirror-line::selection, .CodeMirror-line > span::selection, .CodeMirror-line > span > span::selection { background: #d7d4f0; }

.CodeMirror-line::-moz-selection, .CodeMirror-line > span::-moz-selection, .CodeMirror-line > span > span::-moz-selection { background: #d7d4f0; }

.cm-searching {
  background: #ffa;
  background: rgba(255, 255, 0, .4);
}

/* IE7 hack to prevent it from returning funny offsetTops on the spans */

.CodeMirror span { *vertical-align: text-bottom; }

/* Used to force a border model for a node */

.cm-force-border { padding-right: .1px; }

@media print {
  /* Hide the cursor when printing */
  .CodeMirror div.CodeMirror-cursors {
    visibility: hidden;
  }
}

/* See issue #2901 */

.cm-tab-wrap-hack:after { content: ''; }

/* Help users use markselection to safely style text background */

span.CodeMirror-selectedtext { background: none; }

.CodeMirror-dialog {
  background: inherit;
  color: inherit;
  left: 0; right: 0;
  overflow: hidden;
  padding: .1em .8em;
  position: absolute;
  z-index: 15;
}

.CodeMirror-dialog-top {
  border-bottom: 1px solid #eee;
  top: 0;
}

.CodeMirror-dialog-bottom {
  border-top: 1px solid #eee;
  bottom: 0;
}

.CodeMirror-dialog input {
  background: transparent;
  border: 1px solid #d3d6db;
  color: inherit;
  font-family: monospace;
  outline: none;
  width: 20em;
}

.CodeMirror-dialog button {
  font-size: 70%;
}

.CodeMirror-foldmarker {
  color: blue;
  cursor: pointer;
  font-family: arial;
  line-height: .3;
  text-shadow: #b9f 1px 1px 2px, #b9f -1px -1px 2px, #b9f 1px -1px 2px, #b9f -1px 1px 2px;
}
.CodeMirror-foldgutter {
  width: .7em;
}
.CodeMirror-foldgutter-open,
.CodeMirror-foldgutter-folded {
  cursor: pointer;
}
.CodeMirror-foldgutter-open:after {
  content: "\\25BE";
}
.CodeMirror-foldgutter-folded:after {
  content: "\\25B8";
}

.CodeMirror-info {
  background: white;
  border-radius: 2px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.45);
  box-sizing: border-box;
  color: #555;
  font-family:
    system,
    -apple-system,
    'San Francisco',
    '.SFNSDisplay-Regular',
    'Segoe UI',
    Segoe,
    'Segoe WP',
    'Helvetica Neue',
    helvetica,
    'Lucida Grande',
    arial,
    sans-serif;
  font-size: 13px;
  line-height: 16px;
  margin: 8px -8px;
  max-width: 400px;
  opacity: 0;
  overflow: hidden;
  padding: 8px 8px;
  position: fixed;
  transition: opacity 0.15s;
  z-index: 50;
}

.CodeMirror-info :first-child {
  margin-top: 0;
}

.CodeMirror-info :last-child {
  margin-bottom: 0;
}

.CodeMirror-info p {
  margin: 1em 0;
}

.CodeMirror-info .info-description {
  color: #777;
  line-height: 16px;
  margin-top: 1em;
  max-height: 80px;
  overflow: hidden;
}

.CodeMirror-info .info-deprecation {
  background: #fffae8;
  box-shadow: inset 0 1px 1px -1px #bfb063;
  color: #867F70;
  line-height: 16px;
  margin: -8px;
  margin-top: 8px;
  max-height: 80px;
  overflow: hidden;
  padding: 8px;
}

.CodeMirror-info .info-deprecation-label {
  color: #c79b2e;
  cursor: default;
  display: block;
  font-size: 9px;
  font-weight: bold;
  letter-spacing: 1px;
  line-height: 1;
  padding-bottom: 5px;
  text-transform: uppercase;
  user-select: none;
}

.CodeMirror-info .info-deprecation-label + * {
  margin-top: 0;
}

.CodeMirror-info a {
  text-decoration: none;
}

.CodeMirror-info a:hover {
  text-decoration: underline;
}

.CodeMirror-info .type-name {
  color: #CA9800;
}

.CodeMirror-info .field-name {
  color: #1F61A0;
}

.CodeMirror-info .enum-value {
  color: #0B7FC7;
}

.CodeMirror-info .arg-name {
  color: #8B2BB9;
}

.CodeMirror-info .directive-name {
  color: #B33086;
}

.CodeMirror-jump-token {
  text-decoration: underline;
  cursor: pointer;
}

/* The lint marker gutter */
.CodeMirror-lint-markers {
  width: 16px;
}
.CodeMirror-lint-tooltip {
  background-color: infobackground;
  border-radius: 4px 4px 4px 4px;
  border: 1px solid black;
  color: infotext;
  font-family: monospace;
  font-size: 10pt;
  max-width: 600px;
  opacity: 0;
  overflow: hidden;
  padding: 2px 5px;
  position: fixed;
  transition: opacity .4s;
  white-space: pre-wrap;
  z-index: 100;
}
.CodeMirror-lint-mark-error, .CodeMirror-lint-mark-warning {
  background-position: left bottom;
  background-repeat: repeat-x;
}
.CodeMirror-lint-mark-error {
  background-image:
  url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAYAAAC09K7GAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9sJDw4cOCW1/KIAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAHElEQVQI12NggIL/DAz/GdA5/xkY/qPKMDAwAADLZwf5rvm+LQAAAABJRU5ErkJggg==")
  ;
}
.CodeMirror-lint-mark-warning {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAYAAAC09K7GAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9sJFhQXEbhTg7YAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAMklEQVQI12NkgIIvJ3QXMjAwdDN+OaEbysDA4MPAwNDNwMCwiOHLCd1zX07o6kBVGQEAKBANtobskNMAAAAASUVORK5CYII=");
}
.CodeMirror-lint-marker-error, .CodeMirror-lint-marker-warning {
  background-position: center center;
  background-repeat: no-repeat;
  cursor: pointer;
  display: inline-block;
  height: 16px;
  position: relative;
  vertical-align: middle;
  width: 16px;
}
.CodeMirror-lint-message-error, .CodeMirror-lint-message-warning {
  background-position: top left;
  background-repeat: no-repeat;
  padding-left: 18px;
}
.CodeMirror-lint-marker-error, .CodeMirror-lint-message-error {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAHlBMVEW7AAC7AACxAAC7AAC7AAAAAAC4AAC5AAD///+7AAAUdclpAAAABnRSTlMXnORSiwCK0ZKSAAAATUlEQVR42mWPOQ7AQAgDuQLx/z8csYRmPRIFIwRGnosRrpamvkKi0FTIiMASR3hhKW+hAN6/tIWhu9PDWiTGNEkTtIOucA5Oyr9ckPgAWm0GPBog6v4AAAAASUVORK5CYII=");
}
.CodeMirror-lint-marker-warning, .CodeMirror-lint-message-warning {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAANlBMVEX/uwDvrwD/uwD/uwD/uwD/uwD/uwD/uwD/uwD6twD/uwAAAADurwD2tQD7uAD+ugAAAAD/uwDhmeTRAAAADHRSTlMJ8mN1EYcbmiixgACm7WbuAAAAVklEQVR42n3PUQqAIBBFUU1LLc3u/jdbOJoW1P08DA9Gba8+YWJ6gNJoNYIBzAA2chBth5kLmG9YUoG0NHAUwFXwO9LuBQL1giCQb8gC9Oro2vp5rncCIY8L8uEx5ZkAAAAASUVORK5CYII=");
}
.CodeMirror-lint-marker-multiple {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAMAAADzjKfhAAAACVBMVEUAAAAAAAC/v7914kyHAAAAAXRSTlMAQObYZgAAACNJREFUeNo1ioEJAAAIwmz/H90iFFSGJgFMe3gaLZ0od+9/AQZ0ADosbYraAAAAAElFTkSuQmCC");
  background-position: right bottom;
  background-repeat: no-repeat;
  width: 100%; height: 100%;
}

.graphiql-container .spinner-container {
  height: 36px;
  left: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 36px;
  z-index: 10;
}

.graphiql-container .spinner {
  animation: rotation .6s infinite linear;
  border-bottom: 6px solid rgba(150, 150, 150, .15);
  border-left: 6px solid rgba(150, 150, 150, .15);
  border-radius: 100%;
  border-right: 6px solid rgba(150, 150, 150, .15);
  border-top: 6px solid rgba(150, 150, 150, .8);
  display: inline-block;
  height: 24px;
  position: absolute;
  vertical-align: middle;
  width: 24px;
}

@keyframes rotation {
  from { transform: rotate(0deg); }
  to { transform: rotate(359deg); }
}

.CodeMirror-hints {
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.45);
  font-family: 'Consolas', 'Inconsolata', 'Droid Sans Mono', 'Monaco', monospace;
  font-size: 13px;
  list-style: none;
  margin-left: -6px;
  margin: 0;
  max-height: 14.5em;
  overflow: hidden;
  overflow-y: auto;
  padding: 0;
  position: absolute;
  z-index: 10;
}

.CodeMirror-hint {
  border-top: solid 1px #f7f7f7;
  color: #141823;
  cursor: pointer;
  margin: 0;
  max-width: 300px;
  overflow: hidden;
  padding: 2px 6px;
  white-space: pre;
}

li.CodeMirror-hint-active {
  background-color: #08f;
  border-top-color: white;
  color: white;
}

.CodeMirror-hint-information {
  border-top: solid 1px #c0c0c0;
  max-width: 300px;
  padding: 4px 6px;
  position: relative;
  z-index: 1;
}

.CodeMirror-hint-information:first-child {
  border-bottom: solid 1px #c0c0c0;
  border-top: none;
  margin-bottom: -1px;
}

.CodeMirror-hint-deprecation {
  background: #fffae8;
  box-shadow: inset 0 1px 1px -1px #bfb063;
  color: #867F70;
  font-family:
    system,
    -apple-system,
    'San Francisco',
    '.SFNSDisplay-Regular',
    'Segoe UI',
    Segoe,
    'Segoe WP',
    'Helvetica Neue',
    helvetica,
    'Lucida Grande',
    arial,
    sans-serif;
  font-size: 13px;
  line-height: 16px;
  margin-top: 4px;
  max-height: 80px;
  overflow: hidden;
  padding: 6px;
}

.CodeMirror-hint-deprecation .deprecation-label {
  color: #c79b2e;
  cursor: default;
  display: block;
  font-size: 9px;
  font-weight: bold;
  letter-spacing: 1px;
  line-height: 1;
  padding-bottom: 5px;
  text-transform: uppercase;
  user-select: none;
}

.CodeMirror-hint-deprecation .deprecation-label + * {
  margin-top: 0;
}

.CodeMirror-hint-deprecation :last-child {
  margin-bottom: 0;
}

.graphiql-container .doc-explorer {
  background: white;
}

.graphiql-container .doc-explorer-title-bar,
.graphiql-container .history-title-bar {
  cursor: default;
  display: flex;
  height: 34px;
  line-height: 14px;
  padding: 8px 8px 5px;
  position: relative;
  user-select: none;
}

.graphiql-container .doc-explorer-title,
.graphiql-container .history-title {
  flex: 1;
  font-weight: bold;
  overflow-x: hidden;
  padding: 10px 0 10px 10px;
  text-align: center;
  text-overflow: ellipsis;
  user-select: text;
  white-space: nowrap;
}

.graphiql-container .doc-explorer-back {
  color: #3B5998;
  cursor: pointer;
  margin: -7px 0 -6px -8px;
  overflow-x: hidden;
  padding: 17px 12px 16px 16px;
  text-overflow: ellipsis;
  white-space: nowrap;
  background: 0;
  border: 0;
  line-height: 14px;
}

.doc-explorer-narrow .doc-explorer-back {
  width: 0;
}

.graphiql-container .doc-explorer-back:before {
  border-left: 2px solid #3B5998;
  border-top: 2px solid #3B5998;
  content: '';
  display: inline-block;
  height: 9px;
  margin: 0 3px -1px 0;
  position: relative;
  transform: rotate(-45deg);
  width: 9px;
}

.graphiql-container .doc-explorer-rhs {
  position: relative;
}

.graphiql-container .doc-explorer-contents,
.graphiql-container .history-contents {
  background-color: #ffffff;
  border-top: 1px solid #d6d6d6;
  bottom: 0;
  left: 0;
  overflow-y: auto;
  padding: 20px 15px;
  position: absolute;
  right: 0;
  top: 47px;
}

.graphiql-container .doc-explorer-contents {
  min-width: 300px;
}

.graphiql-container .doc-type-description p:first-child ,
.graphiql-container .doc-type-description blockquote:first-child {
  margin-top: 0;
}

.graphiql-container .doc-explorer-contents a {
  cursor: pointer;
  text-decoration: none;
}

.graphiql-container .doc-explorer-contents a:hover {
  text-decoration: underline;
}

.graphiql-container .doc-value-description > :first-child {
  margin-top: 4px;
}

.graphiql-container .doc-value-description > :last-child {
  margin-bottom: 4px;
}

.graphiql-container .doc-type-description code,
.graphiql-container .doc-type-description pre,
.graphiql-container .doc-category code,
.graphiql-container .doc-category pre {
  --saf-0: rgba(var(--sk_foreground_low,29,28,29),0.13);
  font-size: 12px;
  line-height: 1.50001;
  font-variant-ligatures: none;
  white-space: pre;
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: normal;
  -webkit-tab-size: 4;
  -moz-tab-size: 4;
  tab-size: 4;
}

.graphiql-container .doc-type-description code,
.graphiql-container .doc-category code {
  padding: 2px 3px 1px;
  border: 1px solid var(--saf-0);
  border-radius: 3px;
  background-color: rgba(var(--sk_foreground_min,29,28,29),.04);
  color: #e01e5a;
  background-color: white;
}

.graphiql-container .doc-category {
  margin: 20px 0;
}

.graphiql-container .doc-category-title {
  border-bottom: 1px solid #e0e0e0;
  color: #777;
  cursor: default;
  font-size: 14px;
  font-variant: small-caps;
  font-weight: bold;
  letter-spacing: 1px;
  margin: 0 -15px 10px 0;
  padding: 10px 0;
  user-select: none;
}

.graphiql-container .doc-category-item {
  margin: 12px 0;
  color: #555;
}

.graphiql-container .keyword {
  color: #B11A04;
}

.graphiql-container .type-name {
  color: #CA9800;
}

.graphiql-container .field-name {
  color: #1F61A0;
}

.graphiql-container .field-short-description {
  color: #999;
  margin-left: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.graphiql-container .enum-value {
  color: #0B7FC7;
}

.graphiql-container .arg-name {
  color: #8B2BB9;
}

.graphiql-container .arg {
  display: block;
  margin-left: 1em;
}

.graphiql-container .arg:first-child:last-child,
.graphiql-container .arg:first-child:nth-last-child(2),
.graphiql-container .arg:first-child:nth-last-child(2) ~ .arg {
  display: inherit;
  margin: inherit;
}

.graphiql-container .arg:first-child:nth-last-child(2):after {
  content: ', ';
}

.graphiql-container .arg-default-value {
  color: #43A047;
}

.graphiql-container .doc-deprecation {
  background: #fffae8;
  box-shadow: inset 0 0 1px #bfb063;
  color: #867F70;
  line-height: 16px;
  margin: 8px -8px;
  max-height: 80px;
  overflow: hidden;
  padding: 8px;
  border-radius: 3px;
}

.graphiql-container .doc-deprecation:before {
  content: 'Deprecated:';
  color: #c79b2e;
  cursor: default;
  display: block;
  font-size: 9px;
  font-weight: bold;
  letter-spacing: 1px;
  line-height: 1;
  padding-bottom: 5px;
  text-transform: uppercase;
  user-select: none;
}

.graphiql-container .doc-deprecation > :first-child {
  margin-top: 0;
}

.graphiql-container .doc-deprecation > :last-child {
  margin-bottom: 0;
}

.graphiql-container .show-btn {
  -webkit-appearance: initial;
  display: block;
  border-radius: 3px;
  border: solid 1px #ccc;
  text-align: center;
  padding: 8px 12px 10px;
  width: 100%;
  box-sizing: border-box;
  background: #fbfcfc;
  color: #555;
  cursor: pointer;
}

.graphiql-container .search-box {
  border-bottom: 1px solid #d3d6db;
  display: block;
  font-size: 14px;
  margin: -15px -15px 12px 0;
  position: relative;
}

.graphiql-container .search-box-icon {
  cursor: pointer;
  display: block;
  font-size: 24px;
  position: absolute;
  top: -2px;
  transform: rotate(-45deg);
  user-select: none;
}

.graphiql-container .search-box .search-box-clear {
  background-color: #d0d0d0;
  border-radius: 12px;
  color: #fff;
  cursor: pointer;
  font-size: 11px;
  padding: 1px 5px 2px;
  position: absolute;
  right: 3px;
  top: 8px;
  user-select: none;
  border: 0;
}

.graphiql-container .search-box .search-box-clear:hover {
  background-color: #b9b9b9;
}

.graphiql-container .search-box > input {
  border: none;
  box-sizing: border-box;
  font-size: 14px;
  outline: none;
  padding: 6px 24px 8px 20px;
  width: 100%;
}

.graphiql-container .error-container {
  font-weight: bold;
  left: 0;
  letter-spacing: 1px;
  opacity: 0.5;
  position: absolute;
  right: 0;
  text-align: center;
  text-transform: uppercase;
  top: 50%;
  transform: translate(0, -50%);
}

.graphiql-container .history-contents {
  font-family: 'Consolas', 'Inconsolata', 'Droid Sans Mono', 'Monaco', monospace;
}

.graphiql-container .history-contents {
  margin: 0;
  padding: 0;
}

.graphiql-container .history-contents li {
  align-items: center;
  display: flex;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0;
  padding: 8px;
  border-bottom: 1px solid #e0e0e0;
}

.graphiql-container .history-contents li button:not(.history-label) {
  display: none;
  margin-left: 10px;
}

.graphiql-container .history-contents li:hover button:not(.history-label),
.graphiql-container .history-contents li:focus-within button:not(.history-label) {
  display: inline-block;
}

.graphiql-container .history-contents input,
.graphiql-container .history-contents button {
  padding: 0;
  background: 0;
  border: 0;
  font-size: inherit;
  font-family: inherit;
  line-height: 14px;
  color: inherit;
}

.graphiql-container .history-contents input {
  flex-grow: 1;
}

.graphiql-container .history-contents input::placeholder {
  color: inherit;
}

.graphiql-container .history-contents button {
  cursor: pointer;
  text-align: left;
}

.graphiql-container .history-contents .history-label {
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}
`

const GraphiQL = dynamic<GraphiQLProps>(() => import('graphiql'), {
  ssr: false,
})
const GraphQL: NextPage = () => {
  const auth = useAuth()
  //console.log('GraphQL auth', auth.current)

  return (
    <>
      <Style />
      <GraphiQL
        fetcher={async function fetcher(params) {
          const data = await executeQuery()
          const error = data.errors?.[0] as
            | (GraphQLError & {
                extensions: {
                  code: 'UNAUTHENTICATED'
                }
              })
            | undefined
          if (
            error?.extensions.code === 'UNAUTHENTICATED' &&
            auth.current !== null
          ) {
            await auth.current.refreshToken()
            return await executeQuery()
          }
          return data

          async function executeQuery() {
            const response = await fetch(endpoint, {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                ...(auth.current
                  ? {
                      Authorization: `Bearer ${auth.current.token}`,
                    }
                  : {}),
              },
              body: JSON.stringify(params),
              credentials: 'same-origin',
            })
            return (await response.json()) as FetcherResult & GraphQLResponse
          }
        }}
      />
    </>
  )
}

export default GraphQL
