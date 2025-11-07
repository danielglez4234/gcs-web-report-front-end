import { SUSBSYSTEMS } from "../../constants/subSystems";
import { useSubSystemStore } from "../../store/useSubSystemStore";
import GraphicSciChart from "./GraphicViewer/GraphicScichart";
import LogViewer from "./LogViewer/LogViewer";

const subSystemMM = SUSBSYSTEMS.MM
const subSystemLM = SUSBSYSTEMS.LM

function DisplayComponent() {
    const { activeSubSystem } = useSubSystemStore((state => ({
        activeSubSystem: state.activeSubSystem
    })))

    return (
        <>
        {
            (activeSubSystem === subSystemMM.id) ?
                <GraphicSciChart />
            : (activeSubSystem === subSystemLM.id) ?
                <LogViewer />
            : <div>No display component available for the selected subsystem.</div>
        }
        </>
    );
}

export default DisplayComponent;