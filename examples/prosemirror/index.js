/* eslint-env browser */
import * as Y from '../../src/index.js'
import ProsemirrorBinding from '../../bindings/ProsemirrorBinding/ProsemirrorBinding.js'
import WebsocketProvider from '../../provider/websocket/WebSocketProvider.js'

import {EditorState} from 'prosemirror-state'
import {EditorView} from 'prosemirror-view'
import {Schema, DOMParser, Mark, Fragment, Node, Slice} from 'prosemirror-model'
import {schema} from 'prosemirror-schema-basic'
import {exampleSetup} from 'prosemirror-example-setup'
import { PlaceholderPlugin, startImageUpload } from './PlaceholderPlugin.js'

const view = new EditorView(document.querySelector('#editor'), {
  state: EditorState.create({
    doc: DOMParser.fromSchema(schema).parse(document.querySelector('#content')),
    plugins: exampleSetup({schema}).concat(PlaceholderPlugin)
  })
})

const provider = new WebsocketProvider('ws://localhost:1234/')
const ydocument = provider.get('prosemirror')
/**
 * @type {any}
 */
const type = ydocument.define('prosemirror', Y.XmlFragment)
const prosemirrorBinding = new ProsemirrorBinding(type, view)

window.view = view
window.EditorState = EditorState
window.EditorView = EditorView
window.Mark = Mark
window.Fragment = Fragment
window.Node = Node
window.Schema = Schema
window.Slice = Slice
window.prosemirrorBinding = prosemirrorBinding

document.querySelector('#image-upload').addEventListener('change', e => {
  if (view.state.selection.$from.parent.inlineContent && e.target.files.length) {
    startImageUpload(view, e.target.files[0])
  }
  view.focus()
})