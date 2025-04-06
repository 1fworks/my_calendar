import { Dayjs } from "dayjs"
import { useState } from "react"
import { MdCancel } from "react-icons/md";
import { BiPlusCircle } from "react-icons/bi";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { FaEquals, FaSave, FaArrowLeft } from "react-icons/fa";
import { TiPlus, TiMinus } from "react-icons/ti";
import { LuBookPlus } from "react-icons/lu";
import { PiStarFourFill, PiArrowBendDownRightBold } from "react-icons/pi";
import { FaStarOfLife } from "react-icons/fa6";

export const Item = ({
	isCurrMonth,
	date,
}:{
	isCurrMonth:boolean,
	date:Dayjs,
}) => {
  const [ active, setActive ] = useState(false)

  const closeDetail = () => {
    setActive(false)
  }

  const showDetail = () => {
    if(!active) {
      setActive(true)
    }
  }

	return (
    <>
      <div
        className={`overlay ${active?'overlay-active':''}`}
        onClick={closeDetail}
      >
        <div className="overlay-box">
          <div className="w-full h-full relative p-2 cursor-default flex flex-col" onClick={e=>e.stopPropagation()}>
            <div className="w-full h-fit flex justify-between mb-3">
              <button className="theme-switch">
                <FaSave />
              </button>
              <div className="w-full"></div>
              <button className="theme-switch" onClick={closeDetail}>  
                <MdCancel />
              </button>
            </div>
            <div className="flex-1 relative">
              <div className="absolute w-full top-0 bottom-0 pr-1 overflow-y-scroll flex flex-col gap-1">
                <div className="div-border rule-box flex flex-row items-center">

                  <div className="w-fit flex flex-row items-center">
                    <div className="mini-svg">
                      <PiStarFourFill/>
                    </div>
                    <span className="ml-1 mr-2 font-bold text-nowrap">휴가</span>
                    <button className="mini-svg ml-auto flex flex-row">
                      <FaArrowLeft/>{/* <TiMinus/><TiPlus/> */}
                      <FaEquals/>
                    </button>
                    <input className="div-border"></input>
                  </div>
                  <button className="theme-switch ml-auto"><RiDeleteBin2Fill/></button>

                </div>
                
                <button className="w-full mini-svg flex flex-row items-center justify-center">
                  <LuBookPlus />
                  <span>add rule</span>
                </button>

                <div className="flex flex-row justify-center opacity-30 my-2">
                  <FaStarOfLife />
                  <FaStarOfLife />
                  <FaStarOfLife />
                </div>
                
                <div className="div-border rule-box flex flex-row items-center">

                  <div className="w-fit flex flex-row items-center">
                    <div className="mini-svg">
                      <PiStarFourFill/>
                    </div>
                    <span className="ml-1 mr-2 font-bold text-nowrap">휴가</span>
                    <button className="mini-svg ml-auto flex flex-row">
                      <FaArrowLeft/>{/* <TiMinus/><TiPlus/> */}
                      <FaEquals/>
                    </button>
                    <input className="div-border"></input>
                  </div>
                  <button className="theme-switch ml-auto"><RiDeleteBin2Fill/></button>

                </div>

                <div className="div-border rule-box flex flex-row items-center">
                  <div className="mini-svg">
                    <PiArrowBendDownRightBold />
                  </div>
                  <span className="text-nowrap">rule 1:</span>
                  <div className="w-full h-fit">

                  </div>
                  <button className="mini-svg ml-auto"><RiDeleteBin2Fill/></button>
                </div>

                <button className="w-full mini-svg flex flex-row items-center justify-center">
                  <LuBookPlus />
                  <span>add rule</span>
                </button>

                <div className="flex flex-row justify-center opacity-30 my-2">
                  <FaStarOfLife />
                  <FaStarOfLife />
                  <FaStarOfLife />
                </div>

                <button className="w-full mini-svg flex flex-row items-center justify-center">
                  <BiPlusCircle />
                  <span>add new variable</span>
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ----------------------------------------------------- */}
      <div className={`calendar-item ${isCurrMonth?'font-bold':'opacity-50'}`}>
        <button className="calendar-circle" onClick={showDetail}>
          <div>
            {date.format('D')}
          </div>
        </button>
      </div>
    </>
	)
}