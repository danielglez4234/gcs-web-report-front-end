import CircleIcon from '@mui/icons-material/Circle';
import DonutSmallIcon from '@mui/icons-material/DonutSmall';
import DeblurIcon from '@mui/icons-material/Deblur';
import { MTUtil } from '../utils/monitorTypeUtils';
import folder from '../assets/img/folderIcon.png';

const GetMonitordIconType = ({type}) => {
	let defineIcon
	/*
	 * if magnitude
	 */
	if (MTUtil.IsMagnitude(type))
		defineIcon = <CircleIcon className ="color-type-indicator_magnitud_gray" />
	/*
	 * if scalar
	 */
	else if (MTUtil.IsMonitor(type))
		defineIcon = <CircleIcon className ="color-type-indicator_scalar_blue" />
	/*
	 * if scalar array
	 */
	else if (MTUtil.IsSimpleArray(type))
		defineIcon = <DonutSmallIcon className ="color-type-indicator_array_yellow" />
	/*
	 * if doubleArray
	 */
	else if (MTUtil.IsDoubleArray(type))
		defineIcon = <DonutSmallIcon className ="color-type-indicator_doubleArray_purple" />
	/*
	 * if state
	 */
	if (MTUtil.IsState(type))
		defineIcon = <DeblurIcon className ="color-type-indicator_state" />

	if(MTUtil.IsDevice(type))
		defineIcon = <img src={folder} alt="folder" className="component_IMG-folder"/>

	return(
		<div className="monitor-seleted-typeIcon">
			{ defineIcon }
		</div>
	)
}

export default GetMonitordIconType;
