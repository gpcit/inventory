import { ArrowLongLeftIcon, ArrowLongRightIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import React from "react";


interface CustomPaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (selected: { selected: number }) => void;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  pageCount,
  currentPage,
  onPageChange,
}) => {
  
  const handlePreviousClick = () => {
    if(currentPage > 1) {
      const newPage = currentPage - 1
      onPageChange({selected: newPage - 1})
    }
    
  };
  const handleNextClick = () => {
    if(currentPage < pageCount){
      const newPage = currentPage;
      onPageChange({selected: newPage})
    }
  }
    return (
        <div className="flex items-center justify-center ">
          {/* Left arrow */}
          <button
            onClick={handlePreviousClick}
            disabled={currentPage === 1}
            className="mr-2"
          >
            {/* {currentPage === 1 && <ChevronLeftIcon className="w-5 h-5 border-gray-500 border rounded"/>} */}
            {currentPage > 1 && <ChevronDoubleLeftIcon className="w-5 h-5 border-gray-500 border rounded"/>}
           {/* <ArrowLongLeftIcon className="w-5 dashbord-summary"/> */}
          </button>
          {/* Total pages */}
          <p className="mx-2">{`Page ${currentPage} of ${pageCount}`}</p>
          {/* Right arrow */}
          <button
            onClick={handleNextClick}
            disabled={currentPage === pageCount}
            className="ml-2"
          >
            { currentPage === currentPage && currentPage != pageCount && <ChevronDoubleRightIcon className="w-5 h-5 border-gray-500 border rounded"/>}
            {/* <ArrowLongRightIcon className="w-5 dashbord-summary"/> */}
            {/* {currentPage === pageCount && currentPage != 1 && <ChevronRightIcon className="w-5 h-5 border-gray-500 border rounded"/> } */}
          </button>
        </div>
      );
    };
    
    export default CustomPagination;