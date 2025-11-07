import { data } from '@patternfly/react-log-viewer/patternfly-docs/content/extensions/react-log-viewer/examples/realTestData.js';
import { LogViewer as LogViewerComponent, LogViewerSearch } from '@patternfly/react-log-viewer';
import { Toolbar, ToolbarContent, ToolbarItem, Banner, Checkbox } from '@patternfly/react-core';
import { useRef, useState } from 'react';


function LogViewer() {
    const [isTextWrapped, setIsTextWrapped] = useState(false)


    return (
          <LogViewerComponent
            data={data.data}
            theme="dark"
            isTextWrapped={isTextWrapped}
            header={<Banner>{5019 || 0} lines</Banner>}
            toolbar={
            <Toolbar>
                <ToolbarContent>
                    <ToolbarItem>
                        <LogViewerSearch placeholder="Search value" />
                    </ToolbarItem>
                    {/* <ToolbarItem alignSelf="center">
                        <Checkbox
                            label="Wrap text"
                            aria-label="wrap text checkbox"
                            isChecked={isTextWrapped}
                            id="wrap-text-checkbox"
                            onChange={(_event, value) => setIsTextWrapped(value)}
                        />
                    </ToolbarItem> */}
                </ToolbarContent>
            </Toolbar>
            }
        />
    );
}

export default LogViewer;