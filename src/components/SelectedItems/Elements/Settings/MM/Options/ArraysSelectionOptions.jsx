import { useEffect, useRef, useState } from 'react';
import { Box, Button, ClickAwayListener, Divider, Popper } from '@mui/material';
import { ITEMSDEFAULTOPTIONS } from '../../../../../../constants/selectedItemsOptions';
import { useSelectedItemsStore } from '../../../../../../store/useSelectedItemsStore';

// DEFAULT OPTIONS
const { pos: defaultPos } = ITEMSDEFAULTOPTIONS

/*
 * return range and single indexes template
 */
function getTemplate(ma_){
	if(ma_.length > 1) {
		const initial = ma_[0]
		const last = ma_[ma_.length - 1]
		return "["+initial+"-"+last+"]"
	}
	else {
		const single = ma_[0]
		return "["+single+"]"
	}
}

const sortDESC = (a, b) => {
	if (a < b) return -1
	if (a > b) return 1
}

/*
 * builds a string template from an array of numbers
 * expected template to return: "[[0];[0-0]; ...]"
 */
const buildStringRange = (arr_) => {
	try {
		if (!arr_ || !Array.isArray(arr_) || arr_.length === 0) return ""

		arr_.sort((a, b) => sortDESC(a, b))
		const arrange_ = []
		let range_ = []

		for (let x = 0; x < arr_.length; x++) 
		{
			const num = arr_[x]
			const nextNumber = num + 1

				if(arr_.includes(nextNumber)){
					range_.push(num)
				}
				else{
					range_.push(num)
					arrange_.push(getTemplate(range_))
					range_ = []
				}
		}
		return `[${arrange_.join(';')}]` // expected return template "[[0];[0-0]; ...]" (string)
	} catch (error) {
		console.error("Error building string range:", error)
		return ""
	}
}

/*
 * convert position string format to array of numbers
 * expected template from server "[[0];[0-0]; ...]"
 */
const buildArrayFromTemplate = (str) => {
    try {
		if (!str || str === "") return []

        const activeIndexes_ = []
        const result = str.replace(/;/g, ",")
		                  .substring(1)
		                  .slice(0, -1)
		                  .split(",")
        result.map(val => 
            activeIndexes_.push(
                (val.includes("-"))
                ? getRangeFromString(val)
                : JSON.parse(val)
            )
        )
        return activeIndexes_.flat().sort((a, b) => sortDESC(a, b))
    } catch (error) {
        console.error(error)
		return []
    }
}

/*
 * create range from string // from => [1-4] to => [1, 2, 3, 4]
 */
const getRangeFromString = (values) => {
	try {
		const arrange_ = []
        const arr = values.replace(/\[/g, "").replace(/\]/g, "")
        const range = arr.split("-")
        const diference = (Number(range[1]) + 1) - Number(range[0])
        for (let i = 0; i < diference; i++) { arrange_.push(Number(range[0]) + i) }
        return arrange_
    } catch (error) {
        console.error(error)
    }
}

function ArraysSelectionOptions({element}) {
	const { updateOptions } = useSelectedItemsStore()
    const {
		id,
		dimension_x,
		dimension_y,
		options: {pos = defaultPos} // rename pos as storedPos and set default if empty to defaultPos
	} = element
	
    const availablePositions = dimension_x * dimension_y // get all available positions based on dimensions Y and X
	const allPositions = Array.from(Array(availablePositions).keys())

	const positions = buildArrayFromTemplate(pos) // this will be a string comming from the backend || template: "[[0];[0-0]; ...]"
	const [selectedItems, setSelectedItems] = useState(positions)
	const isDragging = useRef(false)
	const alreadyChanged = useRef(new Set())
	const mouseMoved = useRef(false)

	const setRanges = (arr_) => {
		const positionValue = buildStringRange(arr_)
		updateOptions(id, "pos", positionValue)
	}

	/**
	 * synchronize selected items with the updated positions 
	 */
	useEffect(() => {
		const updatedPositions = buildArrayFromTemplate(pos)
		setSelectedItems(updatedPositions)
	}, [pos])

	const reset = () => {
		setSelectedItems([])
	}

	const selectAll = () => {
		setSelectedItems(allPositions)
	}

    const [openArrayOptions, setOpenArrayOptions] = useState(false)
    const arrayAnchorRef = useRef(null)

    const toggleOpenArrayOptions = () => {
        setOpenArrayOptions(!openArrayOptions)
		setRanges(selectedItems)
    }

	const toggleItem = (index) => {
		setSelectedItems((prev) =>
			prev.includes(index)
				? prev.filter((i) => i !== index)
				: [...prev, index]
		)
	}

	const handleMouseDown = (index) => {
		isDragging.current = true
		alreadyChanged.current = new Set()
		mouseMoved.current = false
		
		toggleItem(index)
		alreadyChanged.current.add(index)

		window.addEventListener("mouseup", handleGlobalMouseUp)
	}

	const handleMouseMove = () => {
		if (isDragging.current) {
			mouseMoved.current = true
		}
	}

	const handleMouseEnter = (index) => {
		if (!isDragging.current || !mouseMoved.current) return
		if (alreadyChanged.current.has(index)) return
		toggleItem(index)
		alreadyChanged.current.add(index)
	}

	const handleMouseUp = () => {
		if (isDragging.current && !mouseMoved.current) {
			handleGlobalMouseUp()
		}
		isDragging.current = false
		alreadyChanged.current = new Set()
		mouseMoved.current = false
	}

	const handleGlobalMouseUp = () => {
		isDragging.current = false
		alreadyChanged.current = new Set()
		mouseMoved.current = false
		window.removeEventListener("mouseup", handleGlobalMouseUp)
	}

    return (
        <>
		{/* 
		* SHOW Index selected and reset button
		*/}

		<Popper
			open={openArrayOptions}
			anchorEl={arrayAnchorRef.current}
			sx={{zIndex: 99}}
			placement="right-start"
			modifiers={[{ name: 'offset', options: { offset: [0, 10] } }]}
		>
		<ClickAwayListener onClickAway={toggleOpenArrayOptions}>
			<Box className={`setting-selectd-monitor-options-box id-mon-sett-unit` +id} id="mon-settings-unit-sx" sx={{boxShadow: 3, width: "440px"}}>

				<div className="index-choose-button-box">
					<div
						onClick={() => {
							reset()
						}}
						className="index-choose-button"
					>
						<span>Reset</span>
					</div>
					<div
						onClick={() => {
							selectAll()
						}}
						className="index-choose-button"
					>
						<span>Select All</span>
					</div>
				</div>

				<Divider sx={{ marginBottom: "12px", backgroundColor: "#54566a" }} />


				<div className="corner-decoration" onClick={toggleOpenArrayOptions}></div>

				<div className="monitor-selected-select-contain monitor-array-pos-text-label-explination"> 
					If you don't select any positions, all positions will be returned by default.
				</div> 
				<div className="monitor-selected-select-contain monitor-array-pos-text-label"> Drag and select positions: </div> 
				<div className="monitor-selected-select-box">

					    <div
							className="monitor-array-pos-index-box custom-scroll"
							onMouseMove={handleMouseMove}
						>
						{allPositions.map((item, index) => (
							<div
								key={index}
								onMouseDown={() => handleMouseDown(index)}
								onMouseEnter={() => handleMouseEnter(index)}
								onMouseUp={() => handleMouseUp(index)}
								style={{
									width: "30px",
									height: "30px",
									lineHeight: "30px",
									textAlign: "center",
									borderRadius: 4,
									backgroundColor: selectedItems.includes(index)
										? "rgb(88 160 176)"
										: "rgb(87 100 119)",
									userSelect: "none",
									cursor: "pointer"
								}}
							>
								{ item }
							</div>
						))}
						</div>
				</div>
			</Box>
		</ClickAwayListener>
		</Popper>

		<Button
			ref={arrayAnchorRef}
			onClick={toggleOpenArrayOptions}
			aria-label="tune-settings"
			className="opt-button-color-white"
			disableRipple
			sx={{
				backgroundColor: "rgb(87 100 119)",
				height: "24px",
				width: "90px",
				marginTop: "8px",
				fontSize: "11px",
				textTransform: "capitalize",
				padding: "0 4px",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
			>
				<span style={{
					overflow: "hidden",
					textOverflow: "ellipsis",
					whiteSpace: "nowrap",
					display: "block",
					width: "100%",
				}}>
					{pos.replace(/\];\[/g, ", ").slice(1, -1) || "Array positions"}
				</span>
		</Button>
	
			
		</>
    );
}

export default ArraysSelectionOptions;