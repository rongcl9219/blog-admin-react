import React, { useState } from 'react';
import MarkdownEditor from 'md-editor-rt';
import toolbarArr from './config';
import 'md-editor-rt/lib/style.css';
import './mdEditor.less';

const MdEditor = () => {
    const [text, setText] = useState('hello md-editor-rt！');

    return <MarkdownEditor modelValue={text} onChange={setText} toolbars={toolbarArr} />;
};

export default MdEditor;
