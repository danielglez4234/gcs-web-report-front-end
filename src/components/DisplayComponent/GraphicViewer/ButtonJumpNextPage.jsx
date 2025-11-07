import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useFetchStore } from "../../../store/useFetchStore";

function ButtonJumpNextPage() {
    const jumpTime = 7; // seconds

    const [countdown, setCountdown] = useState(jumpTime)
    const [jumping, setJumping] = useState(false)
    const [noDataOnLastPage, setNoDataOnLastPage] = useState(false)

    const { needJumpToNextPage, currentSearch, totalPages, currentPage } = useFetchStore((state) => ({
        needJumpToNextPage: state.needJumpToNextPage,
        currentSearch: state.currentSearch,
        totalPages: state.totalPages,
        currentPage: state.currentPage
    }))

    const { fetchData } = useFetchStore()

    const fetchNextPage = () => {
        const nextPage = currentPage + 1
        fetchData({payload: currentSearch, currentPage: nextPage})
    }

    const fetchPreviousPage = () => {
        const previousPage = currentPage - 1
        fetchData({payload: currentSearch, currentPage: previousPage})
    }

    useEffect(() => {
        // There is the posibility that the last page does not
        // have data, so we need to check to avoid jumping on that case
        if (totalPages != null && currentPage+1 >= totalPages) {
            console.log("you supposed to jump but you are already on the last page")
            setCountdown(jumpTime)
            setJumping(false)
            setNoDataOnLastPage(true)
            return
        }
        if (!needJumpToNextPage) {
            setCountdown(jumpTime)
            return
        }

        // start loading after 1 second remaining
        if(countdown === 1){
            setJumping(true)
        }
        // auto jump when countdown reaches 0
        if (countdown === 0) {
            fetchNextPage()
            return
        }
        const timerId = setInterval(() => {
            setCountdown((prevCountdown) => prevCountdown - 1)
        }, 1000)

        return () => clearInterval(timerId)
    }, [needJumpToNextPage, countdown])

    /**
     * If no need to jump to next page, do not render the button
     */
    if (!needJumpToNextPage) {
        return null
    }

    return (
        <>
            <Button
                onClick={() => {
                    if (noDataOnLastPage) {
                        fetchPreviousPage()
                    } else {
                        fetchNextPage()
                    }
                }}
                loading={jumping}
                variant="contained"
                sx={{
                    zIndex: 10,
                    width: "300px",
                    height: "60px",
                    marginBottom: "26px",
                    fontSize: "1.2rem",
                    fontFamily: "RobotoMono-Regular",
                    backgroundColor: "#333a44",
                    color: "#fff",
                    textTransform: "Capitalize",
                    "&:hover": {
                        backgroundColor: "rgba(83, 83, 83, 1)a44"
                    }
                }}
            >
                {
                jumping ? "Jumping" 
                : noDataOnLastPage 
                    ? "Jump to Previous Page?"
                    :`Jump to Next Page (${countdown-2}s)`}
            </Button>
            {
                (noDataOnLastPage) 
                ? <><p>You are already on the last page.</p>
                    <p>But no further data was found.</p></>
                : <p>No data available in the current page.</p>
            }
             
            <p>But it seems that there is more pages available.</p>
        </>
    );
}

export default ButtonJumpNextPage;