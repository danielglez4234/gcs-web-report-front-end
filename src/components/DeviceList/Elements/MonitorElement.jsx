import GetMonitordIconType from '../../GetMonitorIconType';

const MonitorElement = ({monitorDescription, select }) => {
	/*
	 * Get Icons
	 */
	const icontype = <GetMonitordIconType type={ monitorDescription.type } />

	return(
		<div id={monitorDescription.id} className="drag componentItem-box-container monitor-element">
			<div 
				className="componentItem-box" 
				onClick={() => { 
					select(monitorDescription)
				}}
			>
				<div className="componentItem-icon">
					{ icontype }
				</div>
				<div className="monitorItem-title-div">
					<p className="monitorItem-title"> { monitorDescription.magnitude } </p>
				</div>
			</div>
		</div>
	);
}

export default MonitorElement;
