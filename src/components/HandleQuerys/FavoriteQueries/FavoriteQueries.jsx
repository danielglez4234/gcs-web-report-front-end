import Fuse from 'fuse.js';
import { 
	Stack, 
	Skeleton, 
	IconButton, 
	Divider,
	Tooltip,
	Backdrop, 
	CircularProgress
}  from '@mui/material';
import { 
	LtTooltip,
	Search,
	SearchIconWrapper,
	StyledInputBase 
} from '../../../assets/uiStyles/components';
import SearchIcon      from '@mui/icons-material/Search';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import BookmarkIcon	   from '@mui/icons-material/Bookmark';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import HelpIcon from '@mui/icons-material/Help';
// import FavoriteElement from './FavoriteElement'
import { Fragment } from 'react';





function FavoriteQueries() {

    
    return (
		<div styles={{ display: "flex"}}>
			<div className="favorite-sample-header">
				<Stack direction="column" spacing={0}>
					<Stack className="stack-row-components-title-buttons" direction="row">
						<p className="components-item-title">Quick Access</p>
					</Stack>
					<Search>
						<SearchIconWrapper>
							<SearchIcon />
						</SearchIconWrapper>
						<StyledInputBase
							placeholder="Search…"
							// onChange={handleOnSeacrhFavorites}
							inputProps={{ 'aria-label': 'search' }}
							id="searchInputCompMon"
						/>
					</Search>
				</Stack>
			</div>
			<div className="sample-items sample-items-favorites">
				{/* {
					(loadingFavorites) ? skeleton :
					(resultQueryFavorite.length === 0) ? noResultFound :
					resultQueryFavorite.map((element, index) =>
						<FavoriteElement
							key = { index }
							element = { element }
							loadMonitors = { loadMonitors }
							removeFavorite = { removeFavorite }
						/>
					)
				} */}
			</div>
			<div className="favorite-bottom-menu-actions">
				<Stack
					direction="row"
					alignItems="center"
					justifyContent="space-between"
				>
					<Stack>
						<LtTooltip
							title={
								<Fragment>
									{/* <b className="label-indHlp-tooltip">{sectionHelperText}</b> */}
								</Fragment>
							} 
							placement="top" 
							className="tool-tip-options"
						>
							<IconButton>
								<HelpIcon sx={{color: '#e9e9e9'}}/>
							</IconButton>
						</LtTooltip>
					</Stack>
					<Stack
						direction="row"
						justifyContent="flex-end"
						alignItems="center"
						divider={<Divider orientation="vertical" flexItem />}
						spacing={1}
					>
						<Tooltip
							// title={(sortToggle) ? "DESC" : "ASC"}
							placement="top" 
							className="tool-tip-options"
							disableInteractive
						>
							<IconButton
								// onClick={() => {sortFavorites()}}
							>
								<SortByAlphaIcon sx={{color: '#e9e9e9'}}/>
							</IconButton>
						</Tooltip>
						<Tooltip
							title={"Delete all marked queries"}
							placement="top" 
							className="tool-tip-options"
							disableInteractive
						>
							<IconButton
								// onClick={() => {removeAllFavorites()}}
							>
								<DeleteSweepIcon sx={{color: '#e9e9e9'}}/>
							</IconButton>
						</Tooltip>
					</Stack>
				</Stack>
			</div>
			{/* <Backdrop
				sx={{ color: '#569d90', zIndex: (theme) => theme.zIndex.drawer + 13001 }}
				open={openBackDrop}
			>
				<CircularProgress color="inherit" />
			</Backdrop> */}
            
        </div>
    )
}

export default FavoriteQueries;