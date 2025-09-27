// ** Component Import
import { Editor } from 'react-draft-wysiwyg'
import '@styles/react/libs/editor/editor.scss'

const EditorControlled = (props) => {
  return <Editor onEditorStateChange={props.handleEditor} onChange={props.handleEditorChange} editorState={props.editorValue}/>
}

export default EditorControlled
