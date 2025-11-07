/**
 * Messages constant object containing various error and informational messages.
 * @typedef {Object} MESSAGES
 * @property {string} CantConvertToLogarithm - Error message indicating that logarithm cannot have zero or negative values.
 * @property {string} NotValidData - Error message indicating that the data type is not valid.
 * @property {string} CantProcessGraphicData - Error message indicating that the data could not be processed.
 */
export const MESSAGES = {
    CantConvertToLogarithm: 'Logarithm can\'t have zero or negative values, all incompatible values will be ignored!! If you want to avoid inconsistencies deactivate the logarithm format',
    NotValidData: 'The data type is not valid!! please contact the administrator to fix this',
    CantProcessGraphicData: 'The data could not be processed, please contact the administrator to fix this.',
}