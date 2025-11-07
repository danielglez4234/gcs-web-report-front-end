import * as $  from 'jquery';
import ArrowDropUpSharpIcon from '@mui/icons-material/ArrowDropUpSharp';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';

function BottomBar({monitorsCount}) {
    /*
	 * Hide Component and monitor list handle arrows movement
	 */
	const handleExpandSection = (icon, setHeightPX) => {
		const container = $(".menu-monitorSelected-contain")
		const monitorSection = $(".selected-monitors-select-all")

		container.css('height', setHeightPX + "px")
		if (setHeightPX === 0) {
			container.addClass('hide-sections')
			monitorSection.addClass('hide-sections')
		}
		else {
			container.removeClass('hide-sections')
			monitorSection.removeClass('hide-sections')
		}

		$('.rotback').removeClass('rotate180 activeExpandColor')
		if (icon === "visibilityMiddle-icon") {
			if (!$('.visibilityMiddle-icon').hasClass('activeExpandColor')) {
				$('.' + icon).toggleClass('activeExpandColor')
			}
		}
		else if (icon === "visibilityOff-icon") {
			$('.' + icon).toggleClass('rotate180 activeExpandColor')
			$('.visibilityMiddle-icon').removeClass('rotate180')
		}
		else {
			$('.' + icon).toggleClass('rotate180 activeExpandColor')
			$('.visibilityMiddle-icon').toggleClass('rotate180')
		}
	}
    return ( 
        <div className="selected-monitors-extends-buttons">
			<div className="selected-monitor-count">
				º
				{
					monitorsCount
				}
			</div>
			<KeyboardDoubleArrowDownIcon 
				onClick={() => { 
					handleExpandSection("visibilityLarge-icon", 400) 
				}} 
				className="section-selected-extends-icons rotback visibilityLarge-icon"
			/>
			<ExpandMoreIcon 
				onClick={() => { 
					handleExpandSection("visibilityMiddle-icon", 98) 
				}} 
				className="section-selected-extends-icons rotback activeExpandColor visibilityMiddle-icon" 
			/>
			<ArrowDropUpSharpIcon 
				onClick={() => { 
					handleExpandSection("visibilityOff-icon", 0) 
				}} 
				className="section-selected-extends-icons rotback visibilityOff-icon" 
			/>
        </div>
    );
}

export default BottomBar;