import React from "react";
import { Allotment } from "allotment";
import 'allotment/dist/style.css';
import { EditArea } from "../EditArea";
import { MaterialWrapper } from "../MaterialWrapper";
import { Setting } from "../Setting";

export function Edit() {
    return <Allotment>
        <Allotment.Pane preferredSize={240} maxSize={300} minSize={200}>
            {/* <Material /> */}
            <MaterialWrapper />
        </Allotment.Pane>
        <Allotment.Pane>
            <EditArea />
        </Allotment.Pane>
        <Allotment.Pane preferredSize={300} maxSize={500} minSize={300}>
            <Setting />
        </Allotment.Pane>
    </Allotment>
}
