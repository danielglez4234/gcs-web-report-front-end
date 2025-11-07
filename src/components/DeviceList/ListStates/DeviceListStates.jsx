import { Skeleton } from "@mui/material"
import SnippetFolderIcon from '@mui/icons-material/SnippetFolder';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ReportGmailerrorredRoundedIcon from '@mui/icons-material/ReportGmailerrorredRounded';


export const SkeletonList = () => (
    <div>
        <Skeleton className="skeleton-componentmonitor" variant="rectangular" width={235} height={30} />
        <Skeleton className="skeleton-componentmonitor" variant="rectangular" width={235} height={30} />
        <Skeleton className="skeleton-componentmonitor" variant="rectangular" width={235} height={30} />
        <Skeleton className="skeleton-componentmonitor" variant="rectangular" width={235} height={30} />
        <Skeleton className="skeleton-componentmonitor" variant="rectangular" width={235} height={30} />
    </div>
)

export const NoSelectedDevice =  () => (
    <div className="noComponentSelected-box">
        <SnippetFolderIcon className="noComponentSelected-icon" />
        <p className="noComponentSelected-title">No Component Selected From Component Item List</p>
    </div>
)

export const NoResultFound =  () => ( 
    <div className="noComponentSelected-box">
        <HelpOutlineIcon className="noComponentSelected-icon" />
        <p className="noComponentSelected-title">No Results Found</p>
    </div>
)

export const NoMonitorElements = () => ( 
    <div className="noComponentSelected-box">
        <HelpOutlineIcon className="noComponentSelected-icon" />
        <p className="noComponentSelected-title">No Monitors Found</p>
    </div>
)

export const Error = () => ( 
    <div className="noComponentSelected-box">
        <ReportGmailerrorredRoundedIcon className="noComponentSelected-icon" />
        <p className="noComponentSelected-title">Connection Error</p>
    </div>
)


