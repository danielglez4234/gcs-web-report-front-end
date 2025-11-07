import GetMonitordIconType from '../../GetMonitorIconType';

const DeviceElement = ({ deviceName, loadMonitors, selectableDevice, select }) => {
	const type = 'device'
	const icontype = <GetMonitordIconType type={ type } />

	return(
		<div className="componentItem-box-container">
			<div className="componentItem-box" 
			onClick={() => { 
				if(selectableDevice) {
					select({
						id: deviceName,
						name: "",
						magnitude: deviceName,
						type: type,
						description: null,
					})
					return
				}
				loadMonitors(deviceName) 
			}}>
				<div className="componentItem-icon component-icon-color">
					{ icontype }
				</div>
				<div className="componentItem-title-div">
					<p className="componentItem-title"> { deviceName } </p>
				</div>
			</div>
		</div>
	);
}

export default DeviceElement;