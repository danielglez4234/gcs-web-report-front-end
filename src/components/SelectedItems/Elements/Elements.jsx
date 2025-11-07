import { Fragment, Suspense, lazy } from 'react';
import {Stack, IconButton} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import MonitorInfo from './MonitorInfo/MonitorInfo';
import { MTUtil } from '../../../utils/monitorTypeUtils';
import { useSelectedItemsStore } from '../../../store/useSelectedItemsStore';
import GetMonitordIconType from '../../GetMonitorIconType';
import { LtTooltip } from '../../../assets/uiStyles/components';
import { SUSBSYSTEMS } from '../../../constants/subSystems';

const subSystemMM = SUSBSYSTEMS.MM;

const LazyMMSettings = lazy(() => import('./Settings/MM/MMSettings'));
const LazyLMSettings = lazy(() => import('./Settings/LM/LMSettings'));

function Elements({id, element, activeSubSystem}) {
    const { remove } = useSelectedItemsStore()
    const { type, description, magnitude } = element

    return (
        <tr className={`monitor-selected-table-tr tr-monMag${id}`} id={ id }>
            <td>
                <div className="monitor-selected-td-container">

                    {(!MTUtil.IsDevice(type)) ? <MonitorInfo element={ element } /> : ""}

                    <div className="align-content-flex-row">
                        <div className="monitor-seleted-options-icons">
                            <IconButton 
                                className="monitor-seleted-closeIcon"
                                color="success"
                                aria-label="upload picture" 
                                component="span" 
                                onClick={() => { remove(id) }} 
                            >
                                <CloseIcon  />
                            </IconButton>
                            {
                                <GetMonitordIconType type={ type } />
                            }
                        </div>
                        <div className="monitor-seleted-item-box">
                            <Stack className="monitor-seleted-item" direction="row">
                                <div className="monitor-selected-item-title-box">
                                    <p className="monitor-selected-item-title">
                                        <span className="monitor-selected-monitorMagnitudeName">{ magnitude }</span>
                                        {
                                        (!MTUtil.IsMagnitude(type) && !MTUtil.IsState(type) && !MTUtil.IsDevice(type)) ?
                                        <LtTooltip
                                            disableInteractive
                                            title={
                                                <Fragment>
                                                    <b className="label-indHlp-tooltip">{"Description:"}</b><br />
                                                    <span className="indHlp-vis-desc">{ description || "--" }</span>
                                                </Fragment>
                                            }
                                            placement="right" className="tool-tip-options-description">
                                            <InfoRoundedIcon className="description-info-icon" />
                                        </LtTooltip>
                                        : ""
                                        }
                                    </p>
                                </div>
                                {
                                    (!activeSubSystem || activeSubSystem === subSystemMM.id) ?
                                        <Suspense fallback={<p>Loading...</p>}>
                                            <LazyMMSettings element={ element } />
                                        </Suspense>
                                    :
                                        <Suspense fallback={<p>Loading...</p>}>
                                            <LazyLMSettings element={ element } />
                                        </Suspense>
                                }
                                
                            </Stack>
                        </div>

                    </div>
                    

                </div>
            </td>
        </tr>
    );
}

export default Elements;