import {codeMirrorHeight, codeMirrorWidth} from './vars.js';

var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
    lineNumbers: true,
    mode: 'javascript',
    theme: 'material',
    indentUnit: 4,
    lineWrapping: false,
    autoCloseBrackets: true,
    matchBrackets: true,
    styleActiveLine: true,
    foldGutter: true,
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
});

window.addEventListener('resize', () => editor.refresh());

let codeMirrorStyle = document.querySelector('.CodeMirror').style;

codeMirrorStyle.height = codeMirrorHeight;
codeMirrorStyle.width = codeMirrorWidth;