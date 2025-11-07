import { MTYPES } from "../constants/monitorTypes";

export const MTUtil = {
	/*
	 * This function say if a monitor is a state or no.
	 */
	IsState: (type) =>  MTYPES.state.includes(type),
	/*
	 * This function say if a monitor is a magnitude or no.
	 */
	IsMagnitude: (type) => MTYPES.magnitude.includes(type),
	/*
	 * This function say if a monitor is a magnitude or no.
	 */
	IsBoolean: (type) => MTYPES.boolean.includes(type),
	/*
	 * This function say if a monitor is a magnitude or no.
	 */
	IsEnum: (type) => MTYPES.enum.includes(type),
	/*
	 * This function say if a monitor is a scalar monitor or no.
	 */
	IsMonitor: (type) => MTYPES.scalar.includes(type),
	/*
	 * This function say if a monitor is a simple array monitor or no.
	 */
	IsSimpleArray: (type) => MTYPES.simpleArray.includes(type),
	/*
	 * This function say if a monitor is a double array monitor or no.
	 */
	IsDoubleArray: (type) => MTYPES.doubleArray.includes(type),
	/*
	 * This function say if a monitor is a scalar monitor or no.
	 */
	IsScalar: (type) => MTYPES.scalar.includes(type) || MTYPES.magnitude.includes(type),
	/*
	 *  This function say if a monitor is a numeric monitor or no.
	 */
	IsNumeric: (type) => MTYPES.numeric.includes(type),
	/*
	 * This function say if a monitor is a array monitor or no.
	 */
	IsArray: (type) => MTYPES.array.includes(type),
	/**
	 * This function say if a monitor is a device or no.
	 */
	IsDevice: (type) => type === "device",
	/*
	 * This function return the category type.
	 */
	getCategory: (type) =>{
		if (MTYPES.simpleArray.includes(type) || MTYPES.doubleArray.includes(type) || MTYPES.scalar.includes(type)){
			return "monitor"
		}else if (MTYPES.magnitude.includes(type)){
			return "magnitude"
		}else if (MTYPES.state.includes(type)){
			return "state"
		}
	},
	/*
	* get presice category type this include if it is "scalar", "simpleArray", "doubleArray", "magnitude" or "state"
	*/
	getPreciseCategory: (type) =>{
		if (MTYPES.simpleArray.includes(type)){
			return "simpleArray"
		}else if (MTYPES.doubleArray.includes(type)){
			return "doubleArray"
		}else if (MTYPES.scalar.includes(type)){
			return "scalar"
		}else if (MTYPES.magnitude.includes(type)){
			return "magnitude"
		}else if (MTYPES.state.includes(type)){
			return "state"
		}else {
			return "unknown"
		}
	}	
}