import React from "react";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import uploadPlugin from "../../../helpers/uploadPlugin";

function DescriptionEditor({ data, onChange }) {
    return (
        <CKEditor
            id="editor"
            editor={ClassicEditor}
            config={{
                extraPlugins: [uploadPlugin],
                toolbar: [
                    "heading",
                    "|",
                    "bold",
                    "italic",
                    "link",
                    "numberedList",
                    "bulletedList",
                    "|",
                    "outdent",
                    "indent",
                    "|",
                    "imageUpload",
                    "blockQuote",
                    "insertTable",
                    "mediaEmbed",
                    "undo",
                    "redo",
                ],
            }}
            className="vh-50"
            data={data}
            onChange={(event, editor) => {
                const data = editor.getData();
                onChange(data);
            }}
        />
    );
}

export default DescriptionEditor;
