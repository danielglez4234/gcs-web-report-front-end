import { useState } from 'react';
import 'antd/dist/reset.css';
import {
  Stack, 
} from '@mui/material';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import HandleSearch from './HandleSearch';
import HandleLoadQueries from './HandleQueries/HandleLoadQueries';
import HandleSaveQueries from './HandleQueries/HandleSaveQueries';
import FavoriteQueries from './FavoriteQueries/FavoriteQueries';


function PerformQuery() {
	const [hidden, setHidden] = useState(false)
	const toggleVisibility = () => {
		// setHidden(prev => !prev)
		setTimeout(() => {
			setHidden(prev => !prev);
		}, 1);
	}


    return (
		<>
			{/* <div className="arrowShowHide arrow-showPerfomSection" style={{visibility: !hidden ? 'visible' : 'hidden'}}> */}
			<div className="arrowShowHide arrow-showPerfomSection" style={{display: hidden ? 'block' : 'none'}}>
				<ArrowLeftIcon onClick={() => { toggleVisibility() }} className="arrow-leftSection" />
			</div>

			{/* <div className="perform-query-section" style={{visibility: hidden ? 'visible' : 'hidden'}}> */}
			<div className="perform-query-section" style={{display: !hidden ? 'flex' : 'none'}}>
				{/* <ArrowRightIcon onClick={() => { toggleVisibility() }} className="arrow-rightSection hide_icon_componentList"/> */}

				<HandleSearch />
				<div className="store-query-section">
					<div className="sample-header-store-query">
						<Stack direction="column" spacing={1}>
							Handle Queries

						<div style={{ display: 'flex', justifyContent: 'space-between' }}>
							<HandleSaveQueries />
							<HandleLoadQueries />
						</div>
							{
								// (editing?.active) ? "" :
									// <ViewHandleQuery
									// 	addItemtoLocalStorage={addItemtoLocalStorage}
									// />
							}
						</Stack>
					</div>
				</div>
					<FavoriteQueries />
			</div>
		</>
    );
}

export default PerformQuery;