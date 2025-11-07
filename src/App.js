import { createRef, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import Button from '@mui/material/Button';

import Header from './components/Header/Header';
import PageNotFound from './components/Header/PageNotFound';

import DeviceList from './components/DeviceList/DeviceList';
import SelectedItems from './components/SelectedItems/SelectedItems';
// import Graphic from './components/Graphic/Graphic';

// import SelectDisplay from './components/Sections/SelectDisplaySection/SelectDisplay';
import PerformQuery from './components/HandleQuerys/PerformQuery';
import BottomBar from './components/BottomBar/BottomBar';
import DisplayComponent from './components/DisplayComponent/DisplayComponent';

function App() {
    const notistackRef = createRef()
	/*
	 * handle close Snackbar messages
	 */
	const onClickDismiss = key => () => {
		notistackRef.current.closeSnackbar(key)
	}

    return (
		<SnackbarProvider
			anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
			ref={notistackRef}
			action={(key) => (
				<Button className="snackbar-handle-close" onClick={onClickDismiss(key)}>
					X
				</Button>
			)}
		>
            <Router>
                <Routes>
                    {/*blank path redirects to -> /WebReport*/}
                    <Route exact path="/" element={<Navigate to="/WebReport" />} />
                    {/*HOME*/}
                    <Route exact path="/WebReport" element={
                        <div className="container">
                            <Header />
                            <div className="content">
                                <DeviceList />
                                <div className="graphic-section">
                                    <SelectedItems />
                                    <DisplayComponent />
                                    <BottomBar />
                                </div>
                                <PerformQuery />
                            </div>
                        </div>
                    } />
                    {/*only appears when no route matches*/}
                    <Route path='*' element={<PageNotFound />} />
                </Routes>
            </Router>
        </SnackbarProvider>
    );
}

export default App;
